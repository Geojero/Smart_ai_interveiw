module.exports = [
  // 5 Easy
  {
    problemId: 39,
    title: 'Binary Search in Sorted Array',
    slug: 'binary-search-sorted-array',
    topic: 'Sorting & Searching',
    difficulty: 'Easy',
    description: `Given a sorted array of $N$ integers and a target value $K$, return the 0-based index of $K$ in the array. If $K$ does not exist, return \`-1\`.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ sorted integers.

### Output Format
- Print index of $K$ or \`-1\`.`,
    examples: [
      { input: '6 9\n-1 0 3 5 9 12', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '6 2\n-1 0 3 5 9 12', output: '-1', explanation: '2 does not exist in nums.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Binary Search', 'Arrays'],
    hints: ['Check the midpoint; divide search space in half each iteration.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let l = 0, r = n - 1, ans = -1;
  while(l <= r) {
    const mid = Math.floor((l + r) / 2);
    if(a[mid] === k) { ans = mid; break; }
    else if(a[mid] < k) l = mid + 1;
    else r = mid - 1;
  }
  console.log(ans);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    l, r, ans = 0, n - 1, -1
    while l <= r:
        m = (l + r) // 2
        if a[m] == k:
            ans = m
            break
        elif a[m] < k: l = m + 1
        else: r = m - 1
    print(ans)`
    },
    testCases: [
      { input: '6 9\n-1 0 3 5 9 12', expectedOutput: '4', isHidden: false },
      { input: '6 2\n-1 0 3 5 9 12', expectedOutput: '-1', isHidden: false },
      { input: '1 5\n5', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Classic binary search in O(log N).',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 40,
    title: 'First and Last Position of Element in Sorted Array',
    slug: 'first-last-position-sorted-array',
    topic: 'Sorting & Searching',
    difficulty: 'Easy',
    description: `Given an array of integers $nums$ sorted in non-decreasing order, find the starting and ending position of a given $target$ value.
If target is not found in the array, print \`-1 -1\`.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ sorted integers.

### Output Format
- Print two space-separated integers representing first and last index.`,
    examples: [
      { input: '6 8\n5 7 7 8 8 10', output: '3 4', explanation: '8 appears starting at 3 and ending at 4.' },
      { input: '6 6\n5 7 7 8 8 10', output: '-1 -1', explanation: '6 is not in the array.' }
    ],
    constraints: ['0 <= N <= 10^5'],
    tags: ['Binary Search'],
    hints: ['Run binary search twice: once to find the leftmost boundary, once to find the rightmost.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  function findFirst() {
    let l = 0, r = n - 1, res = -1;
    while(l <= r) {
      let m = Math.floor((l + r) / 2);
      if(a[m] >= target) { if(a[m] === target) res = m; r = m - 1; }
      else l = m + 1;
    }
    return res;
  }
  function findLast() {
    let l = 0, r = n - 1, res = -1;
    while(l <= r) {
      let m = Math.floor((l + r) / 2);
      if(a[m] <= target) { if(a[m] === target) res = m; l = m + 1; }
      else r = m - 1;
    }
    return res;
  }
  console.log(findFirst() + ' ' + findLast());
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    def search(find_first):
        l, r, res = 0, n - 1, -1
        while l <= r:
            m = (l + r) // 2
            if a[m] == target:
                res = m
                if find_first: r = m - 1
                else: l = m + 1
            elif a[m] < target: l = m + 1
            else: r = m - 1
        return res
    print(f"{search(True)} {search(False)}")`
    },
    testCases: [
      { input: '6 8\n5 7 7 8 8 10', expectedOutput: '3 4', isHidden: false },
      { input: '6 6\n5 7 7 8 8 10', expectedOutput: '-1 -1', isHidden: false },
      { input: '1 0\n0', expectedOutput: '0 0', isHidden: true }
    ],
    solution: {
      approach: 'Double binary search for lower and upper bounds.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 41,
    title: 'Search Insert Position',
    slug: 'search-insert-position',
    topic: 'Sorting & Searching',
    difficulty: 'Easy',
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ sorted integers.

### Output Format
- Print insert index.`,
    examples: [
      { input: '4 5\n1 3 5 6', output: '2', explanation: '5 is found at index 2.' },
      { input: '4 2\n1 3 5 6', output: '1', explanation: '2 inserted at index 1.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Binary Search'],
    hints: ['Binary search for lower bound. When loop terminates, left pointer is the insertion index.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let l = 0, r = n - 1;
  while(l <= r) {
    let m = Math.floor((l + r) / 2);
    if(a[m] === target) { console.log(m); process.exit(); }
    else if(a[m] < target) l = m + 1;
    else r = m - 1;
  }
  console.log(l);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    l, r = 0, n - 1
    while l <= r:
        m = (l + r) // 2
        if a[m] == target:
            print(m)
            sys.exit(0)
        elif a[m] < target: l = m + 1
        else: r = m - 1
    print(l)`
    },
    testCases: [
      { input: '4 5\n1 3 5 6', expectedOutput: '2', isHidden: false },
      { input: '4 2\n1 3 5 6', expectedOutput: '1', isHidden: false },
      { input: '4 7\n1 3 5 6', expectedOutput: '4', isHidden: true }
    ],
    solution: {
      approach: 'Binary search lower bound.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 42,
    title: 'Sort Colors (Dutch National Flag Algorithm)',
    slug: 'sort-colors-dutch-flag',
    topic: 'Sorting & Searching',
    difficulty: 'Easy',
    description: `Given an array $nums$ with $N$ objects colored red, white, or blue represented by integers 0, 1, and 2 respectively, sort them in-place so that objects of the same color are adjacent, in order 0s, 1s, and 2s.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers (each 0, 1, or 2).

### Output Format
- Print sorted array space-separated.`,
    examples: [
      { input: '6\n2 0 2 1 1 0', output: '0 0 1 1 2 2', explanation: 'Sorted in 0s, 1s, 2s.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Two Pointers', 'Sorting'],
    hints: ['Maintain three pointers: low, mid, high. Swap a[mid] with a[low] if 0, with a[high] if 2.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  let low = 0, mid = 0, high = n - 1;
  while(mid <= high) {
    if(a[mid] === 0) {
      [a[low], a[mid]] = [a[mid], a[low]];
      low++; mid++;
    } else if(a[mid] === 1) {
      mid++;
    } else {
      [a[mid], a[high]] = [a[high], a[mid]];
      high--;
    }
  }
  console.log(a.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    low, mid, high = 0, 0, n - 1
    while mid <= high:
        if a[mid] == 0:
            a[low], a[mid] = a[mid], a[low]
            low += 1; mid += 1
        elif a[mid] == 1:
            mid += 1
        else:
            a[mid], a[high] = a[high], a[mid]
            high -= 1
    print(' '.join(map(str, a)))`
    },
    testCases: [
      { input: '6\n2 0 2 1 1 0', expectedOutput: '0 0 1 1 2 2', isHidden: false },
      { input: '3\n2 0 1', expectedOutput: '0 1 2', isHidden: false },
      { input: '1\n0', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Dutch National Flag 3-way partition.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 43,
    title: 'Merge Sorted Array In-Place',
    slug: 'merge-sorted-array-in-place',
    topic: 'Sorting & Searching',
    difficulty: 'Easy',
    description: `You are given two integer arrays $nums1$ and $nums2$, sorted in non-decreasing order. Merge $nums2$ into $nums1$ as one sorted array.
Print the merged sorted array space-separated.

### Input Format
- First line: integer $M$ (elements in first array).
- Second line: $M$ sorted integers.
- Third line: integer $N$ (elements in second array).
- Fourth line: $N$ sorted integers.

### Output Format
- Print merged sorted elements.`,
    examples: [
      { input: '3\n1 2 3\n3\n2 5 6', output: '1 2 2 3 5 6', explanation: 'Merged output.' }
    ],
    constraints: ['0 <= M, N <= 10^5'],
    tags: ['Two Pointers', 'Sorting'],
    hints: ['Merge backwards from the end of both arrays to avoid overwriting.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  let idx = 0;
  const m = parseInt(input[idx++]);
  const a = input.slice(idx, idx + m).map(Number); idx += m;
  const n = parseInt(input[idx++]);
  const b = input.slice(idx, idx + n).map(Number);
  const merged = [];
  let i = 0, j = 0;
  while(i < m && j < n) {
    if(a[i] <= b[j]) merged.push(a[i++]);
    else merged.push(b[j++]);
  }
  while(i < m) merged.push(a[i++]);
  while(j < n) merged.push(b[j++]);
  console.log(merged.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    m = int(data[idx]); idx += 1
    a = [int(x) for x in data[idx:idx+m]]; idx += m
    n = int(data[idx]); idx += 1
    b = [int(x) for x in data[idx:idx+n]]
    print(' '.join(map(str, sorted(a + b))))`
    },
    testCases: [
      { input: '3\n1 2 3\n3\n2 5 6', expectedOutput: '1 2 2 3 5 6', isHidden: false },
      { input: '1\n1\n0', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer linear merge.',
      timeComplexity: 'O(M + N)',
      spaceComplexity: 'O(M + N)'
    }
  },

  // 5 Medium
  {
    problemId: 44,
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    topic: 'Sorting & Searching',
    difficulty: 'Medium',
    description: `There is an integer array $nums$ sorted in ascending order (with distinct values), which was rotated at an unknown pivot index.
Given the array and a target integer, return the index of target if it is in $nums$, or \`-1\` if it is not.
You must achieve $O(\\log N)$ runtime complexity.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ integers.

### Output Format
- Print index or \`-1\`.`,
    examples: [
      { input: '7 0\n4 5 6 7 0 1 2', output: '4', explanation: '0 is at index 4.' },
      { input: '7 3\n4 5 6 7 0 1 2', output: '-1', explanation: '3 is not in nums.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Binary Search'],
    hints: ['In any rotated sorted array, at least one half (left or right) is always strictly sorted.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let l = 0, r = n - 1, ans = -1;
  while(l <= r) {
    let m = Math.floor((l + r) / 2);
    if(a[m] === target) { ans = m; break; }
    if(a[l] <= a[m]) {
      if(a[l] <= target && target < a[m]) r = m - 1;
      else l = m + 1;
    } else {
      if(a[m] < target && target <= a[r]) l = m + 1;
      else r = m - 1;
    }
  }
  console.log(ans);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    l, r, ans = 0, n - 1, -1
    while l <= r:
        m = (l + r) // 2
        if a[m] == target:
            ans = m
            break
        if a[l] <= a[m]:
            if a[l] <= target < a[m]: r = m - 1
            else: l = m + 1
        else:
            if a[m] < target <= a[r]: l = m + 1
            else: r = m - 1
    print(ans)`
    },
    testCases: [
      { input: '7 0\n4 5 6 7 0 1 2', expectedOutput: '4', isHidden: false },
      { input: '7 3\n4 5 6 7 0 1 2', expectedOutput: '-1', isHidden: false },
      { input: '1 0\n0', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Modified binary search checking sorted half.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 45,
    title: 'Find Peak Element',
    slug: 'find-peak-element',
    topic: 'Sorting & Searching',
    difficulty: 'Medium',
    description: `A peak element is an element that is strictly greater than its neighbors.
Given a 0-indexed integer array $nums$, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.
You must write an algorithm that runs in $O(\\log N)$ time.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print index of a peak element.`,
    examples: [
      { input: '4\n1 2 3 1', output: '2', explanation: 'Index 2 (value 3) is a peak.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Binary Search'],
    hints: ['If nums[mid] < nums[mid + 1], a peak must lie to the right; otherwise to the left.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  let l = 0, r = n - 1;
  while(l < r) {
    let m = Math.floor((l + r) / 2);
    if(a[m] < a[m+1]) l = m + 1;
    else r = m;
  }
  console.log(l);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    l, r = 0, n - 1
    while l < r:
        m = (l + r) // 2
        if a[m] < a[m+1]: l = m + 1
        else: r = m
    print(l)`
    },
    testCases: [
      { input: '4\n1 2 3 1', expectedOutput: '2', isHidden: false },
      { input: '7\n1 2 1 3 5 6 4', expectedOutput: '5', isHidden: true }
    ],
    solution: {
      approach: 'Binary search gradient slope tracking.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 46,
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-array',
    topic: 'Sorting & Searching',
    difficulty: 'Medium',
    description: `Given an integer array $nums$ and an integer $K$, return the $K$-th largest element in the array.
Note that it is the $K$-th largest element in the sorted order, not the $K$-th distinct element.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ integers.

### Output Format
- Print the $K$-th largest element.`,
    examples: [
      { input: '6 2\n3 2 1 5 6 4', output: '5', explanation: 'Sorted descending: [6, 5, 4, 3, 2, 1]. 2nd largest is 5.' },
      { input: '9 4\n3 2 3 1 2 4 5 5 6', output: '4', explanation: '4th largest is 4.' }
    ],
    constraints: ['1 <= K <= N <= 10^5'],
    tags: ['Heap', 'QuickSelect', 'Sorting'],
    hints: ['Sort descending or use QuickSelect or min-heap of size K.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number).sort((x,y)=>y-x);
  console.log(a[k - 1]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    a = sorted([int(x) for x in data[2:n+2]], reverse=True)
    print(a[k-1])`
    },
    testCases: [
      { input: '6 2\n3 2 1 5 6 4', expectedOutput: '5', isHidden: false },
      { input: '9 4\n3 2 3 1 2 4 5 5 6', expectedOutput: '4', isHidden: false }
    ],
    solution: {
      approach: 'QuickSelect or Min-Heap in O(N).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 47,
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    topic: 'Sorting & Searching',
    difficulty: 'Medium',
    description: `Given an array of $N$ intervals where intervals$[i] = [start_i, end_i]$, merge all overlapping intervals, and print the resulting non-overlapping intervals in ascending order of start times.

### Input Format
- First line: integer $N$.
- Next $N$ lines: two integers $start$ and $end$.

### Output Format
- Each merged interval printed as \`start end\` on separate lines.`,
    examples: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18', explanation: '[1,3] and [2,6] overlap into [1,6].' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Sorting', 'Intervals'],
    hints: ['Sort intervals by start time, then merge adjacent ones if current start <= previous end.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const intervals = [];
  let idx = 1;
  for(let i=0; i<n; i++) {
    intervals.push([parseInt(input[idx]), parseInt(input[idx+1])]);
    idx += 2;
  }
  intervals.sort((a,b) => a[0] - b[0]);
  const res = [intervals[0]];
  for(let i=1; i<n; i++) {
    const last = res[res.length - 1];
    if(intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      res.push(intervals[i]);
    }
  }
  for(let it of res) console.log(it[0] + ' ' + it[1]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    intervals = []
    idx = 1
    for _ in range(n):
        intervals.append([int(data[idx]), int(data[idx+1])])
        idx += 2
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for it in intervals[1:]:
        if it[0] <= res[-1][1]:
            res[-1][1] = max(res[-1][1], it[1])
        else:
            res.append(it)
    for it in res:
        print(f"{it[0]} {it[1]}")`
    },
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', isHidden: false },
      { input: '2\n1 4\n4 5', expectedOutput: '1 5', isHidden: false }
    ],
    solution: {
      approach: 'Sort intervals by starting coordinate + linear scan merge.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 48,
    title: 'Capacity To Ship Packages Within D Days',
    slug: 'capacity-to-ship-packages-within-d-days',
    topic: 'Sorting & Searching',
    difficulty: 'Medium',
    description: `A conveyor belt has packages that must be shipped within $D$ days. The $i$-th package on the conveyor belt has a weight of $weights[i]$.
Find the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within $D$ days.

### Input Format
- First line: two integers $N$ and $D$.
- Second line: $N$ integers representing package weights.

### Output Format
- Print the minimum ship capacity.`,
    examples: [
      { input: '10 5\n1 2 3 4 5 6 7 8 9 10', output: '15', explanation: 'A ship capacity of 15 allows shipping in 5 days: [1..5], [6,7], [8], [9], [10].' }
    ],
    constraints: ['1 <= D <= N <= 5 * 10^4'],
    tags: ['Binary Search on Answer'],
    hints: ['Binary search the capacity in range [max(weights), sum(weights)]. Check feasibility for each mid.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const days = parseInt(input[1]);
  const weights = input.slice(2, n + 2).map(Number);
  let l = Math.max(...weights);
  let r = weights.reduce((a, b) => a + b, 0);
  function canShip(cap) {
    let d = 1, curr = 0;
    for(let w of weights) {
      if(curr + w > cap) {
        d++;
        curr = w;
      } else curr += w;
    }
    return d <= days;
  }
  let ans = r;
  while(l <= r) {
    let mid = Math.floor((l + r) / 2);
    if(canShip(mid)) {
      ans = mid;
      r = mid - 1;
    } else l = mid + 1;
  }
  console.log(ans);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, days = int(data[0]), int(data[1])
    weights = [int(x) for x in data[2:n+2]]
    l, r = max(weights), sum(weights)
    def can_ship(cap):
        d = 1
        curr = 0
        for w in weights:
            if curr + w > cap:
                d += 1
                curr = w
            else:
                curr += w
        return d <= days
    ans = r
    while l <= r:
        mid = (l + r) // 2
        if can_ship(mid):
            ans = mid
            r = mid - 1
        else:
            l = mid + 1
    print(ans)`
    },
    testCases: [
      { input: '10 5\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '15', isHidden: false },
      { input: '6 3\n3 2 2 4 1 4', expectedOutput: '6', isHidden: false }
    ],
    solution: {
      approach: 'Binary search on monotonic answer space.',
      timeComplexity: 'O(N log(sum - max))',
      spaceComplexity: 'O(1)'
    }
  }
];
