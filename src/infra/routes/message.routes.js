import { Router } from "express";
import { AdapterExpressController } from "../adpterRequests/adpaterController.js";

export class ChatRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()

    }

    getRoutes() {

        // rotas de send messages 
        this.#router.route("/chat/:chatId/message/text")
        this.#router.route("/chat/:chatId/message/audio")
        this.#router.route("/chat/:chatId/message/image")
        this.#router.route("/chat/:chatId/message/file")


        // rotas de get messages
        this.#router.route("/chat/:chatId/message")
        this.#router.route("/chat/:chatId/message/:messageId"


        )


        return this.#router
    }

}