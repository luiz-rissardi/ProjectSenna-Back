

import { Result } from "../../../infra/errorHandling/result.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { loggers } from "../../../util/logger.js";
import { UseCase } from "../base/useCase.js"
import { MessageMysql } from "../../../infra/database/messageFileRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";

export class DeleteFileOfMessage extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(messageId) {
        try {
            const result = await this.repository.deleteOne(messageId);
            if (result.isSuccess) {
                return Result.ok("arquivo apagado com sucesso")
            } else {
                return Result.fail(result.error);
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new DeleteFileOfMessage(repositoryContext);

process.on("message", async ({ messageId }) => {
    const result = await useCase.execute(messageId);
    const obj = { ...result, value: result.getValue() }
    process.send(JSON.stringify(obj))
    process.send(null)
})
