import { NotificationContext } from "../DomainNotifications/notifications.js";





export class Contact {
    #notificationContext = new NotificationContext();

    /**
     * 
     * @param {string} userId 
     * @param {string} contactId 
     */
    constructor(userId, contactId) {
        this.userId = userId;
        this.contactId = contactId;
    }

    getNotifications() {
        return this.#notificationContext.notificationsData
    }

    isValid() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if (this.contactId == undefined || !uuidRegex.test(this.contactId)) {
            this.#notificationContext.addNotification({ name: "contactId", message: "o contactId é inválido" })
        }
        if (this.userId == undefined || !uuidRegex.test(this.userId)) {
            this.#notificationContext.addNotification({ name: "userId", message: "o contactId é inválido" })
        }

        

        return this.#notificationContext.hasNotification()
    }
}