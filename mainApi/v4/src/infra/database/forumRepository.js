import { Result } from "../errorHandling/result.js";
import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Repository } from "./base/repository.js";
import { ForumData } from "../../core/entity/ForumData.js";
import { loggers } from "../../util/logger.js";
loggers

export class ForumRepository extends Repository {


    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * 
     * @param {ForumData} forum 
     */
    async insertOne(forum) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(` INSERT INTO forumData
                    VALUES(?,?,?,?)
                    `, [forum.forumTitle, forum.forumDescription, forum.isActive, forum.chatId])
            connection.release();
            return Result.ok(forum)
        } catch (error) {
            loggers.error("não foi possivel criar um novo forum ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param {ForumData} forum 
     */
    async patchOne(forum) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`UPDATE forumData
                SET forumTitle = ?, forumDescription = ?, isActive = ?
                WHERE chatId = ?
                    `, [forum.forumTitle, forum.forumDescription, forum.isActive, forum.chatId])
            connection.release();
            return Result.ok(forum)
        } catch (error) {
            loggers.error("não foi possivel atualizar o forum ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findMany(query) {
        try {
            const connection = await this.getConnection();
            const [foruns] = await connection
                .promise()
                .query(`SELECT *
                        FROM forumData f
                        WHERE f.forumTitle LIKE ?
                        UNION
                        SELECT f.forumTitle, f.forumDescription, f.isActive, f.chatId
                        FROM forumData f
                        JOIN keyword kf ON f.chatId = kf.chatId
                        WHERE kf.keyWord LIKE ?
                        `,[query,query])
            connection.release();
            return Result.ok(foruns)
        } catch (error) {
            loggers.error("não foi possivel buscar os foruns ", error);
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
                FROM forumData
                WHERE chatId = ?
                `, [chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel pegar um forum", error);
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
                WHERE chatId = ? and chatType = "forum"
                AND chatId NOT IN (SELECT chatId FROM forumData);
                `, [chatId]);

            connection.release();
            return Result.ok(group);
        } catch (error) {
            loggers.error("não foi possivel verificar se a key é valida ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

}