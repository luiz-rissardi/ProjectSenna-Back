import { ContactController } from "../../controllers/contactController.js";
import { ContactRepository } from "../database/contactRepository.js";
import { ContactService } from "../../core/services/contactsService.js";


export class ContactControllerFactory{

    static getController(){
        const contactStrategy = new ContactRepository(process.env.CONNECION_STRING);
        const contactService = new ContactService(contactStrategy);
        const controller = new ContactController(contactService);
        return controller;
    }
}