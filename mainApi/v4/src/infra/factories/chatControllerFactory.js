import { ChatController } from "../../controllers/chatController.js";
import { ChatService } from "../../core/services/chatService.js";
import { ChatDataMysql } from "../database/chatDataRepository.js";
import { ChatMysql } from "../database/chatRepository.js";


export class ChatControllerFactory {

    static getController() {
        const chatDataStrategy = new ChatDataMysql(process.env.CONNECION_STRING);
        const chatStrategy = new ChatMysql(process.env.CONNECION_STRING);
        const messageService = new ChatService(chatDataStrategy,chatStrategy);
        const controller = new ChatController(messageService);
        return controller;
    }
}