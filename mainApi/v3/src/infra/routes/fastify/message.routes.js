import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { MessageController } from "../../../controllers/messageController.js";

export class MessageRoutes {

    #controller;
    #fastify

    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = new MessageController();
        this.#setupRoutes();
    }

    static setup(fastifyInstance) {
        return new MessageRoutes(fastifyInstance);
    }

    #setupRoutes() {

        // rotas de send messages 
        this.#fastify.post("/chat/:chatId/message/send",
            FastifyAdapterController.adapt(
                this.#controller.sendMessage.bind(this.#controller)
            )
        );

        // rotas para pegar todas messages de um chat
        this.#fastify.get("/chat/:chatId/messages/:skipMessage",
            FastifyAdapterController.adapt(
                this.#controller.getMessages.bind(this.#controller)
            )
        );

        // mudar status da mensagem para read
        this.#fastify.patch("/chat/messages/read",
            FastifyAdapterController.adapt(
                this.#controller.readMessages.bind(this.#controller)
            )
        );

        this.#fastify.patch("/chat/message/:messageId",
            FastifyAdapterController.adapt(
                this.#controller.updateMessage.bind(this.#controller)
            )
        );

        this.#fastify.delete("/chat/message/:messageId",
            FastifyAdapterController.adapt(
                this.#controller.deleteMessage.bind(this.#controller)
            )
        );
    }

}