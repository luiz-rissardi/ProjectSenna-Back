import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Group } from "../../core/models/groupData.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { Repository } from "./base/database.js";


export class GroupMysql extends Repository {
    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * @param {Group} group 
     */
    async insertOne(group) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                INSERT INTO groupData VALUES(?,?,?,?)
                `, [group.groupPhoto, group.groupName, group.groupDescription, group.chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel inserir um novo chat ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * @param {Group} group 
     */
    async patchOne(group) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                UPDATE groupData
                SET groupPhoto = ?, groupName = ?, groupDescription = ?
                WHERE chatId = ?
                `, [group.groupPhoto, group.groupName, group.groupDescription, group.chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel inserir um novo chat ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async chatIdIsValid(chatId) {
        try {
            const connection = await this.getConnection();
            const [group] = await connection
                .promise()
                .query(`
                SELECT *
                FROM Chat
                WHERE chatId = ? and chatType = "group"
                AND chatId NOT IN (SELECT chatId FROM GroupData);
                `, [chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel inserir um novo chat ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findOne(chatId) {
        try {
            const connection = await this.getConnection();
            const [group] = await connection
                .promise()
                .query(`
                SELECT *
                FROM groupData
                WHERE chatId = ?
                `, [chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel inserir um novo chat ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}