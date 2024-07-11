import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { MessageRepository } from "../../../infra/repository/messageRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { UseCase } from "../base/useCase.js";



export class DeleteMessageUseCase extends UseCase{

    constructor(repositoryContext){
        super(repositoryContext);
    }

    async execute(messageId){
        try {
            const result = await this.repository.deleteOne(messageId);
            if (result.isSuccess) {
                return Result.ok("messagem apagada com sucesso")
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }
}

const databaseStrategy = new MessageRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new DeleteMessageUseCase(repositoryContext);

process.on("message", async ({ chatId }) => {
    const result = await useCase.execute(chatId);
    process.send({ ...result, value: result.getValue() })
})