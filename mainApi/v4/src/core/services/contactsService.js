import { UnexpectedError } from "../aplicationException/appErrors.js";
import { Result } from "../../infra/errorHandling/result.js";
import { loggers } from "../../util/logger.js";
import { Contact } from "../models/contact.js";
import { ContactMysql } from "../../infra/database/contactRepository.js";



export class ContactService {

    #contactStrategy

    constructor(contactRepository) {
        this.#contactStrategy = contactRepository;
    }

    async createContact({ userId, cotactId }) {
        try {
            const contact = new Contact(userId, cotactId);
            if (contact.isValid()){
                const result = await this.#contactStrategy.insertOne(contact);
                if(result.isSuccess){
                    return Result.ok(contact);
                }else{
                    return Result.ok(result.error())
                }
            }else{
                return Result.fail(contact.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async removeContact({ userId, cotactId }) {
        try {
            const contact = new Contact(userId, cotactId);
            if (contact.isValid()){
                const result = await this.#contactStrategy.deleteOne(contact);
                if(result.isSuccess){
                    return Result.ok();
                }else{
                    return Result.ok(result.error())
                }
            }else{
                return Result.fail(contact.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}