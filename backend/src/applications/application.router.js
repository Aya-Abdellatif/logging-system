import express from "express";
import {getAllApplications, createApplication, deleteApplication} from "./application.controllers.js";
import {validateAuthToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

//router.use(validateAuthToken);

router.get("/",validateAuthToken, getAllApplications);
router.post("/", validateAuthToken,createApplication);
router.delete("/:name",validateAuthToken, deleteApplication);

export default router;