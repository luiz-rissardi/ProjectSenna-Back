import { NotificationContext } from "./DomainNotifications/notifications.js";



export class Message {

    #notifications = new NotificationContext()
    #messageTypes = ["text","audio","image","file"]
    #statusTypes = ["read","unread"]

    /**
     * @param {string} message
     * @param {Date} dateSender 
     * @param {string} userId 
     * @param {string} chatId 
     * @param {number} messageId 
     * @param {string} originLanguessage
     * @param {string} messageType 
     * @param {string} status 
     * @param {Blob} data 
     */
    constructor(message,dateSender, userId, chatId, messageId, originLangue, messageType,status,data) {
        this.message = message;
        this.dateSender = dateSender;
        this.userId = userId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.originLangue = originLangue;
        this.messageType = messageType;
        this.status = status;
        this.data = data    

    }

    getNotifications(){
        return this.#notifications.notificationsData;
    }

    isValid(){
        if(this.message.length >= 1000){
            this.#notifications.addNotification({ name: "message", message: "limite do tamanha da mensagem atingido" })
        }

        if(this.dateSender !=  null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.dateSender)){
            this.#notifications.addNotification({ name: "dateSender", message: "a data de envio é invalida" })
        }
        
        if(!this.#messageTypes.includes(this.messageType)){
            this.#notifications.addNotification({ name: "messageType", message: "o tipo da mensagem é invalido" })
        }
        if(!this.#statusTypes.includes(this.status)){
            this.#notifications.addNotification({ name: "status", message: "o status da mensagem é invalido" })
        }
        if(this.messageType != "text" && this.data.constructor != Blob){
            this.#notifications.addNotification({ name: "messageFile", message: "o tipo de message file é inválido" })
        }

        return this.#notifications.hasNotification()
    }
    

}

