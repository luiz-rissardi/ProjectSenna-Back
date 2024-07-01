


export class User{
    constructor(userName,isActive,email,photo,userDescription,contactId,userId,lastOnline,languages,passwordHash = null){
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
}