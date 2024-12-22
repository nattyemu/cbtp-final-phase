import { HttpExecption } from "./root.js";

export class NotFound extends HttpExecption {

   constructor(message: string, statusCode: number, errorCode: number, error: any) {
      super(message, 404, errorCode , null);
   }
}