import http from "http";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import { loggers } from "../../util/logger.js";
import { MessageFileRoutes } from "../routes/messageExpress.routes.js";
import expressMonitor from "express-status-monitor"


const app = express();
const server = http.createServer(app);
dotenv.config()

// configurações adicionais do servidor
app.use(expressMonitor())
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// rotas
const messageFileRoutes = messageFileFactory();
app.use(messageFileRoutes)

server.listen(8729)
    .on("listening", () => {
        loggers.info(`the microservice is running at port ${server.address().port}`)
    })


function messageFileFactory() {
    const messageFile = new MessageFileRoutes();
    return messageFile.getRoutes()
}