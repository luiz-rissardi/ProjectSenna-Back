import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";

export class MessageFileController extends BaseController {
    constructor() {
        const messageFileServiceProcess = new ClusterProcessService(3).initCluster("./src/core/service/messageFileService.js")
        super(messageFileServiceProcess);
    }


    sendFileIntoMessage(params, body) {
        return this.executeAction("sendMessageFile")(params, body);
    }

    deleteFileOfMessage(params, body) {
        return this.executeAction("deleteFile")(params, body);
    }

    findFileOfMessage(params, body) {
        return this.executeActionStream("findFilesOfMessage")(params, body);
    }
}


