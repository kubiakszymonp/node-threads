import { generateNumberArray } from "./bucket-sort-data-generation";
import { insertionSort } from "./insertion-sort";
import { Thread } from "./framework/thread";

const bucketSortMultiThread = async (dataset: number[]) => {
  let min = dataset[0];
  let max = dataset[0];
  for (let i = 1; i < dataset.length; i++) {
    if (dataset[i] < min) min = dataset[i];
    if (dataset[i] > max) max = dataset[i];
  }
  const bucketCount = 3;
  const bucketSize = Math.ceil((max - min + 1) / bucketCount);

  // Create buckets
  const buckets: number[][] = [];
  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = [];
  }

  // Step 2: Fill the buckets
  for (let num of dataset) {
    const bucketIndex = Math.floor((num - min) / bucketSize);
    buckets[bucketIndex].push(num);
  }

  // Step 3: Sort each bucket using a stable sorting algorithm
  const thread = new Thread(insertionSort);
  const threadPromises = buckets.map(
    async (bucket) => await thread.run(bucket).wait()
  );
  const sortedBuckets = await Promise.all(threadPromises);

  // Step 4: Stitch together the sorted buckets
  return ([] as number[]).concat(...sortedBuckets);
};

const dataset = generateNumberArray(60_0_000, 100_000);
console.time("bucketSortMultiThread");
bucketSortMultiThread(dataset).then((sorted) => {
  console.timeEnd("bucketSortMultiThread");
});

// node build/bucket-sorting-multithread.js
