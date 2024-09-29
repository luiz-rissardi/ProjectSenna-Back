import { Result } from "../../../infra/errorHandling/result.js";

export class ChatDataRepositoryMock {
    #data = [
        {
            memberType: "user",
            lastClear: "2024-09-01",
            isActive: true,
            userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa",
            chatId: "chat1",
            dateOfBlocking: null,
        },
        {
            memberType: "admin",
            lastClear: "2024-09-05",
            isActive: true,
            userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa",
            chatId: "chat2",
            dateOfBlocking: null,
        }
    ];

    constructor() {}

    async insertOne(chatData) {
        return Result.ok(chatData);
    }

    async patchOne(chatData) {
        return Result.ok(chatData);
    }

    async findMany(userId) {
        return Result.ok(this.#data);
    }
}
