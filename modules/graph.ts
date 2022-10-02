import { assertArrayIncludes, assertEquals } from "../deps.ts";

type Vertex = string | number;

class Graph {
  adjacencyList: Record<Vertex, Vertex[]>;

  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex: Vertex): boolean {
    if (this.adjacencyList[vertex] === undefined) {
      this.adjacencyList[vertex] = [];
      return true;
    }
    return false;
  }

  removeVertex(vertex: Vertex): void {
    for (const v of this.adjacencyList[vertex]) {
      this.removeEdge(vertex, v);
    }
    delete this.adjacencyList[vertex];
  }

  addEdge(vertex1: Vertex, vertex2: Vertex): boolean {
    if (
      this.adjacencyList[vertex1] !== undefined &&
      this.adjacencyList[vertex2] !== undefined
    ) {
      const v1 = this.adjacencyList[vertex1];
      const v2 = this.adjacencyList[vertex2];
      if (!v1.includes(vertex2)) {
        v1.push(vertex2);
      }
      if (!v2.includes(vertex1)) {
        v2.push(vertex1);
      }
    }
    return false;
  }

  removeEdge(vertex1: Vertex, vertex2: Vertex): boolean {
    if (
      this.adjacencyList[vertex1] !== undefined &&
      this.adjacencyList[vertex2] !== undefined
    ) {
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter((v) =>
        v !== vertex2
      );
      this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter((v) =>
        v !== vertex1
      );
    }
    return false;
  }
}

Deno.test("graph", (_) => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addEdge(1, 2);
  graph.addEdge(1, 3);
  graph.addEdge(2, 3);
  assertArrayIncludes(graph.adjacencyList[1], [2, 3]);
  assertArrayIncludes(graph.adjacencyList[2], [1, 3]);
  assertArrayIncludes(graph.adjacencyList[3], [1, 2]);
  graph.removeEdge(1, 3);
  assertEquals(graph.adjacencyList[1], [2]);
  assertEquals(graph.adjacencyList[3], [2]);
  const got = graph.removeEdge(1, 3);
  assertEquals(got, false);
  graph.addEdge(1, 3);
  graph.addVertex(4);
  graph.addEdge(1, 4);
  graph.addEdge(2, 4);
  graph.addEdge(3, 4);
  graph.removeVertex(4);
  assertArrayIncludes(graph.adjacencyList[1], [2, 3]);
  assertArrayIncludes(graph.adjacencyList[2], [1, 3]);
  assertArrayIncludes(graph.adjacencyList[3], [1, 2]);
  assertEquals(graph.adjacencyList[4], undefined);
});
