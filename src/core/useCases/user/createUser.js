
import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { UserRepository } from "../../../infra/repository/userRepository.js";
import { EncryptService } from "../../../services/encryptService.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { User } from "../../models/user.js";
import { UseCase } from "../base/useCase.js";
import { randomUUID as v4 } from "crypto"
import { EmailAlreadyExistsExeption } from "../../aplicationException/domainException.js";

export class CreateUserUseCase extends UseCase {
    constructor(repository) {
        super(repository);
    }

    async execute(userName, userDescription, email, photo, languages, password) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = new Date();
            const passwordHash = EncryptService.encrypt(password);
            const resultValidate = await this.#validateUserEmail(email);

            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId, passwordHash);

            if (user.isValid()) {
                const result = await this.repository.insertOne(user);
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

    async #validateUserEmail(userEmail) {
        const result = await this.repository.findByEmail(userEmail)
        const fails = [];
        if (result.getValue() != undefined) fails.push(EmailAlreadyExistsExeption.create());
        if (fails.length != 0) return Result.fail(...fails);
        return Result.ok();
    }
}



const databaseStrategy = new UserRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new CreateUserUseCase(repositoryContext);

process.on("message", async ({ userName, userDescription, email, photo, languages, password }) => {
    const result = await useCase.execute(userName, userDescription, email, photo, languages, password)
    process.send({...result,value:result.getValue()});
})