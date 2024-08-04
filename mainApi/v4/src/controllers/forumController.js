import { ForumService } from "../core/services/forumService.js";

export class ForumController {

    #service;
    
    /**
     * 
     * @param {ForumService} chatService 
     */
    constructor(chatService) {
        this.#service = chatService;
    }

    findForunsByQuery(params, body) {
        return this.#service.findForunsByQuery({ ...params, ...body })
    }

    createForum(params, body) {
        return this.#service.createForum({ ...params, ...body })
    }

    changeForum(params, body) {
        return this.#service.changeForum({ ...params, ...body })
    }

    addKeyWordsForum(params, body) {
        return this.#service.addKeyWordsForum({ ...params, ...body })
    }

}