import { Result } from "../../infra/errorHandling/result.js";
import { GroupRepositoryMock } from "./mocks/groupRepositoryMock.js";
import { GroupService } from "../../core/services/groupService.js";
import { randomUUID as v4 } from "crypto"

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Group Service => unit tests", () => {
    const groupStrategy = new GroupRepositoryMock();
    const service = new GroupService(groupStrategy);



    it("Deve criar um grupo novo com sucesso", async () => {
        v4.mockReturnValue('95171413-c9f0-42f9-9a83-81913a4c4dfc');
        const groupData = {
            arrayBuffer: null,
            groupName: 'grupo zoeira',
            groupDescription: "um grupo aberto a atodos",
        }
        const result = await service.createGroup(groupData);
        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual({
            groupPhoto: null,
            groupName: 'grupo zoeira',
            groupDescription: "um grupo aberto a atodos",
            chatId: "95171413-c9f0-42f9-9a83-81913a4c4dfc",
            chatType: "group"
        })
    })

    it("Deve esperar que o grupo atualize com sucesso", async () => {
        v4.mockReturnValue('95171413-c9f0-42f9-9a83-81913a4c4dfc');
        const groupData = {
            groupPhoto: null,
            groupName: 'grupo zoeira',
            chatId:v4(),
            groupDescription: "um grupo aberto a atodos",
        }
        const result = await service.updateGroup(groupData);
        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual({
            groupPhoto: null,
            groupName: 'grupo zoeira',
            groupDescription: "um grupo aberto a atodos",
            chatId: "95171413-c9f0-42f9-9a83-81913a4c4dfc",
            chatType: "group"
        })
    })

    it("Deve retornar um erro caso o chatId não exista", async () => {
        v4.mockReturnValue('95171413-c9f0-42f9-9a83-81913a4c4dfc');
        const mockObject = jest.spyOn(groupStrategy, "findOne").mockReturnValue(Result.ok([]))
        const groupData = {
            groupPhoto: null,
            groupName: 'grupo zoeira',
            chatId:v4(),
            groupDescription: "um grupo aberto a atodos",
        }
        const result = await service.updateGroup(groupData);
        expect(result.error).toEqual({
            message:"conversa ou grupo não encontrado",name:"ChatNotFoundException"
        })
        expect(result.isSuccess).toBe(false)
        mockObject.mockRestore();
    })
})