process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err);
});

import {errorHandler} from "./middlewares/errorHandler.middleware.js";
import developerRouter from "./developers/developer.router.js";
import applicationRouter from "./applications/application.router.js";
import logRouter from "./logs/logs.router.js";
import mongoose from "mongoose";
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});

server.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

server.use((req, res, next) => {
  console.log("After CORS");
  next();
});

//server.use(express.urlencoded());
server.use(express.json());
server.use(cookieParser());

server.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

server.use("/api/developers", developerRouter);
server.use("/api/applications", applicationRouter);
server.use('/api/applications/:name/logs', logRouter);

server.use(errorHandler);


try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("Connected to database.");

    server.listen(process.env.PORT || process.env.PORT_NUMBER || 5000);
}
catch (error) {
    console.error(error);
    process.exit();
}

export default server;