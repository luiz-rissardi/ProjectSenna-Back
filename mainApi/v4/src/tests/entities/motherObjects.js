import { User } from "../../core/entity/user.js";
import { ChatData } from "../../core/entity/chatData.js";
import { Message } from "../../core/entity/message.js";
import { randomUUID as v4 } from "crypto";

export class UserMother {

    static createDefaultUser() {
        return new User("luiz", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "Luiz2006@");
    }

    static createUserWithInvalidEmail() {
        return new User("luiz", true, "emailinvalido.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "Luiz2006@");
    }

    static createUserWithInvalidPassword() {
        return new User("luiz", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "123"); // Senha inválida/fraca
    }

    static createUserWithEmptyName() {
        return new User("", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "Luiz2006@");
    }

    static createUserWithEmptyLanguage() {
        return new User("luiz", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00",null, v4(), "Luiz2006@");
    }
}

export class ChatMother {

    static createDefaultChat() {
        return new ChatData(v4(), v4(), "2024-09-07 10:00:00", true, "member", null);
    }

    static createChatWithInvalidChatId() {
        return new ChatData("invalid-chat-id", v4(), "2024-09-07 10:00:00", true, "member", null);
    }

    static createChatWithInvalidUserId() {
        return new ChatData(v4(), "invalid-user-id", "2024-09-07 10:00:00", true, "member", null);
    }

    static createChatWithInvalidDateOfBlocking() {
        return new ChatData(v4(), v4(), "2024-09-07 10:00:00", true, "member", "2024-0900:00"); // Data inválida
    }

    static createChatWithInvalidLastClear() {
        return new ChatData(v4(), v4(), "20 1:00dw3232", true, "member", null); // Data inválida
    }

    static createChatWithInvalidMemberType() {
        return new ChatData(v4(), v4(), "2024-09-07 10:00:00", true, "invalid-member-type", null);
    }
}


export class MessageMother {

    static createValidMessage() {
        return new Message("Olá, esta é uma mensagem de teste!", "2024-07-09 02:28:16", v4(), v4(), v4(), "pt-br", "text", "unread");
    }

    static createMessageWithLongText() {
        return new Message("A".repeat(1001), "2024-07-09 02:28:16",v4(), v4(),v4(), "pt-br", "text", "unread");
    }

    static createMessageWithInvalidDate() {
        return new Message("Mensagem válida", "2024-15-99 25:61:61", v4(), v4(),v4(), "pt-br", "text", "unread");
    }

    static createMessageWithInvalidType() {
        return new Message("Mensagem válida", "2024-07-09 02:28:16", v4(), v4(),v4(), "pt-br", "invalidType", "unread");
    }

    static createMessageWithInvalidStatus() {
        return new Message("Mensagem válida", "2024-07-09 02:28:16", v4(), v4(),v4(), "pt-br", "text", "invalidStatus");
    }
}
