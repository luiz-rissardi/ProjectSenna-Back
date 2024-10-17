import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { UserBlockingException } from "../aplicationException/domainException.js";
import { InvalidCredentialsException } from "../aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { EmailAlreadyExistsExeption } from "../aplicationException/domainException.js";
import { User } from "../entity/user.js";
import { randomUUID as v4 } from "crypto"
import { EncryptService } from "../../util/encryptService.js";
import { DateFormat } from "../../util/dateFormated.js";

export class UserService {

    #userStrategy

    constructor(userStrategy) {
        this.#userStrategy = userStrategy;
    }

    async createUser({ userName, userDescription, email, arrayBuffer=new ArrayBuffer(), language, password }) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = DateFormat(new Date().toISOString());
            const resultValidate = await this.#EmailAlreadyExist(email,userId);

            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }
            const user = new User(userName, isActive, email, arrayBuffer, userDescription, userId, lastOnline, language, contactId, password);
            user.photo = Buffer.from(arrayBuffer)

            if (user.isValid()) {
                const result = await this.#userStrategy.insertOne(user);
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
            const result = await this.#userStrategy.findMany(contactId);
            if (result.isSuccess) {
                return Result.ok(result.getValue())
            }
            return Result.fail(result.error);
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async findUser({ email, password = "" }) {
        try {
            const passwordHash = EncryptService.encrypt(password);
            const result = await this.#userStrategy.findOne(email, passwordHash);
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

    async updateUser({ userName, userDescription, email, arrayBuffer=new ArrayBuffer(), languages, isActive, password, userId }) {
        const lastOnline = DateFormat(new Date().toISOString())
        try {
            const resultValidate = await this.#EmailAlreadyExist(email, userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const user = new User(userName, isActive, email, arrayBuffer, userDescription, userId, lastOnline, languages, null, password)
            user.photo = Buffer.from(arrayBuffer)

            if (user.isValid()) {
                const result = await this.#userStrategy.patchOne(user);
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
    async #EmailAlreadyExist(userEmail,userId) {
        const result = await this.#userStrategy.findByEmail(userEmail)
        if (result.getValue() != undefined && result.getValue()?.userId != userId) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }
}
