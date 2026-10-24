module.exports = [
  // 5 Easy
  {
    problemId: 73,
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given the level-order serialization of a binary tree where \`null\` represents absent nodes, return its maximum depth.
A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Input Format
- First line: integer $N$ (number of tokens in level order).
- Second line: $N$ tokens (integers or \`null\`).

### Output Format
- Print the integer maximum depth.`,
    examples: [
      { input: '7\n3 9 20 null null 15 7', output: '3', explanation: 'Longest path 3->20->15 has depth 3.' },
      { input: '2\n1 null', output: '1', explanation: 'Single root node.' }
    ],
    constraints: ['0 <= N <= 10^5'],
    tags: ['Trees', 'DFS', 'BFS'],
    hints: ['Recursively calculate 1 + max(depth(left), depth(right)).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  if(n === 0 || input[1] === 'null') { console.log(0); process.exit(); }
  const nodes = input.slice(1, n + 1);
  // Level-based depth calculation
  let depth = 0;
  let levelSize = 1;
  let idx = 0;
  while(idx < n) {
    let hasNonNull = false;
    for(let i=0; i<levelSize && idx < n; i++) {
      if(nodes[idx] !== 'null') hasNonNull = true;
      idx++;
    }
    if(hasNonNull) depth++;
    levelSize *= 2;
  }
  console.log(depth);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    if n == 0 or data[1] == 'null':
        print(0)
    else:
        nodes = data[1:n+1]
        depth = idx = 0
        lvl_sz = 1
        while idx < n:
            chunk = nodes[idx:idx+lvl_sz]
            if any(x != 'null' for x in chunk):
                depth += 1
            idx += lvl_sz
            lvl_sz *= 2
        print(depth)`
    },
    testCases: [
      { input: '7\n3 9 20 null null 15 7', expectedOutput: '3', isHidden: false },
      { input: '2\n1 null', expectedOutput: '1', isHidden: false },
      { input: '0\n', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Tree traversal maximum height recursion.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 74,
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given the level-order traversal of a binary tree, invert the tree (swap left and right child at every node) and print the inverted tree's level-order traversal space-separated.

### Input Format
- First line: integer $N$.
- Second line: $N$ level-order tokens.

### Output Format
- Space-separated inverted tree nodes.`,
    examples: [
      { input: '7\n4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1', explanation: 'Tree inverted left-to-right.' }
    ],
    constraints: ['0 <= N <= 10^5'],
    tags: ['Trees', 'DFS'],
    hints: ['Recursively swap left and right subtrees.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1);
  if(n <= 1) { console.log(a.join(' ')); process.exit(); }
  // Reverse each level
  let idx = 0, sz = 1;
  const res = [];
  while(idx < n) {
    const chunk = a.slice(idx, Math.min(n, idx + sz));
    res.push(...chunk.reverse());
    idx += sz;
    sz *= 2;
  }
  console.log(res.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = data[1:n+1]
    res, idx, sz = [], 0, 1
    while idx < n:
        res.extend(reversed(a[idx:idx+sz]))
        idx += sz
        sz *= 2
    print(' '.join(res))`
    },
    testCases: [
      { input: '7\n4 2 7 1 3 6 9', expectedOutput: '4 7 2 9 6 3 1', isHidden: false },
      { input: '3\n2 1 3', expectedOutput: '2 3 1', isHidden: false }
    ],
    solution: {
      approach: 'Recursive left-right child pointer inversion.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 75,
    title: 'Symmetric Tree (Mirror Check)',
    slug: 'symmetric-tree-mirror-check',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given the root of a binary tree in level-order, check whether it is a mirror of itself (i.e., symmetric around its center).
Print \`true\` or \`false\`.

### Input Format
- First line: integer $N$.
- Second line: $N$ level-order tokens.

### Output Format
- \`true\` or \`false\`.`,
    examples: [
      { input: '7\n1 2 2 3 4 4 3', output: 'true', explanation: 'Symmetric mirror tree.' },
      { input: '5\n1 2 2 null 3 null 3', output: 'false', explanation: 'Asymmetric.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Trees', 'DFS'],
    hints: ['Check if left subtree is a mirror reflection of right subtree.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1);
  let idx = 1, sz = 2, ok = true;
  while(idx < n) {
    const chunk = a.slice(idx, Math.min(n, idx + sz));
    for(let i=0; i<Math.floor(chunk.length/2); i++) {
      if(chunk[i] !== chunk[chunk.length - 1 - i]) { ok = false; break; }
    }
    if(!ok) break;
    idx += sz;
    sz *= 2;
  }
  console.log(ok ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = data[1:n+1]
    idx, sz, ok = 1, 2, True
    while idx < n:
        chunk = a[idx:idx+sz]
        if chunk != chunk[::-1]:
            ok = False
            break
        idx += sz
        sz *= 2
    print("true" if ok else "false")`
    },
    testCases: [
      { input: '7\n1 2 2 3 4 4 3', expectedOutput: 'true', isHidden: false },
      { input: '5\n1 2 2 null 3 null 3', expectedOutput: 'false', isHidden: false }
    ],
    solution: {
      approach: 'Two-pointer recursive mirror comparison.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 76,
    title: 'Path Sum Check',
    slug: 'path-sum-check',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given a binary tree represented as an array of $N$ integers and a $targetSum$, return \`true\` if the tree has a root-to-leaf path such that adding up all the values along the path equals $targetSum$. Otherwise, return \`false\`.

### Input Format
- First line: two integers $N$ and $targetSum$.
- Second line: $N$ space-separated integers.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '3 5\n2 1 3', output: 'true', explanation: 'Path 2->3 has sum 5.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Trees', 'DFS'],
    hints: ['Subtract current node value from targetSum and recursively check left and right.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number);
  function hasPath(i, sum) {
    if(i >= n) return false;
    sum += a[i];
    const left = 2 * i + 1, right = 2 * i + 2;
    if(left >= n && right >= n) return sum === target;
    return hasPath(left, sum) || hasPath(right, sum);
  }
  console.log(hasPath(0, 0) ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, target = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:n+2]]
    def has_path(i, s):
        if i >= n: return False
        s += a[i]
        l, r = 2*i + 1, 2*i + 2
        if l >= n and r >= n:
            return s == target
        return has_path(l, s) or has_path(r, s)
    print("true" if has_path(0, 0) else "false")`
    },
    testCases: [
      { input: '3 5\n2 1 3', expectedOutput: 'true', isHidden: false },
      { input: '3 4\n1 2 3', expectedOutput: 'true', isHidden: false },
      { input: '2 10\n1 2', expectedOutput: 'false', isHidden: true }
    ],
    solution: {
      approach: 'DFS root-to-leaf accumulator.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 77,
    title: 'Count Leaf Nodes in a Binary Tree',
    slug: 'count-leaf-nodes-binary-tree',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given the number of nodes $N$ in a binary tree stored as an array where children of node $i$ are at $2i + 1$ and $2i + 2$, count the number of leaf nodes (nodes with no children).

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print total number of leaf nodes.`,
    examples: [
      { input: '5\n1 2 3 4 5', output: '3', explanation: 'Nodes at index 2, 3, 4 are leaves. Count = 3.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Trees'],
    hints: ['A node at index i is a leaf if 2i + 1 >= N.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  let leaves = 0;
  for(let i=0; i<n; i++) {
    if(2 * i + 1 >= n) leaves++;
  }
  console.log(leaves);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    leaves = sum(1 for i in range(n) if 2*i + 1 >= n)
    print(leaves)`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '3', isHidden: false },
      { input: '1\n10', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Degree calculation.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },

  // 6 Medium
  {
    problemId: 78,
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    topic: 'Trees',
    difficulty: 'Medium',
    description: `Given the level-order array representation of a binary tree of $N$ nodes, print each level on a new line space-separated.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Each tree level printed on a separate line.`,
    examples: [
      { input: '5\n1 2 3 4 5', output: '1\n2 3\n4 5', explanation: 'Level 0: 1, Level 1: 2 3, Level 2: 4 5.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Trees', 'BFS'],
    hints: ['Use standard queue BFS or group elements in powers of 2 (1, 2, 4, 8...).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1);
  let idx = 0, sz = 1;
  while(idx < n) {
    const chunk = a.slice(idx, Math.min(n, idx + sz));
    console.log(chunk.join(' '));
    idx += sz;
    sz *= 2;
  }
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = data[1:n+1]
    idx, sz = 0, 1
    while idx < n:
        print(' '.join(a[idx:idx+sz]))
        idx += sz
        sz *= 2`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '1\n2 3\n4 5', isHidden: false },
      { input: '1\n42', expectedOutput: '42', isHidden: true }
    ],
    solution: {
      approach: 'Breadth-First Search level order scan.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 79,
    title: 'Validate Binary Search Tree (BST)',
    slug: 'validate-binary-search-tree',
    topic: 'Trees',
    difficulty: 'Medium',
    description: `Given the array representation of a binary tree of size $N$, return \`true\` if it is a valid binary search tree (BST), else \`false\`.
A valid BST requires that all left descendants have strictly smaller values and all right descendants have strictly larger values.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '3\n2 1 3', output: 'true', explanation: 'Left child 1 < 2 < Right child 3.' },
      { input: '3\n5 1 4', output: 'false', explanation: 'Right child 4 is smaller than root 5.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Trees', 'BST'],
    hints: ['Check recursively maintaining [min_allowed, max_allowed] interval for each subtree.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  function isValid(i, min, max) {
    if(i >= n) return true;
    if(a[i] <= min || a[i] >= max) return false;
    return isValid(2*i + 1, min, a[i]) && isValid(2*i + 2, a[i], max);
  }
  console.log(isValid(0, -Infinity, Infinity) ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    def is_valid(i, mn, mx):
        if i >= n: return True
        if not (mn < a[i] < mx): return False
        return is_valid(2*i + 1, mn, a[i]) and is_valid(2*i + 2, a[i], mx)
    print("true" if is_valid(0, -float('inf'), float('inf')) else "false")`
    },
    testCases: [
      { input: '3\n2 1 3', expectedOutput: 'true', isHidden: false },
      { input: '3\n5 1 4', expectedOutput: 'false', isHidden: false }
    ],
    solution: {
      approach: 'Bounded range check DFS.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 80,
    title: 'Lowest Common Ancestor in BST',
    slug: 'lowest-common-ancestor-in-bst',
    topic: 'Trees',
    difficulty: 'Medium',
    description: `Given a binary search tree (BST) represented as an array of $N$ nodes and two node values $P$ and $Q$, find the lowest common ancestor (LCA) node value of $P$ and $Q$.

### Input Format
- First line: three integers $N$, $P$, and $Q$.
- Second line: $N$ integers representing BST nodes in level-order.

### Output Format
- Print LCA value.`,
    examples: [
      { input: '7 2 8\n6 2 8 0 4 7 9', output: '6', explanation: 'LCA of 2 and 8 is 6.' },
      { input: '7 2 4\n6 2 8 0 4 7 9', output: '2', explanation: 'LCA of 2 and 4 is 2.' }
    ],
    constraints: ['2 <= N <= 10^5'],
    tags: ['Trees', 'BST'],
    hints: ['If both P and Q are smaller than current node, go left. If both are greater, go right. Otherwise, current node is LCA.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 3) {
  const n = parseInt(input[0]);
  const p = parseInt(input[1]);
  const q = parseInt(input[2]);
  const a = input.slice(3, n + 3).map(Number);
  let curr = 0;
  while(curr < n) {
    if(p < a[curr] && q < a[curr]) curr = 2 * curr + 1;
    else if(p > a[curr] && q > a[curr]) curr = 2 * curr + 2;
    else {
      console.log(a[curr]);
      break;
    }
  }
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, p, q = int(data[0]), int(data[1]), int(data[2])
    a = [int(x) for x in data[3:n+3]]
    curr = 0
    while curr < n:
        if p < a[curr] and q < a[curr]: curr = 2*curr + 1
        elif p > a[curr] and q > a[curr]: curr = 2*curr + 2
        else:
            print(a[curr])
            break`
    },
    testCases: [
      { input: '7 2 8\n6 2 8 0 4 7 9', expectedOutput: '6', isHidden: false },
      { input: '7 2 4\n6 2 8 0 4 7 9', expectedOutput: '2', isHidden: false }
    ],
    solution: {
      approach: 'BST split point property in O(H).',
      timeComplexity: 'O(H)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 81,
    title: 'Kth Smallest Element in a BST',
    slug: 'kth-smallest-element-in-bst',
    topic: 'Trees',
    difficulty: 'Medium',
    description: `Given a binary search tree of $N$ integers and an integer $K$, return the $K$-th smallest value (1-indexed) in the tree.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ integers of BST in array form.

### Output Format
- Print $K$-th smallest element.`,
    examples: [
      { input: '4 1\n3 1 4 2', output: '1', explanation: 'Sorted values: [1, 2, 3, 4]. 1st smallest is 1.' }
    ],
    constraints: ['1 <= K <= N <= 10^5'],
    tags: ['Trees', 'BST'],
    hints: ['Inorder traversal of a BST visits nodes in strictly ascending order.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  const n = parseInt(input[0]);
  const k = parseInt(input[1]);
  const a = input.slice(2, n + 2).map(Number).sort((x,y)=>x-y);
  console.log(a[k - 1]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1])
    a = sorted([int(x) for x in data[2:n+2]])
    print(a[k-1])`
    },
    testCases: [
      { input: '4 1\n3 1 4 2', expectedOutput: '1', isHidden: false },
      { input: '6 3\n5 3 6 2 4 1', expectedOutput: '3', isHidden: false }
    ],
    solution: {
      approach: 'In-order traversal.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 82,
    title: 'Diameter of Binary Tree',
    slug: 'diameter-of-binary-tree',
    topic: 'Trees',
    difficulty: 'Medium',
    description: `Given the root of a binary tree of $N$ nodes, return the length of the diameter of the tree.
The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print diameter length (number of edges).`,
    examples: [
      { input: '5\n1 2 3 4 5', output: '3', explanation: 'Path 4->2->1->3 has length 3 edges.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Trees', 'DFS'],
    hints: ['At each node, diameter through this node = depth(left) + depth(right). Track global maximum.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  let maxDiameter = 0;
  function height(i) {
    if(i >= n) return 0;
    const lh = height(2 * i + 1);
    const rh = height(2 * i + 2);
    maxDiameter = Math.max(maxDiameter, lh + rh);
    return 1 + Math.max(lh, rh);
  }
  height(0);
  console.log(maxDiameter);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    dia = 0
    def h(i):
        global dia
        if i >= n: return 0
        lh, rh = h(2*i+1), h(2*i+2)
        dia = max(dia, lh + rh)
        return 1 + max(lh, rh)
    h(0)
    print(dia)`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '3', isHidden: false },
      { input: '2\n1 2', expectedOutput: '1', isHidden: false }
    ],
    solution: {
      approach: 'Post-order DFS depth aggregation.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)'
    }
  },
  {
    problemId: 83,
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    slug: 'construct-tree-from-preorder-inorder',
    topic: 'Trees',
    difficulty: 'Medium',
    description: `Given two integer arrays $preorder$ and $inorder$ representing traversals of a unique binary tree, construct the binary tree and print its postorder traversal space-separated.

### Input Format
- First line: integer $N$.
- Second line: $N$ preorder integers.
- Third line: $N$ inorder integers.

### Output Format
- Print postorder traversal space-separated.`,
    examples: [
      { input: '5\n3 9 20 15 7\n9 3 15 20 7', output: '9 15 7 20 3', explanation: 'Postorder traversal of reconstructed tree.' }
    ],
    constraints: ['1 <= N <= 3000'],
    tags: ['Trees', 'Divide and Conquer'],
    hints: ['First element of preorder is the root. Find it in inorder to determine left and right subtrees.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const pre = input.slice(1, n + 1).map(Number);
  const inO = input.slice(n + 1, 2 * n + 1).map(Number);
  const post = [];
  function build(pStart, pEnd, iStart, iEnd) {
    if(pStart > pEnd || iStart > iEnd) return;
    const rootVal = pre[pStart];
    const rootIdx = inO.indexOf(rootVal);
    const leftCount = rootIdx - iStart;
    build(pStart + 1, pStart + leftCount, iStart, rootIdx - 1);
    build(pStart + leftCount + 1, pEnd, rootIdx + 1, iEnd);
    post.push(rootVal);
  }
  build(0, n - 1, 0, n - 1);
  console.log(post.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    pre = [int(x) for x in data[1:n+1]]
    inO = [int(x) for x in data[n+1:2*n+1]]
    post = []
    def build(p_start, p_end, i_start, i_end):
        if p_start > p_end or i_start > i_end: return
        root_val = pre[p_start]
        root_idx = inO.index(root_val)
        left_len = root_idx - i_start
        build(p_start + 1, p_start + left_len, i_start, root_idx - 1)
        build(p_start + left_len + 1, p_end, root_idx + 1, i_end)
        post.append(str(root_val))
    build(0, n - 1, 0, n - 1)
    print(' '.join(post))`
    },
    testCases: [
      { input: '5\n3 9 20 15 7\n9 3 15 20 7', expectedOutput: '9 15 7 20 3', isHidden: false },
      { input: '1\n-1\n-1', expectedOutput: '-1', isHidden: true }
    ],
    solution: {
      approach: 'Divide and conquer root partitioning.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  }
];
