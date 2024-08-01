import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { ChatController } from "../../../controllers/chatController.js";

export class ChatRoutes {

    #controller;
    #fastify

    
    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = new ChatController();
        this.#setupRoutes()
    }
    
    static setup(fastifyInstance) {
        return new ChatRoutes(fastifyInstance);
    }
    
    #setupRoutes() {

        this.#fastify.post("/chat",
            FastifyAdapterController.adapt(
                this.#controller.createChat.bind(this.#controller)
            )
        );

        // alterar o estado do chat para bloqueado e vice versa
        this.#fastify.patch("/user/:userId/chat/:chatId/state",
            FastifyAdapterController.adapt(
                this.#controller.changeStateOfChat.bind(this.#controller)
            )
        );


        this.#fastify.patch("/user/:userId/chat/:chatId/messages/clear",
            FastifyAdapterController.adapt(
                this.#controller.clearMessages.bind(this.#controller)
            )
        );

        this.#fastify.post("/chats/:chatId/participant/:userId",
            FastifyAdapterController.adapt(
                this.#controller.addUserInChat.bind(this.#controller)
            )
        );

        this.#fastify.get("/user/:userId/chats",
            FastifyAdapterController.adapt(
                this.#controller.findChats.bind(this.#controller)
            )
        );
    }

}