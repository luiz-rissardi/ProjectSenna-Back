import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Group } from "../../core/entity/groupData.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { Repository } from "./base/repository.js";


export class GroupRepository extends Repository {
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
                .query(`
                INSERT INTO groupData VALUES(?,?,?,?,?)
                `, [group.groupPhoto, group.groupName, group.groupDescription, group.chatId,group.chatType]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel criar um novo grupo ", error);
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
                .query(`
                UPDATE groupData
                SET groupPhoto = ?, groupName = ?, groupDescription = ?
                WHERE chatId = ?
                `, [group.groupPhoto, group.groupName, group.groupDescription, group.chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel atualizar o grupo ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findOne(chatId) {
        try {
            const connection = await this.getConnection();
            const [group] = await connection
                .query(`
                SELECT *
                FROM groupData
                WHERE chatId = ?
                `, [chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel pegar um grupo", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findMany(userId) {
        try {
            const connection = await this.getConnection();
            const [group] = await connection
                .query(`
                        SELECT 
                        GD.groupPhoto, 
                        GD.groupName, 
                        GD.groupDescription, 
                        GD.chatId, 
                        GD.chatType, 
                        CT.memberType, 
                        CT.lastClear, 
                        CT.isActive, 
                        CT.chatId, 
                        CT.dateOfBlocking
                    FROM groupData AS GD
                    INNER JOIN chatData AS CT 
                        ON CT.userId = ?
                    WHERE GD.chatId = CT.chatId;
                `, [userId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel pegar um grupo", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}