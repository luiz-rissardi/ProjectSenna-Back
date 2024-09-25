import { NotificationContext } from "../DomainNotifications/notifications.js";




export class ChatData {

    #notificationContext = new NotificationContext()
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
        return this.#notificationContext.notificationsData
    }

    isValid(){
        const memberTypes = ["member","master"]
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if(this.chatId == undefined || uuidRegex.test(this.chatId) == false){
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é invalido" })
        }

        if(this.userId == undefined || !uuidRegex.test(this.userId)){
            this.#notificationContext.addNotification({ name: "userId", message: "o userId é invalido" })
        }

        if(this.dateOfBlocking !=  null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.dateOfBlocking)){
            this.#notificationContext.addNotification({ name: "dateOfBlocking", message: "a data de block é invalida" })
        }

        if( this.lastClear != null && new RegExp('^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$').test(this.lastClear)){
            this.#notificationContext.addNotification({ name: "lastClear", message: "a data de limpeza é invalida" })
        }

        if(!memberTypes.includes(this.memberType)){
            this.#notificationContext.addNotification({ name: "memberType", message: "tipo de membro é invalido" })
        }

        return this.#notificationContext.hasNotification()
    }


}