import { Readable } from "stream"
import { loggers } from "../../util/logger.js";
import { UnexpectedError } from "../../core/aplicationException/appErrors.js";

export class BaseController {

    #useCases;

    constructor(useCases) {
        this.#useCases = useCases;
    }

    executeAction(processName) {
        return (params, body) => {
            return new Promise((resolve, reject) => {
                try {
                    const chosenProcess = this.#useCases.get(processName).getProcess();
                    function handler(data) {
                        resolve(
                            Readable.from(JSON.stringify(data))
                        )
                        chosenProcess.removeListener("message", handler);
                        data = undefined;
                    }
                    chosenProcess.on("message", handler);
                    chosenProcess.send({ ...params, ...body });

                } catch (error) {
                    loggers.error(UnexpectedError.create(error.message))
                    reject(UnexpectedError.create(error.message))
                }
            })
        }
    }
}