import { Thread } from "../../framework/thread";
import { insertionSort, quickSort } from "./insertion-sort";

export const bucketSortMultiThread = async (
  dataset: number[],
  bucketCount: number
) => {
  let min = dataset[0];
  let max = dataset[0];
  for (let i = 1; i < dataset.length; i++) {
    if (dataset[i] < min) min = dataset[i];
    if (dataset[i] > max) max = dataset[i];
  }
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
