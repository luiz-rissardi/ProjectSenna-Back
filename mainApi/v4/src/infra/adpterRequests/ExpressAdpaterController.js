import { UnexpectedError } from "../../core/aplicationException/appErrors.js";
import { loggers } from "../../util/logger.js";

export class ExpressAdapterController {

    /**
     * @param {Function} callback
     * @returns { Function }
     */
    static adapt(callback) {

        return async (req, res) => {
            try {
                const { params, body, query } = req;
                body["arrayBuffer"] = req.file ? req.file.buffer : Buffer.from("");
                const result = await callback({ ...params, ...query }, body)
                res.write(JSON.stringify({ ...result, value: result.getValue() }))
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