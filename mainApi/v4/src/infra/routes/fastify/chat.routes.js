import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { ChatControllerFactory } from "../../factories/ChatControllerFactory.js";

export class ChatRoutes {

    #controller;
    #fastify

    
    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = ChatControllerFactory.getController();
        this.#setupRoutes()
    }
    
    static setup(fastifyInstance) {
        return new ChatRoutes(fastifyInstance);
    }
    
    #setupRoutes() {

        this.#fastify.post("/chat",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.createChat.bind(this.#controller)
            )
        );

        // alterar o estado do chat para bloqueado e vice versa
        this.#fastify.post("/user/:userId/chat/:chatId/state",
            { preValidation: [this.#fastify.authenticate],
                
             },
            FastifyAdapterController.adapt(
                this.#controller.changeStateOfChat.bind(this.#controller)
            )
        );


        this.#fastify.patch("/user/:userId/chat/:chatId/messages/clear",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.clearMessages.bind(this.#controller)
            )
        );

        this.#fastify.post("/chats/:chatId/participant/:userId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.addUserInChat.bind(this.#controller)
            )
        );

        this.#fastify.post("/user/:userId/chats",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.findChats.bind(this.#controller)
            )
        );
    }

}