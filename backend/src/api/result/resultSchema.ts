import { z } from "zod";

const resultSchema ={
    //register user
  addRequest: z.object({
     result: z.string(),  
     description: z.string(),
     requestId:  z.string(),
   }),
   updateRequest: z.object({
    result: z.string(),  
    description: z.string(),
    requestId:  z.string(),
   }),
  
}
export default resultSchema;