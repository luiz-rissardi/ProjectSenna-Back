import { Router } from "express";
import { ExpressAdapterController } from "../../adpterRequests/ExpressAdpaterController.js";
import { ContactControllerFactory } from "../../factories/contactControllerFactory.js";

export class ContactRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = ContactControllerFactory.getController()

    }

    getRoutes() {

        this.#router.route("/contact/:contactId")
            .post(
                ExpressAdapterController.adapt(
                    this.#controller.createContact.bind(this.#controller)
                )
            )

        this.#router.route("/contact/:contactId/remove/:userId")
            .delete(
                ExpressAdapterController.adapt(
                    this.#controller.deleteContact.bind(this.#controller)
                )
            )

        return this.#router
    }

}