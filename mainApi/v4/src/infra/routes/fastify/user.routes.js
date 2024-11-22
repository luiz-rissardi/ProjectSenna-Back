import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { UserControllerFactory } from "../../factories/UserControllerFactory.js";
import { config } from "dotenv";

config()

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

        this.#fastify.get("/user/find/:query/:skip",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.findUserByUserNameOrEmail.bind(this.#controller)
            )
        );

        this.#fastify.post("/user/:userId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.updateUser.bind(this.#controller)
            )
        );

        this.#fastify.patch("/user/:userId/confirm",
            {
                onRequest: async (request, reply) => {
                    try {
                        const token = request.headers["xxx-confirm-a-token"]; // Captura o cabeçalho de autorização
                        if (token !== process.env.XXX_CONFIRM_A_TOKEN) {
                            reply.code(401).send({ error: 'Unauthorized' });
                        }
                    } catch (error) {
                        reply.send(error);
                    }
                }
            },
            FastifyAdapterController.adapt(
                this.#controller.confirmAccount.bind(this.#controller)
            )
        );

        this.#fastify.post("/user/auth",
            FastifyAdapterController.adapt(
                this.#controller.authUser.bind(this.#controller)
            )
        );

        this.#fastify.post("/user/recover/password/:email",
            FastifyAdapterController.adapt(
                this.#controller.recoverPassword.bind(this.#controller)
            )
        );
    }

}