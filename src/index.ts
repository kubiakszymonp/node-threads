import { hardTask } from "./framework/some-hard-work";
import { Thread } from "./framework/thread";

const a1 = new Thread(hardTask);
const execution2 = a1.run({
  a: "1",
  b: 2,
  c: true,
});
execution2.wait().then(console.log).catch(console.error);
