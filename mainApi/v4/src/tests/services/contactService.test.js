import { ContactService } from "../../core/services/contactsService.js";
import { ContactRepositoryMock } from "./mocks/contactRepositoryMock.js";
import { randomUUID as v4 } from "crypto"

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Contact Service => unit Tests", () => {
    const contactStrategy = new ContactRepositoryMock();
    const service = new ContactService(contactStrategy);

    it("Deve adicionar um contato com sucesso", async () => {
        v4.mockReturnValue('95171413-c9f0-42f9-9a83-81913a4c4dfc');
        const contact = { userId: v4(), cotactId: v4() }
        const result = await service.createContact(contact);
        console.log(result.getValue());
        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual({
            userId: '95171413-c9f0-42f9-9a83-81913a4c4dfc',
            contactId: '95171413-c9f0-42f9-9a83-81913a4c4dfc'
        })
    })

    it("Deve remover um contato com sucesso", async () => {
        const result = await service.removeContact({ userId: v4(), cotactId: v4() });
        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
    })
})