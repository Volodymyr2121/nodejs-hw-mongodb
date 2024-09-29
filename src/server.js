import express from "express";
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "./midlewarres/notFoundHandler.js";
import { errorHandler } from "./midlewarres/errorHandler.js";
import authRouter from "./routers/auth.js";
import cookieParser from "cookie-parser";

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(pino({
        transport: {
            target: 'pino-pretty'
        }
    }));
    app.use(cookieParser());
    app.use(express.static("uploads"));


    app.use("/auth", authRouter);
    app.use("/contacts", contactsRouter);

    app.use('*', notFoundHandler);
    app.use(errorHandler);


    app.listen(PORT, () => {
        console.log(`Server is running of PORT ${PORT}`);
    });
};



