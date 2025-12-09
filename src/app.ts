import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import { envVars } from "./app/config/env";
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { router } from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});
app.use("/api/v1", router);


app.use(globalErrorHandler);

app.use(notFound);

export default app;