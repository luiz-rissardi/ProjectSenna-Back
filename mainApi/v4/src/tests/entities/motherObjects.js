import { User } from "../../core/entity/user.js";
import { Message } from "../../core/entity/message.js";
import { ChatData } from "../../core/entity/chatData.js";
import { Contact } from "../../core/entity/contact.js";
import { Chat } from "../../core/entity/chat.js";
import { randomUUID as v4 } from "crypto";


export class ContactMother {
    static createValidContact() {
        return new Contact(v4(), v4());
    }

    static createContactWithInvalidUserId() {
        return new Contact("invalid-id", v4());
    }

    static createContactWithInvalidContactId() {
        return new Contact(v4(), "invalid-id");
    }

    static createContactWithoutUserId() {
        return new Contact(undefined, v4());
    }

    static createContactWithoutContactId() {
        return new Contact(v4(), undefined);
    }
}


export class ChatMother {

    static createValidChat() {
        return new Chat(v4(), "conversation");
    }

    static createChatWithInvalidChatId() {
        return new Chat("invalid-id", "conversation");
    }

    static createChatWithInvalidChatType() {
        return new Chat(v4(), "invalid-type");
    }

    static createChatWithoutChatId() {
        return new Chat(undefined, "conversation");
    }
}


export class UserMother {

    static createDefaultUser() {
        return new User("luiz", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "Luiz2006@");
    }

    static createUserWithInvalidEmail() {
        return new User("luiz", true, "emailinvalido.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "Luiz2006@");
    }

    static createUserWithInvalidPassword() {
        return new User("luiz", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "123");
    }

    static createUserWithEmptyName() {
        return new User("", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", "pt-br", v4(), "Luiz2006@");
    }

    static createUserWithEmptyLanguage() {
        return new User("luiz", true, "luiz@gmail.com", null, "sou um usuario", v4(), "2024-09-07 10:00:00", null, v4(), "Luiz2006@");
    }
}

export class ChatDataMother {

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
        return new ChatData(v4(), v4(), "2024-09-07 10:00:00", true, "member", "94894");
    }

    static createChatWithInvalidLastClear() {
        return new ChatData(v4(), v4(), "202:s09227 10:00:s", true, "member", null);
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
        return new Message("A".repeat(1001), "2024-07-09 02:28:16", v4(), v4(), v4(), "pt-br", "text", "unread");
    }

    static createMessageWithInvalidDate() {
        return new Message("Mensagem válida", "2024-15-99 25:61:61", v4(), v4(), v4(), "pt-br", "text", "unread");
    }

    static createMessageWithInvalidType() {
        return new Message("Mensagem válida", "2024-07-09 02:28:16", v4(), v4(), v4(), "pt-br", "invalidType", "unread");
    }

    static createMessageWithInvalidStatus() {
        return new Message("Mensagem válida", "2024-07-09 02:28:16", v4(), v4(), v4(), "pt-br", "text", "invalidStatus");
    }
}
