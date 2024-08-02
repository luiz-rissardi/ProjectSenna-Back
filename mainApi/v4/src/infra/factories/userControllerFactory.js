import { UserController } from "../../controllers/userController.js";
import { UserService } from "../../core/services/userService.js";
import { UserRepository } from "../database/userRepository.js";



export class UserControllerFactory {

    static getController() {
        const databaseStrategy = new UserRepository(process.env.CONNECION_STRING);
        const userService = new UserService(databaseStrategy);
        const controller = new UserController(userService);
        return controller;
    }
}