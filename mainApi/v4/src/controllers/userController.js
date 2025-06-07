import { UnexpectedError } from "../core/aplicationException/appErrors.js";
import { UserService } from "../core/services/userService.js"
import { loggers } from "../util/logger.js";
import { Readable } from "stream"

export class UserController {

    #service;
    /**
     * @param {UserService} userService 
     */
    constructor(userService) {
        this.#service = userService;
    }

    createUser(params, body) {
        return this.#service.createUser({ ...params, ...body })
    }

    findUser(params, body) {
        return this.#service.findUser({ ...params, ...body })
    }

    updateUser(params, body) {
        return this.#service.updateUser({ ...params, ...body })
    }

    authUser(params, body) {
        return this.#service.authUser({ ...body })
    }

    confirmAccount(params, body) {
        return this.#service.confirmAccount({ ...params })
    }

    recoverPassword(params, body) {
        return this.#service.recoverPassword({ ...params, ...body })
    }

    async findUserByUserNameOrEmail(params, body) {
        const data = await this.#service.findUserByUserNameOrEmail({ ...params })
        const streamFlow = this.#executeActionStream(
            data.getValue()
        )
        return {
            isStream:true,
            streamFlow
        }
    }

    #executeActionStream(data) {
        try {
            const read = new Readable({
                read() {
                    for (let item of data) {
                        // const { photo, ...user } = item;
                        this.push(JSON.stringify(item));
                    }
                    this.push(null)
                }
            });
            return read

        } catch (error) {
            loggers.error(UnexpectedError.create(error.message))
            return UnexpectedError.create(error.message)
        }
    }

}