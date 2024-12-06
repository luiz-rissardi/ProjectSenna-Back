import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import expressStatusMonitor from "express-status-monitor";
// import { Server } from "socket.io"

import { UserRoutes } from "../../routes/express/user.routes.js";
import { ChatRoutes } from "../../routes/express/chat.routes.js";
import { GroupRoutes } from "../../routes/express/group.routes.js";
import { MessageRoutes } from "../../routes/express/message.routes.js";
import { User } from "../../../core/models/user.js";


const app = express();
const server = createServer(app);
// const socketServer = new Server(server)

// configurações adicionais
dotenv.config()
app.use(expressStatusMonitor())
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

//rotas
const { userRoutes, chatRoutes, messageRoutes, groupRoutes } = setupRoutes()
app.use(userRoutes.getRoutes())
app.use(chatRoutes.getRoutes())
app.use(messageRoutes.getRoutes())
app.use(groupRoutes.getRoutes())

server.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port ${server.address().port}`);
    })

app.get("/user", (req, res) => {
    const data = []
    for (let i = 0; i <= 1000; i++) {
        data.push(new User("luiz", true, "rissardi.luiz@gamil.com", "", "ola sou eu", "378432432hg4h23gj4gj23gj4g2j34g32g4j23g4", new Date().toISOString(), "pt-br", "374274234h32h4234hk234h23kh4", "olamundo"))
    }
    res.json(data)
})

function setupRoutes() {

    const userRoutes = new UserRoutes();
    const chatRoutes = new ChatRoutes();
    const messageRoutes = new MessageRoutes();
    const groupRoutes = new GroupRoutes();

    return {
        messageRoutes,
        userRoutes,
        chatRoutes,
        groupRoutes
    }
}