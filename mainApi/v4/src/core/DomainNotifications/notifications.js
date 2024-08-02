
class Notification {
    constructor(name, message) {
        this.name = name;
        this.message = message
    }
}

export class NotificationContext{
    
    notificationsData = [];


    addNotification(notification){
        this.notificationsData.push(
            new Notification(notification.name,notification.message)
        );
    }

    hasNotification(){
        return this.notificationsData.length == 0;
    }
}