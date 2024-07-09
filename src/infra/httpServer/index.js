import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import { Server } from "socket.io"

import { UserRoutes } from "../routes/user.routes.js";
import { ChatRoutes } from "../routes/chat.routes.js";


const app = express();
const server = createServer(app);
const socketServer = new Server(server)

// configurações adicionais
dotenv.config()
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

//rotas
const { userRoutes, chatRoutes } = ServerFactory()
app.use(userRoutes.getRoutes())
app.use(chatRoutes.getRoutes())

server.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port ${server.address().port}`);
    })

function ServerFactory() {

    const userRoutes = new UserRoutes();
    const chatRoutes = new ChatRoutes();

    return { userRoutes, chatRoutes }
}