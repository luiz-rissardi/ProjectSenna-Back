import { ChatDataMother } from "./motherObjects.js";

describe('ChatData Entity => Unit test', () => {

    it('Deve esperar que um chat seja criado com dados corretos', () => {
        const chat = ChatDataMother.createDefaultChat();
        expect(chat.isValid()).toBe(true); // Sem notificações, o chat é válido
        expect(chat.getNotifications().length).toBe(0);
    });

    it('Deve esperar que um chat seja criado com chatId inválido', () => {
        const chat = ChatDataMother.createChatWithInvalidChatId();
        expect(chat.isValid()).toBe(false); // Deve haver notificação
        expect(chat.getNotifications()[0]).toEqual({ name: "chatId", message: "o chatId é invalido" });
    });

    it('Deve esperar que um chat seja criado com userId inválido', () => {
        const chat = ChatDataMother.createChatWithInvalidUserId();
        expect(chat.isValid()).toBe(false); // Deve haver notificação
        expect(chat.getNotifications()[0]).toEqual({ name: "userId", message: "o userId é invalido" });
    });

    it('Deve esperar que um chat seja criado com dateOfBlocking inválido', () => {
        const chat = ChatDataMother.createChatWithInvalidDateOfBlocking();
        expect(chat.isValid()).toBe(false); // Deve haver notificação
        expect(chat.getNotifications()[0]).toEqual({ name: "dateOfBlocking", message: "a data de block é invalida" });
    });

    it('Deve esperar que um chat seja criado com lastClear inválido', () => {
        const chat = ChatDataMother.createChatWithInvalidLastClear();
        expect(chat.isValid()).toBe(false); // Deve haver notificação
        expect(chat.getNotifications()[0]).toEqual({ name: "lastClear", message: "a data de limpeza é invalida" });
    });

    it('Deve esperar que um chat seja criado com memberType inválido', () => {
        const chat = ChatDataMother.createChatWithInvalidMemberType();
        expect(chat.isValid()).toBe(false); // Deve haver notificação
        expect(chat.getNotifications()[0]).toEqual({ name: "memberType", message: "tipo de membro é invalido" });
    });
});
