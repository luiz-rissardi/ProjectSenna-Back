import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { MessageRepository } from "../../../infra/repository/messageRepository.js";
import { loggers } from "../../../util/logger.js";
import { UseCase } from "../base/useCase.js";


export class ChangeStatusMessageUseCase extends UseCase{
    
    constructor(repositoryContext){
        super(repositoryContext);
    }

    /**
     * 
     * @param {string[]} messagesId 
     */
    async execute(messagesId){
        try {
            const result = await this.repository.pacthMany([messagesId]);
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

const databaseStrategy = new MessageRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new ChangeStatusMessageUseCase(repositoryContext);

process.on("message", async ({ messagesId }) => {
    const result = await useCase.execute(messagesId);
    process.send({ ...result, value: result.getValue() })
})