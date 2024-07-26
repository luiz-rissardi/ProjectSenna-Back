import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataMysql } from "../../../infra/database/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { ChatData } from "../../models/chatData.js";


export function addUserInChat(repositoryContext) {

    return async function (userId, chatId, memberType) {
        try {
            const chatData = new ChatData(chatId, userId, null, true, memberType, null);
            if (chatData.isValid()) {
                const result = await repositoryContext.insertOne(chatData);
                if (result.isSuccess) {
                    return Result.ok(result.getValue());
                }
                return Result.fail(result.error);
            }
            return Result.fail(chatData.getNotifications());
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const databaseStrategy = new ChatDataMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = addUserInChat(repositoryContext);

process.on("message", async ({ userId, chatId, memberType }) => {
    const result = await useCasefn(userId, chatId, memberType);
    process.send({ ...result, value: result.getValue() })
})