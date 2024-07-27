import { ClusterProcessService } from "../util/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class ChatController extends BaseController{

    constructor() {
        const chatServiceProcess = new ClusterProcessService(3).initCluster("./src/core/services/chatService.js")
        super(chatServiceProcess);
    }

    

    findChats(params, body) {
        return this.executeActionStream("getChats")(params,body)
    }

    addUserInChat(params, body) {
        return this.executeAction("addUserInChat")(params,body)
    }

    clearMessages(params, body) {
        return this.executeAction("clearMessages")(params,body)
    }


    changeStateOfChat(params, body) {
        return this.executeAction("changeStateOfChat")(params,body)
    }

    createChat(params, body) {
        return this.executeAction("createChat")(params,body)
    }
}