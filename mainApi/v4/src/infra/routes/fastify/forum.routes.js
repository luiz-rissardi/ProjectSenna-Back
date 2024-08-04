import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { ForumControllerFactory } from "../../factories/forumControllerFactory.js";

export class ForumRoutes {

    #controller;
    #fastify

    
    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = ForumControllerFactory.getController();
        this.#setupRoutes()
    }
    
    static setup(fastifyInstance) {
        return new ForumRoutes(fastifyInstance);
    }
    
    #setupRoutes() {

        this.#fastify.post("/forum",
            FastifyAdapterController.adapt(
                this.#controller.createForum.bind(this.#controller)
            )
        );

        this.#fastify.patch("/forum",
            FastifyAdapterController.adapt(
                this.#controller.changeForum.bind(this.#controller)
            )
        );

        this.#fastify.get("/forum/:query",
            FastifyAdapterController.adapt(
                this.#controller.findForunsByQuery.bind(this.#controller)
            )
        );

        this.#fastify.post("/forum/:forumId/keywords",
            FastifyAdapterController.adapt(
                this.#controller.addKeyWordsForum.bind(this.#controller)
            )
        );
    }

}