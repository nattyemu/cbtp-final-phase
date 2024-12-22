import { HttpExecption } from "./root.js";

export class Unauthorized extends HttpExecption {

   constructor(message: string, statusCode: number, errorCode: number, error: any) {
      super(message, 401, errorCode , null);
   }
}