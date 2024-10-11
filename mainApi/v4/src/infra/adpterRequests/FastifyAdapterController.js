import { UnexpectedError } from '../../core/aplicationException/appErrors.js';
import { loggers } from '../../util/logger.js';

export class FastifyAdapterController {

  static adapt(callback) {
    return async (request, reply) => {
      let body = {};
      let params = request.params;

      try {
        // Captura todas as partes do request (incluindo arquivos e campos)
        const parts = request.parts();
        let data = null;

        // Processa cada parte do request multipart
        for await (const part of parts) {
          if (part.file) {
            data = await readStreamToBuffer(part.file);
            body['arrayBuffer'] = data ? bufferToArrayBuffer(data) : undefined;
          } else {
            body[part.fieldname] = part.value;
          }
        }

        const result = await callback(params, body);
        console.log(result);
        // Envia a resposta como JSON, incluindo o valor de retorno
        reply.send({ ...result, value: result.getValue() });
        return reply;

      } catch (err) {
        // Registra o erro no logger e envia um erro 500 na resposta
        loggers.error(err);
        reply.code(500).send({
          error: UnexpectedError.create('Erro interno no servidor'),
          statusCode: 500,
        });
      }
    };
  }
}

// Função para converter o stream em um Buffer
async function readStreamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Função para converter Buffer para ArrayBuffer
function bufferToArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}