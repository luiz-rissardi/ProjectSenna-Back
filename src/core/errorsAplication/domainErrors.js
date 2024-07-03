


export class EmailAlreadyExistsExeption {
    constructor(){
        this.message = "O email ja esta em uso";
        this.name = "EmailAlreadyExistsExeption";
    }

    static create(){
        return new EmailAlreadyExistsExeption()
    }
}
