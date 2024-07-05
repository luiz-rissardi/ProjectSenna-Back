import { Result } from "../../../infra/errorHandling/result.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { UserRepository } from "../../../infra/repository/userRepository.js";
import { UnexpectedError } from "../../errorsAplication/appErrors.js";
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
            loggers.warn("não foi possivel pegar os contatos do usuario ",error);
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const userRepository = new UserRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(userRepository);
const useCase = new findContactsOfUser(repositoryContext);

process.on("message",async ({contactId})=>{
    const result = await useCase.execute(contactId);
    process.send({...result,value:result.getValue()}); 
})