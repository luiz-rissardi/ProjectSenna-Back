import { UnexpectedError } from "../../core/errorsAplication/appErrors.js";


new WeakMap().get()
export class BaseController{
    ok(data) {
        return {
            data,
            statusCode: 200
        };
    }

    badRequest(message) {
        return {
            message,
            statusCode: 400
        };
    }

    InternalServerError() {
        return {
            error: UnexpectedError("erro interno no servidor"),
            statusCode: 500
        }
    }
}