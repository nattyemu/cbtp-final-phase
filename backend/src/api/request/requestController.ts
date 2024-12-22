import { NextFunction, Request, Response } from "express";
import requestSchema from "../request/requestSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";
interface ClearanceRequest {
  id: number;
  userId: number;
  reason: string;
  academicYear: string;
  semester: string;
  createdAt: Date;
  status: string;
  isDepartment: boolean;
  isCafe: boolean;
  isPolice: boolean;
  isLibrary: boolean;

  isProctor: boolean;
  isSuperproctor: boolean;
  isRegistrar: boolean;
}
const requestController = {
  addRequest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
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

      if (existingRequest) {
        // If a request already exists, respond with a message indicating so
        return res.status(400).json({
          message: "A clearance request already exists for this user.",
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
      res.status(200).json(newRequest);
    } catch (error) {
      next(error); // Pass the error to the error handler
    }
  },

  updateRequest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      requestSchema.updateRequest.parse(req.body);

      let role = req.body.role.toLowerCase();
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1);
      const reportRole =
        req.body.role.charAt(0).toUpperCase() +
        req.body.role.slice(1).toLowerCase();

      const reqExist = await prisma.clearanceRequest.findFirst({
        where: {
          AND: [{ userId: +req.params.id }, { [role]: false }],
        },
      });
      if (!reqExist) {
        return res.status(404).json({
          message:
            "No clearance request found with the provided id or the role field is already true.",
          errorCode: ErrorCode.USER_NOT_FOUND,
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
      return res.status(200).json(response);
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
  deleteRequest: async (req: Request, res: Response, next: NextFunction) => {
    const reqExist = await prisma.clearanceRequest.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    if (!reqExist) {
      return next(
        new UnprocessableEntity(
          "no request found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    const delateRequest = await prisma.clearanceRequest.delete({
      where: {
        id: +req.params.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "request deleted successfully",
    });
  },
  getSearch: async (req: Request, res: Response, next: NextFunction) => {
    requestSchema.searchRequest.parse(req.body);
    const { studentId, firstName } = req.body;
    let role = req.body.role.toLowerCase();

    role = "is" + role.charAt(0).toUpperCase() + role.slice(1);

    let whereCondition = {
      AND: [
        {
          OR: [
            studentId && {
              user: {
                studentProfile: {
                  is: {
                    studentId: {
                      contains: studentId.toString(),
                    },
                  },
                },
              },
            },
            firstName && {
              user: {
                profile: {
                  firstName: {
                    contains: firstName.toString(),
                  },
                },
              },
            },
          ].filter(Boolean),
        },
        {
          [role]: false, // Ensure the role is false
        },
      ],
    };

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
      return res.status(200).json(reqExist);
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse request body
      requestSchema.getAllRequest.parse(req.body);
      let role = req.body.role.toLowerCase();
      role = "is" + role.charAt(0).toUpperCase() + role.slice(1);

      // Retrieve clearance requests where the specified role is false
      const reqExist = await prisma.clearanceRequest.findMany({
        where: {
          [role]: false,
        },
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

      // Organize the data
      const organizedData = reqExist.map((request) => ({
        id: request.id,
        userId: request.userId,
        reason: request.reason,
        academicYear: request.academicYear,
        semester: request.semester,
        createdAt: request.createdAt,
        status: request.status,
        [role]: (request as any)?.[role] as any,
        user: request.user,
        clerance: request.clerance,
        result: request.result,
      }));

      // Send the response
      return res.status(200).json(organizedData);
    } catch (error) {
      // Pass error to the error handler middleware
      next(error);
    }
  },

  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clearanceRequest = await prisma.clearanceRequest.findFirst({
        where: {
          id: +req.params.id,
        },
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
                  department: true,
                  faculty: true,
                  studentId: true,
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

      const responseData = {
        id: clearanceRequest.id, // Include the id in the response data
        fullName: userProfile
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : "N/A",
        lastName: userProfile?.lastName || "N/A",
        sex: userProfile?.sex || "N/A",
        academicYear: clearanceRequest.academicYear || "N/A",
        semester: clearanceRequest.semester || "N/A",
        department: clearanceRequest.user?.studentProfile?.department || "N/A",
        studentId: clearanceRequest.user?.studentProfile?.studentId || "N/A",
        faculty: clearanceRequest.user?.studentProfile?.faculty || "N/A",
        createdAt: clearanceRequest.createdAt,
        status: clearanceRequest.status,
      };

      return res.status(200).json(responseData);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  count: async (req: Request, res: Response, next: NextFunction) => {
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
  sendTrueColumns: async (req: Request, res: Response, next: NextFunction) => {
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
        return res
          .status(404)
          .json({ message: "Clearance request not found for this user" });
      }

      // Extract column names with true values
      const trueColumns = Object.entries(clearanceRequest)
        .filter(([key, value]) => value === true && key.startsWith("is")) // Filter only columns starting with "is"
        .map(([key]) => key.slice(2)); // Remove the prefix "is" from the column name

      // Define unwanted columns
      const unwantedColumns = [
        "",
        "erId",
        "ason",
        "ademicYear",
        "mester",
        "eatedAt",
        "tatus",
      ];

      // Extract the rejected columns based on officer's reasons
      const rejectedColumns: string[] = [];
      Object.entries(clearanceRequest).forEach(([key, value]) => {
        if (key.startsWith("Reason") && value) {
          const role = key.slice(6); // Remove the prefix "Reason" from the column name
          const columnName = `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
          rejectedColumns.push(columnName);
        }
      });

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

      // Extract the unchecked columns
      const falseColumns = Object.keys(clearanceRequest)
        .filter(
          (key) =>
            !trueColumns.includes(key.slice(2)) &&
            !unwantedColumns.includes(key.slice(2)) &&
            key.startsWith("is") // Only consider columns starting with "is"
        )
        .map((key) => key.slice(2)); // Remove the prefix "is" from the column name
      if (trueColumns.length == 7) {
        await prisma.clearanceRequest.update({
          where: {
            userId: userId,
          },
          data: {
            status: "Request complited",
          },
        });
      }
      return res.status(200).json({
        checked: trueColumns.length > 0 ? trueColumns : null,
        unchecked: falseColumns.length > 0 ? falseColumns : null,
        rejectedColumns: rejectedColumns.length > 0 ? rejectedColumns : null, // Check if there are rejected columns
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  moveToClearance: async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;

    try {
      await prisma.$transaction(async (prisma) => {
        const clearanceRequest = await prisma.clearanceRequest.findUnique({
          where: { id: +requestId },
        });

        if (!clearanceRequest) {
          return res
            .status(404)
            .json({ message: "Clearance request not found" });
        }

        const allOfficesApproved = Object.keys(clearanceRequest)
          .filter(
            (key): key is keyof ClearanceRequest =>
              typeof key === "string" && key.startsWith("is")
          )
          .every((key) => clearanceRequest[key]);

        if (!allOfficesApproved) {
          return res
            .status(400)
            .json({ message: "Not all offices have approved" });
        }

        const newClearance = await prisma.clearance.create({
          data: {
            userId: clearanceRequest.userId!,
            requestId: clearanceRequest.id,
            academicYear: clearanceRequest.academicYear,
            semester: clearanceRequest?.semester,
          },
        });

        await prisma.clearanceRequest.delete({
          where: { id: +requestId },
        });

        return res.status(200).json(newClearance);
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getAllCheackTrue: async (req: Request, res: Response, next: NextFunction) => {
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
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  academicYear: true,
                  // semester: true,
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
        });
      }

      // Extract necessary data from the clearance request
      const clearanceRequest = clearanceRequests[0];
      const userProfile = clearanceRequest.user?.profile;

      // Construct response data
      const responseData = {
        id: clearanceRequest.id,
        fullName: userProfile
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : "N/A",
        studentId: clearanceRequest.user?.studentProfile?.studentId || "N/A",
        department: clearanceRequest.user?.studentProfile?.department || "N/A",
        academicYear:
          clearanceRequest.user?.studentProfile?.academicYear || "N/A",
        sex: userProfile?.sex || "N/A",
      };

      // Return response
      return res.status(200).json(responseData);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  searchCleared: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, studentId } = req.body;

      // Define the filter conditions
      const filterConditions: any[] = [
        { isDepartment: true },
        { isCafe: true },
        { isPolice: true },
        { isLibrary: true },

        { isProctor: true },
        { isSuperproctor: true },
        { isRegistrar: true },
      ];

      // Add additional filter condition based on firstName or studentId
      if (firstName) {
        filterConditions.push({
          user: { profile: { firstName: { contains: firstName } } },
        });
      } else if (studentId) {
        filterConditions.push({
          user: { studentProfile: { studentId: { contains: studentId } } },
        });
      }

      // Retrieve the clearance requests where all office clearances are true
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
                  sex: true,
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
        },
      });

      // If no clearance requests are found
      if (clearanceRequests.length === 0) {
        return res.status(404).json({
          message: "No clearance requests found with all offices cleared",
        });
      }

      // Construct response data
      const responseData = clearanceRequests.map((clearanceRequest) => {
        const userProfile = clearanceRequest.user?.profile;
        return {
          id: clearanceRequest.id,
          fullName: userProfile
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : "N/A",
          studentId: clearanceRequest.user?.studentProfile?.studentId || "N/A",
          department:
            clearanceRequest.user?.studentProfile?.department || "N/A",
          academicYear:
            clearanceRequest.user?.studentProfile?.academicYear || "N/A",
          semester: clearanceRequest.semester || "N/A",
          sex: userProfile?.sex || "N/A",
        };
      });

      // Return response
      return res.status(200).json(responseData);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  setRejectReason: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role, reason } = req.body;

      // Map role to corresponding reason column
      const reasonColumn = `Reason${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
      const row = `is${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
      const reportReasonCon =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      // Check if the user has any report under the officer column
      const hasReport = await prisma.reports.findFirst({
        where: {
          studentId: req.body.userId,
          [reportReasonCon]: true,
        },
      });

      // If the user has a report, update the clearance request and reason accordingly
      if (hasReport) {
        const updatedRequest = await prisma.clearanceRequest.update({
          where: { id: +id },
          data: { [reasonColumn]: reason },
        });

        // Fetch the updated clearance request with basic information
        const updatedRequestInfo = await prisma.clearanceRequest.findUnique({
          where: { id: +id },
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
          id: updatedRequestInfo?.id,
          userId: updatedRequestInfo?.userId,
          reasonForClearanceRequest: updatedRequestInfo?.reason,
          academicYear: updatedRequestInfo?.academicYear,
          semester: updatedRequestInfo?.semester,
          createdAt: updatedRequestInfo?.createdAt,
          status: updatedRequestInfo?.status,
          reasonOfRejection: updatedRequestInfo?.[reasonColumn] as any,
        };
        // Return success response with the basic information and reason for the specified role
        return res.status(200).json(responseObj);
      } else {
        // If the user does not have a report, return an error response
        return res.status(400).json({
          message: "User does not have any report under the specified officer",
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  clearRejectionReason: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, role } = req.params;

      // Map role to corresponding reason column
      const reasonColumn = `Reason${role.charAt(0).toUpperCase() + role.slice(1)}`;

      // Check if the debt is paid
      const hasDebt = await prisma.reports.findFirst({
        where: {
          studentId: req.body.studentId,
          [role]: true,
        },
      });

      if (hasDebt) {
        // Debt is not paid, return error response
        return res.status(400).json({
          message: `User still has debt in the ${role} office. Cannot clear the rejection reason until the debt is resolved.`,
          errorCode: ErrorCode.USER_HAS_DEBT,
        });
      }

      // Clear the rejection reason for the specified role
      const updatedRequest = await prisma.clearanceRequest.update({
        where: { id: +id },
        data: { [reasonColumn]: null },
      });

      // Return success response
      return res.status(200).json(updatedRequest);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default requestController;
