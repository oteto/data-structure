import { assertEquals } from "../deps.ts";

function bubbleSort(nums: readonly number[]): number[] {
  const _nums = [...nums];
  for (let i = _nums.length - 1; 0 < i; i--) {
    for (let j = 0; j < i; j++) {
      if (_nums[j] > _nums[j + 1]) {
        [_nums[j], _nums[j + 1]] = [_nums[j + 1], _nums[j]];
      }
    }
  }
  return _nums;
}

function selectionSort(nums: readonly number[]): number[] {
  const _nums = [...nums];
  for (let i = 0; i < _nums.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < _nums.length; j++) {
      if (_nums[j] < _nums[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [_nums[i], _nums[minIndex]] = [_nums[minIndex], _nums[i]];
    }
  }
  return _nums;
}

function insertionSort(nums: readonly number[]): number[] {
  const _nums = [...nums];
  for (let i = 1; i < _nums.length; i++) {
    const curr = _nums[i];
    let j = i - 1;
    for (; j >= 0 && curr < _nums[j]; j--) {
      _nums[j + 1] = _nums[j];
    }
    _nums[j + 1] = curr;
  }
  return _nums;
}

Deno.test("bubble sort", (_) => {
  assertEquals(
    bubbleSort([4, 7, 5, 1, 10]),
    [1, 4, 5, 7, 10],
  );
  assertEquals(
    bubbleSort([5, 5, 5, 1, 3, 3, 6, 10]),
    [1, 3, 3, 5, 5, 5, 6, 10],
  );
});

Deno.test("selection sort", (_) => {
  assertEquals(
    selectionSort([10, 4, 4, 2, 7, 6, 1]),
    [1, 2, 4, 4, 6, 7, 10],
  );
});

Deno.test("insertion sort", (_) => {
  assertEquals(
    insertionSort([5, 8, 1, 3, 10, 2, 7, 7]),
    [1, 2, 3, 5, 7, 7, 8, 10],
  );
});
