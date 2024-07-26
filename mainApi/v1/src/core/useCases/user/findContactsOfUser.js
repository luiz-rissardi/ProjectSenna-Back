import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { UserMysql } from "../../../infra/database/userRepository.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { loggers } from "../../../util/logger.js";


export function findContactsOfUser(repositoryContext) {
    return async function (contactId) {
        try {
            const result = await repositoryContext.findMany(contactId);
            if (result.isSuccess) {
                const stream = result.getValue();
                return Result.ok(stream)
            }
            return Result.fail(result.error);
        } catch (error) {
            console.log(error);
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const databaseStrategy = new UserMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = findContactsOfUser(repositoryContext);

process.on("message", async ({ contactId }) => {
    const result = await useCasefn(contactId);
    const stream = result.getValue();

    if (result.isSuccess == false) {
        process.send({ ...result })
        return;
    }

    const group = []
    stream.on("data", (chunk) => {
        if (group.length == 10) {
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