module.exports = [
  // 3 Easy
  {
    problemId: 92,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes $N$ steps to reach the top.
Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

### Input Format
- A single integer $N$.

### Output Format
- Print total distinct ways.`,
    examples: [
      { input: '2', output: '2', explanation: 'Ways: 1+1 or 2.' },
      { input: '3', output: '3', explanation: 'Ways: 1+1+1, 1+2, 2+1.' }
    ],
    constraints: ['1 <= N <= 45'],
    tags: ['Dynamic Programming', 'Math'],
    hints: ['dp[i] = dp[i-1] + dp[i-2].'],
    starterCodes: {
      javascript: `const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
let a = 1, b = 2;
if(n === 1) { console.log(1); process.exit(); }
for(let i=3; i<=n; i++) {
  let c = a + b;
  a = b;
  b = c;
}
console.log(b);`,
      python: `import sys
n = int(sys.stdin.read().strip())
if n <= 2:
    print(n)
else:
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)`
    },
    testCases: [
      { input: '2', expectedOutput: '2', isHidden: false },
      { input: '3', expectedOutput: '3', isHidden: false },
      { input: '5', expectedOutput: '8', isHidden: true }
    ],
    solution: {
      approach: 'Bottom-up Fibonacci dynamic programming.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 93,
    title: 'Min Cost Climbing Stairs',
    slug: 'min-cost-climbing-stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are given an integer array $cost$ where $cost[i]$ is the cost of $i$-th step on a staircase. Once you pay the cost, you can either climb one or two steps.
You can either start from the step with index 0, or the step with index 1.
Return the minimum cost to reach the top of the floor.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print minimum cost.`,
    examples: [
      { input: '3\n10 15 20', output: '15', explanation: 'Start at index 1, pay 15, climb two steps to reach top.' },
      { input: '10\n1 100 1 1 1 100 1 1 100 1', output: '6', explanation: 'Cheapest path pays 6.' }
    ],
    constraints: ['2 <= N <= 1000'],
    tags: ['Dynamic Programming'],
    hints: ['dp[i] = cost[i] + min(dp[i-1], dp[i-2]).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const cost = input.slice(1, n + 1).map(Number);
  let prev2 = 0, prev1 = 0;
  for(let i=2; i<=n; i++) {
    const curr = Math.min(prev1 + cost[i-1], prev2 + cost[i-2]);
    prev2 = prev1;
    prev1 = curr;
  }
  console.log(prev1);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    cost = [int(x) for x in data[1:n+1]]
    p2 = p1 = 0
    for i in range(2, n + 1):
        curr = min(p1 + cost[i-1], p2 + cost[i-2])
        p2, p1 = p1, curr
    print(p1)`
    },
    testCases: [
      { input: '3\n10 15 20', expectedOutput: '15', isHidden: false },
      { input: '10\n1 100 1 1 1 100 1 1 100 1', expectedOutput: '6', isHidden: false }
    ],
    solution: {
      approach: 'Space-optimized 1D dynamic programming.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 94,
    title: 'House Robber I (Maximum Non-Adjacent Sum)',
    slug: 'house-robber-max-non-adjacent-sum',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob two adjacent houses.
Given an integer array $nums$ representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Maximum money robbed.`,
    examples: [
      { input: '4\n1 2 3 1', output: '4', explanation: 'Rob house 1 (money 1) and house 3 (money 3). Total = 4.' },
      { input: '5\n2 7 9 3 1', output: '12', explanation: 'Rob house 1, 3, 5: 2 + 9 + 1 = 12.' }
    ],
    constraints: ['1 <= N <= 1000'],
    tags: ['Dynamic Programming'],
    hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i]).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  let rob1 = 0, rob2 = 0;
  for(let x of a) {
    const temp = Math.max(rob1 + x, rob2);
    rob1 = rob2;
    rob2 = temp;
  }
  console.log(rob2);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    r1 = r2 = 0
    for x in a:
        r1, r2 = r2, max(r1 + x, r2)
    print(r2)`
    },
    testCases: [
      { input: '4\n1 2 3 1', expectedOutput: '4', isHidden: false },
      { input: '5\n2 7 9 3 1', expectedOutput: '12', isHidden: false }
    ],
    solution: {
      approach: 'Iterative 2-state DP.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },

  // 6 Medium
  {
    problemId: 95,
    title: 'Coin Change (Fewest Coins for Amount)',
    slug: 'coin-change-fewest-coins',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are given an integer array $coins$ representing coins of different denominations and an integer $amount$ representing a total amount of money.
Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

### Input Format
- First line: two integers $N$ (number of coin types) and $amount$.
- Second line: $N$ integers.

### Output Format
- Print fewest coins or \`-1\`.`,
    examples: [
      { input: '3 11\n1 2 5', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins).' },
      { input: '1 3\n2', output: '-1', explanation: 'Cannot make 3 with coin 2.' }
    ],
    constraints: ['1 <= N <= 12', '0 <= amount <= 10^4'],
    tags: ['Dynamic Programming'],
    hints: ['dp[i] = min(dp[i], dp[i - coin] + 1) for all coins.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
  const n = parseInt(input[0]);
  const amount = parseInt(input[1]);
  const coins = input.slice(2, n + 2).map(Number);
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for(let i=1; i<=amount; i++) {
    for(let c of coins) {
      if(i - c >= 0) dp[i] = Math.min(dp[i], dp[i-c] + 1);
    }
  }
  console.log(dp[amount] === Infinity ? -1 : dp[amount]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, amount = int(data[0]), int(data[1])
    coins = [int(x) for x in data[2:n+2]]
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i-c] + 1)
    print(dp[amount] if dp[amount] != float('inf') else -1)`
    },
    testCases: [
      { input: '3 11\n1 2 5', expectedOutput: '3', isHidden: false },
      { input: '1 3\n2', expectedOutput: '-1', isHidden: false },
      { input: '1 0\n1', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Unbounded knapsack dynamic programming.',
      timeComplexity: 'O(N * amount)',
      spaceComplexity: 'O(amount)'
    }
  },
  {
    problemId: 96,
    title: 'Longest Increasing Subsequence (LIS)',
    slug: 'longest-increasing-subsequence',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `Given an integer array $nums$, return the length of the longest strictly increasing subsequence.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Length of LIS.`,
    examples: [
      { input: '8\n10 9 2 5 3 7 101 18', output: '4', explanation: 'The longest increasing subsequence is [2, 3, 7, 101], length 4.' }
    ],
    constraints: ['1 <= N <= 2500'],
    tags: ['Dynamic Programming', 'Binary Search'],
    hints: ['Patience sorting or dp[i] = 1 + max(dp[j]) for j < i and nums[j] < nums[i].'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  const tails = [];
  for(let x of a) {
    let l = 0, r = tails.length;
    while(l < r) {
      let m = Math.floor((l + r) / 2);
      if(tails[m] < x) l = m + 1;
      else r = m;
    }
    tails[l] = x;
  }
  console.log(tails.length);
}`,
      python: `import sys
import bisect
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    tails = []
    for x in a:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    print(len(tails))`
    },
    testCases: [
      { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', isHidden: false },
      { input: '6\n0 1 0 3 2 3', expectedOutput: '4', isHidden: false },
      { input: '7\n7 7 7 7 7 7 7', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Patience sort with binary search in O(N log N).',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 97,
    title: 'Longest Common Subsequence (LCS)',
    slug: 'longest-common-subsequence',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `Given two strings $text1$ and $text2$, return the length of their longest common subsequence.
If there is no common subsequence, return \`0\`.

### Input Format
- First line: string $text1$.
- Second line: string $text2$.

### Output Format
- Print the length of LCS.`,
    examples: [
      { input: 'abcde\nace', output: '3', explanation: 'The longest common subsequence is "ace" and its length is 3.' }
    ],
    constraints: ['1 <= |text1|, |text2| <= 1000'],
    tags: ['Dynamic Programming', 'Strings'],
    hints: ['If text1[i] == text2[j], dp[i][j] = 1 + dp[i-1][j-1], else max(dp[i-1][j], dp[i][j-1]).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const [s1, s2] = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim());
if (!s1 || !s2) { console.log(0); process.exit(); }
const m = s1.length, n = s2.length;
const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
for(let i=1; i<=m; i++) {
  for(let j=1; j<=n; j++) {
    if(s1[i-1] === s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
  }
}
console.log(dp[m][n]);`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if len(lines) >= 2:
    s1, s2 = lines[0], lines[1]
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    print(dp[m][n])
else:
    print(0)`
    },
    testCases: [
      { input: 'abcde\nace', expectedOutput: '3', isHidden: false },
      { input: 'abc\nabc', expectedOutput: '3', isHidden: false },
      { input: 'abc\ndef', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: '2D table LCS dynamic programming.',
      timeComplexity: 'O(M * N)',
      spaceComplexity: 'O(M * N)'
    }
  },
  {
    problemId: 98,
    title: '0/1 Knapsack Problem',
    slug: 'zero-one-knapsack-problem',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are given weights and values of $N$ items, put these items in a knapsack of capacity $W$ to get the maximum total value in the knapsack. Each item can either be picked once or not picked.

### Input Format
- First line: two integers $N$ and $W$.
- Second line: $N$ integers representing values.
- Third line: $N$ integers representing weights.

### Output Format
- Print maximum total value.`,
    examples: [
      { input: '3 4\n1 2 3\n4 5 1', output: '3', explanation: 'Pick item with weight 1 and value 3.' },
      { input: '3 50\n60 100 120\n10 20 30', output: '220', explanation: 'Pick items 2 and 3 for weight 50 and value 220.' }
    ],
    constraints: ['1 <= N <= 100', '1 <= W <= 1000'],
    tags: ['Dynamic Programming'],
    hints: ['dp[w] = max(dp[w], dp[w - weight[i]] + value[i]) traversing weights backwards.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const W = parseInt(input[idx++]);
  const val = input.slice(idx, idx + n).map(Number); idx += n;
  const wt = input.slice(idx, idx + n).map(Number);
  const dp = new Array(W + 1).fill(0);
  for(let i=0; i<n; i++) {
    for(let w=W; w>=wt[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
    }
  }
  console.log(dp[W]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    n, W = int(data[idx]), int(data[idx+1]); idx += 2
    val = [int(x) for x in data[idx:idx+n]]; idx += n
    wt = [int(x) for x in data[idx:idx+n]]
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i])
    print(dp[W])`
    },
    testCases: [
      { input: '3 4\n1 2 3\n4 5 1', expectedOutput: '3', isHidden: false },
      { input: '3 50\n60 100 120\n10 20 30', expectedOutput: '220', isHidden: false }
    ],
    solution: {
      approach: '0/1 knapsack 1D backward traversal DP.',
      timeComplexity: 'O(N * W)',
      spaceComplexity: 'O(W)'
    }
  },
  {
    problemId: 99,
    title: 'Unique Paths in a Grid',
    slug: 'unique-paths-in-grid',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `There is a robot on an $M \\times N$ grid. The robot is initially located at the top-left corner $(0, 0)$ and tries to move to the bottom-right corner $(M - 1, N - 1)$.
The robot can only move either down or right at any point in time.
Return the number of possible unique paths that the robot can take to reach the bottom-right corner.

### Input Format
- First line: two integers $M$ and $N$.

### Output Format
- Print total number of unique paths.`,
    examples: [
      { input: '3 7', output: '28', explanation: '28 unique paths.' },
      { input: '3 2', output: '3', explanation: '3 paths: right-down-down, down-right-down, down-down-right.' }
    ],
    constraints: ['1 <= M, N <= 100'],
    tags: ['Dynamic Programming', 'Math'],
    hints: ['dp[i][j] = dp[i-1][j] + dp[i][j-1]. Can be optimized with 1D array.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length >= 2) {
  const m = parseInt(input[0]);
  const n = parseInt(input[1]);
  const row = new Array(n).fill(1);
  for(let i=1; i<m; i++) {
    for(let j=1; j<n; j++) {
      row[j] += row[j-1];
    }
  }
  console.log(row[n - 1]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    m, n = int(data[0]), int(data[1])
    row = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            row[j] += row[j-1]
    print(row[-1])`
    },
    testCases: [
      { input: '3 7', expectedOutput: '28', isHidden: false },
      { input: '3 2', expectedOutput: '3', isHidden: false }
    ],
    solution: {
      approach: 'Combinatorial grid DP.',
      timeComplexity: 'O(M * N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 100,
    title: 'Word Break Problem',
    slug: 'word-break-problem',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `Given a string $S$ and a dictionary of words $wordDict$, return \`true\` if $S$ can be segmented into a space-separated sequence of one or more dictionary words.
Note that the same word in the dictionary may be reused multiple times in the segmentation.

### Input Format
- First line: string $S$.
- Second line: integer $K$ (number of words in dictionary).
- Third line: $K$ space-separated words.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: 'leetcode\n2\nleet code', output: 'true', explanation: '"leetcode" can be segmented as "leet code".' },
      { input: 'applepenapple\n2\napple pen', output: 'true', explanation: 'Can reuse "apple".' },
      { input: 'catsandog\n5\ncats dog sand and cat', output: 'false', explanation: 'Cannot be segmented.' }
    ],
    constraints: ['1 <= |S| <= 300', '1 <= K <= 1000'],
    tags: ['Dynamic Programming', 'Trie', 'Hash Table'],
    hints: ['dp[i] = true if any j < i has dp[j] == true and substring S[j..i] in dictionary.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const s = input[0];
  const k = parseInt(input[1]);
  const dict = new Set(input.slice(2, k + 2));
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for(let i=1; i<=s.length; i++) {
    for(let j=0; j<i; j++) {
      if(dp[j] && dict.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  console.log(dp[s.length] ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    s = data[0]
    k = int(data[1])
    words = set(data[2:k+2])
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    print("true" if dp[len(s)] else "false")`
    },
    testCases: [
      { input: 'leetcode\n2\nleet code', expectedOutput: 'true', isHidden: false },
      { input: 'applepenapple\n2\napple pen', expectedOutput: 'true', isHidden: false },
      { input: 'catsandog\n5\ncats dog sand and cat', expectedOutput: 'false', isHidden: false }
    ],
    solution: {
      approach: 'Boolean prefix segment DP with hash set lookup.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)'
    }
  }
];
