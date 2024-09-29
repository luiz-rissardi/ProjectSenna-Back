import { ChatService } from "../../core/services/chatService.js";
import { ChatDataRepositoryMock } from "./mocks/chatDataRepositoryMock.js"; // Ajuste o caminho conforme necessário
import { ChatRepositoryMock } from "./mocks/chatRepositoryMock.js";
import { randomUUID as v4 } from "crypto"

describe("Chat Data Service => Unit tests", () => {
    const chatDataStrategy = new ChatDataRepositoryMock();
    const chatStrategy = new ChatRepositoryMock()
    const service = new ChatService(chatDataStrategy, chatStrategy); // Substitua pelo nome correto do seu serviço

    it("Deve criar um chat com sucesso", async () => {
        const result = await service.createChat(); // Substitua pelo nome correto do método no seu serviço
        expect(result.error).toBe(null);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().chatType).toBe("conversation");
    });

    it("Deve retornar os chats de um usuário", async () => {
        const result = await service.getChats({ userId: "userId" }); // Substitua pelo nome correto do método no seu serviço
        expect(result.error).toBe(null);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().length).toBeGreaterThan(0);
    });

    it("Deve retornar o chat bloqueado", async () => {
        const result = await service.changeStateOfChat({ userId: v4(), chatId: v4(), isActive: false }); // Substitua pelo nome correto do método no seu serviço
        
        expect(result.error).toBe(null);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().isActive).toBe(false);
        expect(
            /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(
                result.getValue().dateOfBlocking)
        ).toBe(true);
    });

    it("Deve retornar o chat desbloqueado", async () => {
        const result = await service.changeStateOfChat({ userId: v4(), chatId: v4(), isActive: true }); // Substitua pelo nome correto do método no seu serviço
        
        expect(result.error).toBe(null);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().isActive).toBe(true);
        expect(result.getValue().dateOfBlocking).toBe(null);
    });

    it("Deve atualizar a ultima data de limpeza de mensagens", async () => {
        const result = await service.clearMessages({ chatId: v4(), userId: v4() }); // Substitua pelo nome correto do método no seu serviço

        expect(result.error).toBe(null);
        expect(result.isSuccess).toBe(true);
        expect(
            /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(
                result.getValue().lastClear)
        ).toBe(true);
    });
});
