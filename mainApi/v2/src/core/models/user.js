import { NotificationContext } from "./DomainNotifications/notifications.js";
import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { loggers } from "../../util/logger.js";
import { Readable } from "stream"
import { BaseRepository } from "../../infra/database/base/database.js";
import { EncryptService } from "../../services/encryptService.js";
import { EmailAlreadyExistsExeption, UserBlockingException } from "../aplicationException/domainException.js";
import { InvalidCredentialsException } from "../aplicationException/domainException.js";
import { randomUUID as v4 } from "crypto"

export class User {

    #notifications = new NotificationContext();

    /**
     * @param {string} userName 
     * @param {boolean} isActive 
     * @param {string} email 
     * @param {string} photo 
     * @param {string} userDescription 
     * @param {string} userId 
     * @param {Date} lastOnline 
     * @param {string} languages 
     * @param {string} contactId 
     * @param {string} passwordHash 
     * 
     */

    constructor(userName = "", isActive, email, photo, userDescription, userId, lastOnline, languages = null, contactId = null, password) {
        this.userName = userName;
        this.isActive = isActive;
        this.email = email;
        this.userDescription = userDescription;
        this.photo = photo;
        this.contactId = contactId;
        this.userId = userId;
        this.languages = languages;
        this.lastOnline = lastOnline;
        this.password = password;
        this.passwordHash = EncryptService.encrypt(password);
        this.repository = new BaseRepository(process.env.CONNECION_STRING);
    }

    async updateUser() {
        try {
            const resultValidate = await this.#emailBelongsToUser(this.email, this.userId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }


            const connection = await this.repository.getConnection();
            await connection
                .promise()
                .query(`
                UPDATE User 
                SET userName = ?, isActive = ?, photo = ?, email = ?, lastOnline = ?, languages = ?, userDescription = ?, passwordHash = ?
                WHERE userId = ?
            `, [
                    this.userName,
                    this.isActive,
                    this.photo,
                    this.email,
                    this.lastOnline,
                    this.languages,
                    this.userDescription,
                    this.passwordHash,
                    this.userId
                ]);
            connection.release();
            Reflect.deleteProperty(this, "passwordHash");
            Reflect.deleteProperty(this, "repository");
            return Result.ok(this)


        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async getContactsOfUser() {
        try {
            const connection = await this.repository.getConnection();
            const stream = connection
                .query(`
                SELECT U.userName, U.photo, U.userId
                FROM contact as C
                inner join User as U
                on C.userId = U.userId
                WHERE C.contactId = ?;
                `, [this.contactId])
                .stream()


            const group = []
            const streamFlow = new Readable({
                read() {
                    stream.on("data", (chunk) => {
                        if (group.length == 10) {
                            this.push(JSON.stringify(group))
                            group.length = 0
                        }
                        group.push(chunk);
                    })

                    stream.on("end", () => {
                        if (group.length != 0) {
                            this.push(JSON.stringify(group));
                            group.length = 0
                        }
                        this.push(null)
                    })
                }
            })

            return Result.ok(streamFlow)

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async findUser() {
        try {
            const connection = await this.repository.getConnection();
            const [[user]] = await connection
                .promise()
                .query(`
                SELECT * 
                FROM user
                WHERE email = ? and passwordHash = ?
                `, [this.email, this.passwordHash]);
            connection.release();
            if (user) {
                if (user.isActive) {
                    // remove the repositpry of this
                    Reflect.deleteProperty(user, "repository")
                    Reflect.deleteProperty(user, "passwordHash");
                    return Result.ok(user);
                }
                return Result.fail(UserBlockingException.create())
            }
            return Result.fail(InvalidCredentialsException.create())

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro intrerno do servidor"))
        }
    }

    static async createUser(userName, userDescription, email, photo, languages, password) {
        try {
            const userId = v4();
            const contactId = v4();
            const isActive = false;
            const lastOnline = new Date();
            const user = new User(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId, password);

            const resultValidate = await user.#validateUserEmail(email);

            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            if (user.isValid()) {
                const connection = await user.repository.getConnection();
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

                // remove the repositpry of this
                Reflect.deleteProperty(user, "repository")
                Reflect.deleteProperty(user, "passwordHash");

                return Result.ok(user);
            } else {
                return Result.fail(user.getNotifications());
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async #validateUserEmail(userEmail) {
        const connection = await this.repository.getConnection();
        const [[user]] = await connection.promise().query(`SELECT * FROM user WHERE email = ?`, [userEmail])
        connection.release();
        if (user != undefined) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }

    async #emailBelongsToUser(userEmail, userId) {
        const connection = await this.repository.getConnection();
        const [[user]] = await connection.promise().query(`SELECT * FROM user WHERE email = ?`, [userEmail])
        connection.release();

        if (user != undefined && user.userId != userId) {
            return Result.fail(EmailAlreadyExistsExeption.create());
        }
        return Result.ok();
    }

    getNotifications() {
        return this.#notifications.notificationsData
    }

    isValid() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.userName == "") {
            this.#notifications.addNotification({ name: "userName", message: "o nome do usuario esta vazio" });
        }
        if (!regex.test(this.email)) {
            this.#notifications.addNotification({ name: "email", message: "o email é invalido" });
        }
        if (this.languages == null) {
            this.#notifications.addNotification({ name: "lenguages", message: "o idioma a ser escolhido esta vazio" });
        }

        return this.#notifications.hasNotification();
    }
}