import { Router } from "express";
import errorHandler from "../../config/errorHandler.js";
import usersController from "./userController.js";
import { userAuth } from "../../middlewares/auth.js";
const usersRouter = Router();
usersRouter.post("/register", errorHandler(usersController.register));
// usersRouter.post("/register", errorHandler(usersController.register));
usersRouter.post(
  "/change/password",
  [userAuth],
  errorHandler(usersController.changePassword)
);
usersRouter.get(
  "/student/count",
  errorHandler(usersController.getStudentCount)
);
usersRouter.get("/users/count", errorHandler(usersController.getAllUsersCount));

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
usersRouter.post("/me/myInfo", errorHandler(usersController.myInfo));
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

  errorHandler(usersController.confirmOtp)
);
usersRouter.post(
  "/new/password",

  errorHandler(usersController.newPassword)
);
usersRouter.put(
  "/admin/update/:id",
  [userAuth],
  errorHandler(usersController.updateAdminUser)
);
usersRouter.put(
  "/update/:id",
  [userAuth],
  errorHandler(usersController.updateUser)
);
export default usersRouter;
