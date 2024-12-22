import { z } from "zod";

const reportSchema = {
  //register user
  addRport: z.object({
    reason: z.string(),
    studentId: z.string(),
    role: z.string(),
  }),

  get: z.object({
    role: z.string(),
  }),
  getSingle: z.object({
    role: z.string(),
    firstName: z.string().optional(),
    studentId: z.string().optional(),
  }),
  updateReport: z.object({
    newReason: z.string(),
    clearAllDebts: z.string(),
    role: z.string(),
    studentId: z.string(),
  }),
};
export default reportSchema;
