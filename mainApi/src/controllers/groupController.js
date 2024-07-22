import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class GroupController extends BaseController {
    constructor() {
        const useCases = new Map(
            [
                ["createGroup", new ClusterProcessService(3).initCluster("./src/core/useCases/group/createGroup.js")],
                ["updateGroup", new ClusterProcessService(3).initCluster("./src/core/useCases/group/updateGroup.js")],
            ]
        )
        super(useCases);
    }



    updateGroup(params,body){
        return this.executeAction("updateGroup")(params, body);
    }

    createGroup(params,body){
        return this.executeAction("createGroup")(params, body);
    }

    
}