import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { AdapterExpressController } from "../adpterRequests/adpaterController.js";

export class UserRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = new UserController();
    }

    getRoutes() {
        this.#router.route("/user/login")
            .post(
                AdapterExpressController.adapt(this.#controller.findUser.bind(this.#controller))
            )

        this.#router.route("/user")
            .post(
                AdapterExpressController.adapt(this.#controller.createUser.bind(this.#controller))
            )

        this.#router.route("/user/:userId")
            .patch(
                AdapterExpressController.adapt(this.#controller.updateUser.bind(this.#controller))
            )

        this.#router.route("/user/contact/:contactId")
            .get(
                AdapterExpressController.adapt(this.#controller.findContactsOfUser.bind(this.#controller))
            )


        return this.#router
    }

}