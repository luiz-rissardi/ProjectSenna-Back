import { UserService } from "../core/services/userService.js"

export class UserController {
    
    #service;
    /**
     * @param {UserService} userService 
     */
    constructor(userService) {
        this.#service = userService;
    }

    createUser(params, body) {
        return this.#service.createUser({ ...params, ...body })
    }

    findUser(params, body) {
        return this.#service.findUser({ ...params, ...body })
    }

    updateUser(params, body) {
        return this.#service.updateUser({ ...params, ...body })
    }

    findContactsOfUser(params, body) {
        return this.#service.findContactsOfUser({ ...params })
    }

}