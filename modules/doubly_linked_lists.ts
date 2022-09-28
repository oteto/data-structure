import { assertEquals } from "../deps.ts";
import { nonNullable, type Nullable } from "./utils/nullable.ts";

type Node<T> = {
  value: T;
  prev: Nullable<Node<T>>;
  next: Nullable<Node<T>>;
};

const newNode = <T>(value: T): Node<T> => ({ value, prev: null, next: null });

class DoublyLinkedList<T> {
  head: Nullable<Node<T>>;
  tail: Nullable<Node<T>>;
  length: number;

  constructor(...values: T[]) {
    if (values.length === 0) {
      this.head = null;
      this.tail = null;
      this.length = 0;
      return;
    }
    this.head = newNode(values[0]);
    this.tail = this.head;
    this.length = 1;
    for (const value of values.slice(1)) {
      this.push(value);
    }
  }

  push(value: T): void {
    const node = newNode(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
      this.length += 1;
      return;
    }
    nonNullable(this.tail).next = node;
    node.prev = this.tail;
    this.tail = node;
    this.length += 1;
    return;
  }

  pop(): Nullable<T> {
    if (this.head === null || this.tail === null) {
      return null;
    }
    const poped = this.tail;
    this.tail = this.tail.prev;
    poped.prev = null;
    if (this.tail === null) {
      this.head = null;
    } else {
      this.tail.next = null;
    }
    this.length -= 1;
    return poped.value;
  }

  unshift(value: T): void {
    const node = newNode(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
      this.length += 1;
      return;
    }
    nonNullable(this.tail);
    node.next = this.head;
    this.head.prev = node;
    this.head = node;
    this.length += 1;
  }

  shift(): Nullable<T> {
    if (this.head === null || this.tail === null) {
      return null;
    }
    const shifted = this.head;
    this.head = this.head.next;
    if (this.head === null) {
      this.tail = null;
    } else {
      this.head.prev = null;
    }
    this.length -= 1;
    shifted.next = null;
    return shifted.value;
  }

  get(index: number): Nullable<T> {
    return this.#getNode(index)?.value ?? null;
  }

  set(index: number, value: T): boolean {
    const target = this.#getNode(index);
    if (target !== null) {
      target.value = value;
      return true;
    }
    return false;
  }

  insert(index: number, value: T): Nullable<T> {
    if (index < 0 || this.length < index) {
      return null;
    }
    if (index === 0) {
      this.unshift(value);
      return value;
    }
    if (index === this.length) {
      this.push(value);
      return value;
    }
    const target = nonNullable(this.#getNode(index));
    const targetPrev = nonNullable(target.prev);
    const node = newNode(value);
    node.prev = targetPrev;
    node.next = target;
    targetPrev.next = node;
    target.prev = node;
    this.length += 1;
    return value;
  }

  remove(index: number): Nullable<T> {
    if (index < 0 || this.length <= index) {
      return null;
    }
    if (index === 0) {
      return this.shift();
    }
    if (index === this.length - 1) {
      return this.pop();
    }
    const target = nonNullable(this.#getNode(index));
    const prev = nonNullable(target.prev);
    const next = nonNullable(target.next);
    prev.next = next;
    next.prev = prev;
    target.prev = null;
    target.next = null;
    this.length -= 1;
    return target.value;
  }

  #getNode(index: number): Nullable<Node<T>> {
    if (index < 0 || this.length <= index) {
      return null;
    }
    if (index < this.length / 2) {
      let target: Nullable<Node<T>> = this.head;
      for (let i = 0; i < index; i++) {
        target = target?.next ?? null;
      }
      return target;
    }
    let target: Nullable<Node<T>> = this.tail;
    for (let i = this.length - 1; index < i; i--) {
      target = target?.prev ?? null;
    }
    return target;
  }
}

Deno.test("constructor", (_) => {
  let dll = new DoublyLinkedList();
  assertEquals(dll.head, null);
  assertEquals(dll.tail, null);
  assertEquals(dll.length, 0);

  dll = new DoublyLinkedList(0);
  assertEquals(dll.head?.value, 0);
  assertEquals(dll.head?.prev, null);
  assertEquals(dll.head?.next, null);
  assertEquals(dll.tail?.value, 0);
  assertEquals(dll.head, dll.tail);
  assertEquals(dll.length, 1);

  dll = new DoublyLinkedList(0, 1, 2, 3);
  assertEquals(dll.head?.value, 0);
  assertEquals(dll.tail?.value, 3);
  assertEquals(dll.length, 4);
});

Deno.test("push", (_) => {
  const dll = new DoublyLinkedList();
  dll.push("a");
  assertEquals(dll.head?.value, "a");
  assertEquals(dll.tail?.value, "a");
  assertEquals(dll.length, 1);

  dll.push("b");
  assertEquals(dll.head?.value, "a");
  assertEquals(dll.tail?.value, "b");
  assertEquals(dll.length, 2);
  assertEquals(dll.tail?.prev?.value, "a");
  assertEquals(dll.head?.next?.value, "b");
});

Deno.test("pop", (_) => {
  const dll = new DoublyLinkedList(0, 1, 2, 3);
  let got = dll.pop();
  assertEquals(got, 3);
  assertEquals(dll.length, 3);
  assertEquals(dll.tail?.value, 2);
  assertEquals(dll.tail?.next, null);
  dll.pop();
  dll.pop();
  got = dll.pop();
  assertEquals(got, 0);
  assertEquals(dll.length, 0);
  assertEquals(dll.head, null);
  assertEquals(dll.tail, null);
  got = dll.pop();
  assertEquals(got, null);
  assertEquals(dll.length, 0);
  assertEquals(dll.head, null);
  assertEquals(dll.tail, null);
});

Deno.test("unshift", (_) => {
  const dll = new DoublyLinkedList();
  dll.unshift(0);
  assertEquals(dll.head?.value, 0);
  assertEquals(dll.tail?.value, 0);
  assertEquals(dll.length, 1);
  dll.unshift(1);
  assertEquals(dll.head?.value, 1);
  assertEquals(dll.tail?.value, 0);
  assertEquals(dll.length, 2);
  assertEquals(dll.head?.next?.value, 0);
  assertEquals(dll.head?.prev, null);
  assertEquals(dll.tail?.next, null);
  assertEquals(dll.tail?.prev?.value, 1);
});

Deno.test("shift", (_) => {
  const dll = new DoublyLinkedList(0, 1, 2, 3, 4);
  let got = dll.shift();
  assertEquals(got, 0);
  assertEquals(dll.head?.value, 1);
  assertEquals(dll.head?.prev, null);
  assertEquals(dll.length, 4);
  dll.shift();
  dll.shift();
  dll.shift();
  got = dll.shift();
  assertEquals(got, 4);
  assertEquals(dll.head, null);
  assertEquals(dll.tail, null);
  assertEquals(dll.length, 0);
  got = dll.shift();
  assertEquals(got, null);
  assertEquals(dll.head, null);
  assertEquals(dll.tail, null);
  assertEquals(dll.length, 0);
});

Deno.test("get", (_) => {
  const dll = new DoublyLinkedList(0, 1, 2, 3, 4);
  let got = dll.get(0);
  assertEquals(got, 0);
  got = dll.get(2);
  assertEquals(got, 2);
  got = dll.get(4);
  assertEquals(got, 4);
  got = dll.get(5);
  assertEquals(got, null);
  got = dll.get(-1);
  assertEquals(got, null);
});

Deno.test("set", (_) => {
  const dll = new DoublyLinkedList(0, 1, 2, 3, 4);
  dll.set(0, 5);
  dll.set(4, 0);
  dll.set(2, 99);
  let got = dll.set(-1, 0);
  assertEquals(got, false);
  got = dll.set(5, 0);
  assertEquals(got, false);
  assertEquals(dll.length, 5);
  assertEquals(dll.get(0), 5);
  assertEquals(dll.get(4), 0);
  assertEquals(dll.get(2), 99);
  assertEquals(dll.get(-1), null);
  assertEquals(dll.get(5), null);
});

Deno.test("insert", (_) => {
  const dll = new DoublyLinkedList(0, 1, 2, 3, 4);
  dll.insert(0, -1);
  assertEquals(dll.head?.value, -1);
  assertEquals(dll.head?.next?.value, 0);
  assertEquals(dll.length, 6);
  dll.insert(6, 5);
  assertEquals(dll.tail?.value, 5);
  assertEquals(dll.tail?.prev?.value, 4);
  assertEquals(dll.length, 7);
  dll.insert(3, 99);
  assertEquals(dll.get(3), 99);
  assertEquals(dll.get(2), 1);
  assertEquals(dll.get(4), 2);
  assertEquals(dll.length, 8);
  let got = dll.insert(-1, 100);
  assertEquals(got, null);
  assertEquals(dll.length, 8);
  got = dll.insert(99, 99);
  assertEquals(got, null);
  assertEquals(dll.length, 8);
});

Deno.test("remove", (_) => {
  const dll = new DoublyLinkedList(0, 1, 2, 3, 4);
  let got = dll.remove(0);
  assertEquals(got, 0);
  assertEquals(dll.length, 4);
  assertEquals(dll.head?.value, 1);
  assertEquals(dll.head?.prev, null);
  got = dll.remove(3);
  assertEquals(got, 4);
  assertEquals(dll.length, 3);
  assertEquals(dll.tail?.value, 3);
  assertEquals(dll.tail?.next, null);
  got = dll.remove(1);
  assertEquals(got, 2);
  assertEquals(dll.length, 2);
  assertEquals(dll.head?.next?.value, 3);
  assertEquals(dll.tail?.prev?.value, 1);
  dll.remove(0);
  assertEquals(dll.head, dll.tail);
  assertEquals(dll.length, 1);
  got = dll.remove(1);
  assertEquals(got, null);
  assertEquals(dll.length, 1);
  dll.remove(0);
  assertEquals(dll.head, null);
  assertEquals(dll.tail, null);
  assertEquals(dll.length, 0);
});
