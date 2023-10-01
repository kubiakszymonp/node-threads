# Introduction

With the ever-growing need for performance and scalability in modern web applications, making multithreading more accessible and intuitive in Node.js becomes paramount. 
This project bridges the gap, allowing developers to harness the power of multiple cores without getting entangled in the complexities.

While Node.js offers worker threads for multithreading, the intricacies and boilerplate code often deter developers. This project serves as an intuitive interface, making multithreading as straightforward as writing typical single-threaded code.

# Goal

This project aims to provide very simple interface for running multithreaded applications in Node.js. 

Running the code above will create a new Thread object that will be treated as a receipt for running some work.

Then the Thread object can be used many times to execute with parameters in detached mode (default), or in joined mode (wait for result) - using `wait()`. Result will be returned as a Promise.

```typescript
// index.ts

import { someFunction } from "./someFile";

const thread = new Thread(someFunction);

const runningThread1 = thread.run({ some: "data" });

const runningThread2 = thread.run({ some: "other data" });

const result1 = await runningThread1.wait();

const result2 = await runningThread2.wait();
```

```typescript
// someFile.ts

export function someFunction(data: { some: string }) {

  console.log(data.some);

  return data;
}
```

# Technical details

This project contains of two main components:

- typescipt compiler transformation plugin
- runtime framework for running threads

### Compiler transformation plugin

Located in: ``./src/compilation-transformers/``

Uses [ts-patch](https://github.com/nonara/ts-patch) library, to wrap the typescript compiler, and hook into the compilation process and transform code before compilation.

It transforms Thread() object creation, from the type-safe version, to the runtime version:

```typescript
// before
import { someFunction } from "./someFile";

const a = new Thread(someFunction);
```

```typescript
// after
import { someFunction } from "./someFile";

const a = new Thread(
  (module: any, arg: any) => module.someFunction(arg),
  [__dirname, "./someFile"]
);
```

Then, module resolution can be done correctly, and the function can be easily stringified, and passed to the worker thread.


### Runtime framework

Located in: ``./src/framework/``

It is a simple wrapper around the worker threads, that provides a friendly interface for running threads, and waiting for their results.

Uses different types of WorkerMessages, to return data, or throw errors from the worker thread.


# Limitations

Unfortunately `worker_threads` in Node.js are not exactly as `threads` in other languages. They have separated execution context, and can share memory with limitations.

In practice, data that is shared between threads, needs to be serializable. This means that you can't share functions, classes, or any other objects that are not simple objects, and built-in types - [official documentation](https://nodejs.org/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist)

Another limitation is that creating a Worker is costly operation, and takes much time. At my machine, it takes around 0.5s to create a new Worker. This means that creating a new Worker for every task is not a good idea. Instead, it is better to create a pool of Workers, and reuse them for different tasks. (Perspective to implement in the future)



# Usage

Currently library can be tested on the example program, that sorts a large array of integers using bucket sort algorithm.

Install dependencies:
```
npm install
```

Compile example programs using ts-patch compiler:
```
npm run build
```

Run example program, using node:
```
node build/examples/bucket-sort/index.js
```

# Results

For following input data:

800_000 Integers at range 0 - 100_000_000
Number of buckets (threads): 3

``` bash
Started multiple thread test
bucketSortMultiThread: 26.052s
Started single thread test
bucketSortSingleThread: 1:09.532 (m:ss.mmm)
```