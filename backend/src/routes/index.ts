import { Router } from "express";
const appRouter = Router();

//importing all app routes
import usersRouter from "../api/user/userRoute.js";
import requestRouter from "../api/request/requestRoute.js";
import cleranceRouter from "../api/clearance/cleranceRoute.js";
import reportRouter from "../api/report/reportRoute.js";



appRouter.use('/user',usersRouter);
appRouter.use('/request',requestRouter);
appRouter.use('/clerance',cleranceRouter)
appRouter.use('/result', requestRouter)
appRouter.use('/report',reportRouter)

export default appRouter;