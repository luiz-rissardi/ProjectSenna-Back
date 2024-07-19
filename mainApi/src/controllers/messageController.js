import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class MessageController extends BaseController {
    constructor() {
        const useCases = new Map(
            [
                ["readMessages", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/changeStatusMessage.js")],
                ["sendMessage", new ClusterProcessService(3).initCluster("./src/core/useCases/messages/sendMessage.js")],
                ["getMessages", new ClusterProcessService(5).initCluster("./src/core/useCases/messages/getMessages.js")],
                ["updateMessage", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/updateMessage.js")],
                ["deleteMessage", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/deleteMessage.js")],
            ]
        )
        super(useCases);
    }



    updateMessage(params,body){
        return this.executeAction("updateMessage")(params, body);
    }

    deleteMessage(params,body){
        return this.executeAction("deleteMessage")(params, body);
    }

    readMessages(params,body){
        return this.executeAction("readMessages")(params, body);
    }

    getMessages(params,body){
        return this.executeActionStream("getMessages")(params, body);
    }

    sendMessage(params, body) {
        return this.executeAction("sendMessage")(params, body);
    }
}