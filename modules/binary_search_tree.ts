import { assertEquals } from "../deps.ts";
import { Nullable } from "./utils/nullable.ts";

type Node<T> = {
  value: T;
  left: Nullable<Node<T>>;
  right: Nullable<Node<T>>;
};

const newNode = <T>(value: T): Node<T> => ({ value, left: null, right: null });

class BinarySearchTree<T> {
  root: Nullable<Node<T>>;

  constructor() {
    this.root = null;
  }

  // O(n) Ω(log n) θ(log n)
  insert(value: T) {
    const node = newNode(value);
    if (this.root === null) {
      this.root = node;
      return;
    }
    let curr = this.root;
    while (true) {
      if (curr.value === value) {
        return;
      } else if (value < curr.value) {
        if (curr.left === null) {
          curr.left = node;
          return;
        }
        curr = curr.left;
      } else {
        if (curr.right === null) {
          curr.right = node;
          return;
        }
        curr = curr.right;
      }
    }
  }

  // O(n) Ω(log n) θ(log n)
  contain(value: T): boolean {
    let curr = this.root;
    while (curr !== null) {
      if (curr.value === value) {
        return true;
      }
      curr = value < curr.value ? curr.left : curr.right;
    }
    return false;
  }

  // O(n) Ω(log n) θ(log n)
  min(): Nullable<T> {
    if (this.root === null) {
      return null;
    }
    let curr = this.root;
    while (curr.left !== null) {
      curr = curr.left;
    }
    return curr.value;
  }
}

Deno.test("constructor", (_) => {
  const bst = new BinarySearchTree();
  assertEquals(bst.root, null);
});

Deno.test("insert", (_) => {
  const bst = new BinarySearchTree();
  bst.insert(3);
  assertEquals(bst.root?.value, 3);
  bst.insert(1);
  assertEquals(bst.root?.left?.value, 1);
  bst.insert(5);
  assertEquals(bst.root?.right?.value, 5);
  bst.insert(2);
  assertEquals(bst.root?.left?.right?.value, 2);
  bst.insert(4);
  assertEquals(bst.root?.right?.left?.value, 4);
});

Deno.test("contain", (_) => {
  const bst = new BinarySearchTree();
  let got = bst.contain(20);
  assertEquals(got, false);
  bst.insert(20);
  bst.insert(17);
  bst.insert(23);
  bst.insert(45);
  bst.insert(33);
  bst.insert(10);
  bst.insert(14);
  got = bst.contain(10);
  assertEquals(got, true);
  got = bst.contain(99);
  assertEquals(got, false);
});

Deno.test("min", (_) => {
  const bst = new BinarySearchTree();
  assertEquals(bst.min(), null);
  bst.insert(50);
  bst.insert(25);
  bst.insert(33);
  bst.insert(65);
  bst.insert(99);
  bst.insert(3);
  bst.insert(12);
  bst.insert(8);
  assertEquals(bst.min(), 3);
});
