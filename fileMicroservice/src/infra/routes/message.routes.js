
import multer from "multer";
import { Router } from "express";
import { AdapterExpressController } from "../adpterRequests/adpaterExpress.js";
import { MessageFileController } from "../../controller/messageController.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
})

export class MessageFileRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = new MessageFileController()

    }

    getRoutes() {
        // rotas de enviar arquivos para as messages 
        this.#router.route("/chat/message/:messageId/file")
            .post(
                upload.single('messageArrayBuffer'),
                AdapterExpressController.adapt(this.#controller.sendFileIntoMessage.bind(this.#controller))
            )

        // rotas para pegar o arquivo correspondente a mensagem
        this.#router.route("/chat/message/:messageId")
            .get(
                AdapterExpressController.adapt(this.#controller.findFileOfMessage.bind(this.#controller))
            )

        this.#router.route("/chat/message/:messageId")
            // rotas para deletar uma mensagem "apagar para todos"
            .delete(
                AdapterExpressController.adapt(this.#controller.deleteFileOfMessage.bind(this.#controller))
            )

        return this.#router
    }

}