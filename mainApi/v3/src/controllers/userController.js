import { ClusterProcessService } from "../util/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class UserController extends BaseController{
    constructor() {
        const userServiceProcess = new ClusterProcessService(3).initCluster("./src/core/services/userService.js")
        super(userServiceProcess);
    }

    createUser(params, body) {
        return this.executeAction("createUser")(params,body)
    }

    findUser(params, body) {
        return this.executeAction("findUser")(params,body)
    }

    updateUser(params, body) {
        return this.executeAction("updateUser")(params,body)
    }

    findContactsOfUser(params, body) {
        return this.executeActionStream("findContactsOfUser")(params,body)
    }

}