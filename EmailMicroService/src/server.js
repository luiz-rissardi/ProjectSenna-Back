import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';
import { EmailService } from './emailService.js';

dotenv.config();
const app = fastify();
const emailService = new EmailService();


// Configurações adicionais do servidor
app.register(fastifyHelmet);
app.register(fastifyCors, {
    // origin: 'https://www.teste/domain', // Permite todos os domínios, ajuste conforme necessário
    methods: ['GET'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization',"IS-CONFIRMATED"], // Cabeçalhos permitidos
});

// Rotas
app.post("/api/email/confirmation/:userId", async (req, reply) => {
    const user = req.body;
    user.userId = req.params.userId;
    if (user != undefined) {
        const result = await emailService.sendAccountConfirmationEmail(user);
        if (result?.accepted.length >= 1) {
            reply.send({ isSuccess: true })
        } else {
            reply.send({ isSuccess: false })
        }
    }
    return reply
})

app.get("/user/:userId/confirm", async (req, reply) => {
    const userId = req.params.userId;

    const data = await fetch(`http://localhost:3000/user/${userId}/confirm`, {
        method: 'PATCH', 
        headers: {
            'XXX-CONFIRM-A-TOKEN': process.env.XXX_CONFIRM_A_TOKEN  // Cabeçalho personalizado
        }
    })

    const result = await data.json();
    if(result.isSuccess){
        reply.redirect(`http://localhost:4200/auth/sign-in`);
    }
})


// Iniciar o servidor
const port = process.env.PORT || 8729;
app.listen({
    port: port
}, (err) => {
    if (err) {
        process.exit(1);
    }
    console.log(`O microserviço de email está sendo executado na porta ${port}`);
})
