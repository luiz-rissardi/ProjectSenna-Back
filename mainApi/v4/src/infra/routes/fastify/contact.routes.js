import { FastifyAdapterController } from "../../adpterRequests/FastifyAdapterController.js";
import { ContactControllerFactory } from "../../factories/contactControllerFactory.js";

export class ContactRoutes {

    #controller;
    #fastify


    constructor(fastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#controller = ContactControllerFactory.getController();
        this.#setupRoutes()
    }

    static setup(fastifyInstance) {
        return new ContactRoutes(fastifyInstance);
    }

    #setupRoutes() {

        // adiciona um novo contato a partir de um userId de outro usuario no contactId do requisitante
        this.#fastify.post("/contact/:contactId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.createContact.bind(this.#controller)
            )
        );


        // remove um contato do contactId indicado
        this.#fastify.delete("/contact/:contactId/remove/:userId",
            { preValidation: [this.#fastify.authenticate] },
            FastifyAdapterController.adapt(
                this.#controller.deleteContact.bind(this.#controller)
            )
        )

    }

}