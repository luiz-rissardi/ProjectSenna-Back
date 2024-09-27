import { ChatMother } from "./motherObjects.js";

describe('Chat Entity => Unit test', () => {

    it('Deve criar um Chat válido sem gerar notificações', () => {
        const chat = ChatMother.createValidChat();
        expect(chat.isValid()).toBe(true); // Sem notificações, o chat é válido
        expect(chat.getNotifications()).toHaveLength(0); // Nenhuma notificação gerada
    });

    it('Deve gerar notificação quando o chatId for inválido', () => {
        const chat = ChatMother.createChatWithInvalidChatId();
        expect(chat.isValid()).toBe(false); // Deve haver notificação de ID inválido
        expect(chat.getNotifications()[0]).toEqual({
            name: "chatId",
            message: "o chatId é iválido"
        });
    });

    it('Deve gerar notificação quando o chatType for inválido', () => {
        const chat = ChatMother.createChatWithInvalidChatType();
        expect(chat.isValid()).toBe(false); // Deve haver notificação de tipo de chat inválido
        expect(chat.getNotifications()[0]).toEqual({
            name: "chatType",
            message: "tipo de chat invalido"
        });
    });

    it('Deve gerar notificação quando o chatId estiver indefinido', () => {
        const chat = ChatMother.createChatWithoutChatId();
        expect(chat.isValid()).toBe(false); // Deve haver notificação de ID indefinido
        expect(chat.getNotifications()[0]).toEqual({
            name: "chatId",
            message: "o chatId é iválido"
        });
    });

});
