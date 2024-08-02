import { NotificationContext } from "../DomainNotifications/notifications.js";

export class ForumData {
    #notificationContext = new NotificationContext();

    /**
     * @param {string} forumTitle 
     * @param {string} forumDescription 
     * @param {string} chatId 
     * @param {boolean} isActive 
     */
    constructor(forumTitle, forumDescription, chatId, isActive) {
        this.forumTitle = forumTitle;
        this.forumDescription = forumDescription;
        this.chatId = chatId;
        this.isActive = isActive;
    }

    getNotifications() {
        return this.#notificationContext.notificationsData
    }

    isValid() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

        if (this.forumTitle.length <= 4 || this.forumTitle == undefined) {
            this.#notificationContext.addNotification({ name: "forumTitle", message: "o nome do forum deve conter no minimo 4 letras " })
        }

        if (this.chatId == undefined || !uuidRegex.test(this.chatId)) {
            this.#notificationContext.addNotification({ name: "chatId", message: "o chatId é Obrigatorio" })
        }

        return this.#notificationContext.hasNotification();
    }
}