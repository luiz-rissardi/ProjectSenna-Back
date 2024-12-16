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
        const contact = { userId: v4(), contactId: v4() }
        const result = await service.createContact(contact);
        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual({
            userId: '95171413-c9f0-42f9-9a83-81913a4c4dfc',
            contactId: '95171413-c9f0-42f9-9a83-81913a4c4dfc'
        })
    })

    it("Deve remover um contato com sucesso", async () => {
        const result = await service.removeContact({ userId: "bd2e9856-1dfe-4f91-aa12-2357520a9618", contactId:"bd2e9856-1dfe-4f91-aa12-2357520a9618" });
            expect(result.error).toBe(null)
            expect(result.isSuccess).toBe(true)
    })

    it("Deve pegar os contatos do usuário com sucesso", async () => {

        const result = await service.findContactsOfUser({ contactId: "any" });

        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual([{
            "userName": "roberto",
            "photo": null,
            "userId": "55ce460f-9e24-4cec-8aaf-4c79e499bef0"
        },
        {
            "userName": "antonio",
            "photo": null,
            "userId": "ac9549fe-4f12-4a8c-9849-f7a8b192a246"
        }])
    })
})