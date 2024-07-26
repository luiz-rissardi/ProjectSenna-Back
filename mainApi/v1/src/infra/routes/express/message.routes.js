import { Router } from "express";
import { ExpressAdapterController } from "../../adpterRequests/ExpressAdpaterController.js";
import { MessageController } from "../../../controllers/messageController.js";


export class MessageRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = new MessageController()

    }

    getRoutes() {

        // rotas de send messages 
        this.#router.route("/chat/:chatId/message/send")
            .post(
                ExpressAdapterController.adapt(this.#controller.sendMessage.bind(this.#controller))
            )

        // rotas para pegar todas messages de um chat
        this.#router.route("/chat/:chatId/messages")
            .get(
                ExpressAdapterController.adapt(this.#controller.getMessages.bind(this.#controller))
            )

        // mudar status da mensagem para read
        this.#router.route("/chat/messages/read")
            .patch(
                ExpressAdapterController.adapt(this.#controller.readMessages.bind(this.#controller))
            )

        this.#router.route("/chat/message/:messageId")
            // atualizar mensagem 
            .patch(
                ExpressAdapterController.adapt(this.#controller.updateMessage.bind(this.#controller))
            )
            // rotas para deletar uma mensagem "apagar para todos"
            .delete(
                ExpressAdapterController.adapt(this.#controller.deleteMessage.bind(this.#controller))
            )




        return this.#router
    }

}