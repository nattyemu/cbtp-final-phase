import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import reportController from "./reportController.js";

const reportRouter: Router = Router();

reportRouter.post("/new", [userAuth], errorHandler(reportController.addNew));
reportRouter.put(
  "/updatedebt",
  [userAuth],
  errorHandler(reportController.update)
);

reportRouter.get("/all", [userAuth], errorHandler(reportController.getAll));

reportRouter.get(
  "/search",
  [userAuth],
  errorHandler(reportController.getSearch)
);
//ret reason or get deatils
reportRouter.get(
  "/reason/:id",
  [userAuth],
  errorHandler(reportController.getReason)
);
reportRouter.delete("/:id", [userAuth], errorHandler(reportController.delete));

export default reportRouter;
