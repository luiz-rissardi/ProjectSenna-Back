import { Result } from "../../../infra/errorHandling/result.js";

export class ContactRepositoryMock {

    insertOne(){
        return Result.ok();
    }

    deleteOne(){
        return Result.ok();
    }
}