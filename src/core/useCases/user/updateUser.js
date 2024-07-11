import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { UserRepository } from "../../../infra/repository/userRepository.js";
import { EncryptService } from "../../../services/encryptService.js";
import { DateFormat } from "../../../util/dateFormated.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { EmailAlreadyExistsExeption } from "../../aplicationException/domainException.js";
import { User } from "../../models/user.js";
import { UseCase } from "../base/useCase.js";


export class UpdateUserUseCase extends UseCase {
    constructor(repositoryContext) {
        super(repositoryContext)
    }

    async execute({userName, userDescription, email, photo, languages, isActive, lastOnline, password, userId}) {
        try {
            const resultValidate = await this.#validateUserEmail(email,userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const passwordHash = EncryptService.encrypt(password)
            const user = new User(userName, isActive, email, photo, userDescription, userId, DateFormat(lastOnline), languages, null, passwordHash)
            if (user.isValid()) {
                const result = await this.repository.patchOne(user);
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

    async #validateUserEmail(userEmail,userId) {
        const result = await this.repository.findByEmail(userEmail)
        const fails = [];
        if (result.getValue() != undefined && result.getValue().userId != userId) fails.push(EmailAlreadyExistsExeption.create());
        if (fails.length != 0) return Result.fail(...fails);
        return Result.ok();

    }
}

const databaseStrategy = new UserRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new UpdateUserUseCase(repositoryContext)

process.on("message", async ({ userName, userDescription, email, photo, languages, isActive, contactId, lastOnline, password, userId }) => {
    const result = await useCase.execute({userName, userDescription, email, photo, languages, isActive, lastOnline, password, userId})
    process.send({...result,value:result.getValue()})
})