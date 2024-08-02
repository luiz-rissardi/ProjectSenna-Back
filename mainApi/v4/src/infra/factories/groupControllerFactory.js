import { GroupController } from "../../controllers/groupController.js";
import { GroupService } from "../../core/services/groupService.js";
import { GroupRepository } from "../database/groupRepository.js"

export class GroupControllerFactory {

    static getController() {
        const databaseStrategy = new GroupRepository(process.env.CONNECION_STRING);
        const groupService = new GroupService(databaseStrategy);
        const controller = new GroupController(groupService);
        return controller;
    }
}