import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { UserMysql } from "../../../infra/database/userRepository.js";
import { EncryptService } from "../../../services/encryptService.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { EmailAlreadyExistsExeption } from "../../aplicationException/domainException.js";
import { User } from "../../models/user.js";


export function updateUser(repositoryContext) {

    async function validateUserEmail(userEmail, userId) {
        const result = await repositoryContext.findByEmail(userEmail)
        if (result.getValue() != undefined && result.getValue().userId != userId) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }

    return async function (userName, userDescription, email, photo, languages, isActive, lastOnline = new Date(), password, userId) {
        try {
            const resultValidate = await validateUserEmail(email, userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const passwordHash = EncryptService.encrypt(password)
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, null, passwordHash)
            if (user.isValid()) {
                const result = await repositoryContext.patchOne(user);
                if (result.isSuccess) {
                    //remove passwordHash antes de retornar o user
                    Reflect.deleteProperty(user, "passwordHash");
                    return Result.ok(user)
                } else {
                    return Result.fail(result.error);
                }

            } else {
                return Result.fail(user.getNotifications());
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const databaseStrategy = new UserMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = updateUser(repositoryContext)

process.on("message", async ({ userName, userDescription, email, photo, languages, isActive, lastOnline, password, userId }) => {
const result = await useCasefn( userName, userDescription, email, photo, languages, isActive, lastOnline, password, userId )
    process.send({ ...result, value: result.getValue() })
})