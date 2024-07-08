import { UnexpectedError } from "../../../core/errorsAplication/appErrors.js";


export class BaseController{


    static ok(data) {
        return {
            data,
            statusCode: 200
        };
    }

    static badRequest(message) {
        return {
            data:message,
            statusCode: 400
        };
    }

    static InternalServerError() {
        return {
            error: UnexpectedError.create("erro interno no servidor"),
            statusCode: 500
        }
    }
}