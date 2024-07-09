

import { RepositoryOperationError } from "../../core/errorsAplication/appErrors.js";
import { Chat } from "../../core/models/chat.js";
import { loggers } from "../../util/logger.js";
import { Result } from "../errorHandling/result.js";
import { BaseRepository } from "./base/database.js";




export class MessageRepository extends BaseRepository{
    constructor(connectionString) {
        super(connectionString)
    }

}