import { ContactService } from "../core/services/contactsService.js";


export class ContactController {

    #service;

    /**
     * @param {ContactService} contactService 
     */
    constructor(contactService) {
        this.#service = contactService;
    }

    createContact(params, body) {
        return this.#service.createContact({ ...params, ...body })
    }

    deleteContact(params, body) {
        return this.#service.removeContact({ ...params, ...body })
    }

    findContactsOfUser(params, body) {
        return this.#service.findContactsOfUser({ ...params })
    }
}