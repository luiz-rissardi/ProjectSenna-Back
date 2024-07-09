import { Notifications } from "../../infra/notifications/notifications.js";




export class ChatData {

    #notifications = new Notifications()
    #memberTypes = ["member","master"]

    constructor(chatId,userId,lastClear,isActive,memberType,dateOfBlocking){
        this.chatId = chatId;
        this.userId = userId;
        this.lastClear = lastClear;
        this.isActive = isActive;
        this.memberType = memberType;
        this.dateOfBlocking = dateOfBlocking;
    }

    getNotifications(){
        return this.#notifications.notificationsData
    }

    isValid(){
        if(this.chatId == undefined){
            this.#notifications.addNotification({ name: "chatId", message: "o chatId é Obrigatorio" })
        }

        if(this.userId == undefined){
            this.#notifications.addNotification({ name: "userId", message: "o userId é Obrigatorio" })
        }

        if(this.dateOfBlocking !=  null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.dateOfBlocking)){
            this.#notifications.addNotification({ name: "dateOfBlocking", message: "a data de block é invalida" })
        }

        if( this.lastClear != null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.lastClear)){
            this.#notifications.addNotification({ name: "lastClear", message: "a data de limpeza é invalida" })
        }

        if(!this.#memberTypes.includes(this.memberType) && this.memberType != null){
            this.#notifications.addNotification({ name: "memberType", message: "tipo de membro é invalido" })
        }

        return this.#notifications.hasNotification()
    }


}