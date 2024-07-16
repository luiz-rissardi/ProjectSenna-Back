import { Result } from "../../../infra/errorHandling/result.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { UseCase } from "../base/useCase.js";
import { Chat } from "../../models/chat.js";
import { randomUUID } from "crypto";
import { ChatMysql } from "../../../infra/database/chatRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";

export class CreateChat extends UseCase {
    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(chatType) {
        try {
            const chatId = randomUUID();
            const chat = new Chat(chatId, chatType);
            
            if (chat.isValid()) {
                const result = await this.repository.insertOne(chat);
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
}

const databaseStrategy = new ChatMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new CreateChat(repositoryContext);

process.on("message", async ({ chatType }) => {
    const result = await useCase.execute(chatType);
    process.send({...result,value:result.getValue()})
})