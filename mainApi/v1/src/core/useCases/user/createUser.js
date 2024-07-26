
import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { UserMysql } from "../../../infra/database/userRepository.js";
import { EncryptService } from "../../../services/encryptService.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { User } from "../../models/user.js";
import { randomUUID as v4 } from "crypto"
import { EmailAlreadyExistsExeption } from "../../aplicationException/domainException.js";

export function createUser(repositoryContext) {

    async function validateUserEmail(userEmail) {
        const result = await repositoryContext.findByEmail(userEmail)
        if (result.getValue() != undefined) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }

    return async function (userName, userDescription, email, photo, languages, password) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = new Date();
            const passwordHash = EncryptService.encrypt(password);
            const resultValidate = await validateUserEmail(email);

            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId, passwordHash);

            if (user.isValid()) {
                const result = await repositoryContext.insertOne(user);
                if (result.isSuccess) {
                    //remove passwordHash antes de retornar o user
                    Reflect.deleteProperty(user, "passwordHash");
                    return Result.ok(user);
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(user.getNotifications());
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}



const databaseStrategy = new UserMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCasefn = createUser(repositoryContext);

process.on("message", async ({ userName, userDescription, email, photo, languages, password }) => {
    const result = await useCasefn(userName, userDescription, email, photo, languages, password)
    process.send({ ...result, value: result.getValue() });
})