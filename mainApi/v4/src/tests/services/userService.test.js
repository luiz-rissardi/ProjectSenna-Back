import { UserService } from "../../core/services/userService.js";
import { Result } from "../../infra/errorHandling/result.js";
import { UserRepositoryMock } from "./mocks/userRepositoryMock.js";

describe("User Service => Unit tests", () => {
    const repositoryStrategy = new UserRepositoryMock();
    const service = new UserService(repositoryStrategy);

    it("Deve criar um usuário com sucesso", async () => {
        const mockFunction = jest.spyOn(repositoryStrategy, 'findByEmail').mockReturnValue(Result.ok(undefined));
        const user = { userName: "Emilio Rodolfo", userDescription: "sou programador sou e engenheiro de software", email: "emilioRufolfoFey@gmail.com", arrayBuffer: null, languages: "pt-br", password: "Luiz2006@" }
        const result = await service.createUser(user);

        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue().userName).toBe(user.userName)
        mockFunction.mockRestore();
    })

    it("Não deve criar usuário com email já existente", async () => {
        const user = { userName: "Emilio Rodolfo", userDescription: "sou programador sou e engenheiro de software", email: "emilioRufolfoFey@gmail.com", arrayBuffer: null, languages: "pt-br", password: "Luiz2006@" }
        const result = await service.createUser(user);

        expect(result.error).toEqual({"message": "O email ja esta em uso", "name": "EmailAlreadyExistsExeption"})
        expect(result.isSuccess).toBe(false)
        expect(result.getValue()).toBe(undefined)
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

    it("Deve pegar o usuário com sucesso", async () => {

        const result = await service.findUser({ email: "any@gmail.com", password: "Luiz2006@" });

        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual({
            userName: "Emilio Rodolfo",
            isActive: true,
            photo: "https://www.bbc.com/portuguese/articles/c3gllx470jxo",
            email: "emilioRufolfoFey@gmail.com",
            lastOnline: "2024-07-26 09:13:32",
            languages: "pt-br",
            userDescription: "sou programador sou e engenheiro de software",
            contactId: "0d947109-dd74-4c4a-8ce3-9107544f4be6",
            userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa"
        })
    })

    it("Deve atualizar o usuário com sucesso", async () => {

        const user = {
            userName: "Emilio Rodolfo",
            isActive: true,
            photo: "https://www.bbc.com/portuguese/articles/c3gllx470jxo",
            email: "emilioRufolfoFey@gmail.com",
            lastOnline: "2024-07-26 09:13:32",
            languages: "pt-br",
            userDescription: "sou programador sou e engenheiro de software",
            password: "Luiz2006@",
            userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa"
        }

        const result = await service.updateUser(user);

        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue()).toEqual({
            userName: "Emilio Rodolfo",
            isActive: true,
            photo: "https://www.bbc.com/portuguese/articles/c3gllx470jxo",
            email: "emilioRufolfoFey@gmail.com",
            lastOnline: "2024-07-26 09:13:32",
            languages: "pt-br",
            userDescription: "sou programador sou e engenheiro de software",
            contactId: null,
            userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa"
        })
    })


})