import { GroupService } from "../core/services/groupService.js";


export class GroupController {

    #service

    /**
     * @param {GroupService} groupService 
     */
    constructor(groupService) {
        this.#service = groupService
    }

    updateGroup(params, body) {
        return this.#service.updateGroup({ ...params, ...body });
    }

    createGroup(params, body) {
        return this.#service.createGroup({ ...params, ...body });
    }

    findGroups(params, body) {
        return this.#service.getGroups({ ...params, ...body });
    }

}