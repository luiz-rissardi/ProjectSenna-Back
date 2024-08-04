import { Router } from "express";
import { ExpressAdapterController } from "../../adpterRequests/ExpressAdpaterController.js";
import { ForumControllerFactory } from "../../factories/forumControllerFactory.js";

export class ForumRoutes {

    #controller;
    #router;

    constructor() {
        this.#router = Router()
        this.#controller = ForumControllerFactory.getController()

    }

    getRoutes() {

        this.#router.route("/forum")
            .post(
                ExpressAdapterController.adapt(this.#controller.createForum.bind(this.#controller))
            )

        this.#router.route("/forum")
            .patch(
                ExpressAdapterController.adapt(this.#controller.changeForum.bind(this.#controller))
            )

        this.#router.route("/forum/:query")
            .get(
                ExpressAdapterController.adapt(this.#controller.findForunsByQuery.bind(this.#controller))
            )

        this.#router.route("/forum/:forumId/keywords")
            .post(
                ExpressAdapterController.adapt(this.#controller.addKeyWordsForum.bind(this.#controller))
            )

        return this.#router
    }

}