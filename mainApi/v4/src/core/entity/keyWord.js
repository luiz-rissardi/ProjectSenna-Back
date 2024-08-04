
import { NotificationContext } from "../DomainNotifications/notifications.js";

export class KeyWord {
    #notificationContext = new NotificationContext();

    /**
     * @param {string} chatId 
     * @param {string} keyWord 
     */
    constructor(chatId, keyWord) {
        this.chatId = chatId;
        this.keyWord = keyWord;
    }

    getNotifications() {
        return this.#notificationContext.notificationsData
    }

    isValid() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

        if (this.keyWord == undefined) {
            this.#notificationContext.addNotification({ name: "keyWord", message: "a palavra chave não pode estar vazio" })
        }

        if (this.chatId == undefined || !uuidRegex.test(this.chatId)) {
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é invalido" })
        }

        return this.#notificationContext.hasNotification();
    }
}