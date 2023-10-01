import { writeFileSync } from "fs";
import { join } from "path";

export const hardTask = (arg: {
  a: string;
  b: number;
  c: boolean;
}) => {
  console.log( arg );
  const p = join(__dirname, "dupa.txt");
  console.log("writing to file: ", p);
  writeFileSync(p, "dupa from hard task");
  return 1;
};
