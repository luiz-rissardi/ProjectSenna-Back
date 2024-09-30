import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { ChatNotFoundException } from "../aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { Group } from "../entity/groupData.js";
import { randomUUID as v4 } from "crypto"


export class GroupService {

    #groupStrategy;

    constructor(groupStrategy) {
        this.#groupStrategy = groupStrategy;
    }

    async createGroup({groupName, groupDescription, arrayBuffer}) {
        try {
            const chatId = v4();
            const group = new Group(chatId, groupName, groupDescription, arrayBuffer);
            if (group.isValid()) {
                const result = await this.#groupStrategy.insertOne(group);
                if (result.isSuccess) {
                    return Result.ok(group);
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(group.getNotifications());
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async updateGroup({chatId, groupName, groupDescription, groupPhoto}) {
        try {
            const resultValidate = await this.#groupExists(chatId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const group = new Group(chatId, groupName, groupDescription, groupPhoto);
            if (group.isValid()) {
                const result = await this.#groupStrategy.patchOne(group);
                if (result.isSuccess) {
                    return Result.ok(group);
                } else {
                    return Result.fail(result.error);
                }
            } else {
                return Result.fail(group.getNotifications());
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async #groupExists(chatId) {
        const result = await this.#groupStrategy.findOne(chatId)
        if (result.getValue()?.length == 0) {
            return Result.fail(ChatNotFoundException.create());
        }
        return Result.ok();
    }
}
