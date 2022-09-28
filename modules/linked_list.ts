import { assertEquals } from "../deps.ts";
import { nonNullable, type Nullable } from "./utils/nullable.ts";

type Node<T> = {
  value: T;
  next: Nullable<Node<T>>;
};

const newNode = <T>(value: T): Node<T> => ({ value, next: null });

class LinkedList<T> {
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

  push(value: T): LinkedList<T> {
    const node = newNode(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
      this.length = 1;
      return this;
    }
    nonNullable(this.tail).next = node;
    this.tail = node;
    this.length++;
    return this;
  }

  pop(): Nullable<T> {
    if (this.tail === null || this.head === null) {
      return null;
    }

    if (this.tail === this.head) {
      const value = this.tail.value;
      this.head = null;
      this.tail = null;
      this.length -= 1;
      if (this.length !== 0) {
        throw new Error("length is not zero");
      }
      return value;
    }

    const value = this.tail.value;
    let newTail: Nullable<Node<T>> = null;
    for (const curr of this.iter()) {
      const isBeforeTail = curr.next?.next === null;
      if (isBeforeTail) {
        newTail = curr;
      }
    }
    nonNullable(newTail).next = null;
    this.tail = newTail;
    this.length -= 1;
    return value;
  }

  unshift(value: T): LinkedList<T> {
    const node = newNode(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.length += 1;
    return this;
  }

  shift(): Nullable<T> {
    if (this.head === null || this.tail === null) {
      return null;
    }
    const value = this.head.value;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.length -= 1;
      return value;
    }
    const tmp = this.head;
    this.head = this.head.next;
    this.length -= 1;
    tmp.next = null;
    return value;
  }

  get(index: number): Nullable<T> {
    return this.#getNode(index)?.value ?? null;
  }

  set(index: number, value: T): boolean {
    const target = this.#getNode(index);
    if (target === null) {
      return false;
    }
    target.value = value;
    return true;
  }

  insert(index: number, value: T): Nullable<T> {
    if (index === 0) {
      return this.unshift(value).get(index);
    }
    if (index === this.length) {
      return this.push(value).get(index);
    }
    if (index < 0 || this.length < index) {
      return null;
    }
    const node = newNode(value);
    const targetBefore = nonNullable(this.#getNode(index - 1));
    node.next = targetBefore.next;
    targetBefore.next = node;
    this.length += 1;
    return value;
  }

  remove(index: number): Nullable<T> {
    if (index === 0) {
      return this.shift();
    }
    if (index === this.length - 1) {
      return this.pop();
    }
    if (index < 0 || this.length - 1 < index) {
      return null;
    }
    const targetBefore = nonNullable(this.#getNode(index - 1));
    const target = nonNullable(targetBefore.next);
    targetBefore.next = target.next;
    target.next = null;
    this.length -= 1;
    return target.value;
  }

  reverse(): void {
    if (this.head === null || this.tail === null) {
      return;
    }
    let prev: Nullable<Node<T>> = null;
    let curr: Nullable<Node<T>> = this.head;
    let next: Nullable<Node<T>> = curr.next;
    this.head = this.tail;
    this.tail = curr;
    while (curr !== null) {
      next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
  }

  *iter() {
    let curr = this.head;
    if (curr === null) {
      return;
    }
    while (curr.next !== null) {
      yield curr;
      curr = curr.next ?? null;
    }
  }

  #getNode(index: number): Nullable<Node<T>> {
    if (index < 0 || this.length < index + 1) {
      return null;
    }
    let i = 0;
    for (const curr of this.iter()) {
      if (i === index) {
        return curr;
      }
      i++;
    }
    return nonNullable(this.tail);
  }
}

Deno.test("constructor", (_) => {
  const l = new LinkedList();
  assertEquals(l.head, null);
  assertEquals(l.tail, null);
  assertEquals(l.length, 0);

  const ll = new LinkedList(5);
  assertEquals(ll.head?.value, 5);
  assertEquals(ll.tail?.value, 5);
  assertEquals(ll.head?.next, null);
  assertEquals(ll.tail?.next, null);
  assertEquals(ll.length, 1);

  const lll = new LinkedList(1, 2, 3, 4, 5);
  assertEquals(lll.head?.value, 1);
  assertEquals(lll.head?.next?.value, 2);
  assertEquals(lll.head?.next?.next?.value, 3);
  assertEquals(lll.head?.next?.next?.next?.value, 4);
  assertEquals(lll.head?.next?.next?.next?.next?.value, 5);
  assertEquals(lll.length, 5);
});

Deno.test("push", (_) => {
  const ll = new LinkedList("a");
  ll.push("b");
  assertEquals(ll.tail?.value, "b");
  assertEquals(ll.head?.next?.value, "b");
  assertEquals(ll.length, 2);
});

Deno.test("pop", (_) => {
  const ll = new LinkedList(0, 1);
  let got = ll.pop();
  assertEquals(got, 1);
  assertEquals(ll.tail?.value, 0);
  assertEquals(ll.tail?.next, null);
  assertEquals(ll.head, ll.tail);
  assertEquals(ll.length, 1);
  got = ll.pop();
  assertEquals(got, 0);
  assertEquals(ll.head, null);
  assertEquals(ll.length, 0);
  got = ll.pop();
  assertEquals(got, null);
});

Deno.test("unshift", (_) => {
  const ll = new LinkedList(0);
  ll.unshift(2);
  assertEquals(ll.head?.value, 2);
  assertEquals(ll.tail?.value, 0);
  assertEquals(ll.length, 2);
});

Deno.test("shift", (_) => {
  const ll = new LinkedList(2, 0);
  const value = ll.shift();
  assertEquals(value, 2);
  assertEquals(ll.head?.value, 0);
  assertEquals(ll.tail?.value, 0);
  assertEquals(ll.length, 1);
});

Deno.test("get", (_) => {
  const ll = new LinkedList(0, 2, 3, 5);
  assertEquals(ll.get(0), 0);
  assertEquals(ll.get(1), 2);
  assertEquals(ll.get(2), 3);
  assertEquals(ll.get(3), 5);
  assertEquals(ll.get(-1), null);
  assertEquals(ll.get(5), null);
});

Deno.test("set", (_) => {
  const ll = new LinkedList(0, 1, 2, 3);
  let ok = ll.set(0, 10);
  assertEquals(ok, true);
  assertEquals(ll.get(0), 10);
  ok = ll.set(-1, 100);
  assertEquals(ok, false);
  ll.set(3, 30);
  assertEquals(ll.get(3), 30);
});

Deno.test("insert", (_) => {
  const ll = new LinkedList(0, 1, 2, 3, 4);
  let got = ll.insert(0, -1);
  assertEquals(got, -1);
  assertEquals(ll.get(0), -1);
  assertEquals(ll.length, 6);
  got = ll.insert(6, 5);
  assertEquals(got, 5);
  assertEquals(ll.get(6), 5);
  assertEquals(ll.length, 7);
  got = ll.insert(-1, 10);
  assertEquals(got, null);
  assertEquals(ll.length, 7);
  got = ll.insert(4, 99);
  assertEquals(got, 99);
  assertEquals(ll.get(4), 99);
  assertEquals(ll.length, 8);
});

Deno.test("remove", (_) => {
  const ll = new LinkedList(0, 1, 2, 3, 4);
  let got = ll.remove(0);
  assertEquals(got, 0);
  assertEquals(ll.get(0), 1);
  assertEquals(ll.length, 4);
  got = ll.remove(3);
  assertEquals(got, 4);
  assertEquals(ll.get(3), null);
  assertEquals(ll.length, 3);
  got = ll.remove(3);
  assertEquals(got, null);
  assertEquals(ll.length, 3);
  got = ll.remove(1);
  assertEquals(got, 2);
  assertEquals(ll.get(1), 3);
  assertEquals(ll.length, 2);
});

Deno.test("reverse", (_) => {
  const ll = new LinkedList(0, 1, 2, 3, 4);
  ll.reverse();
  assertEquals(ll.length, 5);
  assertEquals(ll.get(0), 4);
  assertEquals(ll.get(1), 3);
  assertEquals(ll.get(2), 2);
  assertEquals(ll.get(3), 1);
  assertEquals(ll.get(4), 0);
});
