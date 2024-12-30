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
import { UserRole } from "@prisma/client";
const usersController = {
  getAdmin: async (req, res) => {
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

      // Send response
      return res.status(200).json({
        message: "success get the admin",
        data: allUsers,
        success: true,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "Error during get admin", success: false });
    }
  },

  getStudent: async (req, res, next) => {
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
      res.status(500).json({
        message: "Error durig get student",
        success: false,
      });
    }
  },
  getUsers: async (req, res, next) => {
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
      const organizedUsers = allUsers.map((user) => {
        return {
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
        };
      });

      res
        .status(200)
        .json({ data: organizedUsers, message: "success", success: true });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Error during get users", success: false });
    }
  },

  searchUsers: async (req, res, next) => {
    try {
      userSchema.searchUser.parse(req.body);

      // Extract search parameters from the request body
      const { studentId, firstName } = req.body;
      // console.log(req.body);

      // Define the where condition based on the search criteria
      let whereCondition = {};

      // Only apply the studentId condition if it is provided
      if (studentId) {
        whereCondition.studentProfile = {
          studentId: {
            contains: studentId.trim(),
            mode: "insensitive",
          },
        };
      }

      // If firstName is provided, we will include it in the OR clause
      if (firstName) {
        whereCondition = {
          AND: [
            whereCondition, // Include the previous condition (studentId if present)
            {
              profile: {
                firstName: {
                  contains: firstName.trim(),
                  mode: "insensitive",
                },
              },
            },
          ],
        };
      }

      // If only studentId is provided, use findFirst to get a single result
      let allUsers;
      if (studentId) {
        allUsers = await prisma.user.findMany({
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
      } else {
        // If only firstName is provided, findMany to allow multiple results
        allUsers = await prisma.user.findMany({
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
      }

      // Organize the response if there are results
      const organizedUsers = Array.isArray(allUsers)
        ? allUsers.map((user) => ({
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
          }))
        : allUsers
          ? [allUsers]
          : []; // Wrap single user in an array if found

      // Send the organized users data in the response
      res
        .status(200)
        .json({ data: organizedUsers, message: "success", success: true });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Error during get searching users", success: false });
    }
  },

  getSingle: async (req, res, next) => {
    req.userId = +req.params.id; // Convert id to number
    try {
      if (isNaN(req.userId)) {
        return res
          .status(400)
          .json({ message: "Invalid userId", success: false });
      }
      // Fetch user and their profile first
      const user = await prisma.user.findFirst({
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
          request: true || [],
          result: true || [],
          clearance: true || [],
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      // If the user has a student profile, use the studentId to fetch only related reports
      let reports = [];
      if (user.studentProfile?.studentId) {
        reports = await prisma.reports.findMany({
          where: {
            studentId: user.studentProfile.studentId,
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

      // Organize the response
      const organizedUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        activeStatus: user.activeStatus,
        createdAt: user.createdAt,
        profile: user.profile || {}, // Provide empty object if profile is null
        studentProfile: user.studentProfile || {}, // Provide empty object if studentProfile is null
        request: user.request || [],
        result: user.result || [],
        reports: reports || [], // Filtered reports
        clearance: user.clearance || [],
      };

      res
        .status(200)
        .json({ data: organizedUser, success: true, message: "success" });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(400)
        .json({ message: "Error during get user", success: false });
    }
  },
  delete: async (req, res, next) => {
    req.userId = +req.params.id; // Convert id to a number
    try {
      if (isNaN(req.userId)) {
        return res
          .status(400)
          .json({ message: "Invalid userId", success: false });
      }
      // Check if the user exists using id and role
      const isUserExist = await prisma.user.findFirst({
        where: {
          id: req.userId, // No need for AND if only checking id
          role: req.body.role, // Checking role directly
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

      // Start deleting
      await prisma.user.delete({
        where: {
          id: req.userId,
        },
      });

      res.status(200).json({
        message: "Successfully deleted",
        success: true,
      });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(400)
        .json({ message: "Error during deleting", success: false });
    }
  },
  loginUser: async (req, res, next) => {
    // Validate the request body against the login schema
    userSchema.login.parse(req.body);

    try {
      // Check if the user exists by email
      const user = await prisma.user.findFirst({
        where: { email: req.body.email },
      });
      const sendRole = user?.role;
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid credential", success: false });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invalid credential", success: false });
      }

      // Retrieve user profile data
      const userProfileData = await prisma.userProfile.findFirst({
        where: { userId: user?.id },
      });
      let userProfile = null;
      if (userProfileData) {
        userProfile = await prisma.userProfile.findFirst({
          where: { userId: user.id },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                activeStatus: true,
                createdAt: true,
                profile: true,
                studentProfile: true,
                request: true,
                result: true,
                clearance: true,
              },
            },
          },
        });
      }
      const report = await prisma.reports.findFirst({
        where: {
          studentId: userProfile?.studentProfile?.studentId,
        },
        select: {
          id: true,
          reson: true,
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
      userProfile = { ...userProfile, role: sendRole };

      // Token payload
      const payload = {
        id: user.id,
        role: user.role,
        firstName: userProfile?.user?.profile?.firstName || null,
      };

      // Generate JWT token with expiration (e.g., 1 hour)
      const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

      return res.status(200).json({
        token,
        data: userProfile,
        message: "Logged in successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(403).json({ message: "unauthenticated user", success: false });
    }
  },
  myInfo: async (req, res, next) => {
    try {
      const { id } = req.body;
      const userId = Number(id);
      if (!id || isNaN(Number(id))) {
        return res
          .status(400)
          .json({ message: "Invalid or missing user ID", success: false });
      }
      // Step 1: Fetch the user and their student profile
      const user = await prisma.user.findFirst({
        where: { id: userId },
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
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      // Step 2: Fetch the specific report linked to the student's profile
      const studentId = user.studentProfile?.studentId;
      const report = await prisma.reports.findFirst({
        where: {
          studentId: studentId,
        },
        select: {
          id: true,
          reson: true,
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
      const data = { ...user, report };
      // Send the user information with the specific report in the response
      res.status(200).json({ success: true, data, message: "success" });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      // Validate the request body using the schema
      userSchema.forgetPassowd.parse(req.body);

      // Find the user by email
      const user = await prisma.user.findFirstOrThrow({
        where: { email: req.body.email },
        include: { profile: true },
      });

      // Prepare the JWT token payload
      // const payload = {
      //   id: user.id,
      //   role: user.role,
      //   firstName: user.profile?.firstName || null,
      // };
      // const token = jwt.sign(payload, SECRET);

      // Generate a 6-digit OTP
      const otp = generateOTP();
      // console.log(otp);
      // Store the OTP in the database
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: otp },
      });

      // Send the OTP via email
      const emailDelivered = await sendEmail(user.email, `: ${otp}`);
      if (!emailDelivered.success) {
        return next(
          new UnprocessableEntity(
            `Unable to send email: ${emailDelivered.message}`,
            403,
            ErrorCode.EMAIL_SEND_FAILURE,
            null
          )
        );
      }

      // Send response
      res.status(200).json({
        success: true,
        message: "check your email and verify the otp",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        // token,
      });
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        return next(error); // Pass the error to the error handler
      }
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  confirmOtp: async (req, res, next) => {
    try {
      // Fetch the user from the database
      userSchema.confirmOtp.parse(req.body);
      const user = await prisma.user.findFirst({
        where: { id: +req.body.id },
        include: { profile: true },
      });

      // Check if the user exists
      if (!user) {
        return next(
          new UnprocessableEntity(
            "No account found with this ID",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Extract OTP from the request body
      const { otp } = req.body;
      // console.log("first", user);
      // Validate the OTP
      if (otp !== user.otp) {
        return res.status(403).json({
          message: "Incorrect OTP",
          success: false,
        });
      }

      // Update the user by removing the OTP
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { otp: null }, // Set OTP to null instead of a default value
      });

      // Create a JWT token
      // const payload = {
      //   id: user.id,
      //   role: user.role,
      //   firstName: user.profile?.firstName || null,
      // };
      // const token = jwt.sign(payload, SECRET);

      // Send the response
      return res.status(200).json({
        message: "OTP confirmed",
        data: updatedUser,
        // token,
        success: true,
      });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  newPassword: async (req, res, next) => {
    try {
      // Validate request body against schema
      userSchema.newPassword.parse(req.body);

      // Check if passwords match
      if (req.body.password !== req.body.cpassword) {
        return next(
          new UnprocessableEntity(
            "Password and confirm password do not match",
            403,
            ErrorCode.PASSWORD_MISMATCH, // Use a more relevant error code
            null
          )
        );
      }

      // Check if the OTP is confirmed

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      // Update the user's password in the database
      const updatedUser = await prisma.user.update({
        where: { id: req.body.id },
        data: {
          password: hashedPassword, // Save the hashed password
          otp: null, // Reset OTP
        },
      });

      // Send a response with the updated user information
      return res.status(200).json({
        message: "Password updated successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },
  getStudentCount: async (req, res, next) => {
    try {
      const studentCount = await prisma.user.count({
        where: {
          role: "STUDENT",
        },
      });
      res.status(200).json({
        data: studentCount,
        success: true,
        message: "the no of students are retrieved",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Error during student count retrieval",
        success: false,
      });
    }
  },
  getAllUsersCount: async (req, res, next) => {
    try {
      const totalUsersCount = await prisma.user.count();
      res.status(200).json({
        data: totalUsersCount,
        success: true,
        message: "the no of students are retrieved",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Error during total user count retrieval",
        success: false,
      });
    }
  },

  register: async (req, res, next) => {
    try {
      // Validate request body against schema
      userSchema.register.parse(req.body);
      const role = req.body.role.toUpperCase();
      const validRoles = Object.values(UserRole);
      // Check if the user already exists
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role. Valid roles are: ${validRoles.join(", ")}`,
        });
      }
      const existingUser = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (existingUser?.id) {
        return res.status(403).json({
          success: false,
          message: `${req.body.email} Email has already been registered `,
        });
      }
      if (role === "STUDENT") {
        const { studentId, faculty, department } = req.body;
        if (!studentId || !faculty || !department) {
          return res.status(400).json({
            success: false,
            message:
              "Student ID, Faculty, and Department are required for students.",
          });
        }
      }
      // Hash the password before storing
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          activeStatus: true,
          role: role,
          profile: {
            create: {
              firstName: req.body.firstName,
              middleName: req.body.middleName,
              lastName: req.body.lastName,
              imageUrl: req.body.imageUrl,
              sex: req.body.sex,
            },
          },
          ...(role === "STUDENT" && {
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
      const respp =
        role == "STUDENT"
          ? "student added successfully"
          : "user added successfully";
      // Respond with the created user
      return res.status(201).json({
        message: respp,
        data: newUser,
        success: true,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      return res
        .status(500)
        .json({ message: "Failed to add student", success: false });
    }
  },
  // usersController.js

  updateAdminUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    userSchema.updateAdminUserSchema.parse(req.body); // Validate the input with admin-specific schema

    const { firstName, middleName, lastName, sex, email, password, role } =
      req.body;

    const formattedSex =
      sex && sex.toLowerCase() === "male" ? Gender.MALE : Gender.FEMALE;
    const formatRole = role?.toUpperCase();

    try {
      // Admin update: Allow updating email, password, and role (admin-only fields)
      const updatedUserData = {};
      if (email) updatedUserData.email = email;
      if (password) updatedUserData.password = await bcrypt.hash(password, 10);
      if (role) updatedUserData.role = formatRole;

      // Update the User model (email, password, role)
      if (Object.keys(updatedUserData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: updatedUserData,
        });
      }

      // Update the UserProfile model (but exclude student-specific fields like faculty, department, etc.)
      const updatedUserProfile = await prisma.userProfile.update({
        where: { userId: userId },
        data: {
          firstName,
          middleName,
          lastName,
          sex: formattedSex,
        },
      });

      // Return the updated user profile in the response
      const result = { ...updatedUserProfile };
      return res.status(200).json({
        message: "Admin successfully updated the user profile",
        data: result,
        success: true,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({
        message: "Failed to update user profile",
        success: false,
      });
    }
  },

  updateUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    userSchema.updateUserSchema.parse(req.body);
    const {
      faculty,
      department,
      studentId,
      firstName,
      middleName,
      lastName,
      sex,
      email,
      password,
      role,
    } = req.body;
    const formattedSex =
      sex && sex.toLowerCase() === "male" ? Gender.MALE : Gender.FEMALE;
    const formatRole = role ? role.toUpperCase() : undefined;
    try {
      // Update the UserProfile and StudentProfile models
      const updatedUserData = {};
      if (email) updatedUserData.email = email;
      if (password) updatedUserData.password = await bcrypt.hash(password, 10);
      if (role) updatedUserData.role = formatRole;

      // Update the User model (email, password, role)
      if (Object.keys(updatedUserData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: updatedUserData,
        });
      }
      const updatedUserProfile = await prisma.userProfile.update({
        where: { userId: userId },
        data: {
          firstName,
          middleName,
          lastName,
          sex: formattedSex,
        },
      });

      const updatedStudentProfile = await prisma.studentProfile.update({
        where: { userId: userId },
        data: {
          faculty,
          department,
          studentId,
        },
      });
      const result = { ...updatedUserProfile, ...updatedStudentProfile };
      // Return the updated profiles in the response
      return res.status(200).json({
        message: "User's data updated successfully",
        data: result,
        success: true,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({
        message: "Failed to update user's data ",
        success: false,
      });
    }
  },
  changePassword: async (req, res, next) => {
    try {
      // Check if user exists
      const user = await prisma.user.findFirst({
        where: { id: req.user.id },
      });

      if (!user) {
        return next(
          new UnprocessableEntity(
            "User not found",
            404,
            ErrorCode.USER_NOT_FOUND,
            null
          )
        );
      }

      // Check if the old password is correct
      const isMatch = bcrypt.compareSync(req.body.oldPassword, user.password);
      if (!isMatch) {
        return next(
          new UnprocessableEntity(
            "Incorrect old password",
            403,
            ErrorCode.INCORRECT_OLD_PASSWORD,
            null
          )
        );
      }

      // Hash the new password
      const hashedNewPassword = bcrypt.hashSync(req.body.newPassword, 10);

      // Update the password in the database
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedNewPassword },
      });

      // Respond with the updated user information, excluding sensitive data
      return res.status(200).json({
        message: "Password updated successfully",
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          activeStatus: updatedUser.activeStatus,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      console.error("Error during password change:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  },

  updatedEmail: async (req, res, next) => {
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
            ErrorCode.INVALID_USER_ID,
            null
          )
        );
      }

      // Parse and validate the request body
      try {
        userSchema.updateEmailAndPhone.parse(req.body);
      } catch (validationError) {
        return next(
          new UnprocessableEntity(
            "Validation failed: " + validationError.message,
            422,
            ErrorCode.VALIDATION_FAILED,
            null
          )
        );
      }

      // Check if the user exists with the given ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      // Check if the email is already in use
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (existingUserWithEmail) {
        return next(
          new UnprocessableEntity(
            "Email has already been registered",
            403,
            ErrorCode.EMAIL_ALREADY_REGISTERED,
            null
          )
        );
      }

      // Update the user's email
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { email: req.body.email },
      });

      // Return the updated user excluding sensitive data
      return res.status(200).json({
        message: "Email updated successfully",
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          activeStatus: updatedUser.activeStatus,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during email update:", error);
      res.status(500).json({ message: "email is not update", success: false });
    }
  },

  updateStudent: async (req, res, next) => {
    try {
      // Parse and validate the request body
      const requestBody = userSchema.studentUpdateSchema.parse(req.body);

      // Extract and validate user ID from the request parameters
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId) || userId <= 0) {
        return next(
          new UnprocessableEntity(
            "Invalid user ID",
            422,
            ErrorCode.INVALID_USER_ID,
            null
          )
        );
      }

      // Check if the user exists with the given ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      // Prepare update data
      const updatedData = {
        profile: {
          update: {
            firstName: requestBody.firstName,
            middleName: requestBody.middleName,
            lastName: requestBody.lastName,
            sex: requestBody.sex ? requestBody.sex.toUpperCase() : undefined,
          },
        },
      };

      // Update the user's details
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });

      // Return the updated user
      return res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during student update:", error);
      return res
        .status(500)
        .json({ message: "use not updated successfully", success: false });
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

  getSearchAdmin: async (req, res, next) => {
    try {
      // Parse and validate request body
      userSchema.searchAdminSchema.parse(req.body);
      const { id, firstName } = req.body;
      // const id = 2
      // const firstName = 'meng'
      console.log("Searching for:", id, firstName);
      console.log("Request body:", req.body);

      // Define where condition for filtering users
      let whereCondition = {
        role: {
          not: "STUDENT",
        },
      };

      // Add conditions for ID and first name search
      if (id) {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
          return next(
            new UnprocessableEntity(
              "Invalid ID format",
              422,
              ErrorCode.INVALID_ID,
              null
            )
          );
        }
        // Directly assign the parsed ID
        whereCondition.id = parsedId;
      }

      if (firstName) {
        whereCondition.profile = {
          firstName: {
            contains: firstName.toString(),
            mode: "insensitive", // Make the search case-insensitive
          },
        };
      }

      console.log("Where condition:", whereCondition);

      // Retrieve the users matching the search criteria
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

      // Organize and send response
      const response =
        users.length > 0
          ? {
              users: users.map((user) => ({
                firstName: user.profile?.firstName || null,
                lastName: user.profile?.lastName || null,
                sex: user.profile?.sex || null,
                role: user.role,
              })),
            }
          : {
              message: "No users found",
            };

      return res.status(200).json({
        data: response,
        success: true,
        message: "Search successful",
      });
    } catch (error) {
      // Log the error and pass it to the error handler middleware
      console.error("Error during admin search:", error);
      return res
        .status(401)
        .json({ message: "No users found", success: false });
    }
  },
  getSearchAdminForSearch: (req, res) => {
    console.log("check");
    res.send("check");
  },
};
export default usersController;
