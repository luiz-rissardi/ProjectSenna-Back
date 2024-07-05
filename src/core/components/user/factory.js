import { UserController } from "../../../controllers/userController.js";
import { ClusterProcessService } from "../../../services/clusterProcessService.js";




export class UserFactory {
    
    static getController(){
    
        return new UserController();
    }
}