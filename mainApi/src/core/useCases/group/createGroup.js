import { Result } from "../../../infra/errorHandling/result.js";
import { loggers } from "../../../util/logger.js";
import { UnexpectedError } from "../../aplicationException/appErrors.js";
import { UseCase } from "../base/useCase.js";
import { RepositoryContext } from "../../../infra/database/context/contextRepository.js";
import { Group } from "../../models/groupData.js";
import { GroupMysql } from "../../../infra/database/groupRepository.js";
import { ChatInvalidKeyException } from "../../aplicationException/domainException.js";

export class CreateGroup extends UseCase {
    constructor(repositoryContext) {
        super(repositoryContext);
    }

    async execute(chatId, groupName, groupDescription, groupPhoto) {
        try {
            const resultValidate = await this.#groupExists(chatId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const group = new Group(chatId, groupName, groupDescription, groupPhoto);
            if (group.isValid()) {
                const result = await this.repository.insertOne(group);
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

    async #groupExists(groupId) {
        const result = await this.repository.alreadyExist(groupId)
        if (result.getValue().length == 0) {
            return Result.fail(ChatInvalidKeyException.create());
        }
        return Result.ok();
    }
}

const databaseStrategy = new GroupMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new CreateGroup(repositoryContext);

process.on("message", async ({ chatId, groupName, groupDescription, groupPhoto }) => {
    const result = await useCase.execute(chatId, groupName, groupDescription, groupPhoto);
    process.send({ ...result, value: result.getValue() })
})