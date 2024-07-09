import { Server } from "socket.io";
import { Chat } from "../../core/models/chat.js";
import { Message } from "../../core/models/message.js";
import { ChatData } from "../../core/models/chatData";


export class SocketHandler {

    #socketServer;

    constructor(server) {
        this.#socketServer = new Server(server);

        this.#socketServer.on("connection", (socket) => {

            socket.on("listen-chats",
                /**
                * @param {Chat[]} chats
                */
                (chats) => {
                    chats.forEach(chat => {
                        socket.join(chat.chatId)
                    })
                })
        })
    }

    /**
     * 
     * @param {string} chatId 
     * @param { Message } message 
     */
    sendMessageToRoom(chatId, message) {
        this.#socketServer.to(chatId).emit("message", message)
    }

    /**
     * 
     * @param {string} userId 
     * @param { ChatData } chatData 
     */
    createChat(userId,chatData){
        this.#socketServer.to(userId).emit("new-chat",chatData.chatId,chatData.memberType)
    }
}