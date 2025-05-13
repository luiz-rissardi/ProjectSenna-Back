

export class FastifyAdapterController {

    static adapt(callback) {
        return async (request, reply) => {
            try {
                const body = request.body;
                const params = request.params;

                const result = await callback(params,body);

                reply.send({ ...result, value: result.getValue() });
            } catch (error) {
                console.log(error);
                reply.code(500).send({
                    error: {
                        message: 'Erro interno no servior',
                        name: "UnexpectedError"
                    },
                    statusCode: 500,
                });
            }
        }
    }
}