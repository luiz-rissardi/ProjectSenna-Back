import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { ChatInvalidKeyException, ChatNotFoundException } from "../aplicationException/domainException.js";
import { loggers } from "../../util/logger.js";
import { Group } from "../models/groupData.js"
import { GroupMysql } from "../../infra/database/groupRepository.js";
import { Repository } from "../../infra/database/base/database.js";


class GroupService {

    #groupStrategy;

    /**
     * 
     * @param {Repository} groupStrategy 
     */
    constructor(groupStrategy) {
        this.#groupStrategy = groupStrategy;
    }

    async createGroup({chatId, groupName, groupDescription, groupPhoto}) {
        try {
            const resultValidate = await this.#chatIdKeyValidate(chatId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const group = new Group(chatId, groupName, groupDescription, groupPhoto);
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


    async #chatIdKeyValidate(groupId) {
        const result = await this.#groupStrategy.chatIdIsValid(groupId)
        if (result.getValue().length == 0) {
            return Result.fail(ChatInvalidKeyException.create());
        }
        return Result.ok();
    }

    async #groupExists(groupId) {
        const result = await this.#groupStrategy.findOne(groupId)
        if (result.getValue().length == 0) {
            return Result.fail(ChatNotFoundException.create());
        }
        return Result.ok();
    }
}

const groupStrategy = new GroupMysql(process.env.CONNECION_STRING);
const service = new GroupService(groupStrategy);

process.on("message", async ({ actionName, data }) => {
    if (actionName == "createGroup") {
        const result = await service.createGroup(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }
    if (actionName == "updateGroup") {
        const result = await service.updateGroup(data);
        process.send({ ...result, value: result.getValue() });
        return;
    }
})