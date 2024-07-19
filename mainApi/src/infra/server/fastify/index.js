import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';
import fastifyMonitor from "fastify-status"

import { loggers } from '../../../util/logger.js';
import { ChatRoutes } from "../../routes/fastify/chat.routes.js";
import { UserRoutes } from "../../routes/fastify/user.routes.js";
import { MessageRoutes } from "../../routes/fastify/message.routes.js";


dotenv.config();
const app = fastify();

//para ver saude da aplicação
app.register(fastifyMonitor, {
    info: '/__info__',
    logLevel: "trace"
});

// Configurações adicionais do servidor
app.register(fastifyHelmet);
app.register(fastifyCors, {
    origin: "*", // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
});

// Rotas
setupRoutes(app)

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen({
    port: port
}, (err) => {
    if (err) {
        loggers.error(err);
        process.exit(1);
    }
    loggers.info(`O microserviço está sendo executado na porta ${port}`);
})



function setupRoutes(fastifyApp) {
    UserRoutes.setup(fastifyApp);
    MessageRoutes.setup(fastifyApp);
    ChatRoutes.setup(fastifyApp);
}