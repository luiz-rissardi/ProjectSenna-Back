

export class AdapterExpressController {

    /**
     * @param {Function} callback
     * @returns { Function }
     */
    static adapt(callback) {

        return async (req, res) => {
            try {
                const { params, body } = req;
                const stream = await callback(params, body);
                stream.pipe(res)
            } catch (error) {
                res.writeHead(500);
                res.json(
                    {
                        error: UnexpectedError.create("erro interno no servidor"),
                        statusCode: 500
                    }
                )
            }
        }
    }
}