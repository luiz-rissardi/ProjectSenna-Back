import { Repository } from "./base/repository.js";
import { Result } from "../errorHandling/result.js";
import { RepositoryOperationError } from "../../core/aplicationException/appErrors.js";
import { ChatData } from "../../core/entity/chatData.js";
import { loggers } from "../../util/logger.js";
import { DateFormat } from "../../util/dateFormated.js";


export class ChatDataRepository extends Repository {

    constructor(connectionString) {
        super(connectionString)
    }

    /**
     * 
     * @param { ChatData } chatData 
     */
    async insertOne(chatData) {
        try {
            const connection = await this.getConnection();
            await connection
                .query(`
                INSERT INTO chatData
                VALUES (?,?,?,?,?,?)
                `, [chatData.memberType, chatData.lastClear, chatData.isActive, chatData.userId, chatData.chatId, chatData.dateOfBlocking]);
            connection.release();
            return Result.ok(chatData);
        } catch (error) {
            loggers.error("não foi possivel inserir usuario no chat", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

    /**
     * 
     * @param { ChatData } chatData 
     */
    async patchOne(chatData) {
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
                if(chatData.isActive == "true"){
                    chatData.dateOfBlocking = null;
                    values.push(true);
                }else{
                    chatData.dateOfBlocking = DateFormat(new Date().toISOString());
                    values.push(false);
                }
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
            console.log(error);
            loggers.error("não foi possivel atualizar o chat usuario ", error);
            return Result.fail(RepositoryOperationError.create());
        }

    }

    async findMany(userId) {
        try {
            const connection = await this.getConnection();
            const [chats] = await connection
                .query(`
                    SELECT 
                    CT.*,
                    U2.userId AS otherUserId,
                    U2.userName AS otherUserName,
                    U2.userDescription AS otherUserDescription,
                    U2.photo AS otherUserPhoto,
                    U2.lastOnline AS otherUserLastOnline
                    FROM chatData AS CT
                    INNER JOIN user AS U1 ON U1.userId = CT.userId
                    INNER JOIN chatData AS CT2 ON CT2.chatId = CT.chatId AND CT2.userId != U1.userId
                    INNER JOIN user AS U2 ON U2.userId = CT2.userId
                    WHERE U1.userId = ?;
                    `, [userId])

            connection.release();
            return Result.ok(chats);
        } catch (error) {
            console.log(error);
            loggers.error("não foi possivel buscar os chats ", error);
            return Result.fail(RepositoryOperationError.create())
        }
    }

}