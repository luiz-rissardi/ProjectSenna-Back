import { createPool } from "mysql2";
import { loggers } from "../../util/logger.js";

class UICrud{
    findMany(){
        throw new Error("metodo não implementado")
    }

    findOne(){
        throw new Error("metodo não implementado")
    }

    insertOne(){
        throw new Error("metodo não implementado")
    }
    putOne(){
        throw new Error("metodo não implementado")
    }
}

export class DataBaseMysql extends UICrud{

    #pool
    constructor(connectionString) {
        super()
        try {
            this.#pool = createPool(connectionString);
            loggers.info(`banco conectado com sucesso`);
        } catch (error) {
            loggers.error(`não foi possivel conectar o banco de dados, ${error.message}`)
        }
    }

    async getConnection(){
        try {
            return await this.#pool.promise().getConnection();
        } catch (error) {
            throw new Error("não foi possivel pegar conexão")
        }
    }
    
}