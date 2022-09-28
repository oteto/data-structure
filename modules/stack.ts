import { assertEquals } from "../deps.ts";
import { Nullable } from "./utils/nullable.ts";

type Node<T> = {
  value: T;
  next: Nullable<Node<T>>;
};

const newNode = <T>(value: T): Node<T> => ({ value, next: null });

class Stack<T> {
  top: Nullable<Node<T>>;
  length: number;

  constructor(...values: T[]) {
    if (values.length === 0) {
      this.top = null;
      this.length = 0;
      return;
    }
    this.top = newNode(values[0]);
    this.length = 1;
    for (const value of values.slice(1)) {
      this.push(value);
    }
  }

  push(value: T): void {
    const node = newNode(value);
    if (this.top === null) {
      this.top = node;
      this.length += 1;
      return;
    }
    node.next = this.top;
    this.top = node;
    this.length += 1;
  }

  pop(): Nullable<T> {
    if (this.top === null) {
      return null;
    }
    const top = this.top;
    this.top = top.next;
    this.length -= 1;
    top.next = null;
    return top.value;
  }
}

Deno.test("constructor", (_) => {
  let stack = new Stack();
  assertEquals(stack.top, null);
  assertEquals(stack.length, 0);

  stack = new Stack(1);
  assertEquals(stack.top?.value, 1);
  assertEquals(stack.top?.next, null);
  assertEquals(stack.length, 1);

  stack = new Stack(0, 1, 2);
  assertEquals(stack.top?.value, 2);
  assertEquals(stack.length, 3);
});

Deno.test("push", (_) => {
  const stack = new Stack();
  stack.push(1);
  assertEquals(stack.top?.value, 1);
  assertEquals(stack.length, 1);
  stack.push(5);
  assertEquals(stack.top?.value, 5);
  assertEquals(stack.length, 2);
  assertEquals(stack.top?.next?.value, 1);
  assertEquals(stack.top?.next?.next, null);
});

Deno.test("pop", (_) => {
  const stack = new Stack("a", "b", "c");
  let got = stack.pop();
  assertEquals(got, "c");
  assertEquals(stack.length, 2);
  assertEquals(stack.top?.value, "b");
  stack.pop();
  stack.pop();
  assertEquals(stack.top, null);
  assertEquals(stack.length, 0);
  got = stack.pop();
  assertEquals(got, null);
});
