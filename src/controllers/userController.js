import { BaseController } from "./base/baseController.js";

export class UserController extends BaseController {

    #service;
    constructor(userService) {
        super();
        this.#service = userService;
    }


    async createUser(req, res) {
        try {
            const { userName, userDescription, email, photo, languages, password } = req.body;
            const result = await this.#service.createUser(userName, userDescription, email, photo, languages, password);
            if(result.isSuccess){
                res.json(this.ok(result.getValue()))
            }else{
                res.json(this.badRequest(result.error))
            }
        } catch (error) {
            res.writeHead(500);
            res.json(this.InternalServerError())  
        } 
    }

    async login(req,res){
        try {
            const { email,password } = req.body;
            const result = await this.#service.findUser(email,password);
            if(result.isSuccess){
                res.json(this.ok(result.getValue()))
            }else{
                res.json(this.badRequest(result.error))
            }
        } catch (error) {
            res.writeHead(500);
            res.json(this.InternalServerError())  
        }
    }


}