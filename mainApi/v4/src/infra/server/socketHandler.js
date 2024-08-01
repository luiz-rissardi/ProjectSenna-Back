import { Server } from "socket.io";
import { Chat } from "../../core/models/chat.js";
import { Message } from "../../core/models/message.js";
import { ChatData } from "../../core/models/chatData.js";


export class SocketHandler {

    #socketServer;

    static setup(server) {
        return new SocketHandler(server)
    }

    constructor(server) {
        this.#socketServer = new Server(server);

        this.#socketServer.on("connection", (socket) => {
            // entrar em uma sala com o seu ID para comunicação de info do sistema
            const userId = socket.handshake.query.userId;
            socket.join(userId);

            // adicionar chat quando outro usuario quer conversar com ele
            socket.on("new-chat", (chatId) => {
                socket.join(chatId);
            })

            socket.on("create-chat", (chatId, userId) => {
                socket.join(chatId);
                this.createChat(userId,chatId);
            })

            // sair da conversa / bloquear grupo forum e etc..
            socket.on("leave-chat", (chatId) => {
                socket.leave(chatId)
            })

            // escutar os chatsRoom que o usuario esta
            socket.on("listen-chats",
                /**
                * @param {Chat[]} chats
                */
                (chats) => {
                    chats.forEach(chat => {
                        socket.join(chat.chatId)
                    })
                });

            // enviar mensagem para o chat
            socket.on("send-message", (chatId, message) => {
                this.sendMessageToRoom(chatId, message);
            })

            //expulsar usuario de grupos e forums
            socket.on("kick-user", (chatId, userId) => {
                this.leaveChat(userId, chatId)
            })

        })
    }

    /**
     * @param {string} chatId 
     * @param { Message } message 
     */
    sendMessageToRoom(chatId, message) {
        this.#socketServer.to(chatId).emit("message", { message, chatId })
    }

    /**
     * @param {string} userId 
     * @param { ChatData } chatData 
     */
    createChat(userId, chatData) {
        this.#socketServer.to(userId).emit("new-chat", chatData.chatId)
    }

    leaveChat(userId, chatId) {
        this.#socketServer.to(userId).emit("leave-chat", chatId)
    }
}