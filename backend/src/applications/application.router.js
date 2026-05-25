import express from "express";
//import logRouter from "../logs/logs.router.js";
import {getAllApplications, createApplication, deleteApplication} from "./application.controllers.js";
import {validateAuthToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.use(validateAuthToken);

router.get("/", getAllApplications);
router.post("/", createApplication);
router.delete("/:name", deleteApplication);

//router.use("/:name/logs", logRouter);

export default router;