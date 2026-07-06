import express from "express";
import { registerDeveloperController, loginDeveloperController, logoutDeveloperController, getMe, regenerateApiKeyController } from "./developer.controllers.js";
import {validateAuthToken} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/register", registerDeveloperController);
router.post("/login", loginDeveloperController);
router.post("/logout", validateAuthToken, logoutDeveloperController);
router.get('/me', validateAuthToken, getMe);
router.post('/regenerate-key', validateAuthToken, regenerateApiKeyController);

export default router;