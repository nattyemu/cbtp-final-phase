import jwt from "jsonwebtoken";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { SECRET } from "../config/secrets.js";
import { prisma } from "../config/prisma.js";
import { Unauthorized } from "../exceptions/unauthorized.js";
import { NotFound } from "../exceptions/notFound.js";

const userAuth = async (req, res, next) => {
  const token = req.headers.authorization; // Extract Bearer token

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
    // Verify and decode the token
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Attach decoded token data to the request object

    // Fetch the user from the database using the ID from the token payload
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return next(
        new NotFound("User not found", 404, ErrorCode.USER_NOT_FOUND, null)
      );
    }

    // Attach the user data to the request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired", success: false });
    }
    return res.status(403).json({ message: "Invalid token", success: false });
  }
};

// Role-based access control middleware
const isAdmin = async (req, res, next) => {
  const admin = req.user;
  if (admin && admin.role !== "ADMIN") {
    return next(
      new Unauthorized("User not admin", 401, ErrorCode.USER_NOT_FOUND, null)
    );
  }
  next();
};

const isDepartment = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "DEPARTMENT") {
    return next(
      new Unauthorized(
        "User not authorized",
        401,
        ErrorCode.USER_NOT_FOUND,
        null
      )
    );
  }
  next();
};

// Other role-based middlewares (e.g., isCafe, isGard, etc.) remain unchanged
const isCafe = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "CAFE") {
    return next(
      new Unauthorized(
        "User not authorized",
        401,
        ErrorCode.USER_NOT_FOUND,
        null
      )
    );
  }
  next();
};

const isGard = async (req, res, next) => {
  const user = req.user;
  if (user && user.role !== "GARD") {
    return next(
      new Unauthorized(
        "User not authorized",
        401,
        ErrorCode.USER_NOT_FOUND,
        null
      )
    );
  }
  next();
};

// ... other role-based middleware here ...

export {
  userAuth,
  isAdmin,
  isDepartment,
  isCafe,
  isGard,
  // Export other role-based middlewares
};
