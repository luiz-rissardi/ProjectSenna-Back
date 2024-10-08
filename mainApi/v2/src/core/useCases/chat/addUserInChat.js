import { Result } from "../../../infra/errorHandling/result.js";
import { ChatDataMysql } from "../../../infra/database/chatDataRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { ChatData } from "../../models/chatData.js";
import { UseCase } from "../base/useCase.js";


export class AddUserInChat extends UseCase{

    constructor(repositoryContext){
        super(repositoryContext);
    }

    async execute(userId,chatId,memberType){
        try {
            const chatData = new ChatData(chatId,userId,null,true,memberType,null);
            if(chatData.isValid()){
                const result = await this.repository.insertOne(chatData);
                if(result.isSuccess){
                    return Result.ok(result.getValue());
                }
                return Result.fail(result.error);
            }
            return Result.fail(chatData.getNotifications());
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

const databaseStrategy = new ChatDataMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new AddUserInChat(repositoryContext);

process.on("message",async({ userId,chatId,memberType })=>{
    const result = await useCase.execute(userId,chatId,memberType);
    process.send({...result,value:result.getValue()})
})