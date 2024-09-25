import { NotificationContext } from "../DomainNotifications/notifications.js";
import { Chat } from "./chat.js";

export class Group extends Chat{


    /**
     * 
     * @param {string} chatId 
     * @param {string} groupName 
     * @param {string} groupDescription 
     * @param {Blob} groupPhoto
     */
    constructor(chatId,groupName,groupDescription,groupPhoto){
        super(chatId,"group")
        this.groupName = groupName;
        this.groupDescription = groupDescription;
        this.groupPhoto = groupPhoto;
    }
}