import { z } from "zod";
const requestSchema = {
  //register user
  addRequest: z.object({
    reason: z.string(),
    semester: z.string(),
  }),
  updateRequest: z.object({
    role: z.string(),
    studentId: z.string(),
  }),
  reReject: z.object({
    reason: z.string(),
    role: z.string(),
    reporterId: z.string(),
  }),
  searchRequest: z.object({
    firstName: z.string(),
    studentId: z.string(),
    role: z.string(),
  }),
  getAllRequest: z.object({
    role: z.string(),
  }),
  count: z.object({
    id: z.number(),
  }),
  setRejectReason: z.object({
    role: z.string(),
    reason: z.string(),
    studentId: z.string(),
  }),
  searchCleared: z.object({
    firstName: z.string().optional(),
    studentId: z.string().optional(),
  }),
};
export default requestSchema;
