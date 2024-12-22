import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import requestController from "./requestController.js";
const requestRouter: Router = Router();

requestRouter.get(
  "/Search",
  [userAuth],
  errorHandler(requestController.getSearch)
);
requestRouter.get("/all", [userAuth], errorHandler(requestController.getAll));
requestRouter.get(
  "/single/:id",
  [userAuth],
  errorHandler(requestController.getSingle)
);
requestRouter.post(
  "/new/:id",
  [userAuth],

  errorHandler(requestController.addRequest)
);
requestRouter.put(
  "/:id",
  [userAuth],
  errorHandler(requestController.updateRequest)
);
requestRouter.get("/count", [userAuth], errorHandler(requestController.count));
requestRouter.get(
  "/sendTrueColumns",
  [userAuth],
  errorHandler(requestController.sendTrueColumns)
);
requestRouter.put(
  "/moveToClearance/:requestId",
  [userAuth],
  errorHandler(requestController.moveToClearance)
);
requestRouter.delete(
  "/:id",
  [userAuth],
  errorHandler(requestController.deleteRequest)
);
requestRouter.get(
  "/checkTrue",
  [userAuth],
  errorHandler(requestController.getAllCheackTrue)
);
requestRouter.get(
  "/searchCleared",
  [userAuth],
  errorHandler(requestController.searchCleared)
);
requestRouter.post(
  "/rejectReason/:id",
  [userAuth],
  errorHandler(requestController.setRejectReason)
);
export default requestRouter;
