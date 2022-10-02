import { assertArrayIncludes, assertEquals } from "../deps.ts";
import { Nullable } from "./utils/nullable.ts";

type KeyValue<V> = [string, V];

class HashTable<T> {
  // TODO: linked list にする
  #dataMap: Nullable<KeyValue<T>[]>[];
  size: number;

  constructor(size: number = 7) {
    this.#dataMap = new Array<Nullable<KeyValue<T>[]>>(7).fill(null);
    this.size = size;
  }

  set(key: string, value: T): void {
    const index = this.#hash(key);
    this.#dataMap[index] ??= [];
    const fi = this.#dataMap[index]!.findIndex(([k]) => k === key);
    if (fi === -1) {
      this.#dataMap[index]!.push([key, value]);
    } else {
      this.#dataMap[index]![fi]![1] = value;
    }
  }

  get(key: string): Nullable<T> {
    const index = this.#hash(key);
    return this.#dataMap[index]?.find(([k]) => k === key)?.[1] ?? null;
  }

  keys(): string[] {
    return this.#dataMap.flatMap((m) => m?.map(([k]) => k) ?? []);
  }

  #hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * 23) % this.#dataMap.length;
    }
    return hash;
  }
}

Deno.test("hash table", (_) => {
  const ht = new HashTable<string>();
  assertEquals(ht.size, 7);
  ht.set("key", "value");
  assertEquals(ht.get("key"), "value");
  assertEquals(ht.get("nokey"), null);
  ht.set("key", "value2");
  assertEquals(ht.get("key"), "value2");

  ht.set("key2", "a");
  ht.set("key3", "b");
  assertArrayIncludes(ht.keys(), ["key", "key2", "key3"]);
});
