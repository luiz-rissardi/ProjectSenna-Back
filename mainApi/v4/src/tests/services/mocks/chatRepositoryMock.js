import { Result } from "../../../infra/errorHandling/result.js";

export class ChatRepositoryMock {
    #data = [
        { chatId: "chat1", chatType: "private" },
        { chatId: "chat2", chatType: "group" },
    ];

    constructor() {}

    async insertOne(chat) {
        // Simula a inserção do chat retornando o objeto inserido
        return Result.ok(chat);
    }
}
