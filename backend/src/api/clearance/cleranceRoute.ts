import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import cleranceController from "./cleranceController.js";

const cleranceRouter: Router = Router();

cleranceRouter.get("/all", errorHandler(cleranceController.getAll));
cleranceRouter.get("/search", errorHandler(cleranceController.getBySearch));
cleranceRouter.get(
  "/single/:id",

  errorHandler(cleranceController.getSingle)
);
cleranceRouter.post("/new", [userAuth], errorHandler(cleranceController.add));
cleranceRouter.put("/:id", [userAuth], errorHandler(cleranceController.update));
cleranceRouter.delete(
  "/:id",
  [userAuth],
  errorHandler(cleranceController.delete)
);

export default cleranceRouter;
