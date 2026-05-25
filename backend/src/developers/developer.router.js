import { registerDeveloperController, loginDeveloperController, logoutDeveloperController } from "./developer.controllers";
import express from "express";
const router = express.Router();

router.post("/register", registerDeveloperController);
router.post("/login", loginDeveloperController);
router.post("/logout", logoutDeveloperController);

export default router;