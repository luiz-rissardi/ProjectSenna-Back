


export class RepositoryContext {

    #context;
    constructor(strategyContext) {
        this.#context = strategyContext;
        this.mappedOtherMethods(strategyContext)
        // add another methods of the strategy context;
    }

    mappedOtherMethods(strategyContext) {
        const forbidenMethods = ["findMany", "findOne", "insertOne", "patchOne", "constructor"]
        Object.getOwnPropertyNames(strategyContext.__proto__)
            .filter(key => !forbidenMethods.includes(key))
            .map(key => {
                this[key] = (...args) => {
                    return strategyContext[key].bind(strategyContext)(args)
                }
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

    patchOne(...args) {
        return this.#context.patchOne(args);
    }

}