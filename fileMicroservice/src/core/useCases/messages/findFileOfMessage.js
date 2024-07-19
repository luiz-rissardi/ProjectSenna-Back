

import { Result } from "../../../infra/errorHandling/result.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { loggers } from "../../../util/logger.js";
import { UseCase } from "../base/useCase.js"
import { MessageMysql } from "../../../infra/database/messageFileRepository.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";

import { Readable, Writable } from "stream";

export class FindFileOfMessage extends UseCase {

    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(messageId) {
        try {
            const result = await this.repository.findOne(messageId);
            if (result.isSuccess) {
                const stream = result.getValue();

                // pega os chunks maiores vido do stream do db e reparte em pedaços menores
                const readable = new Readable({
                    read() {
                        stream.on("data", (chunk) => {
                            process.send(JSON.stringify({
                                messageId:chunk?.messageId,
                                fileName:chunk?.fileName
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


const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new FindFileOfMessage(repositoryContext);

process.on("message", async ({ messageId }) => {
    const result = await useCase.execute(messageId);
    const stream = result.getValue();

    if (result.isSuccess == false) {
        process.send({ ...result })
        return;
    }

    stream.pipe(new Writable({
        write(chunk,enc,cb){
            process.send(chunk.toString());
            cb();
        },
        final(cb){
            process.send(null);
        }
    }))
})


function splitBuffer(buffer, chunkSize) {
    let chunks = [];
    for (let i = 0; i < buffer.length; i += chunkSize) {
        chunks.push(buffer.slice(i, i + chunkSize));
    }
    return chunks;
}