import { BaseRepository } from "../../../infra/repository/base/database.js";


export class UseCase{

    repository;

    /**
     * @param {BaseRepository} repository 
     */
    constructor(repository){
        this.repository = repository
    }

    execute(){
       throw new Error("Method Not implemented") 
    }
}