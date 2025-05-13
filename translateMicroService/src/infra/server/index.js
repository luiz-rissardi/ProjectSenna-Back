import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import {TranslateRoutes} from "../routes/routes.js"

dotenv.config();
const app = fastify();


app.register(helmet);
app.register(cors, {
    origin: "*", // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET', 'POST', 'DELETE','PATCH','PUT','OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    exposedHeaders: ['XXX-token-auth']
});


setupRoutes(app);


const PORT = process.env.PORT || 5000;
app.listen({
    port:PORT
},(err)=>{
    if(err){
        console.log(err);
        process.exit(1);
    }
    console.log(`server is runnig at port ${PORT}`);
})

function setupRoutes(fastifyInstance){
    TranslateRoutes.setup(fastifyInstance);
}