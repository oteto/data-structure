import { assertEquals } from "../deps.ts";
import { nonNullable, Nullable } from "./utils/nullable.ts";

type Node<T> = {
  value: T;
  next: Nullable<Node<T>>;
};

const newNode = <T>(value: T): Node<T> => ({ value, next: null });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++
//               last               first
// enqueue ->>    ◯ <-next- ◯ <-next- ◯    ->> dequeue
// +++++++++++++++++++++++++++++++++++++++++++++++++++++
export class Queue<T> {
  first: Nullable<Node<T>>;
  last: Nullable<Node<T>>;
  length: number;

  constructor(...values: T[]) {
    if (values.length === 0) {
      this.first = null;
      this.last = null;
      this.length = 0;
      return;
    }
    this.first = newNode(values[0]);
    this.last = this.first;
    this.length = 1;
    for (const value of values.slice(1)) {
      this.enqueue(value);
    }
  }

  // O(1)
  enqueue(value: T): void {
    const node = newNode(value);
    if (this.first === null) {
      this.first = node;
      this.last = node;
      this.length += 1;
      return;
    }
    nonNullable(this.last).next = node;
    this.last = node;
    this.length += 1;
  }

  // O(1)
  dequeue(): Nullable<T> {
    if (this.first === null) {
      return null;
    }
    const first = this.first;
    this.first = first.next;
    if (first.next === null) {
      this.last = null;
    }
    first.next = null;
    this.length -= 1;
    return first.value;
  }
}

Deno.test("constructor", (_) => {
  let queue = new Queue();
  assertEquals(queue.first, null);
  assertEquals(queue.last, null);
  assertEquals(queue.length, 0);

  queue = new Queue(1);
  assertEquals(queue.first?.value, 1);
  assertEquals(queue.last?.value, 1);
  assertEquals(queue.length, 1);
  assertEquals(queue.first?.next, null);

  queue = new Queue(0, 1, 2, 3, 4);
  assertEquals(queue.first?.value, 0);
  assertEquals(queue.last?.value, 4);
  assertEquals(queue.length, 5);
});

Deno.test("enqueue", (_) => {
  const queue = new Queue();
  queue.enqueue(1);
  assertEquals(queue.first?.value, 1);
  assertEquals(queue.last?.value, 1);
  assertEquals(queue.length, 1);
  queue.enqueue(2);
  assertEquals(queue.last?.value, 2);
  assertEquals(queue.last?.next, null);
  assertEquals(queue.first?.value, 1);
  assertEquals(queue.first?.next?.value, 2);
  assertEquals(queue.length, 2);
});

Deno.test("dequeue", (_) => {
  const queue = new Queue(0, 1, 2);
  let got = queue.dequeue();
  assertEquals(got, 0);
  assertEquals(queue.first?.value, 1);
  assertEquals(queue.last?.value, 2);
  assertEquals(queue.length, 2);
  queue.dequeue();
  got = queue.dequeue();
  assertEquals(got, 2);
  assertEquals(queue.first, null);
  assertEquals(queue.last, null);
  assertEquals(queue.length, 0);
  got = queue.dequeue();
  assertEquals(got, null);
  assertEquals(queue.length, 0);
});
