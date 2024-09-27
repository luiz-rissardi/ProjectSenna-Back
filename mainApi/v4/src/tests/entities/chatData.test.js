import { ChatMother } from "./motherObjects.js";

describe('ChatData Entity => Unit test', () => {

    it('Deve esperar que um chat seja criado com dados corretos', () => {
        const chat = ChatMother.createDefaultChat();
        console.log(chat.isValid());
        console.log(chat.getNotifications());
        expect(chat.isValid()).toBe(true); // Sem notificações, o chat é válido
        expect(chat.getNotifications().length).toBe(0);
    });

    // it('Deve esperar que um chat seja criado com chatId inválido', () => {
    //     const chat = ChatMother.createChatWithInvalidChatId();
    //     expect(chat.isValid()).toBe(false); // Deve haver notificação
    //     expect(chat.getNotifications()).toContainEqual({ name: "chatId", message: "o chatId é invalido" });
    // });

    // it('Deve esperar que um chat seja criado com userId inválido', () => {
    //     const chat = ChatMother.createChatWithInvalidUserId();
    //     expect(chat.isValid()).toBe(false); // Deve haver notificação
    //     expect(chat.getNotifications()).toContainEqual({ name: "userId", message: "o userId é invalido" });
    // });

    // it('Deve esperar que um chat seja criado com dateOfBlocking inválido', () => {
    //     const chat = ChatMother.createChatWithInvalidDateOfBlocking();
    //     expect(chat.isValid()).toBe(false); // Deve haver notificação
    //     expect(chat.getNotifications()).toContainEqual({ name: "dateOfBlocking", message: "a data de block é invalida" });
    // });

    // it('Deve esperar que um chat seja criado com lastClear inválido', () => {
    //     const chat = ChatMother.createChatWithInvalidLastClear();
    //     expect(chat.isValid()).toBe(false); // Deve haver notificação
    //     expect(chat.getNotifications()).toContainEqual({ name: "lastClear", message: "a data de limpeza é invalida" });
    // });

    // it('Deve esperar que um chat seja criado com memberType inválido', () => {
    //     const chat = ChatMother.createChatWithInvalidMemberType();
    //     expect(chat.isValid()).toBe(false); // Deve haver notificação
    //     expect(chat.getNotifications()).toContainEqual({ name: "memberType", message: "tipo de membro é invalido" });
    // });
});
