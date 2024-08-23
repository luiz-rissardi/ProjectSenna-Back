import { ForumController } from "../../controllers/forumController.js";
import { ForumService } from "../../core/services/forumService.js";
import { ForumRepository } from "../database/forumRepository.js";
import { KeyWordsRepository } from "../database/keyWordsRepository.js";



export class ForumControllerFactory{

    static getController(){
        const forumStrategy = new ForumRepository(process.env.CONNECION_STRING);
        const keyWordStrategy = new KeyWordsRepository(process.env.CONNECION_STRING)
        const forumService = new ForumService(forumStrategy,keyWordStrategy);
        const controller = new ForumController(forumService);
        return controller;
    }
}