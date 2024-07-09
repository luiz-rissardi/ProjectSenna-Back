
import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { UserRepository } from "../../../infra/repository/userRepository.js";
import { EncryptService } from "../../../services/encryptService.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../errorsAplication/appErrors.js";
import { User } from "../../models/user.js";
import { UseCase } from "../base/useCase.js";
import { randomUUID as v4 } from "crypto"
import { EmailAlreadyExistsExeption } from "../../errorsAplication/domainErrors.js";

export class CreateUserUseCase extends UseCase {
    constructor(repository) {
        super(repository);
    }

    async execute(userName, userDescription, email, photo, languages, password) {
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
                const result = await this.repository.insertOne(user);
                if (result.isSuccess) {
                    //remove passwordHash antes de retornar o user
                    Reflect.deleteProperty(user, "passwordHash");
                    return Result.ok(user);
                } else {
                    return Result.fail(result.error);
                }
            } else {
                Result.fail(user.getNotifications());
            }

        } catch (error) {
            loggers.warn("um erro aconteceu", error);
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



const userStrategy = new UserRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(userStrategy);
const useCase = new CreateUserUseCase(repositoryContext);

process.on("message", async ({ userName, userDescription, email, photo, languages, password }) => {
    const result = await useCase.execute(userName, userDescription, email, photo, languages, password)
    process.send({...result,value:result.getValue()});
})