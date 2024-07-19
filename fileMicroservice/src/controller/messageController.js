import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class MessageFileController extends BaseController {
    constructor() {
        const useCases = new Map(
            [
                ["sendMessageFile", new ClusterProcessService(3).initCluster("./src/core/useCases/messages/sendMessageFile.js")],
                ["deleteFileOfMessage", new ClusterProcessService(2).initCluster("./src/core/useCases/messages/deleteFileOfMessage.js")],
                ["findFileOfMessage", new ClusterProcessService(5).initCluster("./src/core/useCases/messages/findFileOfMessage.js")],
            ]
        )
        super(useCases);
    }


    sendFileIntoMessage(params, body) {
        return this.executeAction("sendMessageFile")(params, body);
    }

    deleteFileOfMessage(params, body) {
        return this.executeAction("deleteFileOfMessage")(params, body);
    }

    findFileOfMessage(params, body) {
        return this.executeAction("findFileOfMessage")(params, body);
    }
}


