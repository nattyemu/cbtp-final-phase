import jwt from "jsonwebtoken";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";
import { Unauthorized } from "../exceptions/unauthorized.js";
import { NotFound } from "../exceptions/notFound.js";
const userAuth = async (req, res, next) => {
  // console.log(req.body);
  const token = req.headers.authorization;
  if (!token) {
    return next(
      new UnprocessableEntity(
        "Token not found",
        404,
        ErrorCode.TOKEN_NOT_FOUND,
        null
      )
    );
  }
  try {
    const payload = await jwt.verify(token, SECRET);
    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      return next(
        new NotFound("User not found", 404, ErrorCode.USER_NOT_FOUND, null)
      );
    }
    req.user = user;
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(404).json({ message: "Invalid token", success: false });
  }
};
const isAdmin = async (req, res, next) => {
  const admin = req.user;
  if (admin && admin.role !== "ADMIN") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isDepartment = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "DEPARTMENT") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isCafe = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "CAFE") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isGard = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "GARD") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isLibrary = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "LIBRARY") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isPolice = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "POLICE") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isRegistrar = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "REGISTRAR") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isStudent = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "STUDENT") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
const isSuperProctor = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "SUPER_PROCTOR") {
    return next(
      new Unauthorized("user not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};
export {
  userAuth,
  isAdmin,
  isDepartment,
  isCafe,
  isGard,
  isLibrary,
  isPolice,
  isRegistrar,
  isStudent,
  isSuperProctor,
};
