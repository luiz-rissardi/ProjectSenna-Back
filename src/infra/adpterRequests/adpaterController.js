
import { Writable } from "stream"

export class AdapterExpressController{
    
    /**
     * @param {Function} callback
     * @returns { Function }
     */
    static adapt(callback){
        return async function(req,res){
            try {
                const { params, body } = req;
                const stream = await callback(params,body);
                stream.pipe(new Writable({
                    write(chunk,enc,cb){
                        cb();
                        res.write(chunk)
                    },
                    final(cb){
                        res.end();
                        cb();
                    }
                }))
            } catch (error) {
                res.writeHead(500);
                res.end();
            }
        }
    }
}