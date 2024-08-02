import { ChatController } from "../../controllers/chatController.js";
import { ChatService } from "../../core/services/chatService.js";
import { ChatDataRepository } from "../database/chatDataRepository.js";
import { ChatRepository } from "../database/chatRepository.js";


export class ChatControllerFactory {

    static getController() {
        const chatDataStrategy = new ChatDataRepository(process.env.CONNECION_STRING);
        const chatStrategy = new ChatRepository(process.env.CONNECION_STRING);
        const messageService = new ChatService(chatDataStrategy,chatStrategy);
        const controller = new ChatController(messageService);
        return controller;
    }
}