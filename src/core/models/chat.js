import { Notifications } from "../../infra/notifications/notifications.js";


export class Chat {

    #notifications = new Notifications();
    #typesOfChat = ["group","forum","conversarion"];

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