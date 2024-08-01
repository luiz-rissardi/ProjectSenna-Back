import multer from 'multer';
import { AdapterFastifyController } from '../adpterRequests/adapterFastify.js';
import { MessageFileFactory } from '../factories/messageFileFactory.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

export class MessageFileRoutesFastify {

  constructor(fastifyInstance) {
    this.fastify = fastifyInstance;
    this.controller = MessageFileFactory.getController();
    this.#setupRoutes();
  }

  #setupRoutes() {
    // Rota para enviar arquivos para mensagens
    this.fastify.post("/chat/message/:messageId/file", { preHandler: upload.single('messageArrayBuffer') },
      AdapterFastifyController.adapt(
        this.controller.sendFileIntoMessage.bind(this.controller)
      )
    );

    // Rota para pegar o arquivo correspondente à mensagem
    this.fastify.get("/chat/message/:messageId",
      AdapterFastifyController.adapt(
        this.controller.findFileOfMessage.bind(this.controller)
      )
    );

    // Rota para deletar o arquivo correspondente à mensagem
    this.fastify.delete("/chat/message/:messageId",
      AdapterFastifyController.adapt(
        this.controller.deleteFileOfMessage.bind(this.controller)
      )
    );
  }
}
