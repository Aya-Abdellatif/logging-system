import express from "express";
import {getAllApplications, createApplication, deleteApplication} from "./application.controllers.js";
import {validateAuthToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.use(validateAuthToken);

router.get("/", getAllApplications);
router.post("/", createApplication);
router.delete("/:name", deleteApplication);

export default router;