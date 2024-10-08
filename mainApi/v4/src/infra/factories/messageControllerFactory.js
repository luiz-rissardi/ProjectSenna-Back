import { MessageController } from "../../controllers/messageController.js";
import { MessageService } from "../../core/services/messageService.js";
import { MessageRepository } from "../database/messageRepository.js";



export class MessageControllerFactory {

    static getController() {
        const databaseStrategy = new MessageRepository(process.env.CONNECION_STRING);
        const messageService = new MessageService(databaseStrategy);
        const controller = new MessageController(messageService);
        return controller;
    }
}