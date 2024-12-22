import { z } from "zod";
const clearanceSchema = {
  //register user
  addClerance: z.object({
    requestId: z.number(),
  }),
  updateClearance: z.object({
    requestId: z.string(),
  }),
  getBySearchSchema: z.object({
    firstName: z.string(),
    studentId: z.string(),
  }),
};
export default clearanceSchema;
