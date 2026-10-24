module.exports = [
  // 4 Easy
  {
    problemId: 49,
    title: 'Reverse a Singly Linked List',
    slug: 'reverse-singly-linked-list',
    topic: 'Linked List',
    difficulty: 'Easy',
    description: `Given the elements of a singly linked list with $N$ nodes, reverse the list and print the values of the reversed linked list space-separated.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers representing node values from head to tail.

### Output Format
- Print values of reversed list space-separated.`,
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'List [1, 2, 3, 4, 5] reversed is [5, 4, 3, 2, 1].' }
    ],
    constraints: ['0 <= N <= 10^5'],
    tags: ['Linked List'],
    hints: ['Iterate through nodes, keeping pointers prev, curr, and next.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  if(n === 0) { process.exit(); }
  const a = input.slice(1, n + 1);
  console.log(a.reverse().join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    if n > 0:
        print(' '.join(data[1:n+1][::-1]))`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { input: '2\n1 2', expectedOutput: '2 1', isHidden: false },
      { input: '1\n99', expectedOutput: '99', isHidden: true }
    ],
    solution: {
      approach: 'Iterative 3-pointer pointer reversal.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 50,
    title: 'Middle of the Linked List',
    slug: 'middle-of-linked-list',
    topic: 'Linked List',
    difficulty: 'Easy',
    description: `Given the values of a singly linked list of $N$ nodes, print the node values starting from the middle node to the end.
If there are two middle nodes, return the second middle node.

### Input Format
- First line: integer $N$.
- Second line: $N$ space-separated integers.

### Output Format
- Space-separated node values from middle node onwards.`,
    examples: [
      { input: '5\n1 2 3 4 5', output: '3 4 5', explanation: 'Middle node is 3.' },
      { input: '6\n1 2 3 4 5 6', output: '4 5 6', explanation: 'Even number of nodes: second middle is 4.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Linked List', 'Two Pointers'],
    hints: ['Use Tortoise and Hare approach: slow moves 1 step, fast moves 2 steps.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1);
  const mid = Math.floor(n / 2);
  console.log(a.slice(mid).join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = data[1:n+1]
    print(' '.join(a[n//2:]))`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '3 4 5', isHidden: false },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '4 5 6', isHidden: false }
    ],
    solution: {
      approach: 'Slow and fast pointer.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 51,
    title: 'Detect Cycle in Linked List',
    slug: 'detect-cycle-in-linked-list',
    topic: 'Linked List',
    difficulty: 'Easy',
    description: `Given a linked list represented as an array of $N$ values and an integer $pos$ representing the 0-indexed position that the tail connects to (-1 if no cycle), determine if the linked list has a cycle in it.
Print \`true\` if there is a cycle, otherwise \`false\`.

### Input Format
- First line: two integers $N$ and $pos$.
- Second line: $N$ node values.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '4 1\n3 2 0 -4', output: 'true', explanation: 'Tail connects to node index 1, cycle exists.' },
      { input: '1 -1\n1', output: 'false', explanation: 'No cycle (-1).' }
    ],
    constraints: ['1 <= N <= 10^5', '-1 <= pos < N'],
    tags: ['Linked List', 'Two Pointers'],
    hints: ['Floyd cycle finding algorithm: slow and fast pointer will meet if there is a cycle.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length >= 2) {
  const n = parseInt(input[0]);
  const pos = parseInt(input[1]);
  console.log(pos >= 0 ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    pos = int(data[1])
    print("true" if pos >= 0 else "false")`
    },
    testCases: [
      { input: '4 1\n3 2 0 -4', expectedOutput: 'true', isHidden: false },
      { input: '1 -1\n1', expectedOutput: 'false', isHidden: false },
      { input: '2 0\n1 2', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: "Floyd's cycle detection algorithm.",
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 52,
    title: 'Merge Two Sorted Linked Lists',
    slug: 'merge-two-sorted-linked-lists',
    topic: 'Linked List',
    difficulty: 'Easy',
    description: `You are given the heads of two sorted linked lists $list1$ and $list2$.
Merge the two lists into one sorted list and print the resulting elements space-separated.

### Input Format
- First line: integer $N$ (size of first list).
- Second line: $N$ sorted integers.
- Third line: integer $M$ (size of second list).
- Fourth line: $M$ sorted integers.

### Output Format
- Space-separated merged list elements.`,
    examples: [
      { input: '3\n1 2 4\n3\n1 3 4', output: '1 1 2 3 4 4', explanation: 'Merged sorted list.' }
    ],
    constraints: ['0 <= N, M <= 10^5'],
    tags: ['Linked List'],
    hints: ['Use a dummy head node and iteratively attach the smaller of the two heads.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const l1 = input.slice(idx, idx + n).map(Number); idx += n;
  const m = parseInt(input[idx++]);
  const l2 = input.slice(idx, idx + m).map(Number);
  const res = [];
  let i = 0, j = 0;
  while(i < n && j < m) {
    if(l1[i] <= l2[j]) res.push(l1[i++]);
    else res.push(l2[j++]);
  }
  while(i < n) res.push(l1[i++]);
  while(j < m) res.push(l2[j++]);
  console.log(res.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    n = int(data[idx]); idx += 1
    l1 = [int(x) for x in data[idx:idx+n]]; idx += n
    m = int(data[idx]); idx += 1
    l2 = [int(x) for x in data[idx:idx+m]]
    print(' '.join(map(str, sorted(l1 + l2))))`
    },
    testCases: [
      { input: '3\n1 2 4\n3\n1 3 4', expectedOutput: '1 1 2 3 4 4', isHidden: false },
      { input: '0\n1\n0', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Dummy head pointer splicing.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(1)'
    }
  },

  // 4 Medium
  {
    problemId: 53,
    title: 'Remove Nth Node From End of List',
    slug: 'remove-nth-node-from-end',
    topic: 'Linked List',
    difficulty: 'Medium',
    description: `Given the values of a linked list with $L$ nodes and an integer $N$, remove the $N$-th node from the end of the list and print the remaining node values space-separated.

### Input Format
- First line: two integers $L$ and $N$.
- Second line: $L$ integers.

### Output Format
- Space-separated values after removal.`,
    examples: [
      { input: '5 2\n1 2 3 4 5', output: '1 2 3 5', explanation: '2nd node from end is 4. Result: 1 2 3 5.' },
      { input: '1 1\n1', output: '', explanation: 'Only node removed.' }
    ],
    constraints: ['1 <= N <= L <= 10^5'],
    tags: ['Linked List', 'Two Pointers'],
    hints: ['Move fast pointer N steps ahead first. Then move both fast and slow together until fast reaches end.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const l = parseInt(input[0]);
  const n = parseInt(input[1]);
  const a = input.slice(2, l + 2);
  const removeIdx = l - n;
  a.splice(removeIdx, 1);
  console.log(a.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    l, n = int(data[0]), int(data[1])
    a = data[2:l+2]
    del a[l - n]
    print(' '.join(a))`
    },
    testCases: [
      { input: '5 2\n1 2 3 4 5', expectedOutput: '1 2 3 5', isHidden: false },
      { input: '2 1\n1 2', expectedOutput: '1', isHidden: false },
      { input: '1 1\n1', expectedOutput: '', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer gap method in a single pass.',
      timeComplexity: 'O(L)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 54,
    title: 'Intersection of Two Linked Lists',
    slug: 'intersection-of-two-linked-lists',
    topic: 'Linked List',
    difficulty: 'Medium',
    description: `Given the lengths and values of two singly-linked lists that merge at a certain common node value, find the node value at which the two lists intersect. If they do not intersect, print \`-1\`.

### Input Format
- First line: integer $N$ (size of list A).
- Second line: $N$ integers.
- Third line: integer $M$ (size of list B).
- Fourth line: $M$ integers.
- Fifth line: value of intersection node (or \`-1\` if none).

### Output Format
- Print intersection node value or \`-1\`.`,
    examples: [
      { input: '5\n4 1 8 4 5\n6\n5 6 1 8 4 5\n8', output: '8', explanation: 'Lists intersect at node with value 8.' }
    ],
    constraints: ['1 <= N, M <= 10^5'],
    tags: ['Linked List', 'Two Pointers'],
    hints: ['Pointers pA and pB iterate through both lists. When pA reaches end, point to headB; when pB reaches end, point to headA.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
if (lines.length >= 5) {
  console.log(lines[4]);
}`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if len(lines) >= 5:
    print(lines[4])`
    },
    testCases: [
      { input: '5\n4 1 8 4 5\n6\n5 6 1 8 4 5\n8', expectedOutput: '8', isHidden: false },
      { input: '3\n2 6 4\n3\n1 5\n-1', expectedOutput: '-1', isHidden: true }
    ],
    solution: {
      approach: 'Dual pointer cycle traversal equalization.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 55,
    title: 'Add Two Numbers as Linked Lists',
    slug: 'add-two-numbers-linked-lists',
    topic: 'Linked List',
    difficulty: 'Medium',
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and print the sum as a space-separated linked list in reverse order.

### Input Format
- First line: integer $N$ (digits in first number).
- Second line: $N$ integers.
- Third line: integer $M$ (digits in second number).
- Fourth line: $M$ integers.

### Output Format
- Digits of resulting sum space-separated.`,
    examples: [
      { input: '3\n2 4 3\n3\n5 6 4', output: '7 0 8', explanation: '342 + 465 = 807, in reverse: 7 0 8.' }
    ],
    constraints: ['1 <= N, M <= 100'],
    tags: ['Linked List', 'Math'],
    hints: ['Keep a carry variable. Sum digit by digit: (val1 + val2 + carry).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const a = input.slice(idx, idx + n).map(Number); idx += n;
  const m = parseInt(input[idx++]);
  const b = input.slice(idx, idx + m).map(Number);
  const res = [];
  let i = 0, j = 0, carry = 0;
  while(i < n || j < m || carry) {
    const s = (i < n ? a[i++] : 0) + (j < m ? b[j++] : 0) + carry;
    res.push(s % 10);
    carry = Math.floor(s / 10);
  }
  console.log(res.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    n = int(data[idx]); idx += 1
    a = [int(x) for x in data[idx:idx+n]]; idx += n
    m = int(data[idx]); idx += 1
    b = [int(x) for x in data[idx:idx+m]]
    res = []
    i = j = carry = 0
    while i < n or j < m or carry:
        s = (a[i] if i < n else 0) + (b[j] if j < m else 0) + carry
        res.append(s % 10)
        carry = s // 10
        i += 1; j += 1
    print(' '.join(map(str, res)))`
    },
    testCases: [
      { input: '3\n2 4 3\n3\n5 6 4', expectedOutput: '7 0 8', isHidden: false },
      { input: '1\n0\n1\n0', expectedOutput: '0', isHidden: true },
      { input: '7\n9 9 9 9 9 9 9\n4\n9 9 9 9', expectedOutput: '8 9 9 9 0 0 0 1', isHidden: true }
    ],
    solution: {
      approach: 'Direct elementary addition with carry propagation.',
      timeComplexity: 'O(max(N, M))',
      spaceComplexity: 'O(max(N, M))'
    }
  },
  {
    problemId: 56,
    title: 'Sort a Linked List (Merge Sort)',
    slug: 'sort-a-linked-list',
    topic: 'Linked List',
    difficulty: 'Medium',
    description: `Given the values of a singly linked list with $N$ nodes, sort the linked list in ascending order and print the sorted values space-separated.
Your algorithm should run in $O(N \\log N)$ time and $O(\\log N)$ or $O(1)$ space.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print sorted elements space-separated.`,
    examples: [
      { input: '4\n4 2 1 3', output: '1 2 3 4', explanation: 'List sorted in ascending order.' },
      { input: '5\n-1 5 3 4 0', output: '-1 0 3 4 5', explanation: 'Sorted elements.' }
    ],
    constraints: ['0 <= N <= 10^5'],
    tags: ['Linked List', 'Divide and Conquer', 'Merge Sort'],
    hints: ['Split list into two halves using fast and slow pointers, recursively sort each half, and merge.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number).sort((x,y)=>x-y);
  console.log(a.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = sorted([int(x) for x in data[1:n+1]])
    print(' '.join(map(str, a)))`
    },
    testCases: [
      { input: '4\n4 2 1 3', expectedOutput: '1 2 3 4', isHidden: false },
      { input: '5\n-1 5 3 4 0', expectedOutput: '-1 0 3 4 5', isHidden: false }
    ],
    solution: {
      approach: 'Merge Sort on linked nodes.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(log N)'
    }
  }
];
