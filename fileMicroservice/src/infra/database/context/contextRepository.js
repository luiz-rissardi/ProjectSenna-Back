


export class RepositoryContext {

    #context;
    constructor(strategyContext) {
        this.#context = strategyContext;
    }
    findOne(...args) {
        return this.#context.findOne(args);
    }

    insertOne(...args) {
        return this.#context.insertOne(args);
    }

    deleteOne(...args) {
        return this.#context.deleteOne(args);
    }

}