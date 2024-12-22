import { NextFunction, Request, Response } from "express";
import reportSchema from "./reportSchema.js";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";

const reportController = {
  addNew: async (req: Request, res: Response, next: NextFunction) => {
    try {
      reportSchema.addRport.parse(req.body);
      let role = req.body.role.toLowerCase();
      role = role.charAt(0).toUpperCase() + role.slice(1);
      let roleReason = role + "Reason";

      const studentId = req.body.studentId;

      // Check if studentId is provided and is a non-empty string
      if (!studentId || typeof studentId !== "string") {
        return res.status(400).json({ message: "Invalid studentId" });
      }

      const reporterId = req.user!.id;

      // Check if a report already exists for the student and office
      const existingReport = await prisma.reports.findFirst({
        where: { AND: [{ studentId: req.body.studentId }, { [role]: true }] },
      });

      if (existingReport) {
        // Append the reason to the existing reason
        const existingReason =
          (existingReport as { [key: string]: any })[roleReason] || "";
        const updatedReason = existingReason + "\n" + req.body.reason; // Append new reason
        await prisma.reports.update({
          where: { id: existingReport.id },
          data: { [roleReason]: updatedReason },
        });
      } else {
        // Check if a report exists for the student
        const studentReport = await prisma.reports.findFirst({
          where: { studentId: req.body.studentId },
        });

        if (studentReport) {
          // Update the existing report for the student with the new reason
          await prisma.reports.update({
            where: { id: studentReport.id },
            data: { [roleReason]: req.body.reason, [role]: true },
          });
        } else {
          // Create a new report for the student with the new reason
          await prisma.reports.create({
            data: {
              [roleReason]: req.body.reason,
              [role]: true,
              studentId: req.body.studentId,
              reporterId,
              reson: "", // Not sure what this field is for, modify as needed
            },
          });
        }
      }

      return res.status(200).json({ message: "Report added successfully" });
    } catch (error) {
      // console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      reportSchema.updateReport.parse(req.body);
      let { studentId, role, clearAllDebts, newReason } = req.body; // Destructure studentId from req.body
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      if (typeof studentId !== "string" || !role || typeof role !== "string") {
        return res.status(400).json({ message: "Invalid studentId or role" });
      }

      const clearAllDebt = clearAllDebts.toLowerCase() === "true"; // Ensure it's parsed as boolean

      if (clearAllDebt) {
        await prisma.reports.updateMany({
          where: { studentId, [role]: true },
          data: {
            [role]: false,
            [role + "Reason"]: null,
          },
        });
        const getStudentId = await prisma.studentProfile.findFirst({
          where: {
            studentId: studentId,
          },
        });
        await prisma.clearanceRequest.update({
          where: { userId: getStudentId?.userId },
          data: {
            ["Reason" + role]: null,
          },
        });
        res.status(200).json({ message: "All Debt cleared successfully" });
      } else {
        const existingReport = await prisma.reports.findFirst({
          where: { studentId, [role]: true },
          include: {
            student: true,
          },
        });

        if (existingReport) {
          const roleReason = role + "Reason";
          await prisma.reports.update({
            where: { id: existingReport.id },
            data: {
              [role]: true,
              [roleReason]: newReason.trim() === "" ? null : newReason,
            },
          });

          if (!newReason) {
            await prisma.reports.update({
              where: { id: existingReport.id },
              data: {
                [role]: false,
              },
            });

            await prisma.clearanceRequest.update({
              where: { userId: existingReport.student.userId },
              data: {
                ["Reason" + role]: null,
              },
            });
          }

          return res.status(200).json({ message: "Debt cleared successfully" });
        } else {
          return res.status(404).json({
            message: "Report not found for debt on this office",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {},
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      reportSchema.get.parse(req.body);
      let role = req.body.role.toLowerCase();
      role = role.charAt(0).toUpperCase() + role.slice(1);

      // Check if role is provided and is a non-empty string
      if (!role || typeof role !== "string") {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Capitalize the role
      const capitalizedRole =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const roleReason = capitalizedRole + "Reason";

      // Fetch all reports where the specified role is true
      const allDebts = await prisma.reports.findMany({
        where: { [role]: true },
        include: {
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

      // Extract required fields from the fetched data
      const formattedDebts = allDebts.map((debt) => {
        const user = debt.student.user;
        const userProfile = user && user.profile;

        return {
          id: debt.id,
          studentId: debt.student.studentId,
          firstName: userProfile ? userProfile.firstName : null,
          lastName: userProfile ? userProfile.lastName : null,
          department: debt.student.department,
        };
      });

      // Return the formatted debts
      return res.status(200).json(formattedDebts);
    } catch (error) {
      // console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getSearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      reportSchema.getSingle.parse(req.body);
      const { studentId, firstName } = req.body;
      let role = req.body.role.toLowerCase();
      role = role.charAt(0).toUpperCase() + role.slice(1);
      if (!role || typeof role !== "string") {
        return res.status(400).json({ message: "Invalid role" });
      }

      if (!studentId && !firstName) {
        return res
          .status(400)
          .json({ message: "Provide either studentId or firstName" });
      }

      const capitalizedRole =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const roleReason = capitalizedRole + "Reason";

      let whereClause: any = { [role]: true };

      if (studentId || firstName) {
        whereClause = {
          ...whereClause,
          AND: [
            { [role]: true },
            {
              student: {
                OR: [
                  { user: { profile: { firstName: { contains: firstName } } } },
                  { studentId: { contains: studentId } },
                ],
              },
            },
          ],
        };
      }

      // Fetch multiple reports based on the conditions
      const reports = await prisma.reports.findMany({
        where: whereClause,
        include: {
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

      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "Reports not found" });
      }

      // Extract required fields from the fetched data for each report
      const formattedReports = reports.map((report) => {
        const userProfile = report.student.user.profile;
        return {
          id: report.id,
          studentId: report.student.studentId,
          firstName: userProfile?.firstName,
          lastName: userProfile?.lastName,
          department: report.student.department,
        };
      });

      // Return the formatted reports
      return res.status(200).json(formattedReports);
    } catch (error) {
      // console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getReason: async (req: Request, res: Response, next: NextFunction) => {
    try {
      reportSchema.get.parse(req.body);
      const { id } = req.params; // Use req.params to get the report ID
      let role = req.body.role.toLowerCase();
      role = role.charAt(0).toUpperCase() + role.slice(1);
      if (!role || typeof role !== "string") {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Fetch single report based on the conditions
      const singleReport = await prisma.reports.findFirst({
        where: { id: parseInt(id), [role]: true }, // Use parseInt to convert id to number
        include: {
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
      const userProfile = singleReport.student?.user?.profile; // Ensure objects are not null/undefined
      const formattedReport = {
        id: singleReport.id,
        studentId: singleReport.student?.studentId,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        department: singleReport.student?.department || null, // Handle potential null value
        reason: singleReport[(role + "Reason") as keyof typeof singleReport], // Include the reason field
      };

      // Return the formatted report
      return res.status(200).json(formattedReport);
    } catch (error) {
      // console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // getByStudentId: async (req: Request, res: Response, next: NextFunction) => {},
};

export default reportController;
