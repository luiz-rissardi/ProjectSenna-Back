import { Repository } from "./base/repository.js";
import { loggers } from "../../util/logger.js";
import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { Result } from "../errorHandling/result.js";

export class KeyWordsRepository extends Repository {

    constructor(connectionString) {
        super(connectionString);
    }

    async insertMany(chatId, words = []) {
        try {
            const connection = await this.getConnection();
            await connection.promise().beginTransaction();

            words.forEach(async word => {
                await connection
                    .promise()
                    .query(` INSERT INTO keyword
                    VALUES(?,?)
                    `, [chatId,word]);
            })

            await connection.promise().commit()
            connection.release();
            return Result.ok()
        } catch (error) {
            loggers.error("não foi possivel criar um novo forum ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}