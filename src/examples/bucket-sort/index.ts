import { generateNumberArray } from "./bucket-sort-data-generation";
import { bucketSortMultiThread } from "./bucket-sorting-multithread";
import { bucketSortSingleThread } from "./bucket-sorting-single-thread";

const BUCKET_COUNT = 3;
const NUM_OF_NUMBERS = 800_000;
const NUM_RANGE = 100_000_000;

const testSingleThread = async () => {
  console.log("Started single thread test");
  const dataset = generateNumberArray(NUM_OF_NUMBERS, NUM_RANGE);
  console.time("bucketSortSingleThread");
  bucketSortSingleThread(dataset, BUCKET_COUNT);
  console.timeEnd("bucketSortSingleThread");
};

const testMultipleThread = async () => {
  console.log("Started multiple thread test");
  const dataset = generateNumberArray(NUM_OF_NUMBERS, NUM_RANGE);
  console.time("bucketSortMultiThread");
  await bucketSortMultiThread(dataset, BUCKET_COUNT);
  console.timeEnd("bucketSortMultiThread");
};

const main = async () => {
  await testMultipleThread();
  await testSingleThread();
};

main();
