import { createPool } from "mysql2/promise";
import request from "supertest";
import app from "../infra/server/fastify/index.js";

jest.mock('mysql2/promise', () => {
    const mockPool = {
        getConnection: jest.fn().mockResolvedValue({
            query: jest.fn(),
            release: jest.fn(), // Simula o método release
        }),
    };
    return {
        createPool: () => mockPool,
    };
});

describe('User login', () => {
    let server;

    // Antes de rodar os testes, inicia o servidor
    beforeAll(async () => {
        server = await app.listen({ port: 0 });  // Inicie o servidor em uma porta aleatória
    });


    it('Deve esperar que o login seja realizado com sucesso, e retornar o usuário', async () => {
        const mockQueryResponse = [[{
            userName: 'Emilio Rodolfo',
            isActive: 1,
            photo: 'https://www.bbc.com/portuguese/articles/c3gllx470jxo',
            email: 'emilioRufolfoFey@gmail.com',
            lastOnline: "2024-07-26T12:13:32.000Z",
            languages: 'pt-br',
            userDescription: 'sou programador sou e engenheiro de software',
            passwordHash: 'f9fd2d016be15d0b0e9b6153be551fb2c18e8e30d14b8de95446c7add01ed59bf332a27a2aff662305b5637906632504c403d349c1aa34ca325f7cfef6d4da33',
            contactId: '0d947109-dd74-4c4a-8ce3-9107544f4be6',
            userId: '5d6432e3-3902-44d1-ae89-ee289e2189aa'
        }]];

        // Mock da função query para retornar a resposta desejada
        const pool = createPool();
        const connection = await pool.getConnection();
        connection.query.mockResolvedValue(mockQueryResponse);

        const result = await request(server).post('/user/login').send({
            email: "emilioRufolfoFey@gmail.com",
            password: "Luiz2006$"
        });

        // Verifica se o status e a resposta estão corretos
        expect(result.statusCode).toBe(200);
        expect(result.body.isSuccess).toBe(true)
        expect(result.body.value).toStrictEqual({
            userName: 'Emilio Rodolfo',
            isActive: 1,
            photo: 'https://www.bbc.com/portuguese/articles/c3gllx470jxo',
            email: 'emilioRufolfoFey@gmail.com',
            lastOnline: '2024-07-26T12:13:32.000Z',
            languages: 'pt-br',
            userDescription: 'sou programador sou e engenheiro de software',
            contactId: '0d947109-dd74-4c4a-8ce3-9107544f4be6',
            userId: '5d6432e3-3902-44d1-ae89-ee289e2189aa'
          })
    });
});
