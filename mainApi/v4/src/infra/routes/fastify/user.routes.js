import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { UserControllerFactory } from "../../factories/UserControllerFactory.js";
import { setHeaders } from "../../server/middlewares.js";

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
            {
                onSend: async (request, reply, payload) => {
                    try {
                        const data = JSON.parse(payload);
                        if (data.isSuccess == true) {
                            const { email, userId, userName } = data.value;
                            const token = this.#fastify.jwt.sign({ email, userId, userName }, { expiresIn: '1h' });
                            reply.header('XXX-token-auth', token);
                        }
                    } catch (error) {
                        reply.send(error);
                    }
                }
            },
            FastifyAdapterController.adapt(
                this.#controller.findUser.bind(this.#controller)
            )
        );

        this.#fastify.post("/user",
            FastifyAdapterController.adapt(
                this.#controller.createUser.bind(this.#controller)
            )
        );

        this.#fastify.post("/user/:userId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.updateUser.bind(this.#controller)
            )
        );

        this.#fastify.get("/user/contact/:contactId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.findContactsOfUser.bind(this.#controller)
            )
        );
    }

}