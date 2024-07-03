import { UserController } from "../../../controllers/userController.js";
import { RepositoryContext } from "../../../infra/repositoryContext/repository.js";
import { UserRepository } from "./userRepository.js";
import { UserService } from "./userService.js";




export class UserFactory {
    
    static getController(){
        const userStrategy = new UserRepository("mysql://root:13012006@localhost/tcc");
        const repositoryContext = new RepositoryContext(userStrategy);
        const service = new UserService(repositoryContext);
        return new UserController(service);
    }
}