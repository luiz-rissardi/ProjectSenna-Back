import { UnexpectedError } from "../core/errorsAplication/appErrors.js";
import { ClusterProcessService } from "../services/clusterProcessService.js";
import { Readable } from "stream";

export class UserController {

    #useCases;
    /**
     * @param {ClusterProcessService} clusterProcesses 
     */
    constructor() {

        this.#useCases = new Map(
            [
                ["createUser", new ClusterProcessService(1).initCluster("./src/core/useCases/user/createUser.js")],
                ["findUser", new ClusterProcessService(1).initCluster("./src/core/useCases/user/findUser.js")],
                ["updateUser", new ClusterProcessService(2).initCluster("./src/core/useCases/user/updateUser.js")],
            ]
        )
    }

    /**
     * @returns {Promise<Readable>}
     */
    async createUser(params, body) {
        const { userName, userDescription, email, photo, languages, password } = body;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.#useCases.get("createUser").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ userName, userDescription, email, photo, languages, password });

            } catch (error) {
                reject(UnexpectedError.create(error.message))
            }
        })
    }

    /**
     * @returns {Promise<Readable>}
     */
    async findUser(params, body) {
        const { email, password } = body
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.#useCases.get("findUser").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ email, password });

            } catch (error) {
                reject(UnexpectedError.create(error.message))
            }
        })
    }

    async updateUser(params, body) {
        const { userName, isActive, userDescription, email, photo, languages, password, lastOnline } = body;
        const { userId } = params;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.#useCases.get("updateUser").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ userName, userDescription, email, photo, languages, lastOnline, isActive, password, userId });

            } catch (error) {
                reject(UnexpectedError.create(error.message))
            }
        })
    }


}