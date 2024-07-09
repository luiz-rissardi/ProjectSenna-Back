


// app error
export class UnexpectedError {
    constructor(message) {
        this.message = message;
        this.name = "UnexpectedError"
    }

    static create(message) {
        return new UnexpectedError(message);
    }
}

export class ExternalServiceError {
    constructor() {
        this.message = "External service error"
        this.message = "ExternalServiceError"
    }

    static create() {
        return new ExternalServiceError()
    }
}

// infra error
export class ConnectioDataBaseError {
    constructor() {
        this.message = "Um erro de Conexão com banco de dados ocorreu";
        this.name = "ConnectioDataBaseError";
    }

    static create() {
        return new ConnectioDataBaseError();
    }
}

export class RepositoryOperationError {
    constructor() {
        this.message = `Um erro ocorreu ao realizar a operação`;
        this.name = "RepositoryOperationError";
    }

    static create() {
        return new RepositoryOperationError();
    }
}

// service errors
export class InvalidCredentialsException {
    constructor() {
        this.message = "nome de usuario ou senha invalidos";
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