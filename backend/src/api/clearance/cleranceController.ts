import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import clearanceSchema from "./clearanceSchema.js";

const cleranceController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    clearanceSchema.addClerance.parse(req.body);

    try {
      const requestExist = await prisma.clearanceRequest.findFirst({
        where: {
          id: +req.body.requestId,
        },
      });

      if (!requestExist) {
        return next(
          new UnprocessableEntity(
            "No request found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      const newClerance = await prisma.clearance.create({
        data: {
          requestId: +req.body.requestId,
          userId: req.user!.id,
          academicYear: requestExist.academicYear,
          semester: requestExist?.semester,
        },
      });

      return res.status(200).json(newClerance);
    } catch (error) {
      return next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    clearanceSchema.updateClearance.parse(req.body);
    const cleranceId = req.params.id;

    try {
      const cleranceExist = await prisma.clearance.findFirst({
        where: {
          id: +cleranceId,
        },
      });

      if (!cleranceExist) {
        return next(
          new UnprocessableEntity(
            "No clearance found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      const updatedClerance = await prisma.clearance.update({
        where: { id: +cleranceId },
        data: {
          requestId: +req.body.requestId,
          userId: req.user!.id,
          academicYear: req.body.academicYear, // Include the academicYear field from request body
        },
      });

      return res.status(200).json(updatedClerance);
    } catch (error) {
      return next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    const cleranceId = req.params.id;
    const isExist = await prisma.clearance.findFirstOrThrow({
      where: {
        id: +cleranceId,
      },
    });
    if (!isExist) {
      return next(
        new UnprocessableEntity(
          "no clerance found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    const delatedClerance = await prisma.clearance.delete({
      where: {
        id: +cleranceId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "clerance deleted successfully",
    });
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clerances = await prisma.clearance.findMany({
        include: {
          user: {
            select: {
              role: true,
              profile: {
                select: {
                  userId: true,
                  firstName: true,
                  lastName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  faculty: true,
                  academicYear: true,
                },
              },
            },
          },
        },
      });

      // Organize data before sending to frontend
      const formattedClerances = clerances.map((clearance) => ({
        userId: clearance.user.profile?.userId,
        firstName: clearance.user.profile?.firstName,
        lastName: clearance.user.profile?.lastName,
        sex: clearance.user.profile?.sex,
        role: clearance.user.role,
        studentId: clearance.user.studentProfile?.studentId || null,
        department: clearance.user.studentProfile?.department || null,
        faculty: clearance.user.studentProfile?.faculty || null,
        academicYear: clearance.user.studentProfile?.academicYear || null,
      }));

      return res.status(200).json(formattedClerances);
    } catch (error) {
      return next(error);
    }
  },
  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clearanceId = req.params.id;
      const clearance = await prisma.clearance.findFirst({
        include: {
          user: {
            select: {
              role: true,
              profile: {
                select: {
                  userId: true,
                  firstName: true,
                  lastName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  faculty: true,
                  academicYear: true,
                },
              },
            },
          },
        },
        where: {
          id: +clearanceId, // Use 'id' instead of 'userId'
        },
      });

      if (!clearance) {
        return res.status(404).json({ message: "Clearance not found" });
      }

      // Format the data before sending to the frontend
      const formattedClearance = {
        userId: clearance.user.profile?.userId,
        firstName: clearance.user.profile?.firstName,
        lastName: clearance.user.profile?.lastName,
        sex: clearance.user.profile?.sex,
        role: clearance.user.role,
        studentId: clearance.user.studentProfile?.studentId || null,
        department: clearance.user.studentProfile?.department || null,
        faculty: clearance.user.studentProfile?.faculty || null,
        academicYear: clearance.user.studentProfile?.academicYear || null,
      };

      return res.status(200).json(formattedClearance);
    } catch (error) {
      return next(error);
    }
  },
  getBySearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      clearanceSchema.getBySearchSchema.parse(req.body);
      const { firstName, studentId } = req.body;

      const whereCondition: any = {};

      // Add conditions for first name and student ID search
      if (firstName) {
        whereCondition.user = {
          profile: {
            firstName: {
              contains: firstName.toString(),
            },
          },
        };
      }
      if (studentId) {
        whereCondition.user = {
          ...whereCondition.user,
          studentProfile: {
            studentId: {
              equals: studentId.toString(),
            },
          },
        };
      }

      const clerances = await prisma.clearance.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              role: true,
              profile: {
                select: {
                  userId: true,
                  firstName: true,
                  lastName: true,
                  sex: true,
                },
              },
              studentProfile: {
                select: {
                  studentId: true,
                  department: true,
                  faculty: true,
                  academicYear: true,
                },
              },
            },
          },
        },
      });

      // Organize data before sending to frontend
      const formattedClerances = clerances.map((clearance) => ({
        userId: clearance.user.profile?.userId,
        firstName: clearance.user.profile?.firstName,
        lastName: clearance.user.profile?.lastName,
        sex: clearance.user.profile?.sex,
        role: clearance.user.role,
        studentId: clearance.user.studentProfile?.studentId || null,
        department: clearance.user.studentProfile?.department || null,
        faculty: clearance.user.studentProfile?.faculty || null,
        academicYear: clearance.user.studentProfile?.academicYear || null,
      }));
      return res.status(200).json(formattedClerances);
    } catch (error) {
      return next(error);
    }
  },
};

export default cleranceController;
