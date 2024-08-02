import { MessageService } from "../core/services/messageService.js";

export class MessageController {

    #service;

    /**
     * @param {MessageService} messageService 
     */
    constructor(messageService) {
        this.#service = messageService;
    }

    updateMessage(params, body) {
        return this.#service.updateMessage({ ...params, ...body });
    }

    deleteMessage(params, body) {
        return this.#service.deleteMessage({ ...params, ...body });
    }

    readMessages(params, body) {
        return this.#service.changeStatusMessage({ ...params, ...body });
    }

    getMessages(params, body) {
        return this.#service.getMessages({...params, ...body });
    }

    sendMessage(params, body) {
        return this.#service.sendMessage({ ...params, ...body });
    }
}