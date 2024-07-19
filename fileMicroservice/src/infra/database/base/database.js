import { createPool } from "mysql2";
import { loggers } from "../../../util/logger.js";
import { ConnectioDataBaseError } from "../../../core/aplicationException/appErrors.js";
import { Result } from "../../errorHandling/result.js";

class UICrud {

    /**
     * @returns {Promise<Result>}
     */
    deleteOne() {
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
}

export class BaseRepository extends UICrud {

    #pool
    static instance = null;

    constructor(connectionString) {
        super()
        try {
            if (BaseRepository.instance == null) {
                this.#pool = createPool(connectionString);
                loggers.info(`banco conectado com sucesso`);
            }
        } catch (error) {
            loggers.error(ConnectioDataBaseError.create())
        }
    }

    async getConnection() {
        // try {
        //     return await this.#pool.promise().getConnection();
        // } catch (error) {
        //     loggers.error(ConnectioDataBaseError.create())
        // }

        return new Promise((resolve, reject) => {
            this.#pool.getConnection((err, con) => {
                if (err) reject(err);
                resolve(con);
            });
        })
    }

}