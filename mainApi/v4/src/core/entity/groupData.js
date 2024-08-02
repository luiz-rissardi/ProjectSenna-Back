import { NotificationContext } from "../DomainNotifications/notifications.js";


export class Group {

    #notificationContext = new NotificationContext();

    /**
     * 
     * @param {string} chatId 
     * @param {string} groupName 
     * @param {string} groupDescription 
     * @param {Blob} groupPhoto
     */
    constructor(chatId,groupName,groupDescription,groupPhoto){
        this.chatId = chatId;
        this.groupName = groupName;
        this.groupDescription = groupDescription;
        this.groupPhoto = groupPhoto;
    }

    getNotifications(){
        return this.#notificationContext.notificationsData
    }

    isValid(){
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if(this.chatId == undefined || !uuidRegex.test(this.chatId)){
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é Obrigatorio" })
        }

        if(this.groupName == undefined || this.groupName == ""){
            this.#notificationContext.addNotification({ name: "groupName", message: "preencha o nome do grupo" })
        }

        return this.#notificationContext.hasNotification()
    }
}