import { UnexpectedError } from "../aplicationException/appErrors.js";
import { Result } from "../../infra/errorHandling/result.js";
import { loggers } from "../../util/logger.js";
import { Contact } from "../entity/contact.js";



export class ContactService {

    #contactStrategy

    constructor(contactStrategy) {
        this.#contactStrategy = contactStrategy;
    }

    async createContact({ userId, contactId }) {
        try {
            const contact = new Contact(userId, contactId);
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

    async findContactsOfUser({ contactId }) {
        try {
            const result = await this.#contactStrategy.findManyByContactId(contactId);
            if (result.isSuccess) {
                return Result.ok(result.getValue())
            }
            return Result.fail(result.error);
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async removeContact({ userId, contactId }) {
        try {
            const contact = new Contact(userId, contactId);
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