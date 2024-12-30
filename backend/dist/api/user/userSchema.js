import { z } from "zod";
const userSchema = {
  register: z
    .object({
      email: z.string().email(),
      password: z.string().min(8).max(50),
      role: z.string(),
      studentId: z.string().nullable().optional(),
      faculty: z.string().nullable().optional(),
      department: z.string().nullable().optional(),
      academicYear: z.string().nullable().optional(),
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(["MALE", "FEMALE"]),

      imageUrl: z.string().optional(),
      activeStatus: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.role === "STUDENT") {
          // Ensure that the required fields are present when the role is "STUDENT"
          return (
            data.faculty &&
            data.department &&
            data.studentId &&
            data.academicYear
          );
        }
        return true; // Return true for non-STUDENT roles (no validation required)
      },
      {
        message:
          "Faculty, department, studentId, and academicYear are required for students",
        path: ["faculty"], // You can choose which field to flag the error on, e.g., 'faculty'
      }
    )
    .superRefine((data, ctx) => {
      // Additional validation for 'academicYear' if the role is 'STUDENT'
      if (data.role === "STUDENT" && !data.academicYear) {
        ctx.addIssue({
          path: ["academicYear"],
          code: z.ZodIssueCode.custom,
          message: "Academic year is required for students",
        });
      }
    }),

  updateAdminUserSchema: z.object({
    email: z.string().email(),
    password: z.string().min(0).max(50).optional(),
    role: z.string(),
    firstName: z.string().min(1),
    middleName: z.string(),
    lastName: z.string().min(1),
    sex: z.string(),
  }),
  updateUserSchema: z.object({
    faculty: z.string(),
    department: z.string(),
    studentId: z.string(),
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    sex: z.string(),
    email: z.string().email().optional(),

    // Password field with conditional validation
    password: z.string().min(0).max(50).optional(),
    role: z.string().optional(),
  }),
  //define mother
  registerStudent: z.object({
    email: z.string().email(),
    phone: z.string().max(14),
    password: z.string().min(8).max(50),
    //profile
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    sex: z.enum(["MALE", "FEMALE"]),
    imageUrl: z.string(),
    faculty: z.string(),
    department: z.string(),
    academicYear: z.string(),
  }),
  searchUser: z.object({
    firstName: z.string().optional(),
    studentId: z.string(),
  }),
  searchAdminSchema: z.object({
    firstName: z.string(),
    id: z.string().optional(),
  }),
  // define
  updateMother: z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    sex: z.enum(["MALE", "FEMALE"]),
    //mother related
  }),
  //update email and phone
  updateEmailAndPhone: z.object({
    role: z.string(),
    email: z.string().email(),
    // phone: z.string().max(14),
  }),
  //login schema
  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  studentUpdateSchema: z.object({
    firstName: z.string(),
    middleName: z.string().nullable(),
    lastName: z.string(),
    sex: z.string().optional(),
  }),
  //forget password
  forgetPassowd: z.object({
    email: z.string().email().min(5).max(42),
  }),
  //
  getRejected: z.object({
    role: z.string(),
  }),
  confirmOtp: z.object({
    id: z.number(),
    otp: z.string(),
  }),
  newPassword: z.object({
    password: z.string().min(8),
    cpassword: z.string().min(8),
    id: z.number(),
  }),
};
export default userSchema;
