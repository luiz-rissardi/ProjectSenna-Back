import { NotificationContext } from "../DomainNotifications/notifications.js";



export class Message {

    #notificationContext = new NotificationContext()

    /**
     * @param {string} message
     * @param {Date} dateSender 
     * @param {string} userId 
     * @param {string} chatId 
     * @param {number} messageId 
     * @param {string} language
     * @param {string} messageType 
     * @param {string} status 
     */
    constructor(message, dateSender, userId, chatId, messageId, language, messageType, status) {
        this.message = message;
        this.dateSender = dateSender;
        this.userId = userId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.language = language;
        this.messageType = messageType;
        this.status = status;
    }

    getNotifications() {
        return this.#notificationContext.notificationsData;
    }

    isValid() {
        const messageTypes = ["text", "audio", "image", "file"]
        const statusTypes = ["read", "unread"];
        const dateRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if(this.chatId == undefined || uuidRegex.test(this.chatId) == false){
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é invalido" })
        }

        if(this.userId == undefined || uuidRegex.test(this.userId) == false){
            this.#notificationContext.addNotification({ name: "userId", message: "o userId é invalido" })
        }

        if (this.message.length >= 1000) {
            this.#notificationContext.addNotification({ name: "message", message: "limite do tamanho da mensagem atingido" })
        }

        if (this.dateSender != null && dateRegex.test(this.dateSender) == false) {
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

