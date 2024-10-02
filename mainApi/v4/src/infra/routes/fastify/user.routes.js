import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { UserControllerFactory } from "../../factories/UserControllerFactory.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

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
            { preHandler: upload.single('arrayBuffer') },
            FastifyAdapterController.adapt(
                this.#controller.createUser.bind(this.#controller)
            )
        );

        this.#fastify.patch("/user/:userId",
            { preHandler: upload.single('arrayBuffer') },
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