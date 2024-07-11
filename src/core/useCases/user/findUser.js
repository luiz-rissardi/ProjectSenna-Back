
import { Result } from "../../../infra/errorHandling/result.js";
import { EncryptService } from "../../../services/encryptService.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { InvalidCredentialsException } from "../../aplicationException/domainException.js";
import { UseCase } from "../base/useCase.js";
import { UserRepository } from "../../../infra/repository/userRepository.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UserBlockingException } from "../../aplicationException/domainException.js";


export class FindUserUseCase extends UseCase {
    constructor(repository) {
        super(repository);
    }

    async execute(email, password) {
        try {
            const passwordHash = EncryptService.encrypt(password);
            const result = await this.repository.findOne(email, passwordHash);
            if (result.isSuccess) {
                const user = result.getValue();
                if (user) {
                    if(user.isActive){
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
}

const databaseStrategy = new UserRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new FindUserUseCase(repositoryContext)

process.on("message", async ({ email, password }) => {
    const result = await useCase.execute(email,password)
    process.send({...result,value:result.getValue()});
})
