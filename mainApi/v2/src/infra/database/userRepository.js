import { BaseRepository } from "./base/database.js";
import { Result } from "../errorHandling/result.js";
import { loggers } from "../../util/logger.js";
import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { User } from "../../core/models/user.js";


export class UserMysql extends BaseRepository {
    constructor(connectionString) {
        super(connectionString)
    }

    //pega o proprio contactId e procura o dados dos outros usuarios
    async findMany([contactId]) {
        try {
            const connection = await this.getConnection();
            const stream = connection
                .query(`
                SELECT U.userName, U.photo, U.userId
                FROM contact as C
                inner join User as U
                on C.userId = U.userId
                WHERE C.contactId = ?;
                `, [contactId])
                .stream()

            connection.release();
            return Result.ok(stream);
        } catch (error) {
            loggers.error(`não foi possivel buscar contatos do usuário `, error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findOne([email, passwordHash]) {
        try {
            const connection = await this.getConnection();
            const [[user]] = await connection
                .promise()
                .query(`
                SELECT * 
                FROM user
                WHERE email = ? and passwordHash = ?
                `, [email, passwordHash]);
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.error("não foi possivel buscar o usuario ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param {User[]} user - O objeto User a ser inserido
     * @returns {Result} result - pode ser um ok ou falha
     */
    async insertOne([user]) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                INSERT INTO User (userName, isActive, photo, email, lastOnline, languages, userDescription, passwordHash, contactId, userId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                    user.userName,
                    user.isActive,
                    user.photo,
                    user.email,
                    user.lastOnline,
                    user.languages,
                    user.userDescription,
                    user.passwordHash,
                    user.contactId,
                    user.userId
                ]);
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.error("não foi possivel criar o usuario ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param {User[]} param0 
     */
    async patchOne([user]) {
        try {
            const connection = await this.getConnection();
            await connection
                .promise()
                .query(`
                UPDATE User 
                SET userName = ?, isActive = ?, photo = ?, email = ?, lastOnline = ?, languages = ?, userDescription = ?, passwordHash = ?
                WHERE userId = ?
            `, [
                    user.userName,
                    user.isActive,
                    user.photo,
                    user.email,
                    user.lastOnline,
                    user.languages,
                    user.userDescription,
                    user.passwordHash,
                    user.userId
                ]);
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.error("não foi possivel atualizar o usuario ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findByEmail(email) {
        try {
            const connection = await this.getConnection();
            const [[user]] = await connection.promise().query(`SELECT * FROM user WHERE email = ?`, [email])
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.error("não foi possivel pegar usuário pelo email ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }
}