


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


// service errors
export class InvalidCredentialsException {
    constructor() {
        this.message = "email de usuario ou senha invalidos";
        this.name = "InvalidCredentialsException";
    }

    static create() {
        return new InvalidCredentialsException();
    }
}



export class UserNotFoundException {
    constructor() {
        this.message = "nenhum usuario não encontrado";
        this.name = "UserNotFoundException"
    }

    static create() {
        return new UserNotFoundException();
    }
}

export class ChatNotFoundException {
    constructor() {
        this.message = "conversa ou grupo não encontrado";
        this.name = "ChatNotFoundException"
    }

    static create() {
        return new ChatNotFoundException();
    }
}



