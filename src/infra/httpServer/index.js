import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import bodyParser from "body-parser";

import { UserRoutes } from "../routes/user.routes.js";

dotenv.config()

const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
const {userRoutes}  = ServerFactory()
app.use(userRoutes.getRoutes())

server.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port ${server.address().port}`);
    })
    
function ServerFactory(){

    const userRoutes = new UserRoutes();

    return {userRoutes}
}