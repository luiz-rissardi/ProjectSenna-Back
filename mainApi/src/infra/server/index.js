import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import bodyParser from "body-parser";
// import expressStatusMonitor from "express-status-monitor";
// import { Server } from "socket.io"

import { UserRoutes } from "../routes/user.routes.js";
import { ChatRoutes } from "../routes/chat.routes.js";
import { MessageRoutes } from "../routes/message.routes.js";


const app = express();
const server = createServer(app);
// const socketServer = new Server(server)

// configurações adicionais
dotenv.config()
// app.use(expressStatusMonitor())
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

//rotas
const { userRoutes, chatRoutes, messageRoutes } = ServerFactory()
app.use(userRoutes.getRoutes())
app.use(chatRoutes.getRoutes())
app.use(messageRoutes.getRoutes())

server.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port ${server.address().port}`);
    })

function ServerFactory() {

    const userRoutes = new UserRoutes();
    const chatRoutes = new ChatRoutes();
    const messageRoutes = new MessageRoutes();

    return {
        messageRoutes,
        userRoutes,
        chatRoutes
    }
}