import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { UserRepository } from "../../../infra/repository/userRepository.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { UseCase } from "../base/useCase.js";



export class findContactsOfUser extends UseCase{
    constructor(repositoryContext) {
        super(repositoryContext)
    }

    async execute(contactId){
        try {
            const result = await this.repository.findMany(contactId);
            if(result.isSuccess){
                return Result.ok(result.getValue())
            }
            return Result.fail(result.error);
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const databaseStrategy = new UserRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new findContactsOfUser(repositoryContext);

process.on("message",async ({contactId})=>{
    const result = await useCase.execute(contactId);
    process.send({...result,value:result.getValue()}); 
})