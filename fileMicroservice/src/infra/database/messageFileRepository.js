

import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { MessageFile } from "../../core/model/messageFile.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js"
import { Repository } from "./base/repository.js";

export class MessageFileMysql extends Repository {
    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * @param {MessageFile} messageFile 
     */
    async insertOne(messageFile) {
        try {

            const buffer = Buffer.from(messageFile.data);
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                INSERT INTO messageFile
                VALUES(?,?,?)
                `, [
                    buffer, messageFile.messageId,
                    messageFile.fileName
                ])


            connection.release();
            return Result.ok(messageFile);
        } catch (error) {
            loggers.error("não foi possivel inserir o arquivo na mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findOne(messageId) {
        try {
            const connection = await this.getConnection();
            const [[messageFile]] = await connection
                .promise()
                .query(`
                    SELECT * FROM messageFile
                    WHERE messageId = ?
                    `, [messageId])

            connection.release();
            return Result.ok(messageFile);
        } catch (error) {
            loggers.error("não foi possivel pegar o arquivo da mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async deleteOne(messageId) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                DELETE  FROM messageFile
                WHERE messageId = ?
                `, [messageId])


            connection.release();
            return Result.ok();
        } catch (error) {
            loggers.error("não foi possivel deletar o arquivo da mensagem", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}