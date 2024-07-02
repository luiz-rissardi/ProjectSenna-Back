import { DataBaseMysql } from "../../../infra/database/database.js";
import { Result } from "../../../infra/errorHandling/result.js";
import { loggers } from "../../../util/logger.js";
import { RepositoryOperationError } from "../../errorsAplication/appErrors.js";
import { User } from "../../models/user.js";


export class UserRepository extends DataBaseMysql {
    constructor(connectionString) {
        super(connectionString)
    }

    //pega o proprio contactId e procura o dados dos outros usuarios
    async findMany([contactId]) {
        try {
            const connection = await this.getConnection();
            const [contacts] = await connection.query(`
                SELECT SELECT U.userName, U.photo, U.userId
                FROM contact as C
                inner join User as U
                on C.userId = U.userId
                WHERE C.contactId = ?;
                `, [contactId]);
            connection.release();
            return Result.ok(contacts);
        } catch (error) {
            loggers.warn(`não foi possivel buscar contatos do usuário`);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findOne([userName, passwordHash]) {
        try {
            const connection = await this.getConnection();
            const [user] = await connection.query(`
                SELECT * 
                FROM user
                WHERE userName = ? and passwordHash = ? and isActive = true
                `, [userName, passwordHash]);
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.warn("não foi possivel buscar o usuario");
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
            await connection.query(`
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
            loggers.warn("não foi possivel criar o usuario");
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param {User[]} param0 
     */
    async putOne([user]){
        try {
            const connection = await this.getConnection();
            await connection.query(`
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
            loggers.warn("não foi possivel atualizar o usuario");
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findByUserName(userName){
        try {
            const connection = await this.getConnection();
            const [hasValue] = await connection.query(`SELECT * FROM user WHERE userName = ?`,[userName])
            connection.release();
            return Result.ok(hasValue);
        } catch (error) {
            loggers.warn("não foi possivel pegar usuário pelo nome");
            return Result.fail(RepositoryOperationError.create())
        }
    }

    async findByEmail(email){
        try {
            const connection = await this.getConnection();
            const [hasValue] = await connection.query(`SELECT * FROM user WHERE email = ?`,[email])
            connection.release();
            return Result.ok(hasValue);
        } catch (error) {
            loggers.warn("não foi possivel pegar usuário pelo email");
            return Result.fail(RepositoryOperationError.create())
        }
    }
}