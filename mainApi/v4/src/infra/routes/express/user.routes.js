import { Router } from "express";
import { ExpressAdapterController } from "../../adpterRequests/ExpressAdpaterController.js";
import { UserControllerFactory } from "../../factories/UserControllerFactory.js";

export class UserRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = UserControllerFactory.getController();
    }

    getRoutes() {
        this.#router.route("/user/login")
            .post(
                ExpressAdapterController.adapt(this.#controller.findUser.bind(this.#controller))
            )

        this.#router.route("/user")
            .post(
                ExpressAdapterController.adapt(this.#controller.createUser.bind(this.#controller))
            )

        this.#router.route("/user/:userId")
            .patch(
                ExpressAdapterController.adapt(this.#controller.updateUser.bind(this.#controller))
            )

        this.#router.route("/user/contact/:contactId")
            .get(
                ExpressAdapterController.adapt(this.#controller.findContactsOfUser.bind(this.#controller))
            )


        return this.#router
    }

}