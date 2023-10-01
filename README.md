# Introduction

This project's purpose is to simplify working with Node.js worker threads.

# Goal

This project aims to provide a simple interface for running multithreaded applications in Node.js. Calling methods on threads works like this:

```typescript
// index.ts

import { someFunction } from "./someFile";

const thread = new Thread(someFunction);
const runningThread = thread.run({ some: "data" });
const result = await runningThread.wait();
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

Uses [ts-patch](https://github.com/nonara/ts-patch) library, to transform code before compilation.

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

It is a simple wrapper around the worker threads, that provides a simple interface for running threads, and waiting for their results.

Uses different types of WorkerMessages, to return data, or throw errors from the worker thread.


# Usage

Install dependencies:
```
npm install
```

Compile example programs using ts-patch compiler:
```
npm run build
```

Run example programs, using node:
```
node ./build/bucket-sorting-thtead.js
node ./build/bucket-sorting-multithread.js
```

# Results

For following input data:

```
600_000 Integers at range 0 - 100_000
Number of buckets (threads): 3
Single threaded time: ~ 36s
Multi threaded time: ~ 12s
```