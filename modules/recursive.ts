import { assertEquals } from "../deps.ts";

function factorial(n: number): number {
  if (n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

Deno.test("factorial", (_) => {
  assertEquals(factorial(5), 120);
  assertEquals(factorial(6), 720);
  assertEquals(factorial(7), 5040);
});
