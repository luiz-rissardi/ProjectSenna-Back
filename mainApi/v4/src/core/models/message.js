import { NotificationContext } from "./DomainNotifications/notifications.js";



export class Message {

    #notificationContext = new NotificationContext()

    /**
     * @param {string} message
     * @param {Date} dateSender 
     * @param {string} userId 
     * @param {string} chatId 
     * @param {number} messageId 
     * @param {string} originLanguessage
     * @param {string} messageType 
     * @param {string} status 
     */
    constructor(message, dateSender, userId, chatId, messageId, originLangue, messageType, status) {
        this.message = message;
        this.dateSender = dateSender;
        this.userId = userId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.originLangue = originLangue;
        this.messageType = messageType;
        this.status = status;
    }

    getNotifications() {
        return this.#notificationContext.notificationsData;
    }

    isValid() {
        const messageTypes = ["text", "audio", "image", "file"]
        const statusTypes = ["read", "unread"]
        if (this.message.length >= 1000) {
            this.#notificationContext.addNotification({ name: "message", message: "limite do tamanha da mensagem atingido" })
        }

        if (this.dateSender != null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.dateSender)) {
            this.#notificationContext.addNotification({ name: "dateSender", message: "a data de envio é invalida" })
        }

        if (!messageTypes.includes(this.messageType)) {
            this.#notificationContext.addNotification({ name: "messageType", message: "o tipo da mensagem é invalido" })
        }
        if (!statusTypes.includes(this.status)) {
            this.#notificationContext.addNotification({ name: "status", message: "o status da mensagem é invalido" })
        }

        return this.#notificationContext.hasNotification()
    }


}

