import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class MessageController extends BaseController {
    constructor() {
        const useCases = new Map(
            [
                ["readMessages", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/changeStatusMessage.js")],
                ["sendText", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/sendersTypes/sendMessageText.js")],
                ["sendAudio", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/sendersTypes/sendMessageAudio.js")],
                ["sendFile", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/sendersTypes/sendMessageFile.js")],
                ["sendImage", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/sendersTypes/sendMessageImage.js")],
                ["getMessages", new ClusterProcessService(1).initCluster("./src/core/useCases/messages/getMessages.js")],
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
        return this.executeAction("getMessages")(params, body);
    }

    sendMessageText(params, body) {
        return this.executeAction("sendText")(params, body);
    }

    sendMessageAudio(params, body) {
        return this.executeAction("sendAudio")(params, body);
    }

    sendMessageImage(params, body) {
        return this.executeAction("sendImage")(params, body);
    }

    sendMessageFile(params, body) {
        return this.executeAction("sendFile")(params, body);
        
    }
}