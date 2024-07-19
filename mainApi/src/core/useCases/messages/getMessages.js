import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { MessageMysql } from "../../../infra/database/messageRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { ChatNotFoundException } from "../../aplicationException/domainException.js";
import { UseCase } from "../base/useCase.js";

export class GetMessagesUseCase extends UseCase {
    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(chatId) {
        try {
            const result = await this.repository.findMany(chatId);
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
}

const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new GetMessagesUseCase(repositoryContext);

process.on("message", async ({ chatId }) => {
    const result = await useCase.execute(chatId);
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
})