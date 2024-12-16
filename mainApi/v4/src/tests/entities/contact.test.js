import { ContactMother } from "./motherObjects.js";

describe('Contact Entity => Unit test', () => {

    it('Deve criar um Contact válido sem gerar notificações', () => {
        const contact = ContactMother.createValidContact();
        expect(contact.isValid()).toBe(true); // Sem notificações, o contact é válido
        expect(contact.getNotifications()).toHaveLength(0); // Nenhuma notificação gerada
    });

    it('Deve gerar notificação quando o userId for inválido', () => {
        const contact = ContactMother.createContactWithInvalidUserId();
        expect(contact.isValid()).toBe(false); // Deve haver notificação de userId inválido
        expect(contact.getNotifications()[0]).toEqual({
            name: "userId",
            message: "o userId é inválido"
        });
    });

    it('Deve gerar notificação quando o contactId for inválido', () => {
        const contact = ContactMother.createContactWithInvalidContactId();
        expect(contact.isValid()).toBe(false); // Deve haver notificação de contactId inválido
        expect(contact.getNotifications()[0]).toEqual({
            name: "contactId",
            message: "o contactId é inválido"
        });
    });

    it('Deve gerar notificação quando o userId estiver indefinido', () => {
        const contact = ContactMother.createContactWithoutUserId();
        expect(contact.isValid()).toBe(false); // Deve haver notificação de userId indefinido
        expect(contact.getNotifications()[0]).toEqual({
            name: "userId",
            message: "o userId é inválido"
        });
    });

    it('Deve gerar notificação quando o contactId estiver indefinido', () => {
        const contact = ContactMother.createContactWithoutContactId();
        expect(contact.isValid()).toBe(false); // Deve haver notificação de contactId indefinido
        expect(contact.getNotifications()[0]).toEqual({
            name: "contactId",
            message: "o contactId é inválido"
        });
    });
});
