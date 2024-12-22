import { Router } from "express";
import { userAuth } from "../../middlewares/auth.js";
import errorHandler from "../../config/errorHandler.js";
import resultController from "./resultController.js";

const requestRouter:Router = Router();

requestRouter.get('/all',[userAuth], errorHandler(resultController.getAll));
requestRouter.get('/single/:id',[userAuth], errorHandler(resultController.getSingle));
requestRouter.post('/new',[userAuth], errorHandler(resultController.addRequest));
requestRouter.put('/:id',[userAuth], errorHandler(resultController.updateRequest));
requestRouter.delete('/:id',[userAuth], errorHandler(resultController.deleteRequest));


export default requestRouter;
