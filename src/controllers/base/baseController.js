import { UnexpectedError } from "../../core/errorsAplication/appErrors.js";


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
            error: UnexpectedError.create("erro interno no servidor"),
            statusCode: 500
        }
    }
}