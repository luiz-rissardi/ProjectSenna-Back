import { resolveNaptr } from "dns";
import { User } from "../core/models/user.js";
import { BaseRepository } from "../infra/database/base/database.js";
import { ClusterProcessService } from "../services/clusterProcessService.js";
import { BaseController } from "./base/baseController.js";
import { Readable } from "stream"

export class UserController {
    constructor() {
    }

    async createUser(params, body) {
        const { userName, userDescription, email, photo, languages, password } = body;
        const result = await User.createUser(userName, userDescription, email, photo, languages, password);
        if (result.isSuccess) {
            return Readable.from(JSON.stringify(result.getValue()))
        }
        return Readable.from(JSON.stringify(result.error))
    }

    async findUser(params, body) {
        const { password, email } = body;
        const user = new User(null, null, email, null, null, null, null, null, null, password);
        const result = await user.findUser();
        if (result.isSuccess) {
            return Readable.from(JSON.stringify(result.getValue()))
        }
        return Readable.from(JSON.stringify(result.error))
    }

    async updateUser(params, body) {
        const { userName, userDescription, email, photo, languages, password, isActive } = body;
        const { userId } = params;
        const user = new User(userName, isActive, email, photo, userDescription, userId, new Date(), languages, null, password);
        if (user.isValid()) {
            const result = await user.updateUser();
            if (result.isSuccess) {
                return Readable.from(JSON.stringify(result.getValue()))
            }
            return Readable.from(JSON.stringify(result.error))
        } else {
            return Readable.from(JSON.stringify(user.getNotifications()))
        }

    }

    async findContactsOfUser(params, body) {
        // const { userName, userDescription, photo, email, lastOnline, dateOfblocking } = body;
        const { contactId } = params;
        const user = new User(null, null, null, null, null, null, null, null, contactId, null);
        const result = await user.getContactsOfUser();
        if (result.isSuccess) {
            return result.getValue();
        }
        return result.error;

    }



}