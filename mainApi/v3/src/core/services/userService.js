import { UserMysql } from "../../../../v1/src/infra/database/userRepository.js";
import { RepositoryContext } from "../../../../v1/src/infra/database/context/contextRepository.js";
import { Result } from "../../../../v1/src/infra/errorHandling/result.js";
import { UnexpectedError } from "../../../../v1/src/core/aplicationException/appErrors.js";
import { UserBlockingException } from "../../../../v1/src/core/aplicationException/domainException.js";
import { InvalidCredentialsException } from "../../../../v1/src/core/aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { EmailAlreadyExistsExeption } from "../aplicationException/domainException.js";
import { User } from "../models/user.js";
import { randomUUID as v4 } from "crypto"
import { EncryptService } from "../../util/encryptService.js";

class UserService {

    #repositoryContext
    /**
     * 
     * @param {RepositoryContext} repositoryContext 
     */
    constructor(repositoryContext) {
        this.#repositoryContext = repositoryContext;
    }

    async createUser({ userName, userDescription, email, photo, languages, password }) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = new Date();
            const passwordHash = EncryptService.encrypt(password);
            const resultValidate = await this.#EmailAlreadyExistToCreate(email);

            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId, passwordHash);

            if (user.isValid()) {
                const result = await this.#repositoryContext.insertOne(user);
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

    async findContactsOfUser({ contactId }) {
        try {
            const result = await this.#repositoryContext.findMany(contactId);
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

    async findUser({ email, password }) {
        try {
            const passwordHash = EncryptService.encrypt(password);
            const result = await this.#repositoryContext.findOne(email, passwordHash);
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

    async updateUser({userName, userDescription, email, photo, languages, isActive, lastOnline = new Date(), password, userId}) {
        try {
            const resultValidate = await this.#EmailAlreadyExistToUpdate(email, userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const passwordHash = EncryptService.encrypt(password)
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, null, passwordHash)
            if (user.isValid()) {
                const result = await this.#repositoryContext.patchOne(user);
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

    // verifica se o email já existe
    async #EmailAlreadyExistToCreate(userEmail) {
        const result = await this.#repositoryContext.findByEmail(userEmail)
        if (result.getValue() != undefined) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }

    // verifica se o email que voce quer mudar já existe em outro usuario
    async #EmailAlreadyExistToUpdate(userEmail, userId) {
        const result = await this.#repositoryContext.findByEmail(userEmail)
        if (result.getValue() != undefined && result.getValue().userId != userId) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }
}

const databaseStrategy = new UserMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const service = new UserService(repositoryContext);

process.on("message", async ({ actionName, data }) => {
    if (actionName == "findUser") {
        const result = await service.findUser(data);
        process.send({ ...result, value: result.getValue() })
        return;
    }
    if (actionName == "createUser") {
        const result = await service.createUser(data);
        process.send({ ...result, value: result.getValue() })
        return;
    }
    if (actionName == "updateUser") {
        const result = await service.updateUser(data);
        process.send({ ...result, value: result.getValue() })
        return;
    }
    if (actionName == "findContactsOfUser") {
        const result = await service.findContactsOfUser(data);
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
        return;
    }
})