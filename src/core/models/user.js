import { Notifications } from "../../infra/notifications/notifications.js";

export class User {

    #notifications = new Notifications();
    
    /**
     * @param {string} userName 
     * @param {boolean} isActive 
     * @param {string} email 
     * @param {string} photo 
     * @param {string} userDescription 
     * @param {string} userId 
     * @param {Date} lastOnline 
     * @param {string} languages 
     * @param {string} contactId 
     * @param {string} passwordHash 
     */
    constructor(userName, isActive, email, photo, userDescription, userId, lastOnline, languages, contactId = null, passwordHash = null) {
        this.userName = userName;
        this.isActive = isActive;
        this.email = email;
        this.userDescription = userDescription;
        this.photo = photo;
        this.contactId = contactId;
        this.userId = userId;
        this.languages = languages;
        this.lastOnline = lastOnline;
        this.passwordHash = passwordHash;
    }

    getNotifications(){
        return this.#notifications.notificationsData
    }

    isValid() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.userName.trim() == "") {
            this.#notifications.addNotification({ name: "userName", message: "o nome do usuario esta vazio" });
        }
        if (!regex.test(this.email)) {
            this.#notifications.addNotification({ name: "email", message: "o email é invalido" });
        }
        if (this.languages.trim() == "") {
            this.#notifications.addNotification({ name: "lenguages", message: "o idioma a ser escolhido esta vazio" });
        }

        return this.#notifications.hasNotification();
    }
}