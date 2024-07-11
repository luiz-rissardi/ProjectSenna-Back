import { ClusterProcessService } from "../services/clusterProcessService.js";
import { Readable } from "stream"
import { loggers } from "../util/logger.js";
import { UnexpectedError } from "../core/aplicationException/appErrors.js";

export class ChatController {

    useCases
    constructor() {
        this.useCases = new Map(
            [
                ["createChat", new ClusterProcessService(2).initCluster("./src/core/useCases/chat/createChat.js")],
                ["findChats", new ClusterProcessService(2).initCluster("./src/core/useCases/chat/getChats.js")],
                ["addUser", new ClusterProcessService(2).initCluster("./src/core/useCases/chat/addUserInChat.js")],
                ["changeStateChat", new ClusterProcessService(1).initCluster("./src/core/useCases/chat/changeStateOfChat.js")],
                ["clearMessages", new ClusterProcessService(1).initCluster("./src/core/useCases/chat/clearMessages.js")],
            ]
        )
    }

    

    findChats(params, body) {
        const { userId } = params;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.useCases.get("findChats").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ userId });

            } catch (error) {
                loggers.error(UnexpectedError.create(error.message))
                reject(UnexpectedError.create(error.message))
            }
        })
    }

    addUserInChat(params, body) {
        const { memberType } = body;
        const { userId, chatId } = params;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.useCases.get("addUser").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ userId, chatId, memberType });

            } catch (error) {
                loggers.error(UnexpectedError.create(error.message))
                reject(UnexpectedError.create(error.message))
            }
        })
    }

    clearMessages(params, body) {
        const { userId, chatId } = params;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.useCases.get("clearMessages").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ userId, chatId });

            } catch (error) {
                loggers.error(UnexpectedError.create(error.message))
                reject(UnexpectedError.create(error.message))
            }
        })
    }


    changeStateOfChat(params, body) {
        const { isActive } = body;
        const  { chatId, userId } = params;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.useCases.get("changeStateChat").getProcess();
                function handler(data) {
                    resolve(
                        Readable.from(JSON.stringify(data))
                    )
                    chosenProcess.removeListener("message", handler);
                    data = undefined;
                }
                chosenProcess.on("message", handler);
                chosenProcess.send({ chatId, userId, isActive });

            } catch (error) {
                loggers.error(UnexpectedError.create(error.message))
                reject(UnexpectedError.create(error.message))
            }
        })
    }

    createChat(params, body) {
        const { chatType } = body;
        return new Promise((resolve, reject) => {
            try {
                const chosenProcess = this.useCases.get("createChat").getProcess();
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