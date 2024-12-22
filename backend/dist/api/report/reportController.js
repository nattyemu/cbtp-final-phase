import reportSchema from "./reportSchema.js";
import { prisma } from "../../config/prisma.js";
const reportController = {
  addNew: async (req, res, next) => {
    try {
      // Validate the incoming request body against the schema
      reportSchema.addRport.parse(req.body);

      // Normalize role
      if (!req.body.role) {
        return res
          .status(400)
          .json({ message: "Role is required.", success: false });
      }

      let role = req.body.role.toLowerCase();
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const isRole = "is" + role;
      let roleReason = role + "Reason";
      const reasonRole = "Reason" + role;
      const studentId = req.body.studentId;
      if (
        !studentId ||
        typeof studentId !== "string" ||
        studentId.trim() === ""
      ) {
        return res
          .status(400)
          .json({ message: "Invalid studentId", success: false });
      }

      const reporterId = req.user.id;

      const existingReport = await prisma.reports.findFirst({
        where: { AND: [{ studentId }, { [role]: true }] },
      });
      let result;
      if (existingReport?.id) {
        const existingReason = existingReport?.[roleReason] || "";
        const updatedReason = existingReason + "\n" + req.body.reason;
        result = await prisma.reports.update({
          where: { id: existingReport?.id },
          data: { [roleReason]: updatedReason },
          select: {
            [roleReason]: true,
          },
        });
        // also update clerancerequest here
      } else {
        const studentReport = await prisma.reports.findFirst({
          where: { studentId },
          select: {
            [roleReason]: true,
            id: true,
          },
        });
        result = studentReport;
        if (studentReport) {
          result = await prisma.reports.update({
            where: { id: studentReport?.id },
            data: { [roleReason]: req.body.reason, [role]: true },
            select: {
              [roleReason]: true,
            },
          });
        } else {
          result = await prisma.reports.create({
            data: {
              [roleReason]: req.body.reason,
              [role]: true,
              studentId,
              reporterId,
              reson: "", // Clarify usage or remove
            },
            select: {
              [roleReason]: true,
            },
          });
        }
      }
      // if the user is cleared and after it if the user get debt have to cancel the aprove clerance request
      const getUsetId = await prisma.studentProfile.findUnique({
        where: {
          studentId: studentId,
        },
        select: {
          userId: true,
        },
      });
      if (getUsetId?.userId) {
        const checkExistance = await prisma.clearanceRequest.findUnique({
          where: {
            userId: getUsetId?.userId,
          },
        });
        if (checkExistance?.id) {
          await prisma.clearanceRequest.update({
            where: {
              userId: getUsetId?.userId,
            },
            data: {
              [isRole]: false,
              [reasonRole]: "the user have debt",
              status: "request accepted",
            },
          });
        } else {
          console.log("the user haven't clerancerequest");
        }
      }
      return res.status(200).json({
        message: "Report added successfully",
        data: result?.[roleReason],
        success: true,
      });
    } catch (error) {
      console.error("Error:", error); // Log error for debugging
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  update: async (req, res, next) => {
    try {
      reportSchema.updateReport.parse(req.body);
      let { studentId, role, clearAllDebts, newReason } = req.body;
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const roleReason = role + "Reason";

      // Validate studentId and role
      if (typeof studentId !== "string" || !role) {
        return res.status(400).json({ message: "Invalid studentId or role" });
      }

      // Convert clearAllDebts to boolean if it's a string
      const clearAllDebt =
        typeof clearAllDebts === "boolean"
          ? clearAllDebts
          : clearAllDebts.toLowerCase() === "true";

      if (clearAllDebt) {
        // Clear all debts if clearAllDebts is true
        await prisma.reports.updateMany({
          where: { studentId, [role]: true },
          data: {
            [role]: false,
            [roleReason]: null,
          },
        });

        // Fetch associated user ID and clear corresponding clearance reason
        const studentProfile = await prisma.studentProfile.findFirst({
          where: { studentId },
          select: { userId: true },
        });

        if (studentProfile?.userId) {
          await prisma.clearanceRequest.update({
            where: { userId: studentProfile?.userId },
            data: { ["Reason" + role]: null },
          });
        }

        return res.status(200).json({
          success: true,
          message: "All Debt cleared successfully",
          data: newReason,
        });
      } else {
        // Check if a report exists for this student and role
        const existingReport = await prisma.reports.findFirst({
          where: { studentId, [role]: true },
          select: {
            student: { select: { userId: true } },
            [roleReason]: true,
            id: true,
          },
        });
        if (!existingReport?.id) {
          return res.status(404).json({
            message: "Debt report not found for update in this office",
            success: false,
          });
        }

        if (existingReport?.id) {
          // Update the report with the new reason or clear it if empty
          await prisma.reports.update({
            where: { id: existingReport?.id },
            data: {
              [role]: true,
              [roleReason]: newReason.trim() || null,
            },
          });

          // Update the clearance request only if the reason is cleared
          if (!newReason.trim()) {
            await prisma.clearanceRequest.update({
              where: { userId: existingReport?.student?.userId },
              data: { [`Reason${role}`]: null },
            });
            await prisma.reports.update({
              where: { id: existingReport.id },
              data: { [role]: false },
            });
          }

          // Retrieve the updated reason for response
          const updatedReport = await prisma.reports.findFirst({
            where: { studentId, [role]: true },
            select: {
              [roleReason]: true,
            },
          });

          return res.status(200).json({
            success: true,
            message: "Debt successfully updated",
            data: updatedReport?.[roleReason] || null,
          });
        } else {
          return res.status(404).json({
            message: "Report not found for debt on this office",
            success: false,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging purposes
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
  delete: async (req, res, next) => {},
  getAll: async (req, res, next) => {
    try {
      // Validate the incoming request body against the schema
      reportSchema.get.parse(req.body);

      // Check if role is provided and is a non-empty string
      if (!req.body.role || typeof req.body.role !== "string") {
        return res
          .status(400)
          .json({ message: "Invalid role", success: false });
      }

      // Capitalize the role
      const role =
        req.body.role.charAt(0).toUpperCase() +
        req.body.role.slice(1).toLowerCase();
      const reasonCole = role + "Reason";

      // Fetch all reports where the specified role is true
      const allDebts = await prisma.reports.findMany({
        where: { [role]: true },
        select: {
          [reasonCole]: true,
          id: true,
          student: {
            select: {
              id: true,
              studentId: true,
              department: true,
              userId: true,
              user: {
                select: {
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      sex: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Extract required fields from the fetched data
      const formattedDebts = allDebts.map((debt) => {
        const userProfile = debt.student.user?.profile; // Safe navigation
        return {
          reason: debt[reasonCole], // No need for optional chaining here
          id: debt?.id,
          userId: debt?.student?.userId,
          studentId: debt?.student?.studentId,
          firstName: userProfile ? userProfile.firstName : null,
          lastName: userProfile ? userProfile.lastName : null,
          department: debt?.student?.department,
        };
      });

      // Return the formatted debts
      if (formattedDebts.length == 0) {
        return res.status(404).json({ message: "not found", success: false });
      }
      return res.status(200).json({
        data: formattedDebts,
        success: true,
        message: "succefully get the data",
      });
    } catch (error) {
      console.error("Error:", error); // Log error for debugging
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },

  getSearch: async (req, res, next) => {
    try {
      reportSchema.getSingle.parse(req.body);
      const { studentId, firstName, role: rawRole } = req.body;

      if (!rawRole || typeof rawRole !== "string") {
        return res.status(400).json({ message: "Invalid role" });
      }

      const role =
        rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
      const roleReason = role + "Reason";

      if (!studentId && !firstName) {
        return res
          .status(400)
          .json({ message: "Provide at least studentId or firstName" });
      }

      const whereClause = {
        [role]: true,
        student: {
          OR: [
            ...(firstName
              ? [
                  {
                    user: {
                      profile: {
                        firstName: {
                          contains: firstName.trim(),
                        },
                      },
                    },
                  },
                ]
              : []),
            ...(studentId
              ? [
                  {
                    studentId: {
                      contains: studentId.trim(),
                    },
                  },
                ]
              : []),
          ],
        },
      };

      const reports = await prisma.reports.findMany({
        where: whereClause,
        select: {
          [roleReason]: true,
          id: true,
          student: {
            select: {
              id: true,
              studentId: true,
              department: true,
              user: {
                select: {
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      sex: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!reports.length) {
        return res.status(404).json({ message: "Reports not found" });
      }

      const formattedReports = reports.map((report) => {
        const userProfile = report.student.user?.profile;
        return {
          id: report?.id,
          studentId: report?.student?.studentId,
          firstName: userProfile?.firstName ?? null,
          lastName: userProfile?.lastName ?? null,
          department: report?.student?.department,
          reason: report[roleReason],
        };
      });

      return res.status(200).json(formattedReports);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getReason: async (req, res, next) => {
    try {
      reportSchema.get.parse(req.body);
      const { id: paramId } = req.params; // Use req.params to get the report ID
      const id = parseInt(paramId);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: "Invalid report ID", success: false });
      }

      let role = req.body.role?.toLowerCase();
      if (!role) {
        return res
          .status(400)
          .json({ message: "Invalid role", success: false });
      }
      role = role.charAt(0).toUpperCase() + role.slice(1);
      const roleReason = role + "Reason";

      // Fetch single report based on the conditions
      const singleReport = await prisma.reports.findFirst({
        where: { id, [role]: true },
        select: {
          id: true,
          [roleReason]: true,
          student: {
            select: {
              studentId: true,
              department: true,
              user: {
                select: {
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      sex: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!singleReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Extract required fields from the fetched data
      const userProfile = singleReport.student?.user?.profile || null;

      const formattedReport = {
        id: singleReport.id,
        studentId: singleReport.student?.studentId || null,
        firstName: userProfile?.firstName || null,
        lastName: userProfile?.lastName || null,
        department: singleReport.student?.department || null, // Handle potential null value
        reason: singleReport[roleReason],
      };

      // Return the formatted report
      return res.status(200).json(formattedReport);
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },

  // getByStudentId: async (req: Request, res: Response, next: NextFunction) => {},
};
export default reportController;
