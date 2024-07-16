import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class ChatController extends BaseController{

    constructor() {
        const useCases = new Map(
            [
                ["createChat", new ClusterProcessService(2).initCluster("./src/core/useCases/chat/createChat.js")],
                ["findChats", new ClusterProcessService(2).initCluster("./src/core/useCases/chat/getChats.js")],
                ["addUser", new ClusterProcessService(2).initCluster("./src/core/useCases/chat/addUserInChat.js")],
                ["changeStateChat", new ClusterProcessService(1).initCluster("./src/core/useCases/chat/changeStateOfChat.js")],
                ["clearMessages", new ClusterProcessService(1).initCluster("./src/core/useCases/chat/clearMessages.js")],
            ]
        )
        super(useCases);
    }

    

    findChats(params, body) {
        return this.executeAction("findChats")(params,body)
    }

    addUserInChat(params, body) {
        return this.executeAction("addUser")(params,body)
    }

    clearMessages(params, body) {
        return this.executeAction("clearMessages")(params,body)
    }


    changeStateOfChat(params, body) {
        return this.executeAction("changeStateChat")(params,body)
    }

    createChat(params, body) {
        return this.executeAction("createChat")(params,body)
    }
}