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
        const dateRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if(this.chatId == undefined || uuidRegex.test(this.chatId) == false){
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é invalido" })
        }

        if(this.userId == undefined || !uuidRegex.test(this.userId)){
            this.#notificationContext.addNotification({ name: "userId", message: "o userId é invalido" })
        }

        if(this.dateOfBlocking != null && dateRegex.test(this.dateOfBlocking) == false){
            this.#notificationContext.addNotification({ name: "dateOfBlocking", message: "a data de block é invalida" })
        }

        if( this.lastClear != null && dateRegex.test(this.lastClear) ==  false){
            this.#notificationContext.addNotification({ name: "lastClear", message: "a data de limpeza é invalida" })
        }

        if(this.memberType != undefined && !memberTypes.includes(this.memberType)){
            this.#notificationContext.addNotification({ name: "memberType", message: "tipo de membro é invalido" })
        }

        return this.#notificationContext.hasNotification()
    }


}