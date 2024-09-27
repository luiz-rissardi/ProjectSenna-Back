import { UserMother } from "./motherObjects.js";


describe("User Entity => Unit test", () => {

    it("Deve esperar que um usuário seja criado com dados corretos", () => {
        const model = UserMother.createDefaultUser();
        const validate = model.isValid();
        expect(validate).toBe(true)
    })

    it("Deve esperar que um usuário seja criado com o email incorreto", () => {
        const model = UserMother.createUserWithInvalidEmail();
        const validate = model.isValid();
        expect(validate).toBe(false);
        expect(model.getNotifications()[0]).toEqual({ name: "email", message: "o email é invalido" });

    })

    it("Deve esperar que um usuário seja criado com a senha invalida", () => {
        const model = UserMother.createUserWithInvalidPassword();
        const validate = model.isValid();
        expect(validate).toBe(false);
        expect(model.getNotifications()[0]).toEqual({
            name: "password", message:
                `senha invalida, a senha deve conter no minimo: - 8 digitos - 1 carater especial - 1 letra maiuscula - 1 letra minuscula - 1 numero`
        });
    })

    it("Deve esperar que um usuário seja criado com o nome vazio", () => {
        const model = UserMother.createUserWithEmptyName();
        const validate = model.isValid();
        expect(validate).toBe(false);
        expect(model.getNotifications()[0]).toEqual({ name: "userName", message: "o nome do usuario esta vazio" });
    })

    it("Deve esperar que um usuário seja criado com o idioma vazio", () => {
        const model = UserMother.createUserWithEmptyLanguage();
        const validate = model.isValid();
        expect(validate).toBe(false);
        expect(model.getNotifications()[0]).toEqual({ name: "lenguages", message: "o idioma a ser escolhido esta vazio" });
    })

})