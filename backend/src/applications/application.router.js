import express from "express";
import logRouter from "../logs/logs.router.js";

const router = express.Router();

router.get("/applications", );
router.post("/applications", );
router.delete("/applications", );

router.use("/:name/logs", logRouter);

export default router;