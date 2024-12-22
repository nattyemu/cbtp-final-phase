import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import clearanceSchema from "./clearanceSchema.js";
const cleranceController = {
  add: async (req, res, next) => {
    try {
      clearanceSchema.addClerance.parse(req.body);

      const result = await prisma.$transaction(async (prisma) => {
        // Check if a clearance request exists with all necessary fields set to true
        const requestExist = await prisma.clearanceRequest.findFirst({
          where: {
            AND: [
              { id: +req.body.requestId },
              { isDepartment: true },
              { isCafe: true },
              { isPolice: true },
              { isLibrary: true },
              { isProctor: true },
              { isSuperproctor: true },
              { isRegistrar: true },
            ],
          },
          select: {
            id: true,
            userId: true,
            academicYear: true,
            semester: true,
          },
        });

        // If no request meets the conditions, throw an error to trigger a rollback
        if (!requestExist) {
          throw new Error(
            "User has not completed all clearance tasks or request not found."
          );
        }

        // Create a new clearance record using the details from the existing request
        const newClearance = await prisma.clearance.create({
          data: {
            requestId: requestExist.id,
            userId: requestExist.userId,
            academicYear: requestExist.academicYear,
            semester: requestExist.semester,
          },
          select: {
            id: true,
          },
        });

        // Manually delete the related clearance request, and ensure the `Clearance` is not deleted
        if (newClearance.id) {
          console.log(newClearance);
          await prisma.clearanceRequest.delete({
            where: {
              id: requestExist.id,
            },
          });
        }

        // Return the new clearance as the transaction result
        return newClearance;
      });

      // If transaction is successful, respond with the new clearance data
      console.log(result);
      return res.status(200).json({
        data: result,
        message: "Successfully checked out",
        success: true,
      });
    } catch (error) {
      // Handle errors and pass them to the error handler
      if (
        error.message ===
        "User has not completed all clearance tasks or request not found."
      ) {
        return res.status(400).json({
          message: error.message,
          success: false,
        });
      }
      console.log(error);
      return next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      // Validate the incoming request body
      clearanceSchema.updateClearance.parse(req.body);

      const clearanceId = +req.params.id;
      const id = Number(clearanceId);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: "Invalid report ID", success: false });
      }
      // Check if clearance exists
      const clearanceExist = await prisma.clearance.findUnique({
        where: { id: clearanceId },
      });

      if (!clearanceExist) {
        return next(
          new UnprocessableEntity(
            "No clearance found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Build the update data object based on provided fields
      const updateData = {
        ...(req.body.requestId && { requestId: +req.body.requestId }),
        ...(req.user && { userId: req.user.id }),
        ...(req.body.academicYear && { academicYear: req.body.academicYear }),
      };

      // Update the clearance
      const updatedClearance = await prisma.clearance.update({
        where: { id: clearanceId },
        data: updateData,
      });

      return res.status(200).json(updatedClearance);
    } catch (error) {
      return next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const clearanceId = +req.params.id;
      const id = Number(clearanceId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      // Attempt to find and delete the clearance directly
      await prisma.clearance.findFirstOrThrow({
        where: { id: clearanceId },
      });

      // Proceed to delete if the record exists
      await prisma.clearance.delete({
        where: { id: clearanceId },
      });

      // Return success response
      return res.status(200).json({
        success: true,
        message: "Clearance deleted successfully",
      });
    } catch (error) {
      // Handle case where clearance is not found
      if (
        error instanceof prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return next(
          new UnprocessableEntity(
            "No clearance found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }
      // Pass any other errors to the error handler
      return next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const clearances = await prisma.clearance.findMany({
        select: {
          id: true,
          academicYear: true,
          semester: true,
          createdAt: true,
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
                },
              },
            },
          },
        },
      });

      // Format the response
      const formattedClearances = clearances.map((clearance) => ({
        id: clearance.id,
        academicYear: clearance.academicYear,
        semester: clearance.semester,
        createdAt: clearance.createdAt,
        userId: clearance.user?.profile?.userId ?? null,
        firstName: clearance.user?.profile?.firstName ?? null,
        lastName: clearance.user?.profile?.lastName ?? null,
        sex: clearance.user?.profile?.sex ?? null,
        role: clearance.user?.role ?? null,
        studentId: clearance.user?.studentProfile?.studentId ?? null,
        department: clearance.user?.studentProfile?.department ?? null,
        faculty: clearance.user?.studentProfile?.faculty ?? null,
      }));

      return res.status(200).json(formattedClearances);
    } catch (error) {
      return next(error);
    }
  },
  getSingle: async (req, res, next) => {
    try {
      const userId = +req.params.userId; // Convert userId to a number
      const id = Number(userId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      const clearance = await prisma.clearance.findFirst({
        where: { userId },
        select: {
          id: true,
          academicYear: true,
          semester: true,
          createdAt: true,
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
                },
              },
            },
          },
        },
      });

      // Check if the clearance exists
      if (!clearance) {
        return res.status(404).json({ message: "Clearance not found" });
      }

      // Format the data before sending to the frontend
      const formattedClearance = {
        id: clearance.id,
        academicYear: clearance.academicYear,
        semester: clearance.semester,
        createdAt: clearance.createdAt,
        userId: clearance.user?.profile?.userId ?? null,
        firstName: clearance.user?.profile?.firstName ?? null,
        lastName: clearance.user?.profile?.lastName ?? null,
        sex: clearance.user?.profile?.sex ?? null,
        role: clearance.user?.role ?? null,
        studentId: clearance.user?.studentProfile?.studentId ?? null,
        department: clearance.user?.studentProfile?.department ?? null,
        faculty: clearance.user?.studentProfile?.faculty ?? null,
      };

      return res.status(200).json(formattedClearance);
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging
      return next(error);
    }
  },

  getBySearch: async (req, res, next) => {
    try {
      // Validate incoming request data
      clearanceSchema.getBySearchSchema.parse(req.body);
      const { firstName, studentId } = req.body;

      // Build the where condition for the query
      const whereCondition = {
        user: {
          ...(firstName?.trim() && {
            profile: {
              firstName: {
                contains: firstName.trim(),
                mode: "insensitive", // Optional: make the search case insensitive
              },
            },
          }),
          ...(studentId?.trim() && {
            studentProfile: {
              studentId: {
                contains: studentId.trim(),
                mode: "insensitive", // Optional: make the search case insensitive
              },
            },
          }),
        },
      };

      // Fetch the clearance records from the database
      const clearances = await prisma.clearance.findMany({
        where: whereCondition,
        select: {
          id: true,
          academicYear: true,
          semester: true,
          createdAt: true,
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
                },
              },
            },
          },
        },
      });

      // Format the fetched clearance records
      const formattedClearances = clearances.map((clearance) => {
        return {
          id: clearance.id,
          academicYear: clearance.academicYear,
          semester: clearance.semester,
          createdAt: clearance.createdAt,
          userId: clearance.user?.profile?.userId ?? null,
          firstName: clearance.user?.profile?.firstName ?? null,
          lastName: clearance.user?.profile?.lastName ?? null,
          sex: clearance.user?.profile?.sex ?? null,
          role: clearance.user?.role ?? null,
          studentId: clearance.user?.studentProfile?.studentId ?? null,
          department: clearance.user?.studentProfile?.department ?? null,
          faculty: clearance.user?.studentProfile?.faculty ?? null,
        };
      });

      return res.status(200).json(formattedClearances);
    } catch (error) {
      console.error("Error during search:", error); // Log the error for debugging
      return next(error);
    }
  },
};
export default cleranceController;
