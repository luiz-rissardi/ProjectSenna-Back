import { ClusterProcessService } from "../services/clusterProcessService.js";
import { Readable } from "stream"
import { loggers } from "../util/logger.js";
import { UnexpectedError } from "../core/errorsAplication/appErrors.js";

export class ChatController {
    #useCases;

    constructor() {
        this.#useCases = new Map(
            [
                ["createChat", new ClusterProcessService(3).initCluster("./src/core/useCases/chat/createChat.js")]
            ]
        )
    }

    createChat(params, body) {
        const { chatType } = body;
        return new Promise(async (resolve, reject) => {
            try {
                const chosenProcess = this.#useCases.get("createChat").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ chatType });

            } catch (error) {
                loggers.error(UnexpectedError.create(error.message))
                reject(UnexpectedError.create(error.message))
            }
        })
    }
}