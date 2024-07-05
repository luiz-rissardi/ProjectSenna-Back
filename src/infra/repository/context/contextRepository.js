


export class RepositoryContext {

    #context;
    constructor(strategyContext) {
        this.#context = strategyContext;
        // add another methods of the strategy context;
        const forbidenMethods = ["findMany", "findOne", "insertOne", "putOne","constructor"]
        Object.getOwnPropertyNames(strategyContext.__proto__)
            .filter(key => !forbidenMethods.includes(key))
            .map(key => {
                this[key] = strategyContext[key].bind(strategyContext)
            })
    }

    findMany(...args) {
        return this.#context.findMany(args)
    }

    findOne(...args) {
        return this.#context.findOne(args);
    }

    insertOne(...args) {
        return this.#context.insertOne(args);
    }

    putOne(...args) {
        return this.#context.putOne(args);
    }
}