import { UnexpectedError } from "../aplicationException/appErrors.js";
import { Result } from "../../infra/errorHandling/result.js";
import { Repository } from "../../infra/database/base/repository.js";
import { loggers } from "../../util/logger.js";
import { MessageFile } from "../model/messageFile.js";

export class MessageFileService {

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
            const message = new MessageFile(messageId, data, fileName);
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
                return Result.ok(result.getValue());
            } else {
                return Result.fail(result.error);
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }
}
