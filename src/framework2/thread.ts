import { join } from "path";
import { Worker } from "worker_threads";
import { ThreadMessage, ThreadMessageType } from "./message";
import { SerializableValue } from "./serializable-value";

export class Thread<
  Arg extends SerializableValue,
  Ret extends SerializableValue
> {
  public importArgs: string[];
  public dataArg: any;
  public threadBody: string;

  constructor(public task: (funcArg: Arg) => Ret, public arg?: string[]) {
    const relativeModule = new RelativeModule(arg![0], arg![1]);
    this.importArgs = this.prepareImportArgs(relativeModule);
    this.threadBody = ThreadCallFactory(this.task.toString(), this.importArgs);
  }

  prepareImportArgs(module: RelativeModule) {
    return [`await import("${module.path}")`];
  }

  run(args: Arg): ThreadExecution<Arg, Ret> {
    const worker = new Worker(this.threadBody, {
      eval: true,
      workerData: args,
    });

    return new ThreadExecution(worker);
  }
}

export class ThreadExecution<Arg, Ret> {
  constructor(public worker: Worker) {}

  stop() {
    this.worker.terminate();
  }

  wait(): Promise<Ret> {
    return new Promise((resolve, reject) => {
      this.worker.on("message", (msg: string) => {
        const message = ThreadMessage.deserialize(msg);
        if (message.type === ThreadMessageType.FINISHED) {
          resolve(message.payload);
        }
        if (message.type === ThreadMessageType.ERROR) {
          reject(message.payload);
        }
      });
    });
  }
}

export const ThreadCallFactory = (func: string, args: any[]) => {
  const threadHelperModulePath = new RelativeModule(__dirname, "./message");
  return `
const threadExecution = async () => {
  try {
    const {parentPort, workerData} = await import("worker_threads");
    const {ThreadMessage, ThreadMessageType} = await import("${threadHelperModulePath.path}");
    const func = ${func};
    const returnValue = func.apply(null, [${args}, workerData]);
    parentPort.postMessage(new ThreadMessage(ThreadMessageType.FINISHED, returnValue));
  } catch (err) {
    console.error(err);
    parentPort.postMessage(new ThreadMessage(ThreadMessageType.ERROR, err));
  }
};
threadExecution();
`
    .trim()
    .replace(/[\r\n\t]/g, " ");
};

export class RelativeModule {
  public path: string;

  constructor(dirname: string, relativePath: string) {
    this.path = this.preparePath(dirname, relativePath);
  }

  preparePath(dirname: string, relativePath: string) {
    let p = join(dirname, relativePath);
    p = p.endsWith(".ts") ? p.replace(".ts", ".js") : p;
    p = p.endsWith(".js") ? p : p + ".js";
    return p;
  }
}
