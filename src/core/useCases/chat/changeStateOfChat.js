import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataRepository } from "../../../infra/repository/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { DateFormat } from "../../../util/dateFormated.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";import { ChatData } from "../../models/chatData.js";
import { UseCase } from "../base/useCase.js";


export class ChangeStateOfChat extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(chatId, userId, isActive) {
        try {
            let dateOfBlock;

            // desbloquear chat
            if (isActive == true) {
                dateOfBlock = null
            }  // bloquear chat 
            else {
                dateOfBlock = DateFormat(new Date().toISOString());
            }

            const chatData = new ChatData(chatId, userId, null, isActive, null, dateOfBlock);

            if (chatData.isValid()) {
                const result = await this.repository.patchOne(chatData);
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

const databaseStrategy = new ChatDataRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new ChangeStateOfChat(repositoryContext);

process.on("message", async ({ userId, chatId, isActive }) => {
    const result = await useCase.execute(chatId,userId,isActive);
    process.send({ ...result, value: result.getValue() })
})