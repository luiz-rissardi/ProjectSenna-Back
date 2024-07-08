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
            )

        return this.#router
    }

}