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

function mergeSort(nums: readonly number[]): number[] {
  const _nums = [...nums];
  if (_nums.length < 2) {
    return _nums;
  }
  const mid = Math.floor(_nums.length / 2);
  return marge(
    mergeSort(_nums.slice(0, mid)),
    mergeSort(_nums.slice(mid)),
  );
}

function marge(nums1: readonly number[], nums2: readonly number[]): number[] {
  let [i1, i2] = [0, 0];
  const nums: number[] = [];
  while (i1 < nums1.length && i2 < nums2.length) {
    if (nums1[i1] <= nums2[i2]) {
      nums.push(nums1[i1]);
      i1++;
    } else {
      nums.push(nums2[i2]);
      i2++;
    }
  }
  while (i1 < nums1.length) {
    nums.push(nums1[i1]);
    i1++;
  }
  while (i2 < nums2.length) {
    nums.push(nums2[i2]);
    i2++;
  }
  return nums;
}

function quickSort(
  nums: number[],
  left = 0,
  right = nums.length - 1,
): number[] {
  if (left < right) {
    const pivotIndex = pivot(nums, left, right);
    quickSort(nums, left, pivotIndex - 1);
    quickSort(nums, pivotIndex + 1, right);
  }
  return nums;
}

function pivot(
  nums: number[],
  pivotIndex: number,
  lastIndex: number,
): number {
  let swapIndex = pivotIndex;
  for (let i = swapIndex + 1; i <= lastIndex; i++) {
    if (nums[i] < nums[pivotIndex]) {
      swapIndex++;
      [nums[swapIndex], nums[i]] = [nums[i], nums[swapIndex]];
    }
  }
  [nums[swapIndex], nums[pivotIndex]] = [nums[pivotIndex], nums[swapIndex]];
  return swapIndex;
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
  assertEquals(mergeSort([3]), [3]);
  assertEquals(mergeSort([]), []);
});

Deno.test("selection sort", (_) => {
  assertEquals(
    selectionSort([10, 4, 4, 2, 7, 6, 1]),
    [1, 2, 4, 4, 6, 7, 10],
  );
  assertEquals(mergeSort([3]), [3]);
  assertEquals(mergeSort([]), []);
});

Deno.test("insertion sort", (_) => {
  assertEquals(
    insertionSort([5, 8, 1, 3, 10, 2, 7, 7]),
    [1, 2, 3, 5, 7, 7, 8, 10],
  );
  assertEquals(mergeSort([3]), [3]);
  assertEquals(mergeSort([]), []);
});

Deno.test("merge sort", (_) => {
  assertEquals(
    mergeSort([5, 8, 1, 3, 10, 2, 7, 7]),
    [1, 2, 3, 5, 7, 7, 8, 10],
  );
  assertEquals(mergeSort([3]), [3]);
  assertEquals(mergeSort([]), []);
});

Deno.test("quick sort", (_) => {
  assertEquals(
    quickSort([5, 8, 1, 3, 10, 2, 7, 7]),
    [1, 2, 3, 5, 7, 7, 8, 10],
  );
  assertEquals(quickSort([3]), [3]);
  assertEquals(quickSort([]), []);
});
