import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';
import multipart from "@fastify/multipart"
import jwt from "fastify-jwt";

// import { initalizeTracing } from '../tracing.js';

// await initalizeTracing();

import { SocketHandler } from '../socketHandler.js';
import { loggers } from '../../../util/logger.js';
import { ChatRoutes } from "../../routes/fastify/chat.routes.js";
import { UserRoutes } from "../../routes/fastify/user.routes.js";
import { MessageRoutes } from "../../routes/fastify/message.routes.js";
import { GroupRoutes } from '../../routes/fastify/group.routes.js';
import { ContactRoutes } from '../../routes/fastify/contact.routes.js';

dotenv.config();
const app = fastify({
    bodyLimit: 10 * 1024 * 1024
});


SocketHandler.setup(app.server)

// Configurações adicionais do servidor
app.register(fastifyHelmet);
app.register(multipart);
app.register(fastifyCors, {
    origin: "*", // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    exposedHeaders: ['XXX-token-auth']
});

// config to include the auth
app.register(jwt, {
    secret: process.env.HASHED_JWT
})

// middlewares of auth
app.decorate("authenticate", async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (error) {
        reply.send(error);
    }
})


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

export default app


// app.post('/user2', { preValidation: [app.authenticate] }, async (req, reply) => {
//     // Use req.file() para pegar o arquivo


//     // Para acessar os outros campos do formulário


//     console.log('Received body:', req.body);

//     // Aqui você pode fazer o que precisa com os dados

//     reply.send({ status: 'success' });
// });