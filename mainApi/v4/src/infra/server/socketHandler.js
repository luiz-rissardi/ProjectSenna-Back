import { Server } from "socket.io";
import { Chat } from "../../core/entity/chat.js";
import { Message } from "../../core/entity/message.js";
import { ChatData } from "../../core/entity/chatData.js";

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
            // socket.on("new-chat", (chatId) => {
            //     if (!socket.rooms.has(chatId)) {
            //         socket.join(chatId);
            //     }
            // })

            socket.on("create-chat", ({ chatId, userId }) => {
                if (!socket.rooms.has(chatId)) {
                    socket.join(chatId);
                    this.createChat(userId, chatId);
                }
            })

            // sair da conversa / bloquear chat e etc..
            socket.on("leave-chat", (chatId) => {
                socket.leave(chatId)
            })

            // entrar / desbloquar chat
            socket.on("enter-chat", (chatId) => {
                socket.join(chatId)
            })

            // escutar os chatsRoom que o usuario esta
            socket.on("enter-rooms-chat",
                (chats) => {
                    chats.forEach(chatId => {
                        if (!socket.rooms.has(chatId)) {
                            socket.join(chatId)
                        }
                    })
                });

            // enviar mensagem para o chat
            socket.on("send-message", ({ message }) => {
                this.sendMessageToRoom(message.chatId, message);
            })

            socket.on("update-message", ({ message }) => {
                this.updateMessageToRoom(message.chatId, message);
            })

            socket.on("delete-message", ({ message }) => {
                this.deleteMessageToRoom(message.chatId, message);
            })

            //expulsar usuario de grupos e forums
            socket.on("kick-user", ({ chatId, userId }) => {
                this.leaveChat(userId, chatId)
            })


            socket.on("read-messages", ({ chatId, userId }) => {
                this.readMessages(userId, chatId)
            })

        })
    }

    sendMessageToRoom(chatId, message) {
        this.#socketServer.to(chatId).emit("message", message)
    }

    updateMessageToRoom(chatId, message) {
        this.#socketServer.to(chatId).emit("update-message", message)
    }

    deleteMessageToRoom(chatId, message) {
        this.#socketServer.to(chatId).emit("delete-message", message)
    }

    createChat(userId, chatData) {
        this.#socketServer.to(userId).emit("new-chat", chatData)
    }

    leaveChat(userId, chatId) {
        this.#socketServer.to(userId).emit("leave-chat", chatId)
    }

    readMessages(userId, chatId) {
        this.#socketServer.to(userId).emit("read-messages", chatId )
    }
}