import { Result } from "../../infra/errorHandling/result.js";
import { loggers } from "../../util/logger.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { Chat } from "../models/chat.js";
import { ChatData } from "../models/chatData.js";
import { RepositoryContext } from "../../infra/database/context/contextRepository.js";
import { randomUUID as v4 } from "crypto"
import { ChatDataMysql } from "../../infra/database/chatDataRepository.js";

class ChatService {

    #repositoryContext;
    /**
     * @param {RepositoryContext} repositoryContext 
     */
    constructor(repositoryContext) {
        this.#repositoryContext = repositoryContext;
    }

    async addUserInChat({ userId, chatId, memberType }) {
        try {
            const chatData = new ChatData(chatId, userId, null, true, memberType, null);
            if (chatData.isValid()) {
                const result = await this.#repositoryContext.insertOne(chatData);
                if (result.isSuccess) {
                    return Result.ok(result.getValue());
                }
                return Result.fail(result.error);
            }
            return Result.fail(chatData.getNotifications());
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async changeStateOfChat({ chatId, userId, isActive }) {
        try {
            let dateOfBlock;

            // desbloquear / sair do chat
            if (isActive == true) {
                dateOfBlock = null
            }  // bloquear / sair do chat 
            else {
                dateOfBlock = new Date();
            }

            const chatData = new ChatData(chatId, userId, null, isActive, null, dateOfBlock);

            if (chatData.isValid()) {
                const result = await this.#repositoryContext.patchOne(chatData);
                if (result.isSuccess) {
                    return Result.ok(result.getValue())
                }
                return Result.fail(result.error);
            } else {
                return Result.fail(chatData.getNotifications());
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message))
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }

    async clearMessages({ chatId, userId }) {
        try {
            const dateLastClear = new Date();
            const chatData = new ChatData(chatId, userId, dateLastClear, null, null, null);

            if (chatData.isValid()) {
                const result = await this.#repositoryContext.patchOne(chatData);
                if (result.isSuccess) {
                    return Result.ok(result.getValue())
                }
                return Result.fail(result.error);
            } else {
                return Result.fail(chatData.getNotifications());
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message))
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }

    async createChat({ chatType }) {
        try {
            const chatId = v4();
            const chat = new Chat(chatId, chatType);

            if (chat.isValid()) {
                const result = await this.#repositoryContext.insertOne(chat);
                if (result.isSuccess) {
                    return Result.ok(chat);
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(chat.getNotifications());
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async getChats({ userId }) {
        try {
            const result = await this.#repositoryContext.findMany(userId);
            if (result.isSuccess) {
                return Result.ok(result.getValue());
            }
            return Result.fail(result.error);

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}


const databaseStrategy = new ChatDataMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const service = new ChatService(repositoryContext);

process.on("message", async ({ actionName, data }) => {
    if (actionName == "addUserInChat") {
        const result = await service.addUserInChat(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }

    if (actionName == "changeStateOfChat") {
        const result = await service.changeStateOfChat(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }

    if (actionName == "clearMessages") {
        const result = await service.clearMessages(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }

    if (actionName == "createChat") {
        const result = await service.createChat(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }
    
    if (actionName == "getChats") {
        const result = await service.getChats(data);
        const stream = result.getValue();

        if (result.isSuccess == false) {
            process.send({ ...result })
            return;
        }

        const group = []
        stream.on("data", (chunk) => {
            if (group.length == 5) {
                process.send(JSON.stringify(group));
                group.length = 0
            }
            group.push(chunk);

        })
        stream.on("end", () => {
            if (group.length != 0) {
                process.send(JSON.stringify(group));
                group.length = 0
            }
            process.send(null)
        })
    }
})