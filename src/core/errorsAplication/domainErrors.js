


export class EmailAlreadyExistsExeption {
    constructor(){
        this.message = "O email ja esta em uso";
        this.name = "EmailAlreadyExistsExeption";
    }

    static create(){
        return new EmailAlreadyExistsExeption()
    }
}

export class UserBlockingException {
    constructor() {
        this.message = "seu usuário está bloqueado";
        this.name = "UserBlockingException"
    }

    static create() {
        return new UserBlockingException();
    }
}

