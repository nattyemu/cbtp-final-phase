import { Router } from "express";
import errorHandler from "../../config/errorHandler.js";
import usersController from "./userController.js";
import { userAuth } from "../../middlewares/auth.js";

const usersRouter: Router = Router();
usersRouter.post("/register", errorHandler(usersController.register));
usersRouter.post(
  "/register",

  errorHandler(usersController.register)
);
usersRouter.post(
  "/change/password",
  [userAuth],
  errorHandler(usersController.changePassword)
);

usersRouter.put("/updateEmail/:id", errorHandler(usersController.updatedEmail));


usersRouter.delete("/:id", [userAuth], errorHandler(usersController.delete));
//get all the users and get a specific user
//get all users but not students
usersRouter.get("/admin", errorHandler(usersController.getAdmin));
//get all users including students
usersRouter.get("/users", errorHandler(usersController.getUsers));
// use studentId and firstName
usersRouter.get("/searchusers", errorHandler(usersController.searchUsers));
usersRouter.get("/student", errorHandler(usersController.getStudent));
usersRouter.get("/:id", errorHandler(usersController.getSingle));
usersRouter.get("/me/myInfo", errorHandler(usersController.myInfo));
//noto working
usersRouter.get(
  "/searchAdmin",
  [userAuth],
  errorHandler(usersController.getSearchAdmin)
);
// usersRouter.get(
//   "/getRejected",
//   [userAuth],
//   errorHandler(usersController.getRejected)
// );
usersRouter.post("/login", errorHandler(usersController.loginUser));

usersRouter.post(
  "/forget/password",
  errorHandler(usersController.forgotPassword)
);
usersRouter.post(
  "/confirm/otp",
  [userAuth],
  errorHandler(usersController.confirmOtp)
);

usersRouter.post(
  "/new/password",
  [userAuth],
  errorHandler(usersController.newPassword)
);

export default usersRouter;
