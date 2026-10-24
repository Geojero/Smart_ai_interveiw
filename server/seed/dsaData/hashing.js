module.exports = [
  // 5 Easy
  {
    problemId: 19,
    title: 'Two Sum Target Problem',
    slug: 'two-sum-target-problem',
    topic: 'Hashing',
    difficulty: 'Easy',
    description: `Given an array of integers $nums$ and an integer $target$, print the 0-based indices of the two numbers such that they add up to $target$.
If multiple pairs exist, print the pair with the smallest first index.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ space-separated integers.

### Output Format
- Print two space-separated integers representing indices \`i j\` with $i < j$.`,
    examples: [
      { input: '4 9\n2 7 11 15', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
      { input: '3 6\n3 2 4', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6.' }
    ],
    constraints: ['2 <= N <= 10^5', '-10^9 <= nums[i], target <= 10^9'],
    tags: ['Hashing', 'Arrays'],
    hints: ['Store elements and their indices in a hash map as you iterate.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const nums = input.slice(2, n + 2).map(Number);
  const map = new Map();
  for(let i=0; i<n; i++) {
    const complement = target - nums[i];
    if(map.has(complement)) {
      console.log(map.get(complement) + ' ' + i);
      break;
    }
    map.set(nums[i], i);
  }
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    nums = [int(x) for x in data[2:n+2]]
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            break
        seen[num] = i`
    },
    testCases: [
      { input: '4 9\n2 7 11 15', expectedOutput: '0 1', isHidden: false },
      { input: '3 6\n3 2 4', expectedOutput: '1 2', isHidden: false },
      { input: '2 6\n3 3', expectedOutput: '0 1', isHidden: true }
    ],
    solution: {
      approach: 'Hash map lookup in O(1) expected time.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 20,
    title: 'First Non-Repeating Character',
    slug: 'first-non-repeating-character',
    topic: 'Hashing',
    difficulty: 'Easy',
    description: `Given a string $S$ consisting of lowercase English letters, find the first non-repeating character in it and print its 0-based index. If it does not exist, print \`-1\`.

### Input Format
- A single line containing string $S$.

### Output Format
- Print index of first non-repeating character, or \`-1\`.`,
    examples: [
      { input: 'leetcode', output: '0', explanation: "'l' is the first unique character at index 0." },
      { input: 'loveleetcode', output: '2', explanation: "'v' is the first unique character at index 2." },
      { input: 'aabb', output: '-1', explanation: 'All characters repeat.' }
    ],
    constraints: ['1 <= |S| <= 10^5'],
    tags: ['Hashing', 'Strings'],
    hints: ['Count the frequency of each character in a first pass, then find the first character with count 1 in a second pass.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const count = {};
for(let c of s) count[c] = (count[c] || 0) + 1;
let ans = -1;
for(let i=0; i<s.length; i++) {
  if(count[s[i]] === 1) { ans = i; break; }
}
console.log(ans);`,
      python: `import sys
s = sys.stdin.read().strip()
counts = {}
for c in s:
    counts[c] = counts.get(c, 0) + 1
ans = -1
for i, c in enumerate(s):
    if counts[c] == 1:
        ans = i
        break
print(ans)`
    },
    testCases: [
      { input: 'leetcode', expectedOutput: '0', isHidden: false },
      { input: 'loveleetcode', expectedOutput: '2', isHidden: false },
      { input: 'aabb', expectedOutput: '-1', isHidden: false }
    ],
    solution: {
      approach: 'Two-pass frequency map.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 21,
    title: 'Intersection of Two Arrays',
    slug: 'intersection-of-two-arrays',
    topic: 'Hashing',
    difficulty: 'Easy',
    description: `Given two integer arrays $nums1$ and $nums2$, print the unique elements that appear in both arrays in ascending order. If there is no common element, print \`-1\`.

### Input Format
- First line: integer $N$ (size of first array).
- Second line: $N$ integers.
- Third line: integer $M$ (size of second array).
- Fourth line: $M$ integers.

### Output Format
- Print space-separated unique intersection elements sorted ascending, or \`-1\`.`,
    examples: [
      { input: '4\n1 2 2 1\n2\n2 2', output: '2', explanation: '2 is the only common element.' },
      { input: '5\n4 9 5 4 4\n5\n9 4 9 8 4', output: '4 9', explanation: 'Unique common elements sorted: 4 9.' }
    ],
    constraints: ['1 <= N, M <= 10^5'],
    tags: ['Hashing', 'Arrays'],
    hints: ['Store first array in a hash set, then filter the second array and sort unique values.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const s1 = new Set(input.slice(idx, idx + n).map(Number));
  idx += n;
  const m = parseInt(input[idx++]);
  const arr2 = input.slice(idx, idx + m).map(Number);
  const common = new Set();
  for(let x of arr2) {
    if(s1.has(x)) common.add(x);
  }
  if(common.size === 0) console.log('-1');
  else console.log(Array.from(common).sort((a,b)=>a-b).join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    n = int(data[idx]); idx += 1
    s1 = set(int(x) for x in data[idx:idx+n]); idx += n
    m = int(data[idx]); idx += 1
    s2 = set(int(x) for x in data[idx:idx+m])
    inter = sorted(list(s1 & s2))
    print(' '.join(map(str, inter)) if inter else "-1")`
    },
    testCases: [
      { input: '4\n1 2 2 1\n2\n2 2', expectedOutput: '2', isHidden: false },
      { input: '5\n4 9 5 4 4\n5\n9 4 9 8 4', expectedOutput: '4 9', isHidden: false },
      { input: '2\n1 2\n2\n3 4', expectedOutput: '-1', isHidden: true }
    ],
    solution: {
      approach: 'Set intersection and sorting.',
      timeComplexity: 'O(N + M log M)',
      spaceComplexity: 'O(N + M)'
    }
  },
  {
    problemId: 22,
    title: 'Isomorphic Strings Check',
    slug: 'isomorphic-strings-check',
    topic: 'Hashing',
    difficulty: 'Easy',
    description: `Two strings $S$ and $T$ are isomorphic if the characters in $S$ can be replaced to get $T$. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.

### Input Format
- First line: string $S$.
- Second line: string $T$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: 'egg\nadd', output: 'true', explanation: 'e->a, g->d.' },
      { input: 'foo\nbar', output: 'false', explanation: 'o cannot map to both a and r.' }
    ],
    constraints: ['1 <= |S|, |T| <= 10^5'],
    tags: ['Hashing', 'Strings'],
    hints: ['Check bijection: map from S to T and check reverse map from T to S.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const [s, t] = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim());
function isIsomorphic(s, t) {
  if(!s || !t || s.length !== t.length) return false;
  const m1 = {}, m2 = {};
  for(let i=0; i<s.length; i++) {
    if((m1[s[i]] && m1[s[i]] !== t[i]) || (m2[t[i]] && m2[t[i]] !== s[i])) return false;
    m1[s[i]] = t[i];
    m2[t[i]] = s[i];
  }
  return true;
}
console.log(isIsomorphic(s, t) ? 'true' : 'false');`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if len(lines) >= 2:
    s, t = lines[0], lines[1]
    def check(s, t):
        if len(s) != len(t): return False
        return len(set(zip(s, t))) == len(set(s)) == len(set(t))
    print("true" if check(s, t) else "false")
else:
    print("false")`
    },
    testCases: [
      { input: 'egg\nadd', expectedOutput: 'true', isHidden: false },
      { input: 'foo\nbar', expectedOutput: 'false', isHidden: false },
      { input: 'paper\ntitle', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'Two-way hash bijection.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 23,
    title: 'Happy Number Check',
    slug: 'happy-number-check',
    topic: 'Hashing',
    difficulty: 'Easy',
    description: `A happy number is a number defined by the following process:
Starting with any positive integer, replace the number by the sum of the squares of its digits.
Repeat the process until the number equals 1, or it loops endlessly in a cycle which does not include 1.
Print \`true\` if $N$ is a happy number, else \`false\`.

### Input Format
- A single integer $N$.

### Output Format
- \`true\` or \`false\`.`,
    examples: [
      { input: '19', output: 'true', explanation: '1^2 + 9^2 = 82 -> 68 -> 100 -> 1.' },
      { input: '2', output: 'false', explanation: 'Enters an infinite cycle without reaching 1.' }
    ],
    constraints: ['1 <= N <= 2^31 - 1'],
    tags: ['Hashing', 'Math'],
    hints: ['Keep track of visited sums in a set to detect loops.'],
    starterCodes: {
      javascript: `const fs = require('fs');
let n = parseInt(fs.readFileSync(0, 'utf-8').trim());
const seen = new Set();
function getNext(num) {
  let sum = 0;
  while(num > 0) {
    let d = num % 10;
    sum += d * d;
    num = Math.floor(num / 10);
  }
  return sum;
}
while(n !== 1 && !seen.has(n)) {
  seen.add(n);
  n = getNext(n);
}
console.log(n === 1 ? 'true' : 'false');`,
      python: `import sys
n = int(sys.stdin.read().strip())
seen = set()
def nxt(x):
    return sum(int(d)**2 for d in str(x))
while n != 1 and n not in seen:
    seen.add(n)
    n = nxt(n)
print("true" if n == 1 else "false")`
    },
    testCases: [
      { input: '19', expectedOutput: 'true', isHidden: false },
      { input: '2', expectedOutput: 'false', isHidden: false },
      { input: '7', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'Cycle detection via hash set or Floyd tortoise/hare.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(log N)'
    }
  },

  // 5 Medium
  {
    problemId: 24,
    title: 'Subarray Sum Equals K',
    slug: 'subarray-sum-equals-k',
    topic: 'Hashing',
    difficulty: 'Medium',
    description: `Given an array of integers $nums$ and an integer $K$, return the total number of subarrays whose sum equals to $K$.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ space-separated integers.

### Output Format
- Print the total count of valid subarrays.`,
    examples: [
      { input: '3 2\n1 1 1', output: '2', explanation: '[1, 1] at [0,1] and [1,2].' },
      { input: '3 3\n1 2 3', output: '2', explanation: '[1, 2] and [3].' }
    ],
    constraints: ['1 <= N <= 10^5', '-1000 <= nums[i] <= 1000', '-10^7 <= K <= 10^7'],
    tags: ['Hashing', 'Prefix Sum'],
    hints: ['Maintain prefix sum frequencies in a hash map. For current sum S, check if S - K has been seen.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if(input.length >= 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const nums = input.slice(2, n + 2).map(Number);
  const map = new Map();
  map.set(0, 1);
  let count = 0, sum = 0;
  for(let x of nums) {
    sum += x;
    if(map.has(sum - k)) count += map.get(sum - k);
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  console.log(count);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    nums = [int(x) for x in data[2:n+2]]
    counts = {0: 1}
    ans = curr = 0
    for x in nums:
        curr += x
        ans += counts.get(curr - k, 0)
        counts[curr] = counts.get(curr, 0) + 1
    print(ans)`
    },
    testCases: [
      { input: '3 2\n1 1 1', expectedOutput: '2', isHidden: false },
      { input: '3 3\n1 2 3', expectedOutput: '2', isHidden: false },
      { input: '5 0\n0 0 0 0 0', expectedOutput: '15', isHidden: true }
    ],
    solution: {
      approach: 'Prefix sum hash map.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 25,
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    topic: 'Hashing',
    difficulty: 'Medium',
    description: `Given an integer array $nums$ and an integer $K$, return the $K$ most frequent elements sorted in descending order of frequency. If frequencies are equal, sort by numerical value ascending.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ integers.

### Output Format
- Print $K$ space-separated integers.`,
    examples: [
      { input: '6 2\n1 1 1 2 2 3', output: '1 2', explanation: '1 appears 3 times, 2 appears 2 times.' }
    ],
    constraints: ['1 <= N <= 10^5', '1 <= K <= number of unique elements'],
    tags: ['Hashing', 'Heap'],
    hints: ['Count frequency of each element and sort by frequency or use bucket sort.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const nums = input.slice(2, n + 2).map(Number);
  const freq = {};
  for(let x of nums) freq[x] = (freq[x] || 0) + 1;
  const entries = Object.entries(freq).map(([num, count]) => ({ num: Number(num), count }));
  entries.sort((a,b) => b.count - a.count || a.num - b.num);
  console.log(entries.slice(0, k).map(e => e.num).join(' '));
}`,
      python: `import sys
from collections import Counter
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    nums = [int(x) for x in data[2:n+2]]
    counts = Counter(nums)
    res = sorted(counts.keys(), key=lambda x: (-counts[x], x))
    print(' '.join(map(str, res[:k])))`
    },
    testCases: [
      { input: '6 2\n1 1 1 2 2 3', expectedOutput: '1 2', isHidden: false },
      { input: '1 1\n1', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Frequency mapping + sorting or bucket sort.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 26,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    topic: 'Hashing',
    difficulty: 'Medium',
    description: `Given a string $S$, find the length of the longest substring without repeating characters.

### Input Format
- A single line containing string $S$.

### Output Format
- Print the integer length.`,
    examples: [
      { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc", with length 3.' },
      { input: 'bbbbb', output: '1', explanation: 'The answer is "b", with length 1.' },
      { input: 'pwwkew', output: '3', explanation: 'The answer is "wke", with length 3.' }
    ],
    constraints: ['0 <= |S| <= 10^5'],
    tags: ['Hashing', 'Sliding Window'],
    hints: ['Use sliding window with two pointers and a hash set or map storing last seen index of each char.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
if (!s) { console.log(0); process.exit(); }
let maxLen = 0, l = 0;
const map = new Map();
for(let r=0; r<s.length; r++) {
  if(map.has(s[r]) && map.get(s[r]) >= l) {
    l = map.get(s[r]) + 1;
  }
  map.set(s[r], r);
  maxLen = Math.max(maxLen, r - l + 1);
}
console.log(maxLen);`,
      python: `import sys
s = sys.stdin.read().strip()
if not s:
    print(0)
else:
    seen = {}
    l = max_len = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        max_len = max(max_len, r - l + 1)
    print(max_len)`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { input: 'pwwkew', expectedOutput: '3', isHidden: false }
    ],
    solution: {
      approach: 'Sliding window with last index map.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, Sigma))'
    }
  },
  {
    problemId: 27,
    title: 'Count Pairs with Given Difference',
    slug: 'count-pairs-with-given-difference',
    topic: 'Hashing',
    difficulty: 'Medium',
    description: `Given an array of $N$ distinct integers and an integer $K$, count all distinct pairs $(A[i], A[j])$ such that $A[i] - A[j] = K$.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ distinct integers.

### Output Format
- Print the count of such pairs.`,
    examples: [
      { input: '5 2\n1 5 3 4 2', output: '3', explanation: 'Pairs: (3,1), (4,2), (5,3).' },
      { input: '4 0\n1 2 3 4', output: '0', explanation: 'All elements are distinct.' }
    ],
    constraints: ['1 <= N <= 10^5', '0 <= K <= 10^9'],
    tags: ['Hashing', 'Arrays'],
    hints: ['Store all elements in a hash set. For each x, check if x + K exists.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const set = new Set(input.slice(2, n + 2).map(Number));
  let count = 0;
  if(k === 0) { console.log(0); process.exit(); }
  for(let x of set) {
    if(set.has(x + k)) count++;
  }
  console.log(count);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    s = set(int(x) for x in data[2:n+2])
    if k == 0:
        print(0)
    else:
        print(sum(1 for x in s if x + k in s))`
    },
    testCases: [
      { input: '5 2\n1 5 3 4 2', expectedOutput: '3', isHidden: false },
      { input: '4 0\n1 2 3 4', expectedOutput: '0', isHidden: true },
      { input: '6 3\n8 12 16 4 0 20', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Hash set lookup in O(N).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 28,
    title: '4Sum Target Combinations',
    slug: 'four-sum-target-combinations',
    topic: 'Hashing',
    difficulty: 'Medium',
    description: `Given an array $nums$ of $N$ integers and an integer $target$, find the count of unique quadruplets $[a, b, c, d]$ such that $a + b + c + d = target$.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ integers.

### Output Format
- Print the number of unique quadruplets.`,
    examples: [
      { input: '6 0\n1 0 -1 0 -2 2', output: '3', explanation: 'Unique quadruplets: [-2,-1,1,2], [-2,0,0,2], [-1,0,0,1].' }
    ],
    constraints: ['4 <= N <= 200'],
    tags: ['Hashing', 'Two Pointers'],
    hints: ['Sort the array and use two nested loops with two pointers inside.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const nums = input.slice(2, n + 2).map(Number).sort((a,b)=>a-b);
  let count = 0;
  for(let i=0; i<n-3; i++) {
    if(i > 0 && nums[i] === nums[i-1]) continue;
    for(let j=i+1; j<n-2; j++) {
      if(j > i+1 && nums[j] === nums[j-1]) continue;
      let l = j + 1, r = n - 1;
      while(l < r) {
        const sum = nums[i] + nums[j] + nums[l] + nums[r];
        if(sum === target) {
          count++;
          while(l < r && nums[l] === nums[l+1]) l++;
          while(l < r && nums[r] === nums[r-1]) r--;
          l++; r--;
        } else if(sum < target) l++;
        else r--;
      }
    }
  }
  console.log(count);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    nums = sorted(int(x) for x in data[2:n+2])
    count = 0
    for i in range(n-3):
        if i > 0 and nums[i] == nums[i-1]: continue
        for j in range(i+1, n-2):
            if j > i+1 and nums[j] == nums[j-1]: continue
            l, r = j + 1, n - 1
            while l < r:
                s = nums[i] + nums[j] + nums[l] + nums[r]
                if s == target:
                    count += 1
                    while l < r and nums[l] == nums[l+1]: l += 1
                    while l < r and nums[r] == nums[r-1]: r -= 1
                    l += 1; r -= 1
                elif s < target: l += 1
                else: r -= 1
    print(count)`
    },
    testCases: [
      { input: '6 0\n1 0 -1 0 -2 2', expectedOutput: '3', isHidden: false },
      { input: '5 0\n2 2 2 2 2', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Sorted two-pointer 4Sum in O(N^3).',
      timeComplexity: 'O(N^3)',
      spaceComplexity: 'O(1)'
    }
  }
];
