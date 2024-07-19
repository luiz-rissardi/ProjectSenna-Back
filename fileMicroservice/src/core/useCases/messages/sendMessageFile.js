

import { Result } from "../../../infra/errorHandling/result.js";
import { MessageFile } from "../../model/messageFile.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { loggers } from "../../../util/logger.js";
import { UseCase } from "../base/useCase.js"
import { MessageMysql } from "../../../infra/database/messageFileRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";

export class SendMessageFile extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(data, fileName, messageId) {
        try {
            const message = new MessageFile(messageId, data = new ArrayBuffer(), fileName);
            const result = await this.repository.insertOne(message);
            if (result.isSuccess) {
                return Result.ok(message)
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
const useCase = new SendMessageFile(repositoryContext);

process.on("message", async ({ fileName, messageArrayBuffer, messageId }) => {
    const result = await useCase.execute(messageArrayBuffer, fileName, messageId);
    const obj = { ...result, value: result.getValue() }
    process.send(JSON.stringify(obj))
    process.send(null)
})
