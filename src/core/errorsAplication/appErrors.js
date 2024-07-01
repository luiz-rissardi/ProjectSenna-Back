


export class UnexpectedError {
    constructor(message) {
        this.message = message;
        this.name = "UnexpectedError"
    }

    static create(message){
        return new UnexpectedError(message);
    }
}

export class ConnectioDataBaseError {
    constructor() {
        this.message = "Um erro de Conexão com banco de dados ocorreu!";
        this.name = "ConnectioDataBaseError";
    }

    static create(){
        return new ConnectioDataBaseError();
    }
}

export class RepositoryOperationError {
    constructor(operation,repository){
        this.message = `Um erro ao realizar a operação [${operation}] do repositorio [${repository}] `;
        this.name = "RepositoryOperationError";
    }

    static create(operation,repository){
        return new RepositoryOperationError(operation,repository);
    }
}