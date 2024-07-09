import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataRepository } from "../../../infra/repository/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../errorsAplication/appErrors.js";
import { UseCase } from "../base/useCase.js";


export class FindChatsUseCase extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(userId) {
        try {
            const result = await this.repository.findMany(userId);
            if (result.isSuccess) {
                return Result.ok(result.getValue());
            }
            return Result.fail(result.error);

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const chatDataRepository = new ChatDataRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(chatDataRepository);
const useCase = new FindChatsUseCase(repositoryContext);

process.on("message", async ({ userId }) => {
    const result = await useCase.execute(userId);
    process.send({ ...result, value: result.getValue() })
})