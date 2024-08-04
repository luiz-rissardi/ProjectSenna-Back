import { ForumRepository } from "../../infra/database/forumRepository.js";
import { KeyWordsRepository } from "../../infra/database/keyWordsRepository.js";
import { Result } from "../../infra/errorHandling/result.js";
import { UnexpectedError } from "../aplicationException/appErrors.js";
import { ChatInvalidKeyException, ChatNotFoundException } from "../aplicationException/domainException.js";
import { ForumData } from "../entity/ForumData.js";
import { KeyWord } from "../entity/keyWord.js";

export class ForumService {

    #forumStrategy
    #keyWordStrategy
    /**
     * 
     * @param {ForumRepository} forumStrategy 
     * @param {KeyWordsRepository} keyWordStrategy 
     */
    constructor(forumStrategy, keyWordStrategy) {
        this.#forumStrategy = forumStrategy;
        this.#keyWordStrategy = keyWordStrategy;
    }

    async createForum({ forumTitle, forumDescription, isActive, chatId }) {
        try {

            const resultValidate = await this.#chatIdKeyValidate(chatId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const forum = new ForumData(forumTitle, forumDescription, chatId, isActive);
            if (forum.isValid()) {
                const result = await this.#forumStrategy.insertOne(forum);
                if (result.isSuccess) {
                    return Result.ok(result.getValue())
                } else {
                    return Result.fail(result.error)
                }
            } else {
                return Result.fail(forum.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    /**
     * 
     * @param {ForumData} forum 
     */
    async changeForum({ forumTitle, forumDescription, isActive, chatId }) {
        try {

            const resultValidate = await this.#forumExists(chatId);
            if (!resultValidate.isSuccess) {
                return Result.fail(resultValidate.error)
            }

            const forum = new ForumData(forumTitle, forumDescription, chatId, isActive);
            if (forum.isValid()) {
                const result = await this.#forumStrategy.patchOne(forum);
                if (result.isSuccess) {
                    return Result.ok(result.getValue())
                } else {
                    return Result.fail(result.error)
                }
            } else {
                return Result.fail(forum.getNotifications())
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }

    async findForunsByQuery({ query }) {
        try {
            const result = await this.#forumStrategy.findMany(query);
            if (result.isSuccess) {
                return Result.ok(result.getValue())
            } else {
                return Result.fail(result.error)
            }
        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"))
        }
    }


    /**
     * @param {KeyWord[]} keyWords 
     */
    async addKeyWordsForum({ keyWords, chatId }) {
        try {
            const wordsValids = keyWords.filter(word => word.isValid())
            const result = await this.#keyWordStrategy.insertMany(chatId, wordsValids);
            if (result.isSuccess) {
                return Result.ok()
            } else {
                return Result.fail(result.error)
            }

        } catch (error) {
            loggers.warn(UnexpectedError.create(error.message));
            return Result.fail(UnexpectedError.create("erro interno do servidor"));
        }
    }

    async #chatIdKeyValidate(chatId) {
        const result = await this.#forumStrategy.chatIdIsValid(chatId)
        if (result.getValue().length == 0) {
            return Result.fail(ChatInvalidKeyException.create());
        }
        return Result.ok();
    }

    async #forumExists(chatId) {
        const result = await this.#forumStrategy.findOne(chatId)
        if (result.getValue().length == 0) {
            return Result.fail(ChatNotFoundException.create());
        }
        return Result.ok();
    }
}