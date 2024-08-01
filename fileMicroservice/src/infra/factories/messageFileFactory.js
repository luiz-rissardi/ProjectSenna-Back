import { MessageFileController } from "../../controller/messageController.js";
import { MessageFileService } from "../../core/service/messageFileService.js";
import { MessageFileMysql } from "../database/messageFileRepository.js";



export class MessageFileFactory{

    static getController(){
        const messageFileStrategy = new MessageFileMysql(process.env.CONNECION_STRING);
        const messageFileService = new MessageFileService(messageFileStrategy);
        const controller = new MessageFileController(messageFileService);
        return controller
    }
}