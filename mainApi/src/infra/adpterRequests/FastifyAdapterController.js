import { UnexpectedError } from "../../core/aplicationException/appErrors.js";
import { loggers } from '../../util/logger.js';

export class FastifyAdapterController {

    static adapt(callback) {
        return async (request, reply) => {
            const { params, body } = request;
            try {
                if (body != undefined) {
                    body["messageArrayBuffer"] = request.file ? request.file.buffer : undefined;
                }
                const stream = callback(params, body);
                reply.type('application/octet-stream');
                reply.send(stream)
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