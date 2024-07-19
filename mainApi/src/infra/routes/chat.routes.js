import { Router } from "express";
import { AdapterExpressController } from "../adpterRequests/adpaterController.js";
import { ChatController } from "../../controllers/chatController.js";

export class ChatRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = new ChatController();
    }

    getRoutes() {

        this.#router.route("/chat")
            .post(
                AdapterExpressController.adapt(this.#controller.createChat.bind(this.#controller))
            );

            // alterar o estado do chat para bloqueado e vice versa
        this.#router.route("/user/:userId/chat/:chatId/state")
            .patch(
                AdapterExpressController.adapt(this.#controller.changeStateOfChat.bind(this.#controller))
            );


        this.#router.route("/user/:userId/chat/:chatId/messages/clear")
            .patch(
                AdapterExpressController.adapt(this.#controller.clearMessages.bind(this.#controller))
            )

        this.#router.route("/chats/:chatId/participant/:userId")
            .post(
                AdapterExpressController.adapt(this.#controller.addUserInChat.bind(this.#controller))
            )


        this.#router.route("/user/:userId/chats")
            .get(
                AdapterExpressController.adapt(this.#controller.findChats.bind(this.#controller))
            )


        return this.#router
    }

}