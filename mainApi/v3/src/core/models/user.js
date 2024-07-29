import { EncryptService } from "../../util/encryptService.js";
import { NotificationContext } from "./DomainNotifications/notifications.js";

export class User {

    #notifications = new NotificationContext();

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
    constructor(userName = "", isActive, email, photo, userDescription, userId, lastOnline, languages = null, contactId = null, password = "") {
        this.userName = userName;
        this.isActive = isActive;
        this.email = email;
        this.userDescription = userDescription;
        this.photo = photo;
        this.contactId = contactId;
        this.languages = languages;
        this.lastOnline = lastOnline;
        this.passwordHash = EncryptService.encrypt(password);
        this.userId = userId;
        this.#validatePassword(password);
    }

    getNotifications() {
        return this.#notifications.notificationsData
    }

    #validatePassword(password) {
        const regexPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (password == null || password == undefined || String(password).trim() == "" || !regexPasswordPattern.test(password) ) {
            this.#notifications.addNotification({ name: "password", message:
                `senha invalida, a senha deve conter no minimo: - 8 digitos - 1 carater especial - 1 letra maiuscula - 1 letra minuscula - 1 numero`});
        }
    }

    isValid() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.userName == "") {
            this.#notifications.addNotification({ name: "userName", message: "o nome do usuario esta vazio" });
        }
        if (!regex.test(this.email)) {
            this.#notifications.addNotification({ name: "email", message: "o email é invalido" });
        }
        if (this.languages == null) {
            this.#notifications.addNotification({ name: "lenguages", message: "o idioma a ser escolhido esta vazio" });
        }

        return this.#notifications.hasNotification();
    }
}