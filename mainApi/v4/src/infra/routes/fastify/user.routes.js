import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { UserControllerFactory } from "../../factories/UserControllerFactory.js";

export class UserRoutes {

    #controller;
    #fastify

    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = UserControllerFactory.getController();
        this.#setupRoutes()
    }

    static setup(fastifyInstance) {
        return new UserRoutes(fastifyInstance);
    }

    #setupRoutes() {
        this.#fastify.post("/user/login",
            FastifyAdapterController.adapt(
                this.#controller.findUser.bind(this.#controller)
            )
        );

        this.#fastify.post("/user",
            FastifyAdapterController.adapt(
                this.#controller.createUser.bind(this.#controller)
            )
        );

        this.#fastify.patch("/user/:userId",
            FastifyAdapterController.adapt(
                this.#controller.updateUser.bind(this.#controller)
            )
        );

        this.#fastify.get("/user/contact/:contactId",
            FastifyAdapterController.adapt(
                this.#controller.findContactsOfUser.bind(this.#controller)
            )
        );
    }

}