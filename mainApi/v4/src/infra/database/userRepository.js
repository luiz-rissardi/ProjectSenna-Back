import { Repository } from "./base/repository.js";
import { Result } from "../errorHandling/result.js";
import { loggers } from "../../util/logger.js";
import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { User } from "../../core/entity/user.js";


export class UserRepository extends Repository {
    constructor(connectionString) {
        super(connectionString)
    }

    async findOne(email, passwordHash) {
        try {
            const connection = await this.getConnection();
            const [[user]] = await connection
                .query(`
                SELECT * 
                FROM user
                WHERE email = ? and passwordHash = ?
                `, [email, passwordHash]);
            connection.release();
            return Result.ok(user);
        } catch (error) {
            console.log(error);
            loggers.error("não foi possivel buscar o usuario ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param {User} user - O objeto User a ser inserido
     * @returns {Result} result - pode ser um ok ou falha
     */
    async insertOne(user) {
        try {
            const connection = await this.getConnection();
            await connection
                .query(`
                INSERT INTO User (userName, isActive, photo, email, lastOnline, languages, userDescription, passwordHash, contactId, userId, readMessages)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    user.userId,
                    user.readMessages
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
     * @param {User} user 
     */
    async patchOne(user) {
        try {
            const connection = await this.getConnection();

            // atualizar somente os campos preenchidos
            const forbidensMutateFields = ["userId", "contactId"]
            const fields = Object.keys(user)
                .map(key => {
                    if (user[key] != undefined && String(user[key]).toString().trim() != "" && !forbidensMutateFields.includes(key)) {
                        return [key, user[key]];
                    }
                }).filter(el => el != undefined);

            // adicione o userId ao array de valores
            const values = fields.map(el => el[1]);
            values.push(user.userId);  // Adiciona o userId no final do array de valores

            const query = fields
                .reduce((acc, el) => {
                    return acc + `${el[0]} = ?, `;
                }, "")
                .replace(/,\s*$/, '');  // Remove a última vírgula e qualquer espaço em branco

            await connection
                .query(`
                    UPDATE User 
                    SET ${query}
                    WHERE userId = ?
                `, values);
            // 
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.error("não foi possivel atualizar o usuario ", error);
            return Result.fail(RepositoryOperationError.create());
        }
    }

    async changeOnlyStateOfUser(userId, isActive) {
        try {
            const connection = await this.getConnection();
            await connection.query(`
                UPDATE User 
                SET isActive = ?
                WHERE userId = ?`, [isActive, userId]);
            connection.release();
            return Result.ok("usuario atualizado com sucesso");
        } catch (error) {
            loggers.error("não foi possivel atualizar o usuario ", error);
            return Result.fail(RepositoryOperationError.create());
        }
    }

    async findByEmail(email) {
        try {
            const connection = await this.getConnection();
            const [[user]] = await connection.query(`SELECT * FROM user WHERE email = ?`, [email])
            connection.release();
            return Result.ok(user);
        } catch (error) {
            loggers.error("não foi possivel pegar usuário pelo email ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }


    async findMany(query, skip) {
        try {
            const connection = await this.getConnection();
            const [users] = await connection.query(`
                SELECT 
                * FROM user
                WHERE userName LIKE CONCAT('%', ?, '%') OR email LIKE CONCAT('%', ?, '%') LIMIT 5 OFFSET ? `, [query, query, Number(skip)])
            connection.release();
            return Result.ok(users);
        } catch (error) {
            loggers.error("não foi possivel pegar usuário pelo email ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }


}