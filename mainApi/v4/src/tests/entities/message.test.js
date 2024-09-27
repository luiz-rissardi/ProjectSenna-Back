import { MessageMother } from "./motherObjects.js";

describe('Message Entity => Unit test', () => {

    it('Mensagem válida não deve gerar notificações', () => {
        const message = MessageMother.createValidMessage();
        expect(message.isValid()).toBe(true); // Nenhuma notificação, então isValid deve ser false.
        expect(message.getNotifications()).toHaveLength(0); // Verifica que não há notificações.
    });

    it('Mensagem com texto muito longo deve gerar notificação de tamanho', () => {
        const message = MessageMother.createMessageWithLongText();
        expect(message.isValid()).toBe(false); // Deve ser false porque haverá notificações.
        expect(message.getNotifications()[0]).toEqual({
            name: "message",
            message: "limite do tamanho da mensagem atingido"
        });
    });

    it('Mensagem com data inválida deve gerar notificação de data', () => {
        const message = MessageMother.createMessageWithInvalidDate();
        expect(message.isValid()).toBe(false); // Deve ser false por causa da notificação de data inválida.
        expect(message.getNotifications()[0]).toEqual({
            name: "dateSender",
            message: "a data de envio é invalida"
        });
    });

    it('Mensagem com tipo de mensagem inválido deve gerar notificação de tipo', () => {
        const message = MessageMother.createMessageWithInvalidType();
        expect(message.isValid()).toBe(false); // Deve ser false porque o tipo de mensagem é inválido.
        expect(message.getNotifications()[0]).toEqual({
            name: "messageType",
            message: "o tipo da mensagem é invalido"
        });
    });

    it('Mensagem com status inválido deve gerar notificação de status', () => {
        const message = MessageMother.createMessageWithInvalidStatus();
        expect(message.isValid()).toBe(false); // Deve ser false porque o status é inválido.
        expect(message.getNotifications()[0]).toEqual({
            name: "status",
            message: "o status da mensagem é invalido"
        });
    });
});
