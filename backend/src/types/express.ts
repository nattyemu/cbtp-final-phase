import { User } from "@prisma/client";
import express from "express";
declare module "express" {
  export interface Request {
    user?: User;
    userId?: number;
    hsInfoId: number;
    newsId: number;
    vaccineId: number;
    hsId: number;
    mId: number;
    childId: number;
    cvId: number;
    mvId: number;
    chatId: number;
    files: any;
    certificateId: number;
    appId: number;
    notificationId: number;
  }
}
