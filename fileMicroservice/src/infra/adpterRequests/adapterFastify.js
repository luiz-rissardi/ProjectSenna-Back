import { UnexpectedError } from '../../core/aplicationException/appErrors.js';
import { loggers } from '../../util/logger.js';
import { Writable, Readable } from 'stream';

export class AdapterFastifyController {

  static adapt(callback) {
    return async (request, reply) => {
      const { params, body } = request;

      if (body != undefined) {
        body['messageArrayBuffer'] = request.file ? request.file.buffer : undefined;
      }
      try {
        const result = await callback(params, body);
        // Envia a stream como resposta diretamente usando reply.send
        reply.send({ ...result, value: result.getValue() })

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