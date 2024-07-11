import { Router } from "express";
import { AdapterExpressController } from "../adpterRequests/adpaterController.js";
import { MessageController } from "../../controllers/messageController.js";

export class MessageRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = new MessageController()

    }

    getRoutes() {

        // rotas de send messages 
        this.#router.route("/chat/:chatId/message/text")
            .post(
                AdapterExpressController.adapt(this.#controller.sendMessageText.bind(this.#controller))
            )
        this.#router.route("/chat/:chatId/message/audio")
            .post(
                AdapterExpressController.adapt(this.#controller.sendMessageAudio.bind(this.#controller))
            )
        this.#router.route("/chat/:chatId/message/image")
            .post(
                AdapterExpressController.adapt(this.#controller.sendMessageImage.bind(this.#controller))
            )
        this.#router.route("/chat/:chatId/message/file")
            .post(
                AdapterExpressController.adapt(this.#controller.sendMessageFile.bind(this.#controller))
            )


        // rotas para pegar todas messages de um chat
        this.#router.route("/chat/:chatId/messages")
            .get(
                AdapterExpressController.adapt(this.#controller.getMessages.bind(this.#controller))
            )

        // mudar status da mensagem para read
        this.#router.route("/chat/messages/read")
            .patch(
                AdapterExpressController.adapt(this.#controller.readMessages.bind(this.#controller))
            )

        // atualizar mensagem 
        this.#router.route("/chat/message/:messageId")
            .patch(
                AdapterExpressController.adapt(this.#controller.updateMessage.bind(this.#controller))
            )
            // rotas para deletar uma mensagem "apagar para todos"
            .delete(
                AdapterExpressController.adapt(this.#controller.deleteMessage.bind(this.#controller))
            )




        return this.#router
    }

}