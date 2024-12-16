import { Result } from "../../../infra/errorHandling/result.js";

export class ContactRepositoryMock {

    #contacts = [{
        "userName": "roberto",
        "photo": null,
        "userId": "55ce460f-9e24-4cec-8aaf-4c79e499bef0"
    },
    {
        "userName": "antonio",
        "photo": null,
        "userId": "ac9549fe-4f12-4a8c-9849-f7a8b192a246"
    }]

    insertOne(){
        return Result.ok();
    }

    deleteOne(){
        return Result.ok();
    }

    async findManyByContactId(contactId) {
        return Result.ok(this.#contacts);
    }
}