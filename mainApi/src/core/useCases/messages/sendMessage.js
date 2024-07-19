import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { MessageMysql } from "../../../infra/database/messageRepository.js";
import { Result } from "../../../infra/errorHandling/result.js";
import { DateFormat } from "../../../util/dateFormated.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { Message } from "../../models/message.js";
import { UseCase } from "../base/useCase.js";
import { randomUUID } from "crypto";

export class SendMessage extends UseCase {

    constructor(repositoryContext,) {
        super(repositoryContext);
    }

    async execute(messageText, userId, chatId, language, messageType = "text") {
        try {
            const dateSenderMessage = DateFormat(new Date());
            const messageId = randomUUID();
            const status = "unread";

            const message = new Message(messageText, dateSenderMessage, userId, chatId, messageId, language, messageType, status);
            if (message.isValid()) {
                const result = await this.repository.insertOne(message);
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
}


const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new SendMessage(repositoryContext);

process.on("message", async ({ messageText, userId, chatId, language, messageType }) => {
    const result = await useCase.execute(messageText, userId, chatId, language, messageType);
    process.send({ ...result, value: result.getValue() })
})
