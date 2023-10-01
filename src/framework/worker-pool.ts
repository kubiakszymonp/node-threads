// import { cpus } from "os";
// import path from "path";
// import { Worker } from "worker_threads";
// import { WorkerMessage, WorkerMessageType } from "../framework2/message";

// export class WorkerPool {
//   poolSize: number;
//   workers: Worker[];
//   workersTasks: number[];

//   constructor(poolSize?: number) {
//     console.debug(`[WorkerPool] Process ID: ${process.pid}`);
//     this.poolSize = poolSize !== undefined ? poolSize : cpus().length;
//     this.workers = this.initWorkers();
//     this.workersTasks = new Array(this.poolSize).fill(-1);
//   }

//   initWorkers() {
//     const workerPath = path.join(__dirname, "./worker-deamon.js");
//     console.debug(`[WorkerPool] Creating ${this.poolSize} workers`);
//     return new Array(this.poolSize).fill(null).map((_, id) => {
//       const w = new Worker(workerPath, { workerData: { id } });
//       w.on("message", (msg: string) => this.onMessage(id, msg));
//       return w;
//     });
//   }

//   onMessage(workerId: number, message: string) {
//     console.debug(`[WorkerPool] Worker ${workerId} send message:`, message);
//     const workerMessage = WorkerMessage.deserialize(message);
//     if (workerMessage.type === WorkerMessageType.SET_STATE) {
//       this.workersTasks[workerId] = workerMessage.payload;
//     }
//     return;
//   }

//   getLeastBusyWorker() {
//     let minTasks = Infinity;
//     let minWorkerId = -1;
//     for (let i = 0; i < this.workersTasks.length; i++) {
//       if (this.workersTasks[i] < minTasks) {
//         minTasks = this.workersTasks[i];
//         minWorkerId = i;
//       }
//     }
//     return minWorkerId;
//   }

//   stringifyFunction(func: Function) {
//     return func.toString().replace(/[\r\n\t]/g, " ");
//   }

//   //   async runTask(
//   //     task: Function,
//   //     dataVariables: Record<string, any>,
//   //     importStatements: Record<string, ImportStatement>
//   //   ) {
//   //     importStatements = importStatements || {};
//   //     const importStr = createDynamicImports(importStatements);
//   //     const str = this.stringifyFunction(task);
//   //     const replaced = replaceModule("utils", str);
//   //     const workerId = this.getLeastBusyWorker();
//   //     console.debug(`[WorkerPool] Running task on worker ${workerId}`);
//   //     this.workers[workerId].postMessage(
//   //       new WorkerMessage(WorkerMessageType.RUN_TASK, { replaced, importStr })
//   //     );
//   //   }
//   // }

//   async runTask(task: Function, argsProvider: string[]) {
//     const argsSources = argsProvider || [];
//     const argsList = argsSources.map((arg) => {
//       return "await import('" + arg + "')";
//     });

//     const str = this.stringifyFunction(task);
//     const replaced = replaceModule("utils", str);
//     const workerId = this.getLeastBusyWorker();
//     console.debug(`[WorkerPool] Running task on worker ${workerId}`);
//     this.workers[workerId].postMessage(
//       new WorkerMessage(WorkerMessageType.RUN_TASK, { replaced, argsList })
//     );
//   }
// }

// const replaceModule = (moduleName: string, source: string) => {
//   const regex = new RegExp(`${moduleName}_\\d+\\.`, "g");
//   return source.replace(regex, "");
// };

// const createDynamicImports = (
//   importStatements: Record<string, ImportStatement>
// ) => {
//   return Object.entries(importStatements).map(
//     ([moduleName, importedProperties]) => {
//       const props = Object.entries(importedProperties)
//         .map((prop) => {
//           console.log(prop);
//           return prop[0];
//         })
//         .join(", ");
//       return `const { ${props} } = await import("${moduleName}");`;
//     }
//   );
// };

// export const workerPoolInstance = new WorkerPool(3);

// export type ImportStatement = Record<string, any>;
