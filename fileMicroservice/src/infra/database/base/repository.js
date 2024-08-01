import { createPool } from "mysql2";
import { loggers } from "../../../util/logger.js";
import { ConnectioDataBaseError } from "../../../core/aplicationException/appErrors.js";


export class Repository {

    #pool

    constructor(connectionString) {
        try {
            this.#pool = createPool(connectionString);
            loggers.info(`banco conectado com sucesso`);
        } catch (error) {
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