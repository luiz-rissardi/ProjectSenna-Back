import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataRepository } from "../../../infra/repository/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/repository/context/contextRepository.js";
import { DateFormat } from "../../../util/dateFormated.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../errorsAplication/appErrors.js";
import { ChatData } from "../../models/chatData.js";
import { UseCase } from "../base/useCase.js";


export class ClearMessageUseCase extends UseCase{

    constructor(repositoryContext){
        super(repositoryContext);
    }

    async execute(chatId,userId){
        try {
            const dateLastClear = DateFormat(new Date().toISOString());
            const chatData = new ChatData(chatId,userId,dateLastClear,null,null,null);

            if(chatData.isValid()){
                const result = await this.repository.putOne(chatData);
                if(result.isSuccess){
                    return Result.ok(result.getValue())
                }
                return Result.fail(result.error);
            }else{
                return Result.fail(chatData.getNotifications());
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message))
            return Result.fail(UnexpectedError.create("erro interno no servidor"))
        }
    }
}

const chatDataRepository = new ChatDataRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(chatDataRepository);
const useCase = new ClearMessageUseCase(repositoryContext);

process.on("message",async({ userId,chatId })=>{
    const result = await useCase.execute(chatId,userId);
    process.send({...result,value:result.getValue()})
})