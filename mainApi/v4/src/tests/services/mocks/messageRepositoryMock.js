import { Result } from "../../../infra/errorHandling/result.js";


export class MessageRepositoryMock {
    async patchMany(messagesId = []) {
        return Result.ok();
    }

    /**
     * @param {Message} message 
     */
    async insertOne(message) {
        return Result.ok(message);
    }

    async patchOne(messageId, dateSender, message, originLanguage) {
        return Result.ok(message);
    }

    async deleteOne(messageId) {
        return Result.ok();
    }

    async findMany(chatId, skipMessage) {
        return Result.ok([
            {
                "messageId": "083c2f66-4d04-4b00-bafd-e2ade81de30c",
                "userName": "luiz",
                "dateMessage": "2024-07-17T15:58:07.000Z",
                "messageType": "text",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "as vezes eu gosto de fazer bastante coisa muito massa sabe e gosto de me divertir muito sabe, gosto de ouvir musicas do iron mainden tb",
                "status": "read",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "20fa54f7-85ba-4ab7-ba37-d6a8c1be0dae",
                "userName": "luiz",
                "dateMessage": "2024-07-15T16:11:01.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "3e90bb9d-a668-4ca0-a35b-3ccd02d9ee40",
                "userName": "luiz",
                "dateMessage": "2024-07-15T16:26:38.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "528bf5d7-e642-480e-821b-83f10b8d2092",
                "userName": "luiz",
                "dateMessage": "2024-07-15T16:03:30.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "670db068-6eec-424d-8e71-47ea13bb5fc5",
                "userName": "luiz",
                "dateMessage": "2024-07-15T16:12:00.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "6c7bf14d-eef6-442a-acaf-a2eb50e8eef0",
                "userName": "luiz",
                "dateMessage": "2024-07-15T15:25:13.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "98de7c7c-65ec-4e7d-b048-1ece4fb88ce5",
                "userName": "luiz",
                "dateMessage": "2024-07-15T16:01:33.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "b702e96b-b972-448f-88a5-a4ef81a5730d",
                "userName": "luiz",
                "dateMessage": "2024-07-15T15:22:02.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            },
            {
                "messageId": "cbf6aa69-8e14-40cc-87c3-8b24cd7e0508",
                "userName": "luiz",
                "dateMessage": "2024-07-15T16:26:52.000Z",
                "messageType": "image",
                "originLanguage": "pt-br",
                "chatId": "95171413-c9f0-42f9-9a83-81913a4c4dfc",
                "message": "ola a todos aqui sou eu de novo ola mundo",
                "status": "unread",
                "userId": "2fc0b1a3-37be-4dd4-aed7-bcad3e89dbb2"
            }
        ]);
    }

}