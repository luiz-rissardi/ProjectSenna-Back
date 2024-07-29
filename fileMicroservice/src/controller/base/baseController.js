import { Readable } from "stream"
import { loggers } from "../../util/logger.js";
import { UnexpectedError } from "../../core/aplicationException/appErrors.js";

export class BaseController {

    #serviceProcess;

    constructor(serviceProcess) {
        this.#serviceProcess = serviceProcess;
    }

    executeActionStream(actionName) {
        return (params, body) => {
            try {
                const chosenProcess = this.#serviceProcess.getProcess();
                const read = new Readable({
                    read() {
                    }
                });

                const handler = (chunk) => {
                    if (chunk == null) {
                        chosenProcess.removeListener("message", handler)
                    }
                    read.push(chunk);
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ actionName, data: { ...params, ...body } });
                return read

            } catch (error) {
                loggers.error(UnexpectedError.create(error.message))
                return UnexpectedError.create(error.message)
            }
        }
    }

    executeAction(actionName) {
        return (params, body) => {
            return new Promise((resolve, reject) => {
                try {
                    const chosenProcess = this.#serviceProcess.getProcess();
                    function handler(data) {
                        resolve(
                            Readable.from(JSON.stringify(data))
                        )
                        chosenProcess.removeListener("message", handler);
                    }
                    chosenProcess.on("message", handler);
                    chosenProcess.send({ actionName, data: { ...params, ...body } });

                } catch (error) {
                    loggers.error(UnexpectedError.create(error.message))
                    reject(UnexpectedError.create(error.message))
                }
            })
        }
    }
}