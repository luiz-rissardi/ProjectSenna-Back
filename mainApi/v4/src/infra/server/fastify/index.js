import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';
import fastifyMonitor from "fastify-status"

import { SocketHandler } from '../socketHandler.js';
import { loggers } from '../../../util/logger.js';
import { ChatRoutes } from "../../routes/fastify/chat.routes.js";
import { UserRoutes } from "../../routes/fastify/user.routes.js";
import { MessageRoutes } from "../../routes/fastify/message.routes.js";
import { GroupRoutes } from '../../routes/fastify/group.routes.js';
import { ContactRoutes } from '../../routes/fastify/contact.routes.js';


dotenv.config();
const app = fastify();
SocketHandler.setup(app.server)

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
    loggers.info(`O servidor está sendo executado na porta ${port}`);
})


function setupRoutes(fastifyApp) {
    MessageRoutes.setup(fastifyApp);
    GroupRoutes.setup(fastifyApp);
    UserRoutes.setup(fastifyApp);
    ChatRoutes.setup(fastifyApp);
    ContactRoutes.setup(fastifyApp);
}