import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { MessageRepository } from "../../../infra/repository/messageRepository.js";
import { DateFormat } from "../../../util/dateFormated.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { UseCase } from "../base/useCase.js";



export class UpdateMessageUseCase extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(messageId, message, originLanguage) {
        try {
            const dateSender = DateFormat(new Date());
            const result = await this.repository.patchOne(messageId, dateSender, message, originLanguage);
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

const databaseStrategy = new MessageRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new UpdateMessageUseCase(repositoryContext);

process.on("message", async ({ messageId, message, originLanguage }) => {
    const result = await useCase.execute(messageId, message, originLanguage);
    process.send({ ...result, value: result.getValue() })
})