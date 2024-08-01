import { MessageFileService } from "../core/service/messageFileService.js";


export class MessageFileController {

    #service
    /**
     * @param {MessageFileService} messageFileService 
     */
    constructor(messageFileService) {
        this.#service = messageFileService;
    }


    sendFileIntoMessage(params, body) {
        return this.#service.sendMessageFile({...params, ...body});
    }

    deleteFileOfMessage(params, body) {
        return this.#service.deleteFile({...params, ...body})
    }

    findFileOfMessage(params, body) {
        return this.#service.findFilesOfMessage({...params, ...body});
    }
}


