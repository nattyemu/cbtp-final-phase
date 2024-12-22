
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";
import { Unauthorized } from "../exceptions/unauthorized.js";
import { any } from "zod";
import { NotFound } from "../exceptions/notFound.js";
import { User } from "@prisma/client";

const userAuth: any = async (req: Request, res: Response, next: NextFunction) => {
   // console.log(req.body);
   const token = req.headers.authorization;
   if (!token) {
      return next(new UnprocessableEntity('Token not found', 404, ErrorCode.TOKEN_NOT_FOUND, null));
   }
   try {
      const payload = await jwt.verify(token, SECRET!) as any;
      const user = await prisma.user.findFirst({
         where: {
            id: payload.id
         }
      });
      if (!user) {
         return next(new NotFound('User not found', 404, ErrorCode.USER_NOT_FOUND, null));
      }
      req.user = user;
      // console.log(req.user);
      next();
   } catch (error) {
      return next(new UnprocessableEntity('Invalid token', 404, ErrorCode.TOKEN_NOT_FOUND, null));
   }
};

const isAdmin :any = async (req:Request,res:Response,next:NextFunction)=>{
   const  admin : User | undefined = req.user;
   if(admin && admin.role !== "ADMIN"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}

const isDepartment:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "DEPARTMENT"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isCafe:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "CAFE"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isGard:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "GARD"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isLibrary:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "LIBRARY"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isPolice:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "POLICE"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isRegistrar:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "REGISTRAR"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isStudent:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "STUDENT"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}
const isSuperProctor:any = async (req:Request,res:Response,next:NextFunction)=>{
   const  user : User | undefined= req.user;
   if(user && user.role !==  "SUPER_PROCTOR"){
      return next(new Unauthorized('user not admin',401,ErrorCode.USER_NOT_FOUND,null))
   }
   next();
}

export {userAuth,isAdmin,isDepartment,isCafe,isGard,isLibrary,isPolice,isRegistrar,isStudent,isSuperProctor};