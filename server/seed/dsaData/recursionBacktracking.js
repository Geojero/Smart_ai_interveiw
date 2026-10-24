module.exports = [
  // 3 Easy
  {
    problemId: 65,
    title: 'Fibonacci Number (Recursive/Memoized)',
    slug: 'fibonacci-number-recursive',
    topic: 'Recursion & Backtracking',
    difficulty: 'Easy',
    description: `The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from $F(0) = 0$ and $F(1) = 1$.
Given $N$, calculate $F(N)$.

### Input Format
- A single integer $N$.

### Output Format
- Print $F(N)$.`,
    examples: [
      { input: '4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' },
      { input: '2', output: '1', explanation: 'F(2) = 1.' }
    ],
    constraints: ['0 <= N <= 30'],
    tags: ['Recursion', 'Math'],
    hints: ['Base cases are F(0) = 0, F(1) = 1. Recursive case is F(N) = F(N-1) + F(N-2).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
function fib(x) {
  if(x <= 1) return x;
  return fib(x - 1) + fib(x - 2);
}
console.log(fib(n));`,
      python: `import sys
n = int(sys.stdin.read().strip())
def fib(x):
    if x <= 1: return x
    return fib(x - 1) + fib(x - 2)
print(fib(n))`
    },
    testCases: [
      { input: '4', expectedOutput: '3', isHidden: false },
      { input: '2', expectedOutput: '1', isHidden: false },
      { input: '10', expectedOutput: '55', isHidden: true }
    ],
    solution: {
      approach: 'Recursion with base cases or memoization.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 66,
    title: 'Power of a Number (x^n)',
    slug: 'power-of-number-pow',
    topic: 'Recursion & Backtracking',
    difficulty: 'Easy',
    description: `Implement $pow(x, n)$, which calculates $x$ raised to the power $n$ ($x^n$). Output the answer formatted to 2 decimal places.

### Input Format
- First line: float $x$ and integer $n$.

### Output Format
- $x^n$ formatted to 2 decimal places.`,
    examples: [
      { input: '2.00000 10', output: '1024.00', explanation: '2^10 = 1024.00.' },
      { input: '2.10000 3', output: '9.26', explanation: '2.1^3 = 9.261 -> 9.26.' }
    ],
    constraints: ['-100.0 < x < 100.0', '-30 <= n <= 30'],
    tags: ['Recursion', 'Divide and Conquer'],
    hints: ['Binary exponentiation: if n is even, x^n = (x*x)^(n/2); if odd, x * x^(n-1).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length >= 2) {
  const x = parseFloat(input[0]);
  const n = parseInt(input[1]);
  function myPow(base, exp) {
    if(exp === 0) return 1;
    if(exp < 0) return 1 / myPow(base, -exp);
    if(exp % 2 === 0) return myPow(base * base, Math.floor(exp / 2));
    return base * myPow(base, exp - 1);
  }
  console.log(myPow(x, n).toFixed(2));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    x, n = float(data[0]), int(data[1])
    print(f"{x**n:.2f}")`
    },
    testCases: [
      { input: '2.00000 10', expectedOutput: '1024.00', isHidden: false },
      { input: '2.10000 3', expectedOutput: '9.26', isHidden: false },
      { input: '2.00000 -2', expectedOutput: '0.25', isHidden: true }
    ],
    solution: {
      approach: 'Binary exponentiation in O(log N).',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(log N)'
    }
  },
  {
    problemId: 67,
    title: 'Print 1 to N Using Recursion',
    slug: 'print-1-to-n-recursion',
    topic: 'Recursion & Backtracking',
    difficulty: 'Easy',
    description: `Given an integer $N$, print numbers from 1 to $N$ space-separated using recursion without using any loops.

### Input Format
- A single integer $N$.

### Output Format
- Numbers from 1 to $N$ space-separated.`,
    examples: [
      { input: '5', output: '1 2 3 4 5', explanation: 'Print 1 to 5.' }
    ],
    constraints: ['1 <= N <= 1000'],
    tags: ['Recursion'],
    hints: ['Call recursive function for N-1 before printing N.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
const res = [];
function printN(x) {
  if(x === 0) return;
  printN(x - 1);
  res.push(x);
}
printN(n);
console.log(res.join(' '));`,
      python: `import sys
n = int(sys.stdin.read().strip())
res = []
def print_n(x):
    if x == 0: return
    print_n(x - 1)
    res.append(str(x))
print_n(n)
print(' '.join(res))`
    },
    testCases: [
      { input: '5', expectedOutput: '1 2 3 4 5', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Call stack recursion.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },

  // 5 Medium
  {
    problemId: 68,
    title: 'Generate All Subsets (Power Set)',
    slug: 'generate-all-subsets-power-set',
    topic: 'Recursion & Backtracking',
    difficulty: 'Medium',
    description: `Given an integer array $nums$ of unique elements, return all possible subsets (the power set).
Print the number of total subsets generated on the first line, followed by the subsets sorted by size then lexicographically.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- First line: count of subsets ($2^N$).
- Following lines: each subset space-separated (empty line for empty set).`,
    examples: [
      { input: '3\n1 2 3', output: '8\n\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3', explanation: 'All 8 subsets.' }
    ],
    constraints: ['1 <= N <= 10'],
    tags: ['Backtracking', 'Bit Manipulation'],
    hints: ['At each index, choose to either include or exclude the element.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number).sort((x,y)=>x-y);
  const subsets = [];
  function backtrack(idx, current) {
    if(idx === n) {
      subsets.push([...current]);
      return;
    }
    backtrack(idx + 1, current);
    current.push(a[idx]);
    backtrack(idx + 1, current);
    current.pop();
  }
  backtrack(0, []);
  subsets.sort((x, y) => x.length - y.length || x.join(' ').localeCompare(y.join(' ')));
  console.log(subsets.length);
  for(let s of subsets) console.log(s.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = sorted([int(x) for x in data[1:n+1]])
    subsets = []
    def backtrack(idx, curr):
        if idx == n:
            subsets.append(list(curr))
            return
        backtrack(idx + 1, curr)
        curr.append(a[idx])
        backtrack(idx + 1, curr)
        curr.pop()
    backtrack(0, [])
    subsets.sort(key=lambda s: (len(s), s))
    print(len(subsets))
    for s in subsets:
        print(' '.join(map(str, s)))`
    },
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '8\n\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3', isHidden: false },
      { input: '1\n0', expectedOutput: '2\n\n0', isHidden: true }
    ],
    solution: {
      approach: 'Backtracking inclusion/exclusion.',
      timeComplexity: 'O(2^N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 69,
    title: 'Permutations of an Array',
    slug: 'permutations-of-an-array',
    topic: 'Recursion & Backtracking',
    difficulty: 'Medium',
    description: `Given an array $nums$ of distinct integers, return all the possible permutations.
Print total count on the first line, followed by permutations sorted lexicographically.

### Input Format
- First line: integer $N$.
- Second line: $N$ distinct integers.

### Output Format
- First line: $N!$.
- Subsequent lines: each permutation space-separated.`,
    examples: [
      { input: '3\n1 2 3', output: '6\n1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', explanation: 'All 6 permutations.' }
    ],
    constraints: ['1 <= N <= 6'],
    tags: ['Backtracking'],
    hints: ['Maintain visited array or swap elements in place during backtracking recursion.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number).sort((x,y)=>x-y);
  const res = [];
  const visited = new Array(n).fill(false);
  function backtrack(curr) {
    if(curr.length === n) {
      res.push([...curr]);
      return;
    }
    for(let i=0; i<n; i++) {
      if(visited[i]) continue;
      visited[i] = true;
      curr.push(a[i]);
      backtrack(curr);
      curr.pop();
      visited[i] = false;
    }
  }
  backtrack([]);
  console.log(res.length);
  for(let p of res) console.log(p.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = sorted([int(x) for x in data[1:n+1]])
    from itertools import permutations
    perms = list(permutations(a))
    print(len(perms))
    for p in perms:
        print(' '.join(map(str, p)))`
    },
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '6\n1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', isHidden: false },
      { input: '1\n1', expectedOutput: '1\n1', isHidden: true }
    ],
    solution: {
      approach: 'Backtracking with visited mask.',
      timeComplexity: 'O(N * N!)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 70,
    title: 'Combination Sum',
    slug: 'combination-sum',
    topic: 'Recursion & Backtracking',
    difficulty: 'Medium',
    description: `Given an array of distinct integers $candidates$ and a target integer $target$, return the count of unique combinations of candidates where the chosen numbers sum to $target$.
The same number may be chosen from candidates an unlimited number of times.

### Input Format
- First line: two integers $N$ and $target$.
- Second line: $N$ integers.

### Output Format
- Print total number of valid combinations.`,
    examples: [
      { input: '4 7\n2 3 6 7', output: '2', explanation: 'Combinations: [2, 2, 3] and [7]. Count = 2.' },
      { input: '3 8\n2 3 5', output: '3', explanation: '[2,2,2,2], [2,3,3], [3,5]. Count = 3.' }
    ],
    constraints: ['1 <= N <= 30', '1 <= target <= 40'],
    tags: ['Backtracking'],
    hints: ['Pass the current index so you can reuse the same candidate or move to the next candidate.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  let count = 0;
  function backtrack(idx, rem) {
    if(rem === 0) { count++; return; }
    if(rem < 0 || idx >= n) return;
    backtrack(idx, rem - a[idx]); // reuse
    backtrack(idx + 1, rem);       // skip
  }
  backtrack(0, target);
  console.log(count);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    ans = 0
    def backtrack(idx, rem):
        global ans
        if rem == 0:
            ans += 1
            return
        if rem < 0 or idx >= n: return
        backtrack(idx, rem - a[idx])
        backtrack(idx + 1, rem)
    backtrack(0, target)
    print(ans)`
    },
    testCases: [
      { input: '4 7\n2 3 6 7', expectedOutput: '2', isHidden: false },
      { input: '3 8\n2 3 5', expectedOutput: '3', isHidden: false },
      { input: '1 2\n2', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Unbounded choice backtracking.',
      timeComplexity: 'O(2^target)',
      spaceComplexity: 'O(target)'
    }
  },
  {
    problemId: 71,
    title: 'Letter Combinations of a Phone Number',
    slug: 'letter-combinations-phone-number',
    topic: 'Recursion & Backtracking',
    difficulty: 'Medium',
    description: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent according to telephone keypad mapping.
Print the combinations space-separated in alphabetical order. If input is empty, print empty.

### Input Format
- A single line containing digit string $digits$.

### Output Format
- Space-separated letter combinations.`,
    examples: [
      { input: '23', output: 'ad ae af bd be bf cd ce cf', explanation: '2 maps to "abc", 3 maps to "def".' }
    ],
    constraints: ['0 <= |digits| <= 4'],
    tags: ['Backtracking', 'Strings'],
    hints: ['Map each digit to its characters. Branch for each letter of current digit.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const digits = fs.readFileSync(0, 'utf-8').trim();
if (!digits) { process.exit(); }
const pad = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
const res = [];
function dfs(idx, curr) {
  if(idx === digits.length) {
    res.push(curr);
    return;
  }
  const letters = pad[digits[idx]] || '';
  for(let c of letters) {
    dfs(idx + 1, curr + c);
  }
}
dfs(0, '');
console.log(res.join(' '));`,
      python: `import sys
digits = sys.stdin.read().strip()
if digits:
    pad = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    res = []
    def dfs(idx, curr):
        if idx == len(digits):
            res.append(curr)
            return
        for c in pad.get(digits[idx], ''):
            dfs(idx + 1, curr + c)
    dfs(0, '')
    print(' '.join(res))`
    },
    testCases: [
      { input: '23', expectedOutput: 'ad ae af bd be bf cd ce cf', isHidden: false },
      { input: '2', expectedOutput: 'a b c', isHidden: true }
    ],
    solution: {
      approach: 'Keypad mapping DFS tree recursion.',
      timeComplexity: 'O(4^N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 72,
    title: 'Word Search in Grid',
    slug: 'word-search-in-grid',
    topic: 'Recursion & Backtracking',
    difficulty: 'Medium',
    description: `Given an $M \\times N$ grid of characters $board$ and a string $word$, return \`true\` if $word$ exists in the grid.
The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once.

### Input Format
- First line: two integers $M$ and $N$.
- Next $M$ lines: $N$ characters space-separated.
- Last line: string $word$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', output: 'true', explanation: 'Word exists in board.' },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', output: 'false', explanation: 'Cannot reuse cell.' }
    ],
    constraints: ['1 <= M, N <= 6', '1 <= |word| <= 15'],
    tags: ['Backtracking', 'Matrix'],
    hints: ['DFS from each cell matching the first character, mark visited cells by temporary character substitution, then backtrack.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  let idx = 0;
  const m = parseInt(input[idx++]);
  const n = parseInt(input[idx++]);
  const board = [];
  for(let i=0; i<m; i++) {
    board.push(input.slice(idx, idx + n));
    idx += n;
  }
  const word = input[idx++];
  function dfs(r, c, k) {
    if(k === word.length) return true;
    if(r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;
    const temp = board[r][c];
    board[r][c] = '#';
    const found = dfs(r+1,c,k+1) || dfs(r-1,c,k+1) || dfs(r,c+1,k+1) || dfs(r,c-1,k+1);
    board[r][c] = temp;
    return found;
  }
  let exists = false;
  for(let i=0; i<m; i++) {
    for(let j=0; j<n; j++) {
      if(dfs(i, j, 0)) { exists = true; break; }
    }
    if(exists) break;
  }
  console.log(exists ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    m, n = int(data[idx]), int(data[idx+1]); idx += 2
    board = []
    for _ in range(m):
        board.append(data[idx:idx+n])
        idx += n
    word = data[idx]
    def dfs(r, c, k):
        if k == len(word): return True
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[k]: return False
        tmp = board[r][c]
        board[r][c] = '#'
        res = dfs(r+1,c,k+1) or dfs(r-1,c,k+1) or dfs(r,c+1,k+1) or dfs(r,c-1,k+1)
        board[r][c] = tmp
        return res
    ok = any(dfs(i, j, 0) for i in range(m) for j in range(n))
    print("true" if ok else "false")`
    },
    testCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', expectedOutput: 'true', isHidden: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', expectedOutput: 'false', isHidden: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nSEE', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'Grid DFS with in-place backtracking.',
      timeComplexity: 'O(M * N * 3^L)',
      spaceComplexity: 'O(L)'
    }
  }
];
