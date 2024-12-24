import requestSchema from "../request/requestSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import { ZodError } from "zod";
const requestController = {
  addRequest: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: "Invalid userId", success: false });
      }
      requestSchema.addRequest.parse(req.body);
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      const yearRange = `${previousYear}/${currentYear}`;
      const status = "request accepted";
      const existingRequest = await prisma.clearanceRequest.findFirst({
        where: {
          userId: id,
        },
      });
      const isUser = await prisma.user.findFirst({
        where: {
          AND: [{ id: id, role: "STUDENT" }],
        },
      });
      if (!isUser?.id) {
        return res.status(400).json({
          message: `this use is not found in our universtiy. Please request to registration to registral`,
          success: false,
        });
      }
      if (existingRequest?.id) {
        // If a request already exists, respond with a message indicating so
        return res.status(400).json({
          message: "A clearance request already exists for this user",
          success: false,
        });
      }
      const newRequest = await prisma.clearanceRequest.create({
        data: {
          academicYear: yearRange,
          reason: req.body.reason,
          status: status,
          userId: id,
          semester: req.body.semester,
        },
      });
      res.status(200).json({
        data: newRequest,
        message: "A clearance request successfully",
        success: true,
      });
    } catch (error) {
      next(error); // Pass the error to the error handler
    }
  },
  updateRequest: async (req, res, next) => {
    try {
      requestSchema.updateRequest.parse(req.body);
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: "Invalid report ID", success: false });
      }
      let role = req.body.role.toLowerCase();
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1);
      const reportRole =
        req.body.role.charAt(0).toUpperCase() +
        req.body.role.slice(1).toLowerCase();
      // console.log("roles", role);
      // console.log("id", id);
      const reqExist = await prisma.clearanceRequest.findFirst({
        where: {
          AND: [{ userId: id }, { [role]: false }],
        },
      });
      if (!reqExist?.id) {
        return res.status(404).json({
          message:
            "No clearance request found with the provided id or the user is already approved",
          errorCode: ErrorCode.USER_NOT_FOUND,
          success: false,
        });
      }
      // Check if the user has debt in the specific office
      const hasDebt = await prisma.reports.findFirst({
        where: {
          studentId: req.body.studentId,
          [reportRole]: true,
        },
      });
      if (hasDebt) {
        return res.status(400).json({
          message: `User has debt in the ${reportRole} office. Cannot clear until the debt is resolved.`,
          errorCode: ErrorCode.USER_HAS_DEBT,
        });
      }
      // Update the clearance request
      const updateRequest = await prisma.clearanceRequest.update({
        where: {
          userId: +req.params.id,
        },
        data: {
          [role]: true,
        },
        include: {
          user: true, // Include the related user information
        },
      });
      // Return only the relevant response data related to the cafe office
      const response = {
        id: updateRequest.id,
        userId: updateRequest.userId,
        reasonForRequest: updateRequest.reason,
        academicYear: updateRequest.academicYear,
        semester: updateRequest.semester,
        createdAt: updateRequest.createdAt,
        status: updateRequest.status,
        // resonOfReject: updateRequest?.[role] as any,
        ReasonCafe: updateRequest.ReasonCafe,
      };
      // Return the updated request
      return res.status(200).json({
        data: response,
        success: true,
        message: "the user is approved successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal servevr error",
      });
    }
  },
  getClearanceRequestReason: async (req, res, next) => {
    try {
      // Get the userId from body or params
      const userId = req.params.id;
      if (isNaN(userId)) {
        return res
          .status(400)
          .json({ message: "Invalid user ID", success: false });
      }

      // Get the role from the request body (assume role is sent in body)
      let role = req.body.role.toLowerCase();
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1); // Convert to column name (isDepartment, isCafe, etc.)

      // Fetch the clearance request for the user
      const clearanceRequest = await prisma.clearanceRequest.findFirst({
        where: { userId: Number(userId) },
      });

      if (!clearanceRequest) {
        return res.status(404).json({
          message: "No clearance request found for the user",
          success: false,
        });
      }

      // Check if the corresponding role column exists on the clearance request
      if (!(role in clearanceRequest)) {
        return res.status(400).json({
          message: `Role '${role}' not found in the clearance request data.`,
          success: false,
        });
      }

      // Dynamically retrieve the reason for the role
      const reasonKey = `Reason${role.charAt(2).toUpperCase() + role.slice(3)}`; // This formats Reason<role> (e.g., ReasonDepartment)
      const reason = clearanceRequest[reasonKey];

      if (!reason) {
        return res.status(404).json({
          message: `No reason found for the role: ${role}`,
          success: false,
        });
      }

      // Prepare the response with relevant data
      const response = {
        userId: clearanceRequest.userId,
        role: req.body.role,
        reason: reason,
      };

      // Return the reason and role
      return res.status(200).json({
        data: response,
        success: true,
        message: "Successfully retrieved the clearance request reason.",
      });
    } catch (error) {
      console.error("Error:", error);
      return next(new Error("Internal Server Error"));
    }
  },

  rejectTheAprovedUser: async (req, res, next) => {
    try {
      requestSchema.reReject.parse(req.body);
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      let role = req.body.role.toLowerCase();
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1);
      const reportRole =
        req.body.role.charAt(0).toUpperCase() +
        req.body.role.slice(1).toLowerCase();
      const roleReason = reportRole + "Reason";
      const clearanceReason = "Reason" + reportRole;
      // const studentId = req.body.studentId;
      const rejectionReason = req.body.reason;
      const reqExist = await prisma.clearanceRequest.findFirst({
        where: {
          AND: [{ userId: +req.params.id }, { [role]: true }],
        },
        select: {
          user: {
            select: {
              studentProfile: true,
            },
          },
        },
      });
      if (!reqExist) {
        return res.status(404).json({
          message:
            "No clearance request found with the provided id or the user  is already rejected.",
          errorCode: ErrorCode.USER_NOT_FOUND,
        });
      }
      // console.log(reqExist?.user?.studentProfile?.studentId);
      const studentId = reqExist?.user?.studentProfile?.studentId;
      // Check if the user has debt in the specific office

      const hasDebt = await prisma.reports.findFirst({
        where: {
          studentId: studentId,
        },
        select: {
          id: true,
        },
      });
      let addDebt;
      let updateDebt;
      if (!hasDebt) {
        addDebt = await prisma.reports.create({
          data: {
            studentId: studentId,
            [roleReason]: rejectionReason,
            [reportRole]: true,
            reporterId: req.body.reporterId,
          },
        });
      } else {
        updateDebt = await prisma.reports.update({
          where: {
            id: hasDebt?.id,
          },
          data: {
            [reportRole]: true,
            [roleReason]: rejectionReason,
          },
          include: {
            report: true, // Include the related user information
          },
        });
      }
      // Update the clearance request
      if (addDebt || updateDebt) {
        const updateRequest = await prisma.clearanceRequest.update({
          where: {
            userId: +req.params.id,
          },
          data: {
            [role]: false,
            [clearanceReason]: rejectionReason,
          },
          select: {
            [role]: true,
            [clearanceReason]: true,
            user: {
              select: {
                studentProfile: true,
              },
            }, // Include the related user information
          },
        });

        const response = {
          message: "succussfully the user is rejected",

          academicYear: updateRequest?.user?.studentProfile?.academicYear,
          department: updateRequest?.user?.studentProfile?.department,
          userId: updateRequest?.user?.studentProfile?.userId,

          // resonOfReject: updateRequest?.[role] as any,
          [role]: updateRequest?.[role],
          [clearanceReason]: updateRequest?.[clearanceReason],
        };

        return res.status(200).json(response);
      }
      return res.status(200).json({ message: "faild to rejected the user" });
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new UnprocessableEntity(
            "Validation failed",
            422,
            ErrorCode.VALIDATION_FAILED,
            null
          )
        );
      }
      // Handle other errors
      console.error("Error:", error);
      return next(new Error("Internal Server Error"));
    }
  },
  deleteRequest: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      // Attempt to find and throw an error if no request exists
      await prisma.clearanceRequest.findFirstOrThrow({
        where: {
          id: +req.params.id,
        },
      });

      // Delete the request
      const deleteRequest = await prisma.clearanceRequest.delete({
        where: {
          id: +req.params.id,
        },
        select: {
          id: true,
        },
      });

      // Respond based on whether the deletion was successful
      if (deleteRequest?.id) {
        return res.status(200).json({
          success: true,
          message: "Request deleted successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Request not deleted",
        });
      }
    } catch (error) {
      // Handle case where the request is not found or other errors occur
      if (error.name === "NotFoundError") {
        return next(
          new UnprocessableEntity(
            "No request found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getSearch: async (req, res, next) => {
    requestSchema.searchRequest.parse(req.body);
    const { studentId, firstName } = req.body;
    let role = req.body.role.toLowerCase();
    const roleSentence = role.charAt(0).toUpperCase() + role.slice(1);
    const reason = roleSentence + "Reason";
    const reasonForRject = "Reason" + roleSentence;
    role = "is" + role.charAt(0).toUpperCase() + role.slice(1);

    let whereCondition = {};
    if (studentId) {
      whereCondition = {
        user: {
          studentProfile: {
            is: {
              studentId: {
                contains: studentId.toString(),
                mode: "insensitive",
              },
            },
          },
        },
      };
    }
    if (firstName) {
      whereCondition = {
        AND: [
          whereCondition, // Include the previous condition (studentId if present)
          {
            user: {
              profile: {
                firstName: {
                  contains: firstName.toString(),
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };
    }

    try {
      const reqExist = await prisma.clearanceRequest.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                },
              },
            },
          },
          clerance: true,
          result: true,
        },
      });
      let reports = [];
      if (reqExist[0]?.user?.studentProfile) {
        reports = await prisma.reports.findMany({
          where: {
            studentId: reqExist[0]?.user?.studentProfile?.studentId,
          },
          select: {
            Department: true,
            reporterId: true,
            studentId: true,
            Cafe: true,
            Police: true,
            Library: true,
            Proctor: true,
            Superproctor: true,
            Registrar: true,
            DepartmentReason: true, // Customize these reason strings as needed
            CafeReason: true,
            PoliceReason: true,
            LibraryReason: true,
            ProctorReason: true,
            SuperproctorReason: true,
            RegistrarReason: true,
          },
        });
      }
      const result = {
        ...reqExist,
        reports,
      };
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getSearchBySpecicAdmin: async (req, res, next) => {
    requestSchema.searchRequest.parse(req.body);
    const { studentId, firstName } = req.body;
    let role = req.body.role.toLowerCase();
    const roleSentence = role.charAt(0).toUpperCase() + role.slice(1);
    const reason = roleSentence + "Reason";
    const reasonForRject = "Reason" + roleSentence;
    role = "is" + role.charAt(0).toUpperCase() + role.slice(1);

    let whereCondition = {};
    if (studentId) {
      whereCondition = {
        user: {
          studentProfile: {
            is: {
              studentId: {
                contains: studentId.toString(),
                mode: "insensitive",
              },
            },
          },
        },
      };
    }
    if (firstName) {
      (whereCondition = {
        // AND: [
        //   {
        AND: [
          whereCondition, // Include the previous condition (studentId if present)
          {
            user: {
              profile: {
                firstName: {
                  contains: firstName.toString(),
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }),
        {
          [role]: false,
          //   },
          // ],
        };
    }

    try {
      const reqExist = await prisma.clearanceRequest.findMany({
        where: whereCondition,

        select: {
          [role]: true,
          [reasonForRject]: true,
          user: {
            select: {
              activeStatus: true,
              createdAt: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  sex: true,
                  imageUrl: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  academicYear: true,
                },
              },
            },
          },
          clerance: true,
          result: true,
        },
      });
      let reports = [];
      if (reqExist[0]?.user?.studentProfile) {
        reports = await prisma.reports.findMany({
          where: {
            studentId: reqExist[0]?.user?.studentProfile?.studentId,
          },
          select: {
            // Department: true,
            reporterId: true,
            studentId: true,
            [roleSentence]: true, // Customize these reason strings as needed
            [reason]: true,
          },
        });
      }
      console.log(reqExist);

      return res.status(200).json({ ...reqExist, reports });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      // Parse request body
      requestSchema.getAllRequest.parse(req.body);
      let role = req.body.role.toLowerCase();
      const roleSentence = role.charAt(0).toUpperCase() + role.slice(1);
      const reason = roleSentence + "Reason";
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1);
      // Retrieve clearance requests where the specified role is false
      const reqExist = await prisma.clearanceRequest.findMany({
        where: {
          [role]: false,
        },
        include: {
          user: {
            select: {
              id: true,
              activeStatus: true,
              role: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  middleName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  faculty: true,
                },
              },
            },
          },

          result: true,
        },
      });
      let reports = [];
      if (reqExist[0]?.user?.studentProfile) {
        reports = await prisma.reports.findMany({
          where: {
            studentId: reqExist[0]?.user?.studentProfile?.studentId,
          },
          select: {
            Department: true,
            reporterId: true,
            studentId: true,
            [roleSentence]: true, // Customize these reason strings as needed
            [reason]: true,
          },
        });
      }
      // Organize the data
      const organizedData = reqExist.map((request) => ({
        id: request.id,
        userId: request.userId,
        reason: request.reason,
        academicYear: request.academicYear,
        semester: request.semester,
        createdAt: request.createdAt,
        status: request.status,
        [role]: request === null || request === void 0 ? void 0 : request[role],
        user: request.user,

        result: request.result,
        report: reports,
      }));
      // Send the response
      return res.status(200).json({
        data: organizedData,
        message: "success to retrive the request",
        success: true,
      });
    } catch (error) {
      // Pass error to the error handler middleware
      console.log(error);
      return res
        .status(404)
        .json({ message: "error to retrive the request", success: false });
    }
  },
  getAllApprove: async (req, res, next) => {
    try {
      // Parse request body
      requestSchema.getAllRequest.parse(req.body);
      let role = req.body.role.toLowerCase();
      const roleSentence = role.charAt(0).toUpperCase() + role.slice(1);
      const reason = roleSentence + "Reason";
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1);
      // Retrieve clearance requests where the specified role is false
      const reqExist = await prisma.clearanceRequest.findMany({
        where: {
          [role]: true,
        },
        include: {
          user: {
            select: {
              id: true,
              activeStatus: true,

              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  middleName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  faculty: true,
                },
              },
            },
          },

          result: true,
        },
      });
      let reports = [];
      if (reqExist[0]?.user?.studentProfile) {
        reports = await prisma.reports.findMany({
          where: {
            studentId: reqExist[0]?.user?.studentProfile?.studentId,
          },
          select: {
            Department: true,
            reporterId: true,
            studentId: true,
            [roleSentence]: true, // Customize these reason strings as needed
            [reason]: true,
          },
        });
      }
      // Organize the data
      const organizedData = reqExist.map((request) => ({
        id: request.id,
        userId: request.userId,
        reason: request.reason,
        academicYear: request.academicYear,
        semester: request.semester,
        createdAt: request.createdAt,
        status: request.status,
        [role]: request === null || request === void 0 ? void 0 : request[role],
        user: request.user,

        result: request.result,
        report: reports,
      }));
      // Send the response
      return res.status(200).json({
        data: organizedData,
        message: "success to retrive the request",
        success: true,
      });
    } catch (error) {
      // Pass error to the error handler middleware

      next(error);
      return res
        .status(404)
        .json({ message: "error to retrive the request", success: false });
    }
  },
  getSingle: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      const clearanceRequest = await prisma.clearanceRequest.findFirst({
        where: {
          userId: +req.params.id,
        },
        include: {
          user: {
            select: {
              activeStatus: true,
              createdAt: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  sex: true,
                  imageUrl: true,
                },
              },
              studentProfile: {
                select: {
                  department: true,
                  faculty: true,
                  studentId: true,
                  academicYear: true,
                },
              },
            },
          },
        },
      });

      if (!clearanceRequest) {
        return res.status(404).json({ message: "Clearance request not found" });
      }

      const userProfile = clearanceRequest.user?.profile;
      const studentProfile = clearanceRequest.user?.studentProfile;

      const responseData = {
        id: clearanceRequest.id,
        fullName: userProfile
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : "N/A",
        sex: userProfile?.sex || "N/A",
        academicYear: clearanceRequest.academicYear || "N/A",
        semester: clearanceRequest.semester || "N/A",
        department: studentProfile?.department || "N/A",
        studentId: studentProfile?.studentId || "N/A",
        faculty: studentProfile?.faculty || "N/A",
        createdAt: clearanceRequest.createdAt,
        status: clearanceRequest.status,
      };

      return res.status(200).json(responseData);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  count: async (req, res, next) => {
    try {
      requestSchema.count.parse(req.body);
      const userId = +req.body.id;
      // Count occurrences of true values for each specific boolean field
      const counts = {
        isDepartment: await prisma.clearanceRequest.count({
          where: { userId, isDepartment: true },
        }),
        isCafe: await prisma.clearanceRequest.count({
          where: { userId, isCafe: true },
        }),
        isPolice: await prisma.clearanceRequest.count({
          where: { userId, isPolice: true },
        }),
        isLibrary: await prisma.clearanceRequest.count({
          where: { userId, isLibrary: true },
        }),
        isProctor: await prisma.clearanceRequest.count({
          where: { userId, isProctor: true },
        }),
        isSuperProctor: await prisma.clearanceRequest.count({
          where: { userId, isSuperproctor: true },
        }),
        isRegistrar: await prisma.clearanceRequest.count({
          where: { userId, isRegistrar: true },
        }),
      };
      // Calculate the total count of true values
      const totalCount = Object.values(counts).reduce(
        (total, count) => total + count,
        0
      );
      return res.status(200).json(totalCount);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  sendTrueColumns: async (req, res, next) => {
    try {
      requestSchema.count.parse(req.body);
      const userId = +req.body.id;
      // Retrieve the clearance request for the given user
      const clearanceRequest = await prisma.clearanceRequest.findUnique({
        where: { userId },
        include: {
          result: true, // Include the associated result
        },
      });
      if (!clearanceRequest) {
        return res.status(404).json({
          message: "Clearance request not found for this user",
          success: false,
        });
      }

      // Initialize sets to hold checked, unchecked, and rejected columns
      const trueColumns = new Set(
        Object.entries(clearanceRequest)
          .filter(([key, value]) => value === true && key.startsWith("is"))
          .map(([key]) => key.slice(2))
      );

      // Extract rejected columns based on reasons provided
      const rejectedColumns = new Set();
      Object.entries(clearanceRequest).forEach(([key, value]) => {
        if (key.startsWith("Reason") && value) {
          const role = key.slice(6);
          const columnName = `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
          rejectedColumns.add(columnName);
        }
      });

      // Define unwanted columns
      const unwantedColumns = new Set([
        "",
        "erId",
        "ason",
        "ademicYear",
        "mester",
        "eatedAt",
        "tatus",
      ]);

      // Fetch all reports for the given user
      const reports = await prisma.reports.findMany({
        where: { student: { userId } },
        select: {
          id: true,
          Department: true,
          Cafe: true,
          Police: true,
          Library: true,
          Proctor: true,
          Superproctor: true,
          Registrar: true,
          DepartmentReason: true,
          CafeReason: true,
          PoliceReason: true,
          LibraryReason: true,
          ProctorReason: true,
          SuperproctorReason: true,
          RegistrarReason: true,
        },
      });

      // Determine unchecked columns
      const falseColumns = Object.keys(clearanceRequest)
        .filter(
          (key) =>
            key.startsWith("is") &&
            !trueColumns.has(key.slice(2)) &&
            !rejectedColumns.has(key.slice(2)) &&
            !unwantedColumns.has(key.slice(2))
        )
        .map((key) => key.slice(2));

      // Update status if all required checks are complete
      if (trueColumns.size === 7) {
        await prisma.clearanceRequest.update({
          where: {
            userId: userId,
          },
          data: {
            status: "Request completed",
          },
        });
      }

      // Respond with categorized columns, converting Sets to arrays
      return res.status(200).json({
        data: {
          checked: Array.from(trueColumns),
          unchecked: falseColumns.length > 0 ? falseColumns : null,
          rejectedColumns: Array.from(rejectedColumns),
          success: true,
          message: "get the data",
        },
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  moveToClearance: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const id = Number(userId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      await prisma.$transaction(async (prisma) => {
        const clearanceRequest = await prisma.clearanceRequest.findUnique({
          where: { userId: +userId },
        });
        if (!clearanceRequest) {
          return res
            .status(404)
            .json({ message: "Clearance request not found" });
        }
        const allOfficesApproved = Object.keys(clearanceRequest)
          .filter((key) => typeof key === "string" && key.startsWith("is"))
          .every((key) => clearanceRequest[key]);
        if (!allOfficesApproved) {
          return res
            .status(400)
            .json({ message: "Not all offices have approved" });
        }
        const newClearance = await prisma.clearance.create({
          data: {
            userId: clearanceRequest.userId,
            requestId: clearanceRequest.id,
            academicYear: clearanceRequest.academicYear,
          },
        });
        await prisma.clearanceRequest.delete({
          where: { id: clearanceRequest.id },
        });
        return res.status(200).json(newClearance);
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getAllCheckTrue: async (req, res, next) => {
    try {
      // Retrieve the clearance requests where all office clearances are true
      const clearanceRequests = await prisma.clearanceRequest.findMany({
        where: {
          AND: [
            { isDepartment: true },
            { isCafe: true },
            { isPolice: true },
            { isLibrary: true },
            { isProctor: true },
            { isSuperproctor: true },
            { isRegistrar: true },
          ],
        },
        include: {
          user: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  middleName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  academicYear: true,
                  faculty: true,
                },
              },
            },
          },
        },
      });

      // If no clearance requests are found
      if (clearanceRequests.length === 0) {
        return res.status(404).json({
          message: "No clearance requests found with all offices cleared",
          success: false,
        });
      }

      // Map each clearance request to format the response
      const responseData = clearanceRequests.map((clearanceRequest) => {
        const userProfile = clearanceRequest.user?.profile || {};
        const studentProfile = clearanceRequest.user?.studentProfile || {};

        return {
          id: clearanceRequest.id,
          firstName: userProfile.firstName || "N/A",
          lastName: userProfile.lastName || "N/A",
          middleName: userProfile.middleName || "N/A",
          sex: userProfile.sex || "N/A",
          studentId: studentProfile.studentId || "N/A",
          department: studentProfile.department || "N/A",
          academicYear: studentProfile.academicYear || "N/A",
          faculty: studentProfile.faculty || "N/A",
        };
      });

      // Return response with all data
      return res.status(200).json({
        data: responseData,
        message: "Successfully retrieved clearance requests data",
        success: true,
      });
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },

  searchCleared: async (req, res, next) => {
    try {
      // Validate request schema
      requestSchema.searchCleared.parse(req.body);
      const { firstName, studentId } = req.body;

      // Define the filter conditions for clearance request
      const filterConditions = [
        { isDepartment: true },
        { isCafe: true },
        { isPolice: true },
        { isLibrary: true },
        { isProctor: true },
        { isSuperproctor: true },
        { isRegistrar: true },
      ];

      // Add filters only if provided (avoid adding empty filters)
      if (studentId?.trim()) {
        filterConditions.push({
          user: {
            studentProfile: {
              studentId: {
                contains: studentId.trim().toLowerCase(), // Applying .toLowerCase() for case insensitivity
              },
            },
          },
        });
      }

      if (firstName?.trim()) {
        filterConditions.push({
          user: {
            profile: {
              firstName: {
                contains: firstName.trim().toLowerCase(), // Applying .toLowerCase() for case insensitivity
              },
            },
          },
        });
      }

      // Fetch the clearance requests with the conditions
      const clearanceRequests = await prisma.clearanceRequest.findMany({
        where: {
          AND: filterConditions,
        },
        include: {
          user: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  middleName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  academicYear: true,
                  faculty: true,
                },
              },
            },
          },
        },
      });

      // If no results found
      if (clearanceRequests.length === 0) {
        return res.status(404).json({
          message: "No clearance requests found with all offices cleared",
          success: false,
        });
      }

      // Format and send the response
      const responseData = clearanceRequests.map((clearanceRequest) => {
        const userProfile = clearanceRequest.user?.profile;
        const studentProfile = clearanceRequest.user?.studentProfile;

        return {
          id: clearanceRequest.id,
          firstName: userProfile ? `${userProfile.firstName}` : "N/A",
          lastName: userProfile?.lastName || "N/A",
          middleName: userProfile?.middleName || "N/A",
          faculty: studentProfile?.faculty || "N/A",
          studentId: studentProfile?.studentId || "N/A",
          department: studentProfile?.department || "N/A",
          academicYear: studentProfile?.academicYear || "N/A",
          semester: clearanceRequest.semester || "N/A",
          sex: userProfile?.sex || "N/A",
        };
      });

      return res.status(200).json({
        data: responseData,
        message: "Data successfully retrieved",
        success: true,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },

  setRejectReason: async (req, res, next) => {
    requestSchema.setRejectReason.parse(req.body);
    try {
      // ClearanceRequest.id
      const { id } = req.params;
      const { role, reason } = req.body;
      // Map role to corresponding reason column
      const idd = Number(id);
      if (isNaN(idd)) {
        return res
          .status(400)
          .json({ message: "Invalid report ID", success: false });
      }
      const reasonColumn = `Reason${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
      const row = `is${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
      const reportReasonCon =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      // Check if the user has any report under the officer column
      const hasReport = await prisma.reports.findFirst({
        where: {
          studentId: req.body.studentId,
          [reportReasonCon]: true,
        },
      });
      // If the user has a report, update the clearance request and reason accordingly
      if (hasReport) {
        const updatedRequest = await prisma.clearanceRequest.update({
          where: { userId: +id },
          data: { [reasonColumn]: reason, [row]: false },
        });
        // Fetch the updated clearance request with basic information
        const updatedRequestInfo = await prisma.clearanceRequest.findUnique({
          where: { userId: +id },
          select: {
            id: true,
            userId: true,
            reason: true,
            academicYear: true,
            semester: true,
            createdAt: true,
            status: true,
            [reasonColumn]: true,
          },
        });
        const responseObj = {
          id: updatedRequestInfo?.id || "N/A",
          userId: updatedRequestInfo?.userId || "N/A",
          reasonForClearanceRequest: updatedRequestInfo?.reason || "N/A",
          academicYear: updatedRequestInfo?.academicYear || "N/A",
          semester: updatedRequestInfo?.semester || "N/A",
          createdAt: updatedRequestInfo?.createdAt || "N/A",
          status: updatedRequestInfo?.status || "N/A",
          reasonOfRejection: updatedRequestInfo?.[reasonColumn] || "N/A",
        };
        // Return success response with the basic information and reason for the specified role
        return res.status(200).json({
          data: responseObj,
          success: true,
          message: "succeslly set the reject",
        });
      } else {
        // If the user does not have a report, return an error response
        return res.status(400).json({
          message: "User does not have any report under the specified officer",
          success: false,
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  clearRejectionReason: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const idd = Number(id);
      if (isNaN(idd)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      // Map role to corresponding reason column
      const isRole = "is" + role.charAt(0).toUpperCase() + role.slice(1);
      const reasonColumn = `Reason${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
      const roleInReport =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const reasonString = roleInReport + "Reason";
      // Check if the debt is paid
      const hasDebt = await prisma.reports.findFirst({
        where: {
          AND: [
            { studentId: req.body.studentId },
            {
              OR: [
                { [roleInReport]: true },
                { [reasonString]: { not: null } },
                { [reasonString]: { not: "" } },
              ],
            },
          ],
        },
        select: {
          [reasonString]: true,
        },
      });
      if (hasDebt?.[reasonString]) {
        // Debt is not paid, return error response
        return res.status(400).json({
          message: `User still has debt with the reason'${hasDebt?.[reasonString]}' in the ${role} office. Cannot clear the rejection reason until the debt is resolved.`,
          errorCode: ErrorCode.USER_HAS_DEBT,
        });
      }
      // Clear the rejection reason for the specified role
      const updatedRequest = await prisma.clearanceRequest.update({
        where: { userId: +id },
        data: { [reasonColumn]: null },
      });
      const result = {
        id: updatedRequest?.id,
        userId: updatedRequest?.userId,
        reason: updatedRequest?.reason,
        academicYear: updatedRequest?.academicYear,
        semester: updatedRequest?.semester,
        createdAt: updatedRequest?.createdAt,
        Status: updatedRequest?.status,
        [isRole]: updatedRequest?.[isRole],
        [reasonColumn]: updatedRequest?.[reasonColumn],
      };
      // Return success response
      return res.status(200).json(result);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default requestController;
