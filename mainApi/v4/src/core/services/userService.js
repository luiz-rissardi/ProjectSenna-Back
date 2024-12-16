import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { UserBlockingException, UserNotFoundException } from "../aplicationException/domainException.js";
import { InvalidCredentialsException } from "../aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { EmailAlreadyExistsExeption } from "../aplicationException/domainException.js";
import { User } from "../entity/user.js";
import { randomUUID as v4 } from "crypto"
import { EncryptService } from "../../util/encryptService.js";
import { DateFormat } from "../../util/dateFormated.js";
import jwt from "jsonwebtoken"

export class UserService {

    #userStrategy

    constructor(userStrategy) {
        this.#userStrategy = userStrategy;
    }

    async createUser({ userName, userDescription, email, arrayBuffer = new ArrayBuffer(), language, password }) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = DateFormat(new Date().toISOString());
            const resultValidate = await this.#EmailAlreadyExist(email, userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }
            const user = new User(userName, isActive, email, arrayBuffer, userDescription, userId, lastOnline, language, contactId, password, true);
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

    async updateUser({ userName, userDescription, email, arrayBuffer = new ArrayBuffer(), language, isActive, password, userId, readMessages }) {
        const lastOnline = DateFormat(new Date().toISOString())
        try {
            const resultValidate = await this.#EmailAlreadyExist(email, userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const user = new User(userName, isActive, email, arrayBuffer, userDescription, userId, lastOnline, language, null, password, readMessages)
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

    // verifica se determinado jwt é valido, e retona o usuário correspondete a ele
    async authUser({ token }) {
        try {
            return new Promise((resolve, reject) => {
                jwt.verify(token, process.env.HASHED_JWT, async (err, decoded) => {
                    if (err) {
                        resolve(Result.fail("token inválido"))
                    } else {
                        const result = await this.#userStrategy.findByEmail(decoded.email);
                        if (result.isSuccess) {
                            resolve(Result.ok(result.getValue()))
                        }
                        else {
                            reject(Result.fail(result.error))
                        }
                    }
                })
            })
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async confirmAccount({ userId }) {
        try {
            const result = await this.#userStrategy.changeOnlyStateOfUser(userId, true);
            if (result.isSuccess) {
                return Result.ok(result.getValue());
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async recoverPassword({ email, password }) {
        try {
            const resultUser = await this.#userStrategy.findByEmail(email);
            if (resultUser.isSuccess) {
                const user = resultUser.getValue();
                if (user != undefined) {
                    const newPasswordHash = EncryptService.encrypt(password);
                    user.passwordHash = newPasswordHash;
                    const resultFinaly = await this.#userStrategy.patchOne(user);
                    if (resultFinaly.isSuccess) {
                        return Result.ok();
                    } else {
                        return Result.fail(resultFinaly.error);
                    }
                } else {
                    return Result.fail(UserNotFoundException.create());
                }
            } else {
                return Result.fail(resultUser.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async findUserByUserNameOrEmail({ query, skip = 0 }) {
        try {
            const result = await this.#userStrategy.findMany(query, skip);
            if (result.isSuccess) {
                return Result.ok(result.getValue());
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    // verifica se o email já existe
    async #EmailAlreadyExist(userEmail, userId) {
        const result = await this.#userStrategy.findByEmail(userEmail)
        if (result.getValue() != undefined && result.getValue()?.userId != userId) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }
}
