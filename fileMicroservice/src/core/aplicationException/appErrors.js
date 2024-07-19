


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
