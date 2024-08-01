import { ChatService } from "../core/services/chatService.js"

export class ChatController {

    #service;
    
    /**
     * 
     * @param {ChatService} chatService 
     */
    constructor(chatService) {
        this.#service = chatService;
    }

    findChats(params, body) {
        return this.#service.getChats({ ...params })
    }

    addUserInChat(params, body) {
        return this.#service.addUserInChat({ ...params, ...body })
    }

    clearMessages(params, body) {
        return this.#service.clearMessages({ ...params })
    }

    changeStateOfChat(params, body) {
        return this.#service.changeStateOfChat({ ...params, ...body })
    }

    createChat(params, body) {
        return this.#service.createChat({ ...params, ...body })
    }
}