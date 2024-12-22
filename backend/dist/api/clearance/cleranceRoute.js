import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import cleranceController from "./cleranceController.js";
const cleranceRouter = Router();
// to get all clerance
cleranceRouter.get("/all", errorHandler(cleranceController.getAll));
//to get the clerance by searching by firstname or studentid
cleranceRouter.get("/search", errorHandler(cleranceController.getBySearch));
//get is specific user clerance
cleranceRouter.get(
  "/single/:userId",
  errorHandler(cleranceController.getSingle)
);
//use for gard to set the student in clerance table coz the student have use the only one time but befor transfer the data to clerance we have to check if all offices get true
cleranceRouter.post("/new", [userAuth], errorHandler(cleranceController.add));
//for incase update is need
cleranceRouter.put("/:id", [userAuth], errorHandler(cleranceController.update));
// not recommanded to use this one but is use for delete clerance
cleranceRouter.delete(
  "/:id",
  [userAuth],
  errorHandler(cleranceController.delete)
);
export default cleranceRouter;
