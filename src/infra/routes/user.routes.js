import { Router } from "express";
import { UserController } from "../../controllers/userController.js";

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

    getRoutes(){
        this.#router.route("/user/login").post(
            this.#controller.login.bind(this.#controller)
        )

        this.#router.route("/user").post(
            this.#controller.createUser.bind(this.#controller)
        )

        return this.#router
    }

}