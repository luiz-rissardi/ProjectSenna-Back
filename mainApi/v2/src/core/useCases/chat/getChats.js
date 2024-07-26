import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataMysql } from "../../../infra/database/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { UseCase } from "../base/useCase.js";


export class GetChatsUseCase extends UseCase {

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

const databaseStrategy = new ChatDataMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new GetChatsUseCase(repositoryContext);

process.on("message", async ({ userId }) => {
    const result = await useCase.execute(userId);
    const stream = result.getValue();

    if (result.isSuccess == false) {
        process.send({ ...result })
        return;
    }

    const group = []
    stream.on("data", (chunk) => {
        if (group.length == 5) {
            process.send(JSON.stringify(group));
            group.length = 0
        }
        group.push(chunk);

    })
    stream.on("end", () => {
        if (group.length != 0) {
            process.send(JSON.stringify(group));
            group.length = 0
        }
        process.send(null)
    })
})