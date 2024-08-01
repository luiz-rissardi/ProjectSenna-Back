import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../../core/aplicationException/appErrors.js";
import { UserBlockingException } from "../../core/aplicationException/domainException.js";
import { InvalidCredentialsException } from "../../core/aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { EmailAlreadyExistsExeption } from "../aplicationException/domainException.js";
import { User } from "../models/user.js";
import { randomUUID as v4 } from "crypto"
import { EncryptService } from "../../util/encryptService.js";
import { UserMysql } from "../../infra/database/userRepository.js";

export class UserService {

    #userStrategy

    /**
     * 
     * @param {UserMysql} userStrategy 
     */
    constructor(userStrategy) {
        this.#userStrategy = userStrategy;
    }

    async createUser({ userName, userDescription, email, photo, languages, password }) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = new Date();
            const resultValidate = await this.#EmailAlreadyExistToCreate(email);

            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId, password);

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

    async updateUser({userName, userDescription, email, photo, languages, isActive, lastOnline = new Date(), password, userId}) {
        try {
            const resultValidate = await this.#EmailAlreadyExistToUpdate(email, userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, null, password)
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
    async #EmailAlreadyExistToCreate(userEmail) {
        const result = await this.#userStrategy.findByEmail(userEmail)
        if (result.getValue() != undefined) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }

    // verifica se o email que voce quer mudar já existe em outro usuario
    async #EmailAlreadyExistToUpdate(userEmail, userId) {
        const result = await this.#userStrategy.findByEmail(userEmail)
        if (result.getValue() != undefined && result.getValue().userId != userId) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }
}