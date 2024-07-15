

import { Result } from "../../../../infra/errorHandling/result.js";
import { DateFormat } from "../../../../util/dateFormated.js";
import { loggers } from "../../../../util/logger.js";
import { UnexpectedError } from "../../../aplicationException/appErrors.js";
import { Message } from "../../../models/message.js";
import { UseCase } from "../../base/useCase.js";
import { randomUUID } from "crypto"

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
                const result = await this.repository.insertMessageFile(message);
                if (result.isSuccess) {
                    return Result.ok(message)
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(message.getNotifications())
            }
        } catch (error) {
            console.log(error);
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

