import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { GroupController } from "../../../controllers/groupController.js";

export class GroupRoutes {

    #controller;
    #fastify

    
    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = new GroupController();
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