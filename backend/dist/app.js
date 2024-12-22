var _a;
import express from "express";
import cors from "cors";
import requestIp from "request-ip";
import { HOST, PORT } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);
// global middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN === "*"
        ? "*"
        : (_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(","),
    credentials: true,
}));
app.use(requestIp.mw());
app.use(express.static("public"));
// Routes
import appRouter from "./routes/index.js";
app.use("/api", appRouter);
//testing routes
app.get("/", async (req, res) => {
    res.send("app working");
});
const startServer = () => {
    app.listen(PORT || 8080, () => {
        console.log(`⚙️ Server is running http://${HOST}:${PORT}`);
    });
};
startServer();
