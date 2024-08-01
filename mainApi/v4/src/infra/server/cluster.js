import cluster from "cluster";
import os from "os";
import { loggers } from "../../util/logger.js";

async function primaryWorker() {
    const processCount = os.cpus().length - 1;
    for (let i = 0; i < processCount; i++) {
        const worker = cluster.fork();
        loggers.info(`a new Worker is spanw ${worker.process.pid}`)
    }

    cluster.on("exit", (worker, code, signal) => {
        const fork = cluster.fork();
        console.log(`worker died, new worker running at ${fork.process.pid}`);
    })
}

async function processWorker() {
    await import("./index.js");
}



cluster.isPrimary ? primaryWorker() : processWorker();