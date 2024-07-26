import { NotificationContext } from "./DomainNotifications/notifications.js";


export class Chat {

    #notifications = new NotificationContext();
    #typesOfChat = ["group","forum","conversation"];

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
        return this.#notifications.notificationsData
    }

    isValid(){
        if(this.chatId == undefined){
            this.#notifications.addNotification({ name: "chatId", message: "o chatId é Obrigatorio" })
        }

        if(!this.#typesOfChat.includes(this.chatType)){
            this.#notifications.addNotification({ name: "chatType", message: "tipo de chat invalido" })
        }

        return this.#notifications.hasNotification()
    }
}