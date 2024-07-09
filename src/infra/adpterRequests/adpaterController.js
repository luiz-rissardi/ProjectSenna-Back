
import { Writable } from "stream"
import { BaseController } from "./base/baseController.js";

export class AdapterExpressController extends BaseController {

    /**
     * @param {Function} callback
     * @returns { Function }
     */
    static adapt(callback) {

        return async (req, res) => {
            try {
                const { params, body } = req;
                const stream = await callback(params, body);
                stream.pipe(new Writable({
                    write: (chunk, enc, cb) => {
                        cb();
                        const { isSuccess, error, value } = JSON.parse(chunk.toString());
                        if (isSuccess) {
                            res.write(
                                JSON.stringify(this.ok(value))
                            )
                        }else{
                            res.write(
                                JSON.stringify(this.badRequest(error))
                            )

                        }
                    },
                    final(cb) {
                        res.end();
                        cb();
                    }
                }))
            } catch (error) {
                res.writeHead(500);
                res.write(
                    JSON.stringify(this.InternalServerError())
                )
                res.end();
            }
        }
    }
}