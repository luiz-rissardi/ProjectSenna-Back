import { UnexpectedError } from '../../core/aplicationException/appErrors.js';
import { loggers } from '../../util/logger.js';
import { Writable,Readable } from 'stream';

export class AdapterFastifyController {

  static adapt(callback) {
    return async (request, reply) => {
      const { params, body } = request;

      if(body != undefined){
          body['messageArrayBuffer'] = request.file ? request.file.buffer : undefined;
      }
      try {
        const stream = await callback(params, body);
        reply.type('application/octet-stream');
        // Envia a stream como resposta diretamente usando reply.send
        reply.send(stream)
        // reply.send(new Readable({
        //     read(){
        //         stream.on("data",(chunk)=>{
        //             this.push(chunk)
        //         })
        //         stream.on("end",()=>{
        //             this.push(null)
        //         })
        //     }
        // }));

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