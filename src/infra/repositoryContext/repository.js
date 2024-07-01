


export class RepositoryContext{

    #context;
    constructor(strategyContext){
        this.#context = strategyContext;
    }

    findMany(...args){
        return this.#context.findMany(args)
    }

    findOne(...args){
        return this.#context.findOne(args);
    }

    insertOne(...args){
        return this.#context.insertOne(args);
    }

    putOne(...args){
        return this.#context.putOne(args);
    }
}