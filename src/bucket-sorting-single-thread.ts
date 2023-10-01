import { generateNumberArray } from "./bucket-sort-data-generation";
import { insertionSort } from "./insertion-sort";

const BUCKET_COUNT = 3;
const NUM_OF_NUMBERS = 600_000;

const bucketSortSingleThread = (dataset: number[]) => {
  
  let min = dataset[0];
  let max = dataset[0];
  for (let i = 1; i < dataset.length; i++) {
    if (dataset[i] < min) min = dataset[i];
    if (dataset[i] > max) max = dataset[i];
  }

  const bucketSize = Math.ceil((max - min + 1) / BUCKET_COUNT);

  // Create buckets
  const buckets: number[][] = [];
  for (let i = 0; i < BUCKET_COUNT; i++) {
    buckets[i] = [];
  }

  // Step 2: Fill the buckets
  for (let num of dataset) {
    const bucketIndex = Math.floor((num - min) / bucketSize);
    buckets[bucketIndex].push(num);
  }

  // Step 3: Sort each bucket using a stable sorting algorithm
  for (let bucket of buckets) {
    insertionSort(bucket);
  }

  // Step 4: Stitch together the sorted buckets
  return ([] as number[]).concat(...buckets);
};

const dataset = generateNumberArray(NUM_OF_NUMBERS, 100_000);
console.time("bucketSortSingleThread");
bucketSortSingleThread(dataset);
console.timeEnd("bucketSortSingleThread");

// node build/bucket-sorting-single-thread.js
