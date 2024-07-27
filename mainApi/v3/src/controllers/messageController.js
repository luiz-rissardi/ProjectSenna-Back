import { ClusterProcessService } from "../util/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class MessageController extends BaseController {
    constructor() {
        const messageServiceProcess = new ClusterProcessService(3).initCluster("./src/core/services/messageService.js")
        super(messageServiceProcess);
    }



    updateMessage(params,body){
        return this.executeAction("updateMessage")(params, body);
    }

    deleteMessage(params,body){
        return this.executeAction("deleteMessage")(params, body);
    }

    readMessages(params,body){
        return this.executeAction("changeStatusMessage")(params, body);
    }

    getMessages(params,body){
        return this.executeActionStream("getMessages")(params, body);
    }

    sendMessage(params, body) {
        return this.executeAction("sendMessageText")(params, body);
    }
}