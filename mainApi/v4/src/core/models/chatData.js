import { NotificationContext } from "./DomainNotifications/notifications.js";




export class ChatData {

    #notifications = new NotificationContext()

    /**
     * 
     * @param {string} chatId 
     * @param {string} userId 
     * @param {Date} lastClear 
     * @param {Boolean} isActive 
     * @param {string} memberType 
     * @param {Date} dateOfBlocking 
     */
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
        const memberTypes = ["member","master"]
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if(this.chatId == undefined && !!uuidRegex.test(this.chatId)){
            this.#notifications.addNotification({ name: "chatId", message: "o chatId é invalido" })
        }

        if(this.userId == undefined && !uuidRegex.test(this.userId)){
            this.#notifications.addNotification({ name: "userId", message: "o userId é invalido" })
        }

        if(this.dateOfBlocking !=  null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.dateOfBlocking)){
            this.#notifications.addNotification({ name: "dateOfBlocking", message: "a data de block é invalida" })
        }

        if( this.lastClear != null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.lastClear)){
            this.#notifications.addNotification({ name: "lastClear", message: "a data de limpeza é invalida" })
        }

        if(!memberTypes.includes(this.memberType)){
            this.#notifications.addNotification({ name: "memberType", message: "tipo de membro é invalido" })
        }

        return this.#notifications.hasNotification()
    }


}