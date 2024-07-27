import { ClusterProcessService } from "../util/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class GroupController extends BaseController {
    constructor() {
        const groupServiceProcess = new ClusterProcessService(3).initCluster("./src/core/services/groupService.js")
        super(groupServiceProcess);
    }



    updateGroup(params,body){
        return this.executeAction("updateGroup")(params, body);
    }

    createGroup(params,body){
        return this.executeAction("createGroup")(params, body);
    }

    
}