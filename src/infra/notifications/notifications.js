


export class Notifications{
    
    notificationsData = [];

    addNotification(notification){
        this.notificationsData.push(notification);
    }

    hasNotification(){
        return this.notificationsData.length == 0;
    }
}