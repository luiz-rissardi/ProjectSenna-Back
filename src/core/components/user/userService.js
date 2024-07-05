import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { Result } from "../../../infra/errorHandling/result.js";
import { randomUUID as v4 } from "crypto";
import { EncryptService } from "../../../services/encryptService.js";
import { User } from "../../models/user.js";
import { loggers } from "../../../util/logger.js";
import { InvalidCredentialsException, UnexpectedError } from "../../errorsAplication/appErrors.js";
import { EmailAlreadyExistsExeption } from "../../errorsAplication/domainErrors.js";

export class UserService {

    #repositoryContext;
    /**
     * @param {RepositoryContext} repositoryContext 
     */
    constructor(repositoryContext) {
        this.#repositoryContext = repositoryContext;
    }

    async createUser(userName, userDescription, email, photo, languages, password) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = true;
            const lastOnline = new Date();
            const passwordHash = EncryptService.encrypt(password);
            const resultValidate = await this.#validateUserEmail(email);
       
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
                Result.fail(...user.notifications.notificationsData);
            }

        } catch (error) {
            loggers.warn("um erro aconteceu", error);
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async findUser(email, password) {
        try {
            
            const passwordHash = EncryptService.encrypt(password)
            const result = await this.#repositoryContext.findOne(email, passwordHash);
            if (result.isSuccess) {
                const user = result.getValue();
                if (user) {
                    Reflect.deleteProperty(user, "passwordHash");
                    return Result.ok(user);
                }
                return Result.fail(InvalidCredentialsException.create())
            }
            return Result.fail(UnexpectedError.create("um erro aconteceu"))
        } catch (error) {
            loggers.warn("não foi possivel pegar o usuario ", error);
            return Result.fail(UnexpectedError.create("erro intrerno do servidor"))
        }
    }

    async findContactsOfUser(contactId){
        try {
            const result = await this.#repositoryContext.findMany(contactId);
            if(result.isSuccess){
                return Result.ok(result.getValue())
            }
            return Result.fail(result.error);
        } catch (error) {
            loggers.warn("não foi possivel pegar os contatos do usuario ",error.message);
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async updateUser(userName, userDescription, email, photo, languages, isActive, contactId, userId, lastOnline, password) {
        try {
            const resultValidate = await this.#validateUserEmail(email);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const passwordHash = EncryptService.encrypt(password)
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId, passwordHash)

            if (user.isValid()) {
                const result = await this.#repositoryContext.putOne(...user);
                if (result.isSuccess) {
                    //remove passwordHash antes de retornar o user
                    Reflect.deleteProperty(user, "passwordHash");
                    return Result.ok(user)
                } else {
                    return Result.fail(result.error);
                }

            } else {
                return Result.fail(user.notifications.notificationsData);
            }

        } catch (error) {
            loggers.warn("não foi possivel atualizar o usuario ",error.message);
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async #validateUserEmail(userEmail) {
        const result = await this.#repositoryContext.findByEmail(userEmail)

        const fails = [];
        if (result.getValue().length != 0) fails.push(EmailAlreadyExistsExeption.create());
        if (fails.length != 0) return Result.fail(...fails);
        return Result.ok();

    }
}