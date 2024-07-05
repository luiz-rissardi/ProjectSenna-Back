import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { AdapterExpressController } from "../adpterRequests/adpaterController.js";

export class UserRoutes {

    #controller;
    #router;
    /**
     * @param {UserController} controller 
     */
    constructor(controller) {
        this.#router = Router()
        this.#controller = controller;
    }

    getRoutes() {
        this.#router.route("/user/login").get(
            AdapterExpressController.adapt(this.#controller.findUser.bind(this.#controller))
        )

        this.#router.route("/user")
            .post(
                AdapterExpressController.adapt(this.#controller.createUser.bind(this.#controller))
            )
        
        this.#router.route("/user/:userId")
            .put(
                AdapterExpressController.adapt(this.#controller.updateUser.bind(this.#controller))
            )


        return this.#router
    }

}