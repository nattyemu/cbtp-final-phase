import { NextFunction, Request, Response } from "express";
import { HttpExecption } from "../exceptions/root.js";

export const errorMiddleware: any = (err:HttpExecption, req:Request, res:Response, nex:NextFunction) => {
      console.log("--------------_+_+-------------------------");
     
   return res.status(err.statusCode).json({
         message: err.message,
         errorCode: err.errorCode,
         errors: err.error      
   });
};
    