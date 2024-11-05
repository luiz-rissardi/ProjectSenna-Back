import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = fastify();


// Configurações adicionais do servidor
app.register(fastifyHelmet);
app.register(fastifyCors, {
    origin: 'https://www.teste/domain', // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true
});

// Rotas


// Iniciar o servidor
const port = process.env.PORT || 8729;
app.listen({
    port: port
}, (err) => {
    if (err) {
        loggers.error(err);
        process.exit(1);
    }
    loggers.info(`O microserviço de email está sendo executado na porta ${port}`);
})
