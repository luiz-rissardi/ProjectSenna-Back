import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());


server.listen(3000)
    .on("listening", () => {
        console.log(`server is running at port ${server.address().port}`);
    })
