import { createPool } from "mysql2/promise";
import { loggers } from "../../../util/logger.js";
import { ConnectioDataBaseError } from "../../../core/aplicationException/appErrors.js";


export class Repository {

    #pool

    constructor(connectionString) {
        try {
            this.#pool = createPool(connectionString);
            loggers.info(`banco conectado com sucesso`);
        } catch (error) {
            loggers.error(`RepositoryBae => constructor => error:${error}`)
            loggers.error(ConnectioDataBaseError.create())
        }
    }

    async getConnection() {
        return this.#pool.getConnection();
    }

}