import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';
import fastifyMultipart from '@fastify/multipart';

import { loggers } from '../../util/logger.js';
import { MessageFileRoutesFastify } from '../routes/messageFastify.routes.js';


dotenv.config();
const app = fastify();


// Configurações adicionais do servidor
app.register(fastifyHelmet);
app.register(fastifyMultipart);
app.register(fastifyCors, {
    origin: "*", // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    exposedHeaders: ['XXX-token-auth']
});

// Rotas
new MessageFileRoutesFastify(app)

// Iniciar o servidor
const port = process.env.PORT || 8729;
app.listen({
    port: port
}, (err) => {
    if (err) {
        loggers.error(err);
        process.exit(1);
    }
    loggers.info(`O microserviço de messageFile está sendo executado na porta ${port}`);
})
