import { UnexpectedError } from "../aplicationException/appErrors.js";
import { Result } from "../../infra/errorHandling/result.js";
import { Repository } from "../../infra/database/base/database.js";
import { loggers } from "../../util/logger.js";
import { MessageMysql } from "../../infra/database/messageFileRepository.js";
import { MessageFile } from "../model/messageFile.js";
import { Readable, Writable } from "stream"

class MessageFileService {

    #messageFileStrategy
    /**
     * @param {Repository} messageFileStrategy 
     */
    constructor(messageFileStrategy) {
        this.#messageFileStrategy = messageFileStrategy;
    }

    async deleteFile({ messageId }) {
        try {
            const result = await this.#messageFileStrategy.deleteOne(messageId);
            if (result.isSuccess) {
                return Result.ok("arquivo apagado com sucesso")
            } else {
                return Result.fail(result.error);
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async sendMessageFile({ data, fileName, messageId }) {
        try {
            const message = new MessageFile(messageId, data = new ArrayBuffer(), fileName);
            if (message.isValid()) {
                const result = await this.#messageFileStrategy.insertOne(message);
                if (result.isSuccess) {
                    return Result.ok(message)
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(message.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async findFilesOfMessage({ messageId }) {
        try {
            const result = await this.#messageFileStrategy.findOne(messageId);
            if (result.isSuccess) {
                const stream = result.getValue();

                // pega os chunks maiores vido do stream do db e reparte em pedaços menores
                const readable = new Readable({
                    read() {
                        stream.on("data", (chunk) => {
                            this.push(JSON.stringify({
                                messageId: chunk?.messageId,
                                fileName: chunk?.fileName
                            }))
                            const buffer = Buffer.from(chunk.data);
                            const chunkSize = 12000; // Tamanho de cada pedaço 12000 caracteres por chunk
                            const chunks = splitBuffer(buffer, chunkSize);
                            chunks.forEach(chunkData => this.push(JSON.stringify(chunkData)));
                        })
                        stream.on("end", () => {
                            this.push(null)
                        })
                    }
                })

                return Result.ok(readable);
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}

function splitBuffer(buffer, chunkSize) {
    let chunks = [];
    for (let i = 0; i < buffer.length; i += chunkSize) {
        chunks.push(buffer.slice(i, i + chunkSize));
    }
    return chunks;
}

const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const service = new MessageFileService(databaseStrategy);

process.on("message", async ({ actionName, data }) => {
    if (actionName == "deleteFile") {
        const result = await service.deleteFile(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }
    if (actionName == "sendMessageFile") {
        const result = await service.sendMessageFile(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }
    if (actionName == "findFilesOfMessage") {
        const result = await service.findFilesOfMessage(data);
        const stream = result.getValue();

        if (result.isSuccess == false) {
            process.send({ ...result })
            return;
        }

        stream.pipe(new Writable({
            write(chunk, enc, cb) {
                process.send(chunk.toString());
                cb();
            },
            final(cb) {
                process.send(null);
            }
        }))
    }

})