import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { ChatNotFoundException } from "../aplicationException/domainException.js";
import { MessageMysql } from "../../infra/database/messageRepository.js"
import { loggers } from "../../util/logger.js";
import { randomUUID as v4 } from "crypto"
import { Message } from "../models/message.js";
import { Repository } from "../../infra/database/base/database.js";

class MessageService {

    #messageStrategy;
    /**
     * @param {Repository} messageStrategy 
     */
    constructor(messageStrategy) {
        this.#messageStrategy = messageStrategy;
    }

    async changeStatusMessage({ messagesId }) {
        try {
            const result = await this.#messageStrategy.patchMany(messagesId);
            if (result.isSuccess) {
                return Result.ok("");
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }

    async deleteMessage({ messageId }) {
        try {
            const result = await this.#messageStrategy.deleteOne(messageId);
            if (result.isSuccess) {
                return Result.ok("messagem apagada com sucesso")
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }

    async getMessages({ chatId }) {
        try {
            const result = await this.#messageStrategy.findMany(chatId);
            if (result.isSuccess) {
                const stream = result.getValue();
                return Result.ok(stream)
            } else {
                return Result.fail(ChatNotFoundException.create());
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }

    async sendMessageText({ messageText, userId, chatId, language, messageType = "text" }) {
        try {
            const dateSenderMessage = new Date();
            const messageId = v4();
            const status = "unread";

            const message = new Message(messageText, dateSenderMessage, userId, chatId, messageId, language, messageType, status);
            if (message.isValid()) {
                const result = await this.#messageStrategy.insertOne(message);
                if (result.isSuccess) {
                    return Result.ok(message)
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(message.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async updateMessage({ messageId, message, originLanguage }) {
        try {
            const dateSender = new Date();
            const result = await this.#messageStrategy.patchOne(messageId, dateSender, message, originLanguage);
            if (result.isSuccess) {
                return Result.ok("mensagem ediatda com sucesso")
            } else {
                return Result.fail(result.error)
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }
}

const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const service = new MessageService(databaseStrategy)

process.on("message", async ({ actionName, data }) => {
    if (actionName == "changeStatusMessage") {
        const result = await service.changeStatusMessage(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }

    if (actionName == "deleteMessage") {
        const result = await service.deleteMessage(data);
        process.send({ ...result, value: result.getValue() })
        return;
    }

    if (actionName == "sendMessageText") {
        const result = await service.sendMessageText(data);
        process.send({ ...result, value: result.getValue() })
        return;
    }

    if (actionName == "updateMessage") {
        const result = await service.updateMessage(data);
        process.send({ ...result, value: result.getValue() })
        return;
    }

    if (actionName == "getMessages") {
        const result = await service.getMessages(data);
        const stream = result.getValue();

        if (result.isSuccess == false) {
            process.send({ ...result })
            return;
        }

        const group = []
        stream.on("data", (chunk) => {
            if (group.length == 10) {
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