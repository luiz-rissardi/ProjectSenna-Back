import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';
// import fastifyMonitor from "fastify-status"

import { loggers } from '../../util/logger.js';
import { MessageFileRoutesFastify } from '../routes/messageFastify.routes.js';


dotenv.config();
const app = fastify();


//para ver saude da aplicação
// app.register(fastifyMonitor, {
//     info: '/__info__',
//     alive: '/__alive__',
//     logLevel:"trace"
// });


// Configurações adicionais do servidor
app.register(fastifyHelmet);
app.register(fastifyCors, {
    origin: 'https://www.teste/domain', // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true
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
    loggers.info(`O microserviço está sendo executado na porta ${port}`);
})
