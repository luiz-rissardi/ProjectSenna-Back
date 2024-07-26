import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { MessageMysql } from "../../../infra/database/messageRepository.js";
import { loggers } from "../../../util/logger.js";


export function changeStatusMessage(repositoryContext) {
    
    /**
     * @param {string[]} messagesId 
     */
    return async function(messagesId){
        try {
            const result = await repositoryContext.pacthMany(messagesId);
            if(result.isSuccess){
                return Result.ok("");
            }else{
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }
}

const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = changeStatusMessage(repositoryContext);

process.on("message", async ({ messagesId }) => {
    const result = await useCasefn(messagesId);
    process.send({ ...result, value: result.getValue() })
})