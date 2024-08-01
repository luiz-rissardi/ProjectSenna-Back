import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Chat } from "../../core/models/chat.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { Repository } from "./base/repository.js";




export class ChatMysql extends Repository {
    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * 
     * @param {Chat} chat 
     */
    async insertOne(chat) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                INSERT INTO chat VALUES(?,?)
                `, [chat.chatType, chat.chatId]);
                
            connection.release();
            return Result.ok(chat);
        } catch (error) {
            loggers.error("não foi possivel inserir um novo chat ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}