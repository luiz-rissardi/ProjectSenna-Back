import { BaseRepository } from "./base/database.js";
import { Result } from "../errorHandling/result.js";
import { RepositoryOperationError } from "../../core/errorsAplication/appErrors.js";
import { ChatData } from "../../core/models/chatData.js";
import { loggers } from "../../util/logger.js";


export class ChatDataRepository extends BaseRepository {

    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * 
     * @param { ChatData[] } chatData 
     */
    async insertOne([chatData]) {
        try {
            const connection = await this.getConnection();
            await connection.query(`
                INSERT INTO chatData
                VALUES (?,?,?,?,?,?)
                `, [chatData.memberType, chatData.lastClear, chatData.isActive, chatData.userId, chatData.chatId, chatData.dateOfBloking]);
            connection.release();
            return Result.ok(chatData);
        } catch (error) {
            loggers.warn("não foi possivel inserir usuario no chat", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param { ChatData[] } chatData 
     */
    async putOne([chatData]) {
        try {
            const connection = await this.getConnection();
            
            // Inicializa arrays para armazenar colunas e valores que serão atualizados
            const columns = [];
            const values = [];
        
            // Verifica e adiciona ao array apenas os campos que estão definidos em chatData
            if (chatData.memberType !== null) {
                columns.push('memberType');
                values.push(chatData.memberType);
            }
            if (chatData.lastClear !== null) {
                columns.push('lastClear');
                values.push(chatData.lastClear);
            }
            if (chatData.isActive !== null) {
                columns.push('isActive');
                values.push(chatData.isActive);
            }

            columns.push('dateOfBlocking');
            values.push(chatData.dateOfBlocking);

            // Adiciona os campos de filtro
            values.push(chatData.userId);
            values.push(chatData.chatId);
        
            // Constrói a query dinamicamente
            const updateColumns = columns.map(col => `${col} = ?`).join(', ');
            const query = `
                UPDATE chatData
                SET ${updateColumns}
                WHERE userId = ? AND chatId = ?
            `;
        
            // Executa a query com os valores dinâmicos
            await connection.query(query, values);
            connection.release();
            
            return Result.ok(chatData);
        } catch (error) {
            loggers.warn("não foi possivel atuaizar o chat usuario ", error);
            return Result.fail(RepositoryOperationError.create());
        }
        
    }

    async findMany(userId) {
        try {
            const connection = await this.getConnection();
            const [chatsData] = await connection.query(`
                SELECT * 
                FROM chatData as CT
                INNER JOIN chat as C
                on C.chatId = CT.chatId
                WHERE userId = ?
                `,[userId]);
            connection.release();
            return Result.ok(chatsData);
        } catch (error) {
            loggers.warn("não foi possivel buscar os chats ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

}