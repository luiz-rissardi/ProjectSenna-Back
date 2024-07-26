import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataMysql } from "../../../infra/database/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js"; import { ChatData } from "../../models/chatData.js";


export function changeStateOfChat(repositoryContext) {

    return async function(chatId, userId, isActive) {
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
                const result = await repositoryContext.patchOne(chatData);
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
}

const databaseStrategy = new ChatDataMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = changeStateOfChat(repositoryContext);

process.on("message", async ({ userId, chatId, isActive }) => {
    const result = await useCasefn(chatId, userId, isActive);
    process.send({ ...result, value: result.getValue() })
})