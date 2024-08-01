import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { GroupControllerFactory } from "../../factories/groupControllerFactory.js";

export class GroupRoutes {

    #controller;
    #fastify

    
    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = GroupControllerFactory.getController();
        this.#setupRoutes()
    }
    
    static setup(fastifyInstance) {
        return new GroupRoutes(fastifyInstance);
    }
    
    #setupRoutes() {

        this.#fastify.post("/group",
            FastifyAdapterController.adapt(
                this.#controller.createGroup.bind(this.#controller)
            )
        );

        this.#fastify.patch("/group",
            FastifyAdapterController.adapt(
                this.#controller.updateGroup.bind(this.#controller)
            )
        );
    }

}