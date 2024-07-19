import { ChildProcess, fork } from "child_process";
import { loggers } from "../util/logger.js";


export class ClusterProcessService {

    #processses
    #maxProcesses;
    #index = 0

    constructor(sizeOfCluster = 1) {
        this.#maxProcesses = sizeOfCluster
        this.#processses = new Map();
    }

    /**
     * @param {string} task 
     * @returns {ChildProcess}
     */
    #roundRobin() {
        const availableProcesses = [...this.#processses.values()];
        if (availableProcesses.length >= this.#index) this.#index = 0;
        const chosenProcess = availableProcesses[this.#index];
        this.#index++;
        return chosenProcess;
    }

    initCluster(task) {
        this.#startProcesses(task)

        return {
            getProcess: () => {
                return this.#roundRobin()
            }
        }
    }

    #startProcesses(task) {
        
        loggers.info(`criando task [${task}]`)
        for (let i = 0; i < this.#maxProcesses; i++) {
            const child = fork(task);
            this.#processses.set(child.pid, child);

            child.on('error', error => {
                child.kill();
                this.#processses.delete(child.pip);
            })
        }
    }
}