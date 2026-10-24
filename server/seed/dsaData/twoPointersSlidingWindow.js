module.exports = [
  // 5 Easy
  {
    problemId: 29,
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii-sorted-array',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Easy',
    description: `Given a 1-indexed array of integers $numbers$ that is already sorted in non-decreasing order, find two numbers such that they add up to a specific $target$ number.
Print their 1-based indices space-separated.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ space-separated integers in ascending order.

### Output Format
- Print two space-separated 1-based indices \`i j\` ($i < j$).`,
    examples: [
      { input: '4 9\n2 7 11 15', output: '1 2', explanation: 'numbers[1] + numbers[2] = 2 + 7 = 9.' },
      { input: '3 6\n2 3 4', output: '1 3', explanation: 'numbers[1] + numbers[3] = 2 + 4 = 6.' }
    ],
    constraints: ['2 <= N <= 10^5', 'numbers is sorted'],
    tags: ['Two Pointers', 'Arrays'],
    hints: ['Place left pointer at 0 and right pointer at N-1. If sum < target, increment left; if sum > target, decrement right.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let l = 0, r = n - 1;
  while(l < r) {
    const s = a[l] + a[r];
    if(s === target) {
      console.log((l + 1) + ' ' + (r + 1));
      break;
    } else if(s < target) l++;
    else r--;
  }
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    l, r = 0, n - 1
    while l < r:
        s = a[l] + a[r]
        if s == target:
            print(f"{l+1} {r+1}")
            break
        elif s < target: l += 1
        else: r -= 1`
    },
    testCases: [
      { input: '4 9\n2 7 11 15', expectedOutput: '1 2', isHidden: false },
      { input: '3 6\n2 3 4', expectedOutput: '1 3', isHidden: false },
      { input: '2 -1\n-1 0', expectedOutput: '1 2', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer inward scan in O(N) time and O(1) space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 30,
    title: 'Squares of a Sorted Array',
    slug: 'squares-of-a-sorted-array',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Easy',
    description: `Given an integer array $nums$ sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.

### Input Format
- First line: integer $N$.
- Second line: $N$ sorted integers.

### Output Format
- Print the sorted squared elements space-separated.`,
    examples: [
      { input: '5\n-4 -1 0 3 10', output: '0 1 9 16 100', explanation: 'Squares: [16, 1, 0, 9, 100], sorted: [0, 1, 9, 16, 100].' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Two Pointers', 'Arrays'],
    hints: ['The largest squares will be at either end of the array. Use two pointers moving inward.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  const res = new Array(n);
  let l = 0, r = n - 1, idx = n - 1;
  while(l <= r) {
    const s1 = a[l] * a[l];
    const s2 = a[r] * a[r];
    if(s1 > s2) {
      res[idx--] = s1;
      l++;
    } else {
      res[idx--] = s2;
      r--;
    }
  }
  console.log(res.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    res = [0] * n
    l, r, idx = 0, n - 1, n - 1
    while l <= r:
        if abs(a[l]) > abs(a[r]):
            res[idx] = a[l] * a[l]
            l += 1
        else:
            res[idx] = a[r] * a[r]
            r -= 1
        idx -= 1
    print(' '.join(map(str, res)))`
    },
    testCases: [
      { input: '5\n-4 -1 0 3 10', expectedOutput: '0 1 9 16 100', isHidden: false },
      { input: '5\n-7 -3 2 3 11', expectedOutput: '4 9 9 49 121', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer comparing absolute extremes.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 31,
    title: 'Valid Palindrome II (At Most One Deletion)',
    slug: 'valid-palindrome-at-most-one-deletion',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Easy',
    description: `Given a string $S$, return \`true\` if the $S$ can be a palindrome after deleting at most one character from it, else \`false\`.

### Input Format
- A single line containing string $S$.

### Output Format
- \`true\` or \`false\`.`,
    examples: [
      { input: 'aba', output: 'true', explanation: 'Already palindrome.' },
      { input: 'abca', output: 'true', explanation: 'Delete "c" or "b".' },
      { input: 'abc', output: 'false', explanation: 'Cannot form palindrome with 1 deletion.' }
    ],
    constraints: ['1 <= |S| <= 10^5'],
    tags: ['Two Pointers', 'Strings'],
    hints: ['When characters mismatch, check if substring skipping left or substring skipping right is a palindrome.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
function isPal(str, l, r) {
  while(l < r) {
    if(str[l] !== str[r]) return false;
    l++; r--;
  }
  return true;
}
let l = 0, r = s.length - 1, ans = true;
while(l < r) {
  if(s[l] !== s[r]) {
    ans = isPal(s, l + 1, r) || isPal(s, l, r - 1);
    break;
  }
  l++; r--;
}
console.log(ans ? 'true' : 'false');`,
      python: `import sys
s = sys.stdin.read().strip()
def is_pal(sub):
    return sub == sub[::-1]
l, r = 0, len(s) - 1
ans = True
while l < r:
    if s[l] != s[r]:
        ans = is_pal(s[l+1:r+1]) or is_pal(s[l:r])
        break
    l += 1; r -= 1
print("true" if ans else "false")`
    },
    testCases: [
      { input: 'aba', expectedOutput: 'true', isHidden: false },
      { input: 'abca', expectedOutput: 'true', isHidden: false },
      { input: 'abc', expectedOutput: 'false', isHidden: false }
    ],
    solution: {
      approach: 'Two pointers with single branch on first mismatch.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 32,
    title: 'Maximum Average Subarray of Size K',
    slug: 'max-average-subarray-size-k',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Easy',
    description: `You are given an integer array $nums$ consisting of $N$ elements, and an integer $K$.
Find a contiguous subarray whose length is equal to $K$ that has the maximum average value and return this value rounded to 2 decimal places.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ integers.

### Output Format
- Maximum average formatted with two decimals (e.g. \`12.75\`).`,
    examples: [
      { input: '6 4\n1 12 -5 -6 50 3', output: '12.75', explanation: 'Subarray [12, -5, -6, 50] has sum 51, 51 / 4 = 12.75.' }
    ],
    constraints: ['1 <= K <= N <= 10^5'],
    tags: ['Sliding Window', 'Arrays'],
    hints: ['Compute the sum of the first K elements, then slide the window by adding the incoming element and subtracting the outgoing.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let curr = 0;
  for(let i=0; i<k; i++) curr += a[i];
  let max = curr;
  for(let i=k; i<n; i++) {
    curr += a[i] - a[i-k];
    max = Math.max(max, curr);
  }
  console.log((max / k).toFixed(2));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    curr = sum(a[:k])
    mx = curr
    for i in range(k, n):
        curr += a[i] - a[i-k]
        mx = max(mx, curr)
    print(f"{mx / k:.2f}")`
    },
    testCases: [
      { input: '6 4\n1 12 -5 -6 50 3', expectedOutput: '12.75', isHidden: false },
      { input: '1 1\n5', expectedOutput: '5.00', isHidden: true }
    ],
    solution: {
      approach: 'Fixed size sliding window of length K.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 33,
    title: 'Sort Array By Parity (Evens First)',
    slug: 'sort-array-by-parity',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Easy',
    description: `Given an integer array $nums$, move all the even integers at the beginning of the array followed by all the odd integers. The relative order does not matter.
Output the resulting array space-separated.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print array with all evens before odds.`,
    examples: [
      { input: '4\n3 1 2 4', output: '4 2 1 3', explanation: 'All evens are placed before odds.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Two Pointers', 'Arrays'],
    hints: ['Use two pointers: left scanning for odd, right scanning for even, and swap.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  let l = 0, r = n - 1;
  while(l < r) {
    if(a[l] % 2 > a[r] % 2) {
      [a[l], a[r]] = [a[r], a[l]];
    }
    if(a[l] % 2 === 0) l++;
    if(a[r] % 2 === 1) r--;
  }
  console.log(a.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    l, r = 0, n - 1
    while l < r:
        if a[l] % 2 > a[r] % 2:
            a[l], a[r] = a[r], a[l]
        if a[l] % 2 == 0: l += 1
        if a[r] % 2 == 1: r -= 1
    print(' '.join(map(str, a)))`
    },
    testCases: [
      { input: '4\n3 1 2 4', expectedOutput: '4 2 1 3', isHidden: false },
      { input: '2\n0 1', expectedOutput: '0 1', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer partition.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },

  // 5 Medium
  {
    problemId: 34,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Medium',
    description: `You are given an integer array $height$ of length $N$. There are $N$ vertical lines drawn such that the two endpoints of the $i$-th line are $(i, 0)$ and $(i, height[i])$.
Find two lines that together with the x-axis form a container, such that the container contains the most water.
Print the maximum amount of water a container can store.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print maximum water capacity.`,
    examples: [
      { input: '9\n1 8 6 2 5 4 8 3 7', output: '49', explanation: 'Max area formed between height 8 and 7 at distance 7: min(8, 7) * 7 = 49.' }
    ],
    constraints: ['2 <= N <= 10^5'],
    tags: ['Two Pointers', 'Greedy'],
    hints: ['Place left at 0 and right at N-1. Calculate area, then move the pointer pointing to the shorter line.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const h = input.slice(1, n + 1).map(Number);
  let l = 0, r = n - 1, maxArea = 0;
  while(l < r) {
    const area = Math.min(h[l], h[r]) * (r - l);
    maxArea = Math.max(maxArea, area);
    if(h[l] < h[r]) l++;
    else r--;
  }
  console.log(maxArea);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    h = [int(x) for x in data[1:n+1]]
    l, r, ans = 0, n - 1, 0
    while l < r:
        ans = max(ans, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]: l += 1
        else: r -= 1
    print(ans)`
    },
    testCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49', isHidden: false },
      { input: '2\n1 1', expectedOutput: '1', isHidden: false },
      { input: '4\n4 3 2 1 4', expectedOutput: '16', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer greedy inward shrinking.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 35,
    title: '3Sum Problem',
    slug: 'three-sum-problem',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Medium',
    description: `Given an integer array $nums$, find all unique triplets $[nums[i], nums[j], nums[k]]$ such that $i \\neq j$, $i \\neq k$, and $j \\neq k$, and $nums[i] + nums[j] + nums[k] = 0$.
Print the number of unique triplets found.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print total number of valid triplets.`,
    examples: [
      { input: '6\n-1 0 1 2 -1 -4', output: '2', explanation: 'Triplets: [-1, -1, 2] and [-1, 0, 1]. Count = 2.' },
      { input: '3\n0 1 1', output: '0', explanation: 'No triplet sums to 0.' }
    ],
    constraints: ['3 <= N <= 3000'],
    tags: ['Two Pointers', 'Sorting'],
    hints: ['Sort the array. Fix the first element with a loop, then use two pointers for the remaining two elements.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number).sort((x,y)=>x-y);
  let count = 0;
  for(let i=0; i<n-2; i++) {
    if(i > 0 && a[i] === a[i-1]) continue;
    let l = i + 1, r = n - 1;
    while(l < r) {
      const sum = a[i] + a[l] + a[r];
      if(sum === 0) {
        count++;
        while(l < r && a[l] === a[l+1]) l++;
        while(l < r && a[r] === a[r-1]) r--;
        l++; r--;
      } else if(sum < 0) l++;
      else r--;
    }
  }
  console.log(count);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = sorted(int(x) for x in data[1:n+1])
    cnt = 0
    for i in range(n-2):
        if i > 0 and a[i] == a[i-1]: continue
        l, r = i + 1, n - 1
        while l < r:
            s = a[i] + a[l] + a[r]
            if s == 0:
                cnt += 1
                while l < r and a[l] == a[l+1]: l += 1
                while l < r and a[r] == a[r-1]: r -= 1
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    print(cnt)`
    },
    testCases: [
      { input: '6\n-1 0 1 2 -1 -4', expectedOutput: '2', isHidden: false },
      { input: '3\n0 1 1', expectedOutput: '0', isHidden: false },
      { input: '3\n0 0 0', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Sorting + Two-pointer scan.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 36,
    title: 'Minimum Size Subarray Sum',
    slug: 'minimum-size-subarray-sum',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Medium',
    description: `Given an array of positive integers $nums$ and a positive integer $target$, return the minimal length of a subarray whose sum is greater than or equal to $target$. If there is no such subarray, print \`0\`.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ positive integers.

### Output Format
- Minimal subarray length, or \`0\`.`,
    examples: [
      { input: '6 7\n2 3 1 2 4 3', output: '2', explanation: 'Subarray [4, 3] has sum 7 and minimal length 2.' }
    ],
    constraints: ['1 <= N <= 10^5', '1 <= target <= 10^9'],
    tags: ['Sliding Window', 'Two Pointers'],
    hints: ['Expand the right pointer adding elements to sum. While sum >= target, update minLen and shrink the left pointer.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let l = 0, sum = 0, minLen = Infinity;
  for(let r=0; r<n; r++) {
    sum += a[r];
    while(sum >= target) {
      minLen = Math.min(minLen, r - l + 1);
      sum -= a[l++];
    }
  }
  console.log(minLen === Infinity ? 0 : minLen);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    l = curr = 0
    ans = float('inf')
    for r in range(n):
        curr += a[r]
        while curr >= target:
            ans = min(ans, r - l + 1)
            curr -= a[l]
            l += 1
    print(ans if ans != float('inf') else 0)`
    },
    testCases: [
      { input: '6 7\n2 3 1 2 4 3', expectedOutput: '2', isHidden: false },
      { input: '3 4\n1 4 4', expectedOutput: '1', isHidden: false },
      { input: '5 100\n1 2 3 4 5', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Dynamic sliding window in O(N).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 37,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Medium',
    description: `Given $N$ non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Input Format
- First line: integer $N$.
- Second line: $N$ non-negative integers.

### Output Format
- Print total trapped water units.`,
    examples: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: 'Total 6 units of rain water trapped.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Two Pointers', 'Dynamic Programming'],
    hints: ['Two pointers left and right maintain left_max and right_max.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const h = input.slice(1, n + 1).map(Number);
  let l = 0, r = n - 1, leftMax = 0, rightMax = 0, water = 0;
  while(l <= r) {
    if(h[l] <= h[r]) {
      if(h[l] >= leftMax) leftMax = h[l];
      else water += leftMax - h[l];
      l++;
    } else {
      if(h[r] >= rightMax) rightMax = h[r];
      else water += rightMax - h[r];
      r--;
    }
  }
  console.log(water);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    h = [int(x) for x in data[1:n+1]]
    l, r = 0, n - 1
    lm = rm = ans = 0
    while l <= r:
        if h[l] <= h[r]:
            if h[l] >= lm: lm = h[l]
            else: ans += lm - h[l]
            l += 1
        else:
            if h[r] >= rm: rm = h[r]
            else: ans += rm - h[r]
            r -= 1
    print(ans)`
    },
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { input: '6\n4 2 0 3 2 5', expectedOutput: '9', isHidden: false }
    ],
    solution: {
      approach: 'Two-pointer inward water tracking in O(N) time and O(1) space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 38,
    title: 'Longest Repeating Character Replacement',
    slug: 'longest-repeating-character-replacement',
    topic: 'Two Pointers / Sliding Window',
    difficulty: 'Medium',
    description: `You are given a string $S$ and an integer $K$. You can choose any character of the string and change it to any other uppercase English character at most $K$ times.
Return the length of the longest substring containing the same letter you can get.

### Input Format
- First line: integer $K$.
- Second line: uppercase string $S$.

### Output Format
- Print maximum substring length.`,
    examples: [
      { input: '2\nABAB', output: '4', explanation: 'Replace the two "A"s with "B"s or vice versa.' },
      { input: '1\nAABABBA', output: '4', explanation: 'Replace middle "A" with "B" gives "AABBBBA" or "BBBB" length 4.' }
    ],
    constraints: ['0 <= K <= |S| <= 10^5'],
    tags: ['Sliding Window', 'Strings'],
    hints: ['Window length minus max frequency must be <= K. If (r - l + 1) - maxFreq > K, shrink window.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
if (lines.length >= 2) {
  const k = parseInt(lines[0]);
  const s = lines[1];
  const count = {};
  let l = 0, maxCount = 0, maxLen = 0;
  for(let r=0; r<s.length; r++) {
    count[s[r]] = (count[s[r]] || 0) + 1;
    maxCount = Math.max(maxCount, count[s[r]]);
    if((r - l + 1) - maxCount > k) {
      count[s[l]]--;
      l++;
    }
    maxLen = Math.max(maxLen, r - l + 1);
  }
  console.log(maxLen);
}`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if len(lines) >= 2:
    k = int(lines[0])
    s = lines[1]
    count = {}
    l = max_count = max_len = 0
    for r in range(len(s)):
        count[s[r]] = count.get(s[r], 0) + 1
        max_count = max(max_count, count[s[r]])
        if (r - l + 1) - max_count > k:
            count[s[l]] -= 1
            l += 1
        max_len = max(max_len, r - l + 1)
    print(max_len)`
    },
    testCases: [
      { input: '2\nABAB', expectedOutput: '4', isHidden: false },
      { input: '1\nAABABBA', expectedOutput: '4', isHidden: false }
    ],
    solution: {
      approach: 'Sliding window tracking most frequent character count.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  }
];
