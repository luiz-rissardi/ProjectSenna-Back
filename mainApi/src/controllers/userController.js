import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class UserController extends BaseController{
    constructor() {
        const useCases = new Map(
            [
                ["createUser", new ClusterProcessService(1).initCluster("./src/core/useCases/user/createUser.js")],
                ["findUser", new ClusterProcessService(2).initCluster("./src/core/useCases/user/findUser.js")],
                ["updateUser", new ClusterProcessService(2).initCluster("./src/core/useCases/user/updateUser.js")],
                ["findContacts", new ClusterProcessService(1).initCluster("./src/core/useCases/user/findContactsOfUser.js")],
            ]
        )
        super(useCases);
    }

    async createUser(params, body) {
        return this.executeAction("createUser")(params,body)
    }

    async findUser(params, body) {
        return this.executeAction("findUser")(params,body)
    }

    async updateUser(params, body) {
        return this.executeAction("updateUser")(params,body)
        
    }

    async findContactsOfUser(params, body) {
        return this.executeAction("findContacts")(params,body)
    }



}