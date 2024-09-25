import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import bodyParser from "body-parser";
// import expressStatusMonitor from "express-status-monitor";
// import { Server } from "socket.io"

import { UserRoutes } from "../../routes/express/user.routes.js";
import { ChatRoutes } from "../../routes/express/chat.routes.js";
import { GroupRoutes } from "../../routes/express/group.routes.js";
import { MessageRoutes } from "../../routes/express/message.routes.js";
import { ContactRoutes } from "../../routes/express/contact.routes.js";


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
const { userRoutes, chatRoutes, messageRoutes, groupRoutes, contactRoutes, forumRoutes } = setupRoutes()
app.use(userRoutes.getRoutes())
app.use(chatRoutes.getRoutes())
app.use(messageRoutes.getRoutes())
app.use(groupRoutes.getRoutes())
app.use(contactRoutes.getRoutes())

server.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port ${server.address().port}`);
    })

function setupRoutes() {

    const userRoutes = new UserRoutes();
    const chatRoutes = new ChatRoutes();
    const messageRoutes = new MessageRoutes();
    const groupRoutes = new GroupRoutes();
    const contactRoutes = new ContactRoutes();

    return {
        messageRoutes,
        userRoutes,
        chatRoutes,
        groupRoutes,
        contactRoutes,
        forumRoutes
    }
}