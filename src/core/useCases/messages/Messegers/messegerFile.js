

import { Result } from "../../../../infra/errorHandling/result.js";
import { loggers } from "../../../../util/logger.js";
import { UnexpectedError } from "../../../aplicationException/appErrors.js";
import { Message } from "../../../models/message.js";
import { UseCase } from "../../base/useCase.js";

export class SendMessageFile extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(messageText, userId, chatId, language, messageType, data) {
        try {
            const dateSenderMessage = DateFormat(new Date());
            const messageId = randomUUID();
            const status = "unread";
            const message = new Message(messageText, dateSenderMessage, userId, chatId, messageId, language, messageType, status, data);
            if (message.isValid()) {
                const [result1, result2] = await Promise.all([
                    this.repository.insertOne(message),
                    this.repository.indexFileToMessage(message.messageId, message.data)
                ]);
                if (result1.isSuccess && result2.isSuccess) {
                    return Result.ok(message)
                } else {
                    // os result1. error e result2.error são a mesma coisa
                    return Result.fail(result1.error);
                }
            } else {
                return Result.fail(message.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

