import { Repository } from "./base/repository.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { Contact } from "../../core/models/contact.js";
import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";

export class ContactMysql extends Repository {

    constructor(connectionString) {
        super(connectionString);
    }

    /**
     * 
     * @param {Contact} contact 
     */
    async insertOne(contact) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query("INSERT INTO contact VALUES (?,?)"
                    , [contact.contactId, contact.userId]
                )
            return Result.ok()
        } catch (error) {
            loggers.error("não foi possivel adicionar um novo contato ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param {Contact} contact 
     */
    async deleteOne(contact) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query("DELETE contact WHERE contactId = ? and userId = ?"
                    , [contact.contactId, contact.userId]
                )
            return Result.ok()
        } catch (error) {
            loggers.error("não foi possivel apagar o contato ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}