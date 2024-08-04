import { Router } from "express";
import { ExpressAdapterController } from "../../adpterRequests/ExpressAdpaterController.js";
import { ChatControllerFactory } from "../../factories/ChatControllerFactory.js";

export class ChatRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = ChatControllerFactory.getController();
    }

    getRoutes() {

        this.#router.route("/chat")
            .post(
                ExpressAdapterController.adapt(this.#controller.createChat.bind(this.#controller))
            );

            // alterar o estado do chat para bloqueado e vice versa
        this.#router.route("/user/:userId/chat/:chatId/state")
            .patch(
                ExpressAdapterController.adapt(this.#controller.changeStateOfChat.bind(this.#controller))
            );


        this.#router.route("/user/:userId/chat/:chatId/messages/clear")
            .patch(
                ExpressAdapterController.adapt(this.#controller.clearMessages.bind(this.#controller))
            )

        this.#router.route("/chats/:chatId/participant/:userId")
            .post(
                ExpressAdapterController.adapt(this.#controller.addUserInChat.bind(this.#controller))
            )


        this.#router.route("/user/:userId/chats")
            .get(
                ExpressAdapterController.adapt(this.#controller.findChats.bind(this.#controller))
            )


        return this.#router
    }

}