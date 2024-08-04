import { ForumController } from "../../controllers/forumController.js";
import { ForumService } from "../../core/services/forumService.js";
import { ForumRepository } from "../database/forumRepository.js";



export class ForumControllerFactory{

    static getController(){
        const contactStrategy = new ForumRepository(process.env.CONNECION_STRING);
        const contactService = new ForumService(contactStrategy);
        const controller = new ForumController(contactService);
        return controller;
    }
}