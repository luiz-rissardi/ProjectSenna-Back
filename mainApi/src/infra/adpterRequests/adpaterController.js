import { UnexpectedError } from "../../core/aplicationException/appErrors.js";
import { loggers } from "../../util/logger.js";

export class AdapterExpressController {

    /**
     * @param {Function} callback
     * @returns { Function }
     */
    static adapt(callback) {

        return async (req, res) => {
            try {
                const { params, body } = req;
                body["messageArrayBuffer"] = req?.file?.buffer;
                const stream = await callback(params, body)
                stream.pipe(res);
            } catch (error) {
                res.writeHead(500);
                res.json(
                    {
                        error: UnexpectedError.create("erro interno no servidor"),
                        statusCode: 500
                    }
                )
                loggers.error(error)
            }
        }
    }
}