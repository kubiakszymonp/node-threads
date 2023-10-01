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

