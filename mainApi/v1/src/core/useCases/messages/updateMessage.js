import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { MessageMysql } from "../../../infra/database/messageRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";


export function updateMessage(repositoryContext) {

    return async function(messageId, message, originLanguage) {
        try {
            const dateSender = new Date();
            const result = await repositoryContext.patchOne(messageId, dateSender, message, originLanguage);
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
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = updateMessage(repositoryContext);

process.on("message", async ({ messageId, message, originLanguage }) => {
    const result = await useCasefn(messageId, message, originLanguage);
    process.send({ ...result, value: result.getValue() })
})