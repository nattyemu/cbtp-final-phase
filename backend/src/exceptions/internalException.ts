import { HttpExecption } from "./root.js";

export class InternalException extends HttpExecption {

   constructor(message: string, statusCode: number, errorCode: number, error: any) {
      super(message, 500, errorCode , null);
   }
}