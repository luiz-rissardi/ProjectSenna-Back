import { Result } from "../../../infra/errorHandling/result.js";

export class UserRepositoryMock {

    #data = {
        userName: "Emilio Rodolfo",
        isActive: true,
        photo: "https://www.bbc.com/portuguese/articles/c3gllx470jxo",
        email: "emilioRufolfoFey@gmail.com",
        lastOnline: "2024-07-26 09:13:32",
        languages: "pt-br",
        userDescription: "sou programador sou e engenheiro de software",
        passwordHash: "2d151e2380a90706170127017fcc7869d140eaebfc9bc2a6b33d527ae00f74b915a632052adf294bf8bb659b889105bacd6810a3871113c329fcf72725d84f1a",
        contactId: "0d947109-dd74-4c4a-8ce3-9107544f4be6",
        userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa"
    }

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

    constructor() {
    }

    async findOne(email, passwordHash) {
        return Result.ok(this.#data);
    }

    async insertOne(user) {
        return Result.ok(user);
    }

    async patchOne(user) {
        return Result.ok(user);
    }

    async findMany(contactId) {
        return Result.ok(this.#contacts);
    }

    async findByEmail(email){
        return Result.ok(this.#data)
    }

}