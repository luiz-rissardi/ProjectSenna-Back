import { UnexpectedError } from "../../core/aplicationException/appErrors.js";
import { loggers } from '../../util/logger.js';

export class FastifyAdapterController {

    static adapt(callback) {
        return async (request, reply) => {
            const { params, body, query } = request;
            try {
                const result = await callback({ ...params,...query }, body);
                reply.send({ ...result, value: result.getValue() });
                return reply

            } catch (err) {
                loggers.error(err);
                reply.code(500).send({
                    error: UnexpectedError.create('Erro interno no servidor'),
                    statusCode: 500,
                });
            }
        };
    }
}