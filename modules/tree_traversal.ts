import { assertEquals } from "../deps.ts";
import {
  BinarySearchTree,
  type Node as BSTNode,
} from "./binary_search_tree.ts";
import { Queue } from "./queue.ts";
import { nonNullable } from "./utils/nullable.ts";

type DepthTraversalOrder = "pre" | "post" | "in";

// 幅優先探索
function breadthFirstSearch<T>(tree: BinarySearchTree<T>): T[] {
  const queue = new Queue<BSTNode<T>>();
  const result: T[] = [];
  if (tree.root === null) {
    return result;
  }
  let currentNode: BSTNode<T> = tree.root;
  queue.enqueue(currentNode);
  while (queue.length > 0) {
    currentNode = nonNullable(queue.dequeue());
    result.push(currentNode.value);
    if (currentNode.left !== null) {
      queue.enqueue(currentNode.left);
    }
    if (currentNode.right !== null) {
      queue.enqueue(currentNode.right);
    }
  }
  return result;
}

// 深さ優先探索
function depthFirstSearch<T>(
  tree: BinarySearchTree<T>,
  order: DepthTraversalOrder,
): T[] {
  const result: T[] = [];
  function traverse(currentNode: BSTNode<T>): void {
    if (order === "pre") {
      result.push(currentNode.value);
    }
    if (currentNode.left !== null) {
      traverse(currentNode.left);
    }
    if (order === "in") {
      result.push(currentNode.value);
    }
    if (currentNode.right !== null) {
      traverse(currentNode.right);
    }
    if (order === "post") {
      result.push(currentNode.value);
    }
  }
  if (tree.root !== null) {
    traverse(tree.root);
  }
  return result;
}

Deno.test("breadthFirstSearch", (_) => {
  const bst = new BinarySearchTree<number>();
  assertEquals(breadthFirstSearch(bst), []);
  bst.insert(47);
  bst.insert(21);
  bst.insert(76);
  bst.insert(18);
  bst.insert(27);
  bst.insert(52);
  bst.insert(82);
  assertEquals(breadthFirstSearch(bst), [47, 21, 76, 18, 27, 52, 82]);
});

Deno.test("depthFirstSearch", (_) => {
  const bst = new BinarySearchTree();
  assertEquals(depthFirstSearch(bst, "pre"), []);
  assertEquals(depthFirstSearch(bst, "in"), []);
  assertEquals(depthFirstSearch(bst, "post"), []);
  bst.insert(47);
  bst.insert(21);
  bst.insert(76);
  bst.insert(18);
  bst.insert(27);
  bst.insert(52);
  bst.insert(82);
  assertEquals(depthFirstSearch(bst, "pre"), [47, 21, 18, 27, 76, 52, 82]);
  assertEquals(depthFirstSearch(bst, "in"), [18, 21, 27, 47, 52, 76, 82]);
  assertEquals(depthFirstSearch(bst, "post"), [18, 27, 21, 52, 82, 76, 47]);
});
