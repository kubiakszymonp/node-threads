export type SerializableValue =
    | string
    | number
    | boolean
    | bigint
    | undefined
    | null
    | Date
    | SerializableArray
    | SerializableObject
    | SerializableMap
    | SerializableSet
    | TypedArray;

type SerializableArray = SerializableValue[];
type SerializableObject = { [key: string]: SerializableValue };
type SerializableMap = Map<SerializableValue, SerializableValue>;
type SerializableSet = Set<SerializableValue>;

type TypedArray = 
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array;