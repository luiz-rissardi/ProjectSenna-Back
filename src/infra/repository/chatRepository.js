import { RepositoryOperationError } from "../../core/errorsAplication/appErrors.js";
import { Chat } from "../../core/models/chat.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { BaseRepository } from "./base/database.js";




export class ChatRepository extends BaseRepository{
    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * 
     * @param {Chat[]} param0 
     */
    async insertOne([chat]){
        try {
            const connection = await this.getConnection();
            await connection.query(`
                INSERT INTO chat VALUES(?,?)
                `,[chat.chatType, chat.chatId]);
            connection.release();
            return Result.ok(chat);
        } catch (error) {
            loggers.warn("não foi possivel buscar o usuario ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}