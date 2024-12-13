import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { MessageControllerFactory } from "../../factories/MessageControllerFactory.js";

export class MessageRoutes {

    #controller;
    #fastify

    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = MessageControllerFactory.getController();
        this.#setupRoutes();
    }

    static setup(fastifyInstance) {
        return new MessageRoutes(fastifyInstance);
    }

    #setupRoutes() {

        // rotas de send messages 
        this.#fastify.post("/chat/:chatId/message/send",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.saveMessage.bind(this.#controller)
            )
        );

        // rotas para pegar todas messages de um chat (aqui pode haver uma queryString "skipMessage")
        this.#fastify.get("/user/:userId/chat/:chatId/messages/:skipMessages",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.getMessages.bind(this.#controller)
            )
        );

        // mudar status da mensagem para read
        this.#fastify.post("/chat/messages/read",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.readMessages.bind(this.#controller)
            )
        );

        this.#fastify.post("/chat/message/:messageId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.updateMessage.bind(this.#controller)
            )
        );

        this.#fastify.delete("/chat/message/:messageId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.deleteMessage.bind(this.#controller)
            )
        );
    }

}