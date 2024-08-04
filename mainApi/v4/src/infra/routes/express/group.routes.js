import { Router } from "express";
import { ExpressAdapterController } from "../../adpterRequests/ExpressAdpaterController.js";
import { GroupControllerFactory } from "../../factories/groupControllerFactory.js";

export class GroupRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = GroupControllerFactory.getController()

    }

    getRoutes() {

        this.#router.route("/group")
            .post(
                ExpressAdapterController.adapt(this.#controller.createGroup.bind(this.#controller))
            )

        this.#router.route("/group")
            .patch(
                ExpressAdapterController.adapt(this.#controller.updateGroup.bind(this.#controller))
            )

        return this.#router
    }

}