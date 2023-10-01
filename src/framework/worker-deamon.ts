// import { parentPort, workerData } from "worker_threads";
// import { logTime } from "../utils";
// import { WorkerMessage, WorkerMessageType } from "../framework2/message";

// let workerId = workerData.id;

// parentPort?.postMessage(new WorkerMessage(WorkerMessageType.SET_STATE, 0));

// parentPort?.on("message", (msg: string) => {
//   const workerMessage = WorkerMessage.deserialize(msg);
//   recievedMessage(msg);
// });

// const recievedMessage = (message: any) => {
//   console.debug(`Worker ${workerId} recieved message: `, message);
//   if (message.type === WorkerMessageType.RUN_TASK) {
//     const { replaced, argsList } = message.payload;
//     const func = `const main = async () => {
//       try{
//       const func = ${replaced};
//       func.apply(null, [${argsList}]);
//     }
//     catch(er) {console.log(er)}}; main()`;
//     eval(func);
//   }
// };
