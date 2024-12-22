import { z } from "zod";
const userSchema = {
  register: z
    .object({
      email: z.string().email(),
      password: z.string().min(8).max(20),
      role: z.string(),
      studentId: z.string().optional(),
      faculty: z.string().optional(),
      department: z.string().optional(),
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(["MALE", "FEMALE"]),
      academicYear: z.string().optional(),
      imageUrl: z.string().optional(),
      activeStatus: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
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
    password: z.string().min(0).max(20).optional(),
    role: z.string().optional(),
  }),
  //define mother
  registerStudent: z.object({
    email: z.string().email(),
    phone: z.string().max(14),
    password: z.string().min(8).max(20),
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
    email: z.string().email(),
  }),
  //
  getRejected: z.object({
    role: z.string(),
  }),
  newPassword: z.object({
    password: z.string().min(6),
    cpassword: z.string().min(6),
  }),
};
export default userSchema;
