


export class UserNameAlreadyExistsExeption {
    constructor(){
        this.message = "O nome ja esta em uso";
        this.name = "UserNameAlreadyExistsExeption";
    }

    static create(){
        return new UserNameAlreadyExistsExeption()
    }
}

export class EmailAlreadyExistsExeption {
    constructor(){
        this.message = "O email ja esta em uso";
        this.name = "EmailAlreadyExistsExeption";
    }

    static create(){
        return new EmailAlreadyExistsExeption()
    }
}
