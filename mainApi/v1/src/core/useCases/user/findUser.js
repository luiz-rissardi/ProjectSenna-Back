
import { Result } from "../../../infra/errorHandling/result.js";
import { EncryptService } from "../../../services/encryptService.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { InvalidCredentialsException } from "../../aplicationException/domainException.js";
import { UserMysql } from "../../../infra/database/userRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UserBlockingException } from "../../aplicationException/domainException.js";


export function findUser(repositoryContext) {
    return async function (email, password) {
        try {
            const passwordHash = EncryptService.encrypt(password);
            const result = await repositoryContext.findOne(email, passwordHash);
            if (result.isSuccess) {
                const user = result.getValue();
                if (user) {
                    if (user.isActive) {
                        Reflect.deleteProperty(user, "passwordHash");
                        return Result.ok(user);
                    }
                    return Result.fail(UserBlockingException.create())
                }
                return Result.fail(InvalidCredentialsException.create())
            }
            return Result.fail(result.error)
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro intrerno do servidor"))
        }
    }
}

const databaseStrategy = new UserMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn =  findUser(repositoryContext)

process.on("message", async ({ email, password }) => {
    const result = await useCasefn(email, password)
    process.send({ ...result, value: result.getValue() });
})
