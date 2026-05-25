import {errorHandler} from "./middlewares/errorHandler.middleware.js";
import developerRouter from "./developers/developer.router.js";
import applicationRouter from "./applications/application.router.js";
import logRouter from "./logs/logs.router.js";


import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();

//server.use(express.urlencoded());
server.use(express.json());
//server.use(cookieParser());


server.use("/api/developers", developerRouter);
server.use("/api/applications", applicationRouter);
server.use('/api/applications/:name/logs', logRouter);

server.use(errorHandler);


try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("Connected to database.");

    server.listen(process.env.PORT_NUMBER || 5000);
}
catch (error) {
    console.error(error);
    process.exit();
}

//export default server;