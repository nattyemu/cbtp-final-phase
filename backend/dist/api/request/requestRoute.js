import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import requestController from "./requestController.js";
const requestRouter = Router();
// use this api for admin  to get all students which is aproved or not by using firstname or studentId
requestRouter.get(
  "/Search",
  [userAuth],
  errorHandler(requestController.getSearch)
);
// use for admin the user wether proved or rejected if we dont provide the aproved user the admin may get confishon why the user is not retrived
requestRouter.get(
  "/getSearchBySpecicAdmin",
  [userAuth],
  errorHandler(requestController.getSearchBySpecicAdmin)
);

// use this api for get all students not aproved by the admin for the admins
requestRouter.post("/all", [userAuth], errorHandler(requestController.getAll));

// use this api for get all students aproved by the admin for the admins
requestRouter.post(
  "/allapprove",
  [userAuth],
  errorHandler(requestController.getAllApprove)
);

//simpley to get the status of request
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
//start
// one end poin is neccessary for reject the request one was aproved
requestRouter.put(
  "/re_reject/:id",
  [userAuth],
  errorHandler(requestController.rejectTheAprovedUser)
);
//end
// count the no of offices that is goes true
requestRouter.post("/count", [userAuth], errorHandler(requestController.count));
requestRouter.post(
  "/sendTrueColumns",
  [userAuth],
  errorHandler(requestController.sendTrueColumns)
);
// for gard in order to know if the student is out from the campus only one time by the one clerance
requestRouter.put(
  "/moveToClearance/:userId",
  [userAuth],
  errorHandler(requestController.moveToClearance)
);
requestRouter.delete(
  "/:id",
  [userAuth],
  errorHandler(requestController.deleteRequest)
);
requestRouter.get(
  "/checkAllTrue",
  [userAuth],
  errorHandler(requestController.getAllCheckTrue)
);
// for gard in order to see the studert is cleared or not
requestRouter.post(
  "/searchCleared",
  [userAuth],
  errorHandler(requestController.searchCleared)
);
// check the report and set the clearance reason in clearance method tihs is for check
requestRouter.post(
  "/rejectReason/:id",
  [userAuth],
  errorHandler(requestController.setRejectReason)
);
//is used to clear the reason from ClearanceRequest model only if the user haven't any debt
requestRouter.put(
  "/clearRejectionReason/:id",
  [userAuth],
  errorHandler(requestController.clearRejectionReason)
);

//to get the rejection reason
requestRouter.post(
  "/clearance/reason/:id",
  [userAuth],
  errorHandler(requestController.getClearanceRequestReason)
);

export default requestRouter;
