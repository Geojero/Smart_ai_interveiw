module.exports = [
  // 4 Easy
  {
    problemId: 57,
    title: 'Valid Parentheses Matching',
    slug: 'valid-parentheses-matching',
    topic: 'Stack & Queue',
    difficulty: 'Easy',
    description: `Given a string $S$ containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if open brackets are closed by the same type of brackets and in the correct order.
Print \`true\` or \`false\`.

### Input Format
- A single line containing bracket string $S$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '()[]{}', output: 'true', explanation: 'All bracket pairs match.' },
      { input: '(]', output: 'false', explanation: 'Mismatched types.' }
    ],
    constraints: ['1 <= |S| <= 10^5'],
    tags: ['Stack', 'Strings'],
    hints: ['Push opening brackets onto stack. For closing brackets, check if stack top matches.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const stack = [];
const map = { ')': '(', '}': '{', ']': '[' };
let ok = true;
for(let c of s) {
  if(c === '(' || c === '{' || c === '[') stack.push(c);
  else if(map[c]) {
    if(stack.pop() !== map[c]) { ok = false; break; }
  }
}
if(stack.length !== 0) ok = false;
console.log(ok ? 'true' : 'false');`,
      python: `import sys
s = sys.stdin.read().strip()
stack = []
pairs = {')': '(', '}': '{', ']': '['}
ok = True
for c in s:
    if c in '({[':
        stack.append(c)
    elif c in pairs:
        if not stack or stack.pop() != pairs[c]:
            ok = False
            break
if stack: ok = False
print("true" if ok else "false")`
    },
    testCases: [
      { input: '()[]{}', expectedOutput: 'true', isHidden: false },
      { input: '(]', expectedOutput: 'false', isHidden: false },
      { input: '([)]', expectedOutput: 'false', isHidden: true },
      { input: '{[]}', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'LIFO Stack matching.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 58,
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    topic: 'Stack & Queue',
    difficulty: 'Easy',
    description: `Implement a first-in-first-out (FIFO) queue using only two stacks. The operations are:
- \`push x\`: Pushes element $x$ to the back of the queue.
- \`pop\`: Removes the element from the front of the queue and prints it.
- \`peek\`: Prints the element at the front of the queue without removing it.

### Input Format
- First line: integer $Q$ (number of queries).
- Next $Q$ lines: query operation string.

### Output Format
- Results of \`pop\` and \`peek\` operations each on a new line.`,
    examples: [
      { input: '5\npush 1\npush 2\npeek\npop\npeek', output: '1\n1\n2', explanation: 'FIFO queue behavior.' }
    ],
    constraints: ['1 <= Q <= 10^4'],
    tags: ['Stack', 'Queue', 'Design'],
    hints: ['Use input stack for pushing, and output stack for popping/peeking.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
if (lines.length > 0) {
  const q = parseInt(lines[0]);
  const s1 = [], s2 = [];
  function shift() {
    if(s2.length === 0) {
      while(s1.length > 0) s2.push(s1.pop());
    }
  }
  for(let i=1; i<=q; i++) {
    const parts = lines[i].split(' ');
    if(parts[0] === 'push') s1.push(parts[1]);
    else if(parts[0] === 'pop') {
      shift();
      console.log(s2.pop());
    } else if(parts[0] === 'peek') {
      shift();
      console.log(s2[s2.length - 1]);
    }
  }
}`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if lines:
    q = int(lines[0])
    s1, s2 = [], []
    def shift():
        if not s2:
            while s1:
                s2.append(s1.pop())
    for line in lines[1:q+1]:
        parts = line.split()
        if parts[0] == 'push':
            s1.append(parts[1])
        elif parts[0] == 'pop':
            shift()
            print(s2.pop())
        elif parts[0] == 'peek':
            shift()
            print(s2[-1])`
    },
    testCases: [
      { input: '5\npush 1\npush 2\npeek\npop\npeek', expectedOutput: '1\n1\n2', isHidden: false },
      { input: '3\npush 42\npeek\npop', expectedOutput: '42\n42', isHidden: true }
    ],
    solution: {
      approach: 'Two stacks amortized O(1) transfer.',
      timeComplexity: 'Amortized O(1)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 59,
    title: 'Next Greater Element I',
    slug: 'next-greater-element-i',
    topic: 'Stack & Queue',
    difficulty: 'Easy',
    description: `Given an array of $N$ integers, for each element, find the next greater element to its right. If no greater element exists, output \`-1\`.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print next greater elements space-separated.`,
    examples: [
      { input: '4\n4 5 2 25', output: '5 25 25 -1', explanation: 'Next greater for 4 is 5, for 5 is 25, for 2 is 25, for 25 is -1.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Stack', 'Monotonic Stack'],
    hints: ['Iterate from right to left using a monotonic decreasing stack.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  const res = new Array(n).fill(-1);
  const stack = [];
  for(let i=n-1; i>=0; i--) {
    while(stack.length && stack[stack.length - 1] <= a[i]) stack.pop();
    if(stack.length) res[i] = stack[stack.length - 1];
    stack.push(a[i]);
  }
  console.log(res.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    res = [-1] * n
    stack = []
    for i in range(n-1, -1, -1):
        while stack and stack[-1] <= a[i]:
            stack.pop()
        if stack:
            res[i] = stack[-1]
        stack.append(a[i])
    print(' '.join(map(str, res)))`
    },
    testCases: [
      { input: '4\n4 5 2 25', expectedOutput: '5 25 25 -1', isHidden: false },
      { input: '4\n13 7 6 12', expectedOutput: '-1 12 12 -1', isHidden: false }
    ],
    solution: {
      approach: 'Monotonic stack right-to-left scan.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 60,
    title: 'Backspace String Compare',
    slug: 'backspace-string-compare',
    topic: 'Stack & Queue',
    difficulty: 'Easy',
    description: `Given two strings $S$ and $T$, return \`true\` if they are equal when both are typed into empty text editors, where \`#\` means a backspace character.

### Input Format
- First line: string $S$.
- Second line: string $T$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: 'ab#c\nad#c', output: 'true', explanation: 'Both become "ac".' },
      { input: 'a#c\nb', output: 'false', explanation: '"c" != "b".' }
    ],
    constraints: ['1 <= |S|, |T| <= 10^5'],
    tags: ['Stack', 'Two Pointers'],
    hints: ['Simulate text editing with a stack or scan backwards.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const [s, t] = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim());
function build(str) {
  const stack = [];
  for(let c of (str || '')) {
    if(c === '#') stack.pop();
    else stack.push(c);
  }
  return stack.join('');
}
console.log(build(s) === build(t) ? 'true' : 'false');`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if len(lines) >= 2:
    s, t = lines[0], lines[1]
    def build(st):
        stk = []
        for c in st:
            if c == '#':
                if stk: stk.pop()
            else:
                stk.append(c)
        return "".join(stk)
    print("true" if build(s) == build(t) else "false")`
    },
    testCases: [
      { input: 'ab#c\nad#c', expectedOutput: 'true', isHidden: false },
      { input: 'a#c\nb', expectedOutput: 'false', isHidden: false },
      { input: 'a##c\n#a#c', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'Stack simulation.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N + M)'
    }
  },

  // 4 Medium
  {
    problemId: 61,
    title: 'Min Stack Design with O(1) Retrieval',
    slug: 'min-stack-design-o1',
    topic: 'Stack & Queue',
    difficulty: 'Medium',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
- \`push x\`: Pushes the element $x$ onto the stack.
- \`pop\`: Removes the element on the top of the stack.
- \`top\`: Prints the top element.
- \`getMin\`: Prints the minimum element in the stack.

### Input Format
- First line: integer $Q$ (number of operations).
- Next $Q$ lines: operation strings.

### Output Format
- Outputs of \`top\` and \`getMin\` queries.`,
    examples: [
      { input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ngetMin', output: '-3\n-2', explanation: 'Retrieves current minimum in O(1).' }
    ],
    constraints: ['1 <= Q <= 10^5'],
    tags: ['Stack', 'Design'],
    hints: ['Maintain a parallel stack or pair storing (value, current_min).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
if (lines.length > 0) {
  const q = parseInt(lines[0]);
  const stack = [], minStack = [];
  for(let i=1; i<=q; i++) {
    const parts = lines[i].split(' ');
    if(parts[0] === 'push') {
      const val = parseInt(parts[1]);
      stack.push(val);
      const curMin = minStack.length ? Math.min(val, minStack[minStack.length - 1]) : val;
      minStack.push(curMin);
    } else if(parts[0] === 'pop') {
      stack.pop();
      minStack.pop();
    } else if(parts[0] === 'top') {
      console.log(stack[stack.length - 1]);
    } else if(parts[0] === 'getMin') {
      console.log(minStack[minStack.length - 1]);
    }
  }
}`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if lines:
    q = int(lines[0])
    stk, min_stk = [], []
    for line in lines[1:q+1]:
        parts = line.split()
        if parts[0] == 'push':
            v = int(parts[1])
            stk.append(v)
            min_stk.append(min(v, min_stk[-1]) if min_stk else v)
        elif parts[0] == 'pop':
            stk.pop(); min_stk.pop()
        elif parts[0] == 'top':
            print(stk[-1])
        elif parts[0] == 'getMin':
            print(min_stk[-1])`
    },
    testCases: [
      { input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ngetMin', expectedOutput: '-3\n-2', isHidden: false }
    ],
    solution: {
      approach: 'Companion auxiliary min-tracking stack.',
      timeComplexity: 'O(1) all operations',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 62,
    title: 'Daily Temperatures (Days until Warmer Weather)',
    slug: 'daily-temperatures-warmer-weather',
    topic: 'Stack & Queue',
    difficulty: 'Medium',
    description: `Given an array of integers $temperatures$ represents the daily temperatures, return an array $answer$ such that $answer[i]$ is the number of days you have to wait after the $i$-th day to get a warmer temperature. If there is no future day for which this is possible, keep $answer[i] == 0$.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print answer array space-separated.`,
    examples: [
      { input: '8\n73 74 75 71 69 72 76 73', output: '1 1 4 2 1 1 0 0', explanation: 'Days to wait for warmer temp.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Stack', 'Monotonic Stack'],
    hints: ['Store indices on a monotonic decreasing stack.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const t = input.slice(1, n + 1).map(Number);
  const ans = new Array(n).fill(0);
  const stack = []; // indices
  for(let i=0; i<n; i++) {
    while(stack.length && t[i] > t[stack[stack.length - 1]]) {
      const prev = stack.pop();
      ans[prev] = i - prev;
    }
    stack.push(i);
  }
  console.log(ans.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    t = [int(x) for x in data[1:n+1]]
    ans = [0] * n
    stack = []
    for i, temp in enumerate(t):
        while stack and temp > t[stack[-1]]:
            prev = stack.pop()
            ans[prev] = i - prev
        stack.append(i)
    print(' '.join(map(str, ans)))`
    },
    testCases: [
      { input: '8\n73 74 75 71 69 72 76 73', expectedOutput: '1 1 4 2 1 1 0 0', isHidden: false },
      { input: '4\n30 40 50 60', expectedOutput: '1 1 1 0', isHidden: true }
    ],
    solution: {
      approach: 'Monotonic stack of indices.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 63,
    title: 'Evaluate Reverse Polish Notation (Postfix)',
    slug: 'evaluate-reverse-polish-notation',
    topic: 'Stack & Queue',
    difficulty: 'Medium',
    description: `Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are \`+\`, \`-\`, \`*\`, and \`/\`.
Division between two integers always truncates toward zero.

### Input Format
- First line: integer $N$ (number of tokens).
- Second line: $N$ space-separated tokens.

### Output Format
- Print single integer result.`,
    examples: [
      { input: '5\n2 1 + 3 *', output: '9', explanation: '((2 + 1) * 3) = 9.' },
      { input: '5\n4 13 5 / +', output: '6', explanation: '(4 + (13 / 5)) = 6.' }
    ],
    constraints: ['1 <= N <= 10^4'],
    tags: ['Stack', 'Math'],
    hints: ['Operands get pushed to stack. When an operator is met, pop two operands, evaluate, and push result.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const tokens = input.slice(1, n + 1);
  const stack = [];
  for(let tok of tokens) {
    if(tok === '+' || tok === '-' || tok === '*' || tok === '/') {
      const b = stack.pop();
      const a = stack.pop();
      let res = 0;
      if(tok === '+') res = a + b;
      else if(tok === '-') res = a - b;
      else if(tok === '*') res = a * b;
      else if(tok === '/') res = Math.trunc(a / b);
      stack.push(res);
    } else {
      stack.push(parseInt(tok));
    }
  }
  console.log(stack[0]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    tokens = data[1:n+1]
    stack = []
    for t in tokens:
        if t in '+-*/':
            b = stack.pop()
            a = stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            elif t == '/': stack.append(int(a / b))
        else:
            stack.append(int(t))
    print(stack[0])`
    },
    testCases: [
      { input: '5\n2 1 + 3 *', expectedOutput: '9', isHidden: false },
      { input: '5\n4 13 5 / +', expectedOutput: '6', isHidden: false }
    ],
    solution: {
      approach: 'Postfix stack evaluation.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 64,
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    topic: 'Stack & Queue',
    difficulty: 'Medium',
    description: `You are given an array of integers $nums$, there is a sliding window of size $K$ which is moving from the very left of the array to the very right. You can only see the $K$ numbers in the window. Each time the sliding window moves right by one position.
Print the max sliding window elements space-separated.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ integers.

### Output Format
- Print max in each window space-separated.`,
    examples: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', output: '3 3 5 5 6 7', explanation: 'Maximums of windows of size 3.' }
    ],
    constraints: ['1 <= K <= N <= 10^5'],
    tags: ['Queue', 'Monotonic Queue', 'Sliding Window'],
    hints: ['Use a monotonic double-ended queue (deque) storing indices of potential maximums.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  const q = []; // deque of indices
  const res = [];
  for(let i=0; i<n; i++) {
    while(q.length && q[0] <= i - k) q.shift();
    while(q.length && a[q[q.length - 1]] <= a[i]) q.pop();
    q.push(i);
    if(i >= k - 1) res.push(a[q[0]]);
  }
  console.log(res.join(' '));
}`,
      python: `import sys
from collections import deque
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    q = deque()
    res = []
    for i, x in enumerate(a):
        while q and q[0] <= i - k:
            q.popleft()
        while q and a[q[-1]] <= x:
            q.pop()
        q.append(i)
        if i >= k - 1:
            res.append(a[q[0]])
    print(' '.join(map(str, res)))`
    },
    testCases: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '3 3 5 5 6 7', isHidden: false },
      { input: '1 1\n1', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Monotonic Deque in O(N).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(K)'
    }
  }
];
