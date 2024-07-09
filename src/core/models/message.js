import { Notifications } from "../../infra/notifications/notifications.js";



export class Message {

    #notifications = new Notifications()
    #messageTypes = ["text","audio","image","file"]

    /**
     * @param {string} message
     * @param {string} userName 
     * @param {Date} dateSender 
     * @param {boolean} isActive
     * @param {string} userId 
     * @param {string} chatId 
     * @param {number} messageId 
     * @param {string} originLanguessage
     * @param {string} messageType 
     */
    constructor(message, userName, dateSender, isActive, userId, chatId, messageId, originLangue, messageType) {
        this.message = message;
        this.userName = userName;
        this.dateSender = dateSender;
        this.isActive = isActive;
        this.userId = userId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.originLangue = originLangue;
        this.messageType = messageType;
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

        return this.#notifications.hasNotification()
    }
    

}

