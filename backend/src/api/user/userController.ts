import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import userSchema from "./userSchema.js";
import bcrypt from "bcrypt";
import { SECRET } from "../../config/secrets.js";
import { generateOTP } from "../../util/generateor.js";
import { sendEmail } from "../../util/emailSender.js";
import { Gender } from "@prisma/client";

const usersController = {
  getAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allUsers = await prisma.user.findMany({
        where: {
          NOT: {
            role: "STUDENT",
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          activeStatus: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              middleName: true,
              lastName: true,
              sex: true,
              imageUrl: true,
            },
          },
        },
      });
      res.status(200).json(allUsers);
      next();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getStudent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allUsers = await prisma.user.findMany({
        where: {
          role: "STUDENT",
        },
        select: {
          id: true,
          email: true,
          role: true,
          activeStatus: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              middleName: true,
              lastName: true,
              sex: true,
              imageUrl: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              userId: true,
              studentId: true,
              faculty: true,
              department: true,
              academicYear: true,
            },
          },
        },
      });
      res.status(200).json(allUsers);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          activeStatus: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              middleName: true,
              lastName: true,
              sex: true,
              imageUrl: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              userId: true,
              studentId: true,
              faculty: true,
              department: true,
              academicYear: true,
            },
          },
        },
      });
      const organizedUsers = allUsers.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        profile: {
          id: user.profile?.id,
          firstName: user.profile?.firstName,
          middleName: user.profile?.middleName,
          lastName: user.profile?.lastName,
          sex: user.profile?.sex,
          imageUrl: user.profile?.imageUrl,
        },
        studentProfile: {
          id: user.studentProfile?.id,
          studentId: user.studentProfile?.studentId,
          faculty: user.studentProfile?.faculty,
          department: user.studentProfile?.department,
          academicYear: user.studentProfile?.academicYear,
        },
      }));
      res.status(200).json(organizedUsers);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  searchUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      userSchema.searchUser.parse(req.body);
      // Extract search parameters from the request body
      const { searchCondition } = req.body;

      // Define the where condition based on the search condition
      let whereCondition = {};

      if (searchCondition.studentId) {
        whereCondition = {
          studentProfile: {
            studentId: {
              contains: searchCondition.studentId,
            },
          },
        };
      } else if (searchCondition.firstName) {
        whereCondition = {
          profile: {
            firstName: {
              contains: searchCondition.firstName,
            },
          },
        };
      }

      // Retrieve users matching the search criteria
      const allUsers = await prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          email: true,
          role: true,
          activeStatus: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              middleName: true,
              lastName: true,
              sex: true,
              imageUrl: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              userId: true,
              studentId: true,
              faculty: true,
              department: true,
              academicYear: true,
            },
          },
        },
      });

      // Organize the response
      const organizedUsers = allUsers.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        profile: {
          id: user.profile?.id,
          firstName: user.profile?.firstName,
          middleName: user.profile?.middleName,
          lastName: user.profile?.lastName,
          sex: user.profile?.sex,
          imageUrl: user.profile?.imageUrl,
        },
        studentProfile: {
          id: user.studentProfile?.id,
          studentId: user.studentProfile?.studentId,
          faculty: user.studentProfile?.faculty,
          department: user.studentProfile?.department,
          academicYear: user.studentProfile?.academicYear,
        },
      }));

      // Send the organized users data in the response
      res.status(200).json(organizedUsers);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getSingle: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    try {
      const User = await prisma.user.findFirst({
        where: { id: +req.userId },
        select: {
          id: true,
          email: true,
          role: true,
          activeStatus: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              middleName: true,
              lastName: true,
              sex: true,
              imageUrl: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              userId: true,
              studentId: true,
              faculty: true,
              department: true,
              academicYear: true,
            },
          },
        },
      });

      const organizedUser = {
        id: User?.id,
        email: User?.email,
        role: User?.role,
        activeStatus: User?.activeStatus,
        createdAt: User?.createdAt,
        profile: {
          id: User?.profile?.id,
          userId: User?.profile?.userId,
          firstName: User?.profile?.firstName,
          middleName: User?.profile?.middleName,
          lastName: User?.profile?.lastName,
          sex: User?.profile?.sex,
          imageUrl: User?.profile?.imageUrl,
        },
        studentProfile: {
          id: User?.studentProfile?.id,
          userId: User?.studentProfile?.userId,
          studentId: User?.studentProfile?.studentId,
          faculty: User?.studentProfile?.faculty,
          department: User?.studentProfile?.department,
          academicYear: User?.studentProfile?.academicYear,
        },
      };
      // res.status(200).json(User);
      res.status(200).json({
        data: organizedUser,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    req.userId = +req.params.id;
    // check if user exist usind id and role
    const isUserExist = await prisma.user.findFirst({
      where: {
        AND: [{ id: +req.userId }, { role: req.body.role }],
      },
    });
    if (!isUserExist) {
      return next(
        new UnprocessableEntity(
          "no user found in this id",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    //start deleting
    const isUserDeleted = await prisma.user.delete({
      where: {
        id: +req.userId,
      },
    });
    res.status(200).json({
      message: "sucessfully deleted",
      sucess: true,
    });
  },
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    userSchema.login.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(403).json({
        message: "No account found with this email",
        success: false,
      });
    }

    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        message: "Incorrect password",
        success: false,
      });
    }

    let userProfile = null;
    const userProfileData = await prisma.userProfile.findFirst({
      where: { userId: user.id },
    });

    if (userProfileData) {
      userProfile = await prisma.userProfile.findFirst({
        where: { userId: user.id },
        include: {
          user: {
            include: {
              profile: true,
              studentProfile: true,
              // request: true,
              // result: true,
              // clearance: true,
              // reports: true,
            },
          },
        },
      });
    }

    // Create token
    const payload = {
      id: user.id,
      role: user.role,
      firstName: userProfile?.user?.profile?.firstName || null,
    };
    const token = jwt.sign(payload, SECRET!);

    return res.status(200).json({
      token,
      success: true,
      data: userProfile,
      message: "Login successfully",
    });
  },
  myInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: +req.user!.id },
        select: {
          id: true,
          email: true,
          role: true,
          activeStatus: true,
          createdAt: true,
          otp: true,
          _count: {
            select: {
              request: true,
              result: true,
              clearance: true,
              reports: true,
            },
          },
          profile: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              middleName: true,
              lastName: true,
              sex: true,
              imageUrl: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              userId: true,
              studentId: true,
              faculty: true,
              department: true,
              academicYear: true,
            },
          },
          request: true,
          result: true,
          clearance: true,
          reports: true,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    userSchema.forgetPassowd.parse(req.body);
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: req.body.email,
      },
      include: {
        profile: true,
      },
    });
    if (!user) {
      return next(
        new UnprocessableEntity(
          "No account found with this email",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    // prepare token
    const payload = {
      id: user.id,
      role: user.role,
      firstName: user.profile?.firstName,
    };
    const token = jwt.sign(payload, SECRET!);
    //generate 6 didgit code
    const otp = generateOTP();
    // // //store in to database
    const otpUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp: otp,
      },
    });
    //send email
    try {
      const emailDelivered = await sendEmail(otpUser.email, `${otp}`);
      if (emailDelivered.success == false) {
        return next(
          new UnprocessableEntity(
            `unable to send email ${emailDelivered.message}`,
            403,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      //send response
      res.status(200).json({
        success: true,
        message: emailDelivered.message,
        data: user,
        token,
      });
    } catch (er) {
      console.log(er);
    }
  },
  confirmOtp: async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findFirst({
      where: { id: +req.user!.id },
      include: {
        profile: true,
      },
    });
    if (!user) {
      return next(
        new UnprocessableEntity(
          "No account found with this email",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    const { otp } = req.body;
    if (otp != user.otp) {
      return next(
        new UnprocessableEntity(
          "Incorrect otp",
          403,
          ErrorCode.INCORRECT_OTP,
          null
        )
      );
    }

    // remove otp and set null
    const udpadteUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp: "000000",
      },
    });
    // Create token
    const payload = {
      id: user.id,
      role: user.role,
      firstName: user.profile?.firstName,
    };
    const token = jwt.sign(payload, SECRET!);
    return res.status(200).json({
      message: "Otp confirmed",
      data: udpadteUser,
      token,
    });
  },
  newPassword: async (req: Request, res: Response, next: NextFunction) => {
    userSchema.newPassword.parse(req.body);
    if (req.body.passwod != req.body.cpasswod) {
      return next(
        new UnprocessableEntity(
          "password and confirm password does not mutch ",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }

    // check if the otp is confirmed
    if (req.user!.otp == "00000") {
      return next(
        new UnprocessableEntity(
          "the otp is not cofirmed yet",
          403,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    // hash the password

    req.body.cpassword = bcrypt.hashSync(req.body.cpassword, 10);
    console.log(req.body.cpasswod);

    //  know chenge password
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        password: req.body.cpasswod,
        otp: null,
      },
    });

    return res.status(200).json(updatedUser);
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    // userSchema.register.parse(req.body);
    //check if the employye exist before
    const isUserExist = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (isUserExist) {
      return next(
        new UnprocessableEntity(
          "Email  has been registered before",
          403,
          ErrorCode.USER_ALREADY_EXIST,
          null
        )
      );
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    //create the employee
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        activeStatus: true,
        role: req.body.role,
        profile: {
          create: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            // imageUrl: req.body.imageUrl,
            sex: req.body.sex,
          },
        },
        ...(req.body.role === "STUDENT" && {
          studentProfile: {
            create: {
              studentId: req.body.studentId,
              faculty: req.body.faculty,
              department: req.body.department,
              academicYear: req.body.academicYear,
            },
          },
        }),
      },
      include: {
        profile: true,
        studentProfile: true,
      },
    });
    res.status(201).json(newUser);
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    //check if user exist
    const isUser = await prisma.user.findFirst({
      where: { id: req.user!.id },
    });
    if (!isUser) {
      return next(
        new UnprocessableEntity(
          "user not found",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    }
    //check if the old passwod is correct
    const isMatch = await bcrypt.compareSync(
      req.body.oldPassword,
      isUser!.password
    );
    if (!isMatch) {
      return next(
        new UnprocessableEntity(
          "incorrect old passwod",
          403,
          ErrorCode.INCORRECT_OLD_PASSWORD,
          null
        )
      );
    }
    req.body.newPasswod = bcrypt.hashSync(req.body.newPasswod, 10);
    //update password
    const updatedPassword = await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: req.body.newPasswod },
    });
    res.status(200).json(updatedPassword);
  },
  updatedEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log the value of req.params.id
      console.log("User ID from request:", req.params.id);

      // Parse the user ID from the request parameters
      const userId = Number(req.params.id.trim());

      // Ensure that userId is a valid number
      if (isNaN(userId) || userId <= 0) {
        return next(
          new UnprocessableEntity(
            "Invalid user ID",
            422,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Parse and validate the request body
      try {
        userSchema.updateEmailAndPhone.parse(req.body);
      } catch (error) {
        return next(
          new UnprocessableEntity(
            "Validation failed",
            422,
            ErrorCode.VALIDATION_FAILED,
            null
          )
        );
      }

      // Check if the user exists with the given ID
      const isUserExist = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!isUserExist) {
        return next(
          new UnprocessableEntity(
            "No user found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Check if the email is already in use
      const isEmailUsed = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (isEmailUsed) {
        return next(
          new UnprocessableEntity(
            "Email has already been registered",
            403,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Update the user's email
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { email: req.body.email },
      });

      // Return the updated user
      return res.status(200).json(updatedUser);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);

      return next(
        new UnprocessableEntity(
          "Internal Server Error",
          422,
          ErrorCode.INTERNAL_SERVER_ERROR,
          null
        )
      );
    }
  },
  updateStudent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body
      const requestBody = userSchema.studentUpdateSchema.parse(req.body);

      // Extract user ID from the request parameters
      const userId = parseInt(req.params.id, 10);

      // Ensure that userId is a valid number
      if (isNaN(userId) || userId <= 0) {
        return next(
          new UnprocessableEntity(
            "Invalid user ID",
            422,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Check if the user exists with the given ID
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return next(
          new UnprocessableEntity(
            "No user found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }
      console.log(req.body.role);
      // Update the user's details
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            update: {
              firstName: requestBody.firstName,
              middleName: requestBody.middleName,
              lastName: requestBody.lastName,
              sex: requestBody.sex?.toUpperCase() as Gender,
            },
          },
        },
      });

      // Return the updated user
      return res.status(200).json(updatedUser);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return next(
        new UnprocessableEntity(
          "Internal Server Error",
          422,
          ErrorCode.INTERNAL_SERVER_ERROR,
          null
        )
      );
    }
  },
  // getRejected: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { role } = req.body;

  //     // Validate the role
  //     if (!role) {
  //       return res.status(400).json({ message: "Role is required" });
  //     }

  //     // Construct the reason column name based on the role
  //     const reasonColumn = `Reason${role.charAt(0).toUpperCase()}${role.slice(1)}`;

  //     // Retrieve users who have rejection reasons for the specified office
  //     const rejectedUsers = await prisma.clearanceRequest.findMany({
  //       where: {
  //         // Ensure that the reasonColumn is used properly in the where clause
  //         [reasonColumn]: {
  //           // Check if the reasonColumn is not null
  //           not: null,
  //         },
  //       },
  //       select: {
  //         userId: true,
  //         user: {
  //           select: {
  //             id: true,
  //             email: true,
  //             role: true,
  //             profile: {
  //               select: {
  //                 id: true,
  //                 userId: true,
  //                 firstName: true,
  //                 middleName: true,
  //                 lastName: true,
  //                 sex: true,
  //                 imageUrl: true,
  //               },
  //             },
  //             studentProfile: {
  //               select: {
  //                 id: true,
  //                 userId: true,
  //                 studentId: true,
  //                 faculty: true,
  //                 department: true,
  //                 academicYear: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     // Map each rejected user to a simplified object
  //     const simplifiedRejectedUsers = rejectedUsers.map(({ user }) => ({
  //       id: user.id,
  //       email: user.email,
  //       role: user.role,
  //       firstName: user.profile?.firstName,
  //       lastName: user.profile?.lastName,
  //       studentId: user.studentProfile?.studentId,
  //       department: user.studentProfile?.department,
  //     }));

  //     // Return the list of simplified rejected users
  //     return res.status(200).json({ rejectedUsers: simplifiedRejectedUsers });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // },

  getSearchAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse request body
      userSchema.searchAdminSchema.parse(req.body);
      const { id, firstName } = req.body;

      // Define where condition for filtering users
      let whereCondition: any = {
        role: {
          not: "STUDENT",
        },
      };

      // Add conditions for ID and first name search
      if (id) {
        whereCondition.id = parseInt(id);
      }
      if (firstName) {
        whereCondition.profile = {
          firstName: {
            contains: firstName.toString(),
          },
        };
      }

      // Retrieve the user matching the search criteria
      const users = await prisma.user.findMany({
        where: whereCondition,
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              sex: true,
            },
          },
        },
      });

      // If users are found, organize the data
      let response;
      if (users.length > 0) {
        const organizedUsers = users.map((user) => ({
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          sex: user.profile?.sex,
          role: user.role,
        }));
        response = {
          message: "Search successful",
          users: organizedUsers,
        };
      } else {
        response = {
          message: "No users found",
        };
      }

      // Send response
      return res.status(200).json(response);
    } catch (error) {
      // Pass error to the error handler middleware
      next();
    }
  },
};

export default usersController;
