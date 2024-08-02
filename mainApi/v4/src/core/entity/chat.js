import { NotificationContext } from "../DomainNotifications/notifications.js";


export class Chat {

    #notificationContext = new NotificationContext();

    /**
     * 
     * @param {string} chatId 
     * @param {string} chatType 
     */
    constructor(chatId,chatType){
        this.chatId = chatId;
        this.chatType = chatType;
    }

    getNotifications(){
        return this.#notificationContext.notificationsData
    }

    isValid(){
        const typesOfChat = ["group","forum","conversation"]
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if(this.chatId == undefined || !!uuidRegex.test(this.chatId)){
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é iválido" })
        }

        if(!typesOfChat.includes(this.chatType)){
            this.#notificationContext.addNotification({ name: "chatType", message: "tipo de chat invalido" })
        }

        return this.#notificationContext.hasNotification()
    }
}