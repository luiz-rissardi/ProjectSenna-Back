

import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Message } from "../../core/models/message.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { BaseRepository } from "./base/database.js";


export class MessageMysql extends BaseRepository {
    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * @param {string[]} messagesId 
     */
    async pacthMany([messagesId = []]) {
        try {
            const connection = await this.getConnection();
            await connection.beginTransaction();
            for (const messageId of messagesId) {
                connection
                    .promise()
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
     * @param {Message[]} message 
     */
    async insertOne([message]) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                INSERT INTO message
                VALUES(?,?,?,?,?,?,?,?)
                `, [
                    message.messageId, message.dateSender,
                    message.messageType, message.originLangue,
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


    async patchOne([messageId, dateSender, message, originLanguage]) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                UPDATE message
                SET dateSender = ?, message = ?, originLanguage = ?
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

    async deleteOne([messageId]) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
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

    async findMany([chatId]) {
        try {
            const connection = await this.getConnection();
            const stream = connection
                .query(`
               SELECT 
                M.messageId AS messageId,
                U.userName,
                M.dateMessage,
                M.messageType,
                M.originLanguage,
                M.chatId,
                M.message,
				M.status,
                M.userId
                FROM message as M
                INNER JOIN user as U
                on U.userId = M.userId
                WHERE chatId = ?
                `, [chatId])
                .stream();
            connection.release();

            return Result.ok(stream);
        } catch (error) {
            loggers.error("não foi possivel pegar as mensagens do chat", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

}