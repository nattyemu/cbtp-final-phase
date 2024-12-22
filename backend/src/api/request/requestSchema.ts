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
  searchRequest: z.object({
    firstName: z.string(),
    studentId: z.string(),
    role: z.string(),
  }),
  getAllRequest: z.object({
    role: z.string(),
  }),
  count: z.object({
    id: z.string(),
  }),
  setRejectReason: z.object({
    role: z.string(),
    reason: z.string(),
  }),
  searchCleared: z.object({
    firstName: z.string(),
    studentId: z.string(),
  }),
};
export default requestSchema;
