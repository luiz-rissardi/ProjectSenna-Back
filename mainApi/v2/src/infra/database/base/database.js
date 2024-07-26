import { createPool } from "mysql2";
import { loggers } from "../../../util/logger.js";
import { ConnectioDataBaseError } from "../../../core/aplicationException/appErrors.js";
import { Result } from "../../errorHandling/result.js";

class UICrud {

    /**
     * @returns {Promise<Result>}
     */
    findMany() {
        throw new Error("metodo não implementado")
    }

    /**
     * @returns {Promise<Result>}
     */
    findOne() {
        throw new Error("metodo não implementado")
    }

    /**
     * @returns {Promise<Result>}
     */
    insertOne() {
        throw new Error("metodo não implementado")
    }

    /**
     * @returns {Promise<Result>}
     */
    patchOne() {
        throw new Error("metodo não implementado")
    }
}

export class BaseRepository extends UICrud {

    #pool
    static instance = null;

    constructor(connectionString) {
        super()
        try {
            if (BaseRepository.instance == null) {
                BaseRepository.instance = this;
                this.#pool = createPool(connectionString);
                loggers.info(`banco conectado com sucesso`);
            }
            return BaseRepository.instance
        } catch (error) {
            console.log(error);
            loggers.error(ConnectioDataBaseError.create())
        }
    }

    async getConnection() {
        return new Promise((resolve, reject) => {
            this.#pool.getConnection((err, con) => {
                if (err) reject(err);
                resolve(con);
            });
        })
    }

}