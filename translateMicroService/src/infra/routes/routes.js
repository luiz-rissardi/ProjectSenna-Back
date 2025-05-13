import { TranslationController } from "../../controllers/translationController.js";
import { FastifyAdapterController } from "../adpterRequests/fastifyAdapterRequest.js";

export class TranslateRoutes{
     #fastify
     #controller

     constructor(fastifyInstance){
        this.#fastify = fastifyInstance;
        this.#controller = new TranslationController();
        this.#setupRoutes();
     }

     static setup(fastifyInstance){
        return new TranslateRoutes(fastifyInstance);
     }

     #setupRoutes(){
        this.#fastify.post("/translate",
            FastifyAdapterController.adapt(
                this.#controller.findTranslations.bind(this.#controller)
            )
        )
     }

}