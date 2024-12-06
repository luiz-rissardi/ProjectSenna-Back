import { UnexpectedError } from '../../core/aplicationException/appErrors.js';
import { loggers } from '../../util/logger.js';

export class AdapterFastifyController {

  static adapt(callback) {
    return async (request, reply) => {
      let body = request.body;
      let params = request.params;

      try {
        // Processa dados multipart, caso estejam presentes
        if (request.isMultipart()) {
          body = await this.processMultipart(request);
        }
        
        const result = await callback(params, body);
        // Handler para fluxo de stream
        if (result?.isStream) {
          reply.type('application/octet-stream');
          const stream = result.streamFlow;

          reply.send(stream);
          return reply;

        } else { // Handler normal para dados JSON
          reply.send({ ...result, value: result.getValue() });
          return reply;
        }

      } catch (err) {
        loggers.error('Erro ao processar a requisição:', err);
        reply.code(500).send({
          error: UnexpectedError.create('Erro interno no servidor'),
          statusCode: 500,
        });
      }
    };
  }

  // Função auxiliar para processar dados multipart
  static async processMultipart(request) {
    const body = {};
    const parts = request.parts();

    for await (const part of parts) {
      if (part.file) {
        const data = await this.readStreamToBuffer(part.file);
        body['arrayBuffer'] = data ? this.bufferToArrayBuffer(data) : undefined;
      } else {
        body[part.fieldname] = part.value;
      }
    }
    return body;
  }

  // Função para converter o stream em um Buffer
  static async readStreamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  // Função para converter Buffer para ArrayBuffer
  static bufferToArrayBuffer(buffer) {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  }
}
