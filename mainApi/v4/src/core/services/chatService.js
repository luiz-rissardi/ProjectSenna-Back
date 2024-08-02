import { Result } from "../../infra/errorHandling/result.js";
import { loggers } from "../../util/logger.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { Chat } from "../entity/chat.js";
import { ChatData } from "../entity/chatData.js";
import { randomUUID as v4 } from "crypto"

export class ChatService {

    #chatDataStrategy;
    #chatStrategy;

    constructor(chatDataStrategy,chatStrategy) {
        this.#chatDataStrategy = chatDataStrategy;
        this.#chatStrategy = chatStrategy;
    }

    async addUserInChat({ userId, chatId, memberType }) {
        try {
            const chatData = new ChatData(chatId, userId, null, true, memberType, null);
            if (chatData.isValid()) {
                const result = await this.#chatDataStrategy.insertOne(chatData);
                if (result.isSuccess) {
                    return Result.ok(result.getValue());
                }
                return Result.fail(result.error);
            }
            return Result.fail(chatData.getNotifications());
        } catch (error) {
            console.log(error);
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
                const result = await this.#chatDataStrategy.patchOne(chatData);
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
                const result = await this.#chatDataStrategy.patchOne(chatData);
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
                const result = await this.#chatStrategy.insertOne(chat);
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
            const result = await this.#chatDataStrategy.findMany(userId);
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

