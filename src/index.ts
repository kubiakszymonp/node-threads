import { hardTask } from "./framework2/some-hard-work";
import { Thread } from "./framework2/thread";

const a1 = new Thread(hardTask);
const execution2 = a1.run("argument");
execution2.wait().then(console.log).catch(console.error);
