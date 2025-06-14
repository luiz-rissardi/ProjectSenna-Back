import { UserService } from "../../core/services/userService.js";
import { Result } from "../../infra/errorHandling/result.js";
import { UserRepositoryMock } from "./mocks/userRepositoryMock.js";

describe("User Service => Unit tests", () => {
    const repositoryStrategy = new UserRepositoryMock();
    const service = new UserService(repositoryStrategy);

    it("Deve criar um usuário com sucesso", async () => {
        const mockFunction = jest.spyOn(repositoryStrategy, 'findByEmail').mockReturnValue(Result.ok(undefined));
        const user = { userName: "Emilio Rodolfo", userDescription: "sou programador sou e engenheiro de software", email: "emilioRufolfoFey@gmail.com", languages: "pt-br", password: "Luiz2006@" }
        const result = await service.createUser(user);

        expect(result.error).toBe(null)
        expect(result.isSuccess).toBe(true)
        expect(result.getValue().isActive).toBe(false)
        expect(result.getValue().userName).toBe(user.userName)
        mockFunction.mockRestore();
    })

    it("Não deve criar usuário com email já existente", async () => {
        const user = { userName: "Emilio Rodolfo", userDescription: "sou programador sou e engenheiro de software", email: "emilioRufolfoFey@gmail.com", arrayBuffer: null, languages: "pt-br", password: "Luiz2006@" }
        const mockFunction = jest.spyOn(repositoryStrategy, 'findByEmail').mockReturnValue(Result.ok(user));
        const result = await service.createUser(user);

        expect(result.error).toEqual({ "message": "O email ja esta em uso", "name": "EmailAlreadyExistsExeption" })
        expect(result.isSuccess).toBe(false)
        expect(result.getValue()).toBe(undefined)
        mockFunction.mockRestore();
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
    })

    it("Deve esperar que um usario bloqueado não seja retornado", async () => {
        const mockObject = jest.spyOn(repositoryStrategy, "findOne").mockReturnValue(Result.ok({
            userName: "Emilio Rodolfo",
            isActive: false,
            photo: "https://www.bbc.com/portuguese/articles/c3gllx470jxo",
            email: "emilioRufolfoFey@gmail.com",
            lastOnline: "2024-07-26 09:13:32",
            languages: "pt-br",
            userDescription: "sou programador sou e engenheiro de software",
            passwordHash: "2d151e2380a90706170127017fcc7869d140eaebfc9bc2a6b33d527ae00f74b915a632052adf294bf8bb659b889105bacd6810a3871113c329fcf72725d84f1a",
            contactId: "0d947109-dd74-4c4a-8ce3-9107544f4be6",
            userId: "5d6432e3-3902-44d1-ae89-ee289e2189aa"
        }))

        const result = await service.findUser({
            email: "any",
            password: "Luiz2006@gmail.com"
        })

        expect(result.error).toEqual({
            message: "seu usuário está bloqueado",
            name: "UserBlockingException",
        })
        expect(result.isSuccess).toBe(false)
        mockObject.mockRestore()
    })

    it("Deve esperar que um usario bloqueado não seja retornado", async () => {
        const mockObject = jest.spyOn(repositoryStrategy, "findOne").mockReturnValue(Result.ok())

        const result = await service.findUser({
            email: "any",
            password: "Luiz2006@gmail.com"
        })

        expect(result.error).toEqual({
            message: 'email de usuario ou senha invalidos',
            name: 'InvalidCredentialsException'
        })
        expect(result.isSuccess).toBe(false)

        mockObject.mockRestore();
    })
})


