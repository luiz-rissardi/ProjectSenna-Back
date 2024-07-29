import { NotificationContext } from "./DomainNotifications/notifications.js";

export class MessageFile {

    #notifications = new NotificationContext();

    /**
     * @param {string} messageId 
     * @param { Blob } data 
     * @param {string} fileName 
     */
    constructor(messageId,data,fileName){
        this.messageId = messageId;
        this.fileName = fileName;
        this.data = data;
    }

    getNotifications(){
        return this.#notifications.notificationsData
    }

    isValid(){
        if(this.fileName == undefined || String(this.fileName).trim() == ""){
            this.#notifications.addNotification({ name: "fileName", message: "o nome do arquivo é obrigatorio" })
        }

        return this.#notifications.hasNotification();
    }
}