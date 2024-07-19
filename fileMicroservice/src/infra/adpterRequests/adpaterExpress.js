import { UnexpectedError } from "../../core/aplicationException/appErrors.js";
import { loggers } from "../../util/logger.js";
import { Readable } from "stream";

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
                
                const stream = callback(params, body)
                stream.pipe(res)
            } catch (error) {
                res.writeHead(500);
                res.end(
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



function* toString(stream) {
    for (let chunck of stream) {
        yield JSON.stringify(chunck)
    }
}