import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { ChatNotFoundException } from "../aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { randomUUID as v4 } from "crypto"
import { Message } from "../entity/message.js";
import { DateFormat } from "../../util/dateFormated.js";

export class MessageService {

    #messageStrategy;
    
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

    async getMessages({ chatId, skipMessage = 0}) {
        try {
            const result = await this.#messageStrategy.findMany(chatId,skipMessage);
            if (result.isSuccess) {
                return Result.ok(result.getValue())
            } else {
                return Result.fail(ChatNotFoundException.create());
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }

    async saveMessage({ messageText, userId, chatId, language, messageType = "text" }) {
        try {
            const dateSenderMessage = DateFormat(new Date().toISOString());
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
            const dateSender = DateFormat(new Date().toISOString());
            const result = await this.#messageStrategy.patchOne(messageId, dateSender, message, originLanguage);
            if (result.isSuccess) {
                return Result.ok("mensagem editada com sucesso")
            } else {
                return Result.fail(result.error)
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }
}
