

import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Message } from "../../core/entity/message.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { Repository } from "./base/repository.js";


export class MessageRepository extends Repository {
    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * @param {string[]} messagesId 
     */
    async patchMany(messagesId = []) {
        try {
            const connection = await this.getConnection();
            await connection.beginTransaction();
            for (const messageId of messagesId) {
                connection
                    .query(`
                    UPDATE message
                    SET status = "read"
                    WHERE messageId = ?
                `, [messageId])
            }
            await connection.commit()
            connection.release();
            return Result.ok();
        } catch (error) {
            loggers.error("não foi possivel atualizar o status da mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * @param {Message} message 
     */
    async insertOne(message) {
        try {
            const connection = await this.getConnection();
            await connection
                .query(`
                INSERT INTO message
                VALUES(?,?,?,?,?,?,?,?)
                `, [
                    message.messageId, message.dateSender,
                    message.messageType, message.languages,
                    message.chatId, message.message,
                    message.userId, message.status
                ]);
            connection.release();
            return Result.ok(message);
        } catch (error) {
            loggers.error("não foi possivel inserir a mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }


    async patchOne(messageId, dateSender, message, originLanguage) {
        try {
            const connection = await this.getConnection();
            await connection
                .query(`
                UPDATE message
                SET dateSender = ?, message = ?, languages = ?, status='unread'
                WHERE messageId = ?
                `, [
                    dateSender, message, originLanguage,
                    messageId
                ])
            connection.release();
            return Result.ok(message);
        } catch (error) {
            loggers.error("não foi possivel atualizar a mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async deleteOne(messageId) {
        try {
            const connection = await this.getConnection();
            await connection
                .query(`
                DELETE  FROM message
                WHERE messageId = ?
                `, [messageId])
            connection.release();
            return Result.ok();
        } catch (error) {
            loggers.error("não foi possivel deletar a mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findMany(chatId, userId, skipMessage) {
        try {
            // botar um skip para pular as ja pegas
            const connection = await this.getConnection();
            const [messages] = await connection
                .query(`
                                   SELECT 
                        M.messageId AS messageId,
                        U.userName,
                        M.dateSender,
                        M.messageType,
                        M.languages,
                        M.chatId,
                        M.message,
                        M.status,
                        M.userId
                    FROM message AS M
                    INNER JOIN user AS U
                        ON U.userId = M.userId
                    INNER JOIN chatData AS CD
                        ON CD.chatId = M.chatId AND CD.userId = ?
                    WHERE M.chatId = ? AND 
                    M.dateSender < COALESCE(CD.dateOfBlocking, '9999-12-31') AND
                    M.dateSender > COALESCE(CD.lastClear, '0001-01-01')
                    ORDER BY M.dateSender DESC
                    LIMIT 50
                    OFFSET ?;
                `, [userId,chatId, Number(skipMessage)])

            connection.release();

            return Result.ok(messages);
        } catch (error) {
            loggers.error("não foi possivel pegar as mensagens do chat", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

}


