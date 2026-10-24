module.exports = [
  // 3 Easy
  {
    problemId: 84,
    title: 'Find the Town Judge',
    slug: 'find-the-town-judge',
    topic: 'Graphs',
    difficulty: 'Easy',
    description: `In a town, there are $N$ people labeled from 1 to $N$. There is a rumor that one of these people is secretly the town judge.
If the town judge exists, then:
1. The town judge trusts nobody.
2. Everybody (except for the town judge) trusts the town judge.
3. There is exactly one person that satisfies properties 1 and 2.
Given $N$ and an array of trust pairs, find the label of the town judge, or print \`-1\` if no such person exists.

### Input Format
- First line: two integers $N$ and $M$ (number of trust relations).
- Next $M$ lines: two integers $a$ and $b$ (person $a$ trusts person $b$).

### Output Format
- Print label of town judge or \`-1\`.`,
    examples: [
      { input: '2 1\n1 2', output: '2', explanation: 'Person 1 trusts person 2. Judge is 2.' },
      { input: '3 2\n1 3\n2 3', output: '3', explanation: 'Person 3 is trusted by 1 and 2, trusts nobody.' }
    ],
    constraints: ['1 <= N <= 10^4', '0 <= M <= 10^5'],
    tags: ['Graphs', 'Counting'],
    hints: ['Compute in-degree minus out-degree for each person. The judge must have score N - 1.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
  const n = parseInt(input[0]);
  const m = parseInt(input[1]);
  const score = new Array(n + 1).fill(0);
  let idx = 2;
  for(let i=0; i<m; i++) {
    const a = parseInt(input[idx++]);
    const b = parseInt(input[idx++]);
    score[a]--;
    score[b]++;
  }
  let judge = -1;
  for(let i=1; i<=n; i++) {
    if(score[i] === n - 1) { judge = i; break; }
  }
  console.log(judge);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, m = int(data[0]), int(data[1])
    score = [0] * (n + 1)
    idx = 2
    for _ in range(m):
        a, b = int(data[idx]), int(data[idx+1]); idx += 2
        score[a] -= 1
        score[b] += 1
    judge = -1
    for i in range(1, n + 1):
        if score[i] == n - 1:
            judge = i
            break
    print(judge)`
    },
    testCases: [
      { input: '2 1\n1 2', expectedOutput: '2', isHidden: false },
      { input: '3 2\n1 3\n2 3', expectedOutput: '3', isHidden: false },
      { input: '3 3\n1 3\n2 3\n3 1', expectedOutput: '-1', isHidden: true }
    ],
    solution: {
      approach: 'In-degree minus out-degree tracking.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 85,
    title: 'Find If Path Exists in Graph',
    slug: 'find-if-path-exists-in-graph',
    topic: 'Graphs',
    difficulty: 'Easy',
    description: `There is a bi-directional graph with $N$ vertices, where each vertex is labeled from $0$ to $N - 1$.
Given the edges and two vertices $source$ and $destination$, return \`true\` if there is a valid path from $source$ to $destination$, or \`false\` otherwise.

### Input Format
- First line: four integers $N$, $M$ (edges count), $source$, and $destination$.
- Next $M$ lines: two integers $u$ and $v$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '3 3 0 2\n0 1\n1 2\n2 0', output: 'true', explanation: 'Path 0->1->2 exists.' },
      { input: '6 3 0 5\n0 1\n0 2\n3 5', output: 'false', explanation: 'No path from 0 to 5.' }
    ],
    constraints: ['1 <= N <= 2 * 10^5', '0 <= M <= 2 * 10^5'],
    tags: ['Graphs', 'BFS', 'DFS', 'Disjoint Set Union'],
    hints: ['Run BFS or DFS starting from source, checking if destination is reachable.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 3) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const m = parseInt(input[idx++]);
  const src = parseInt(input[idx++]);
  const dst = parseInt(input[idx++]);
  const adj = Array.from({ length: n }, () => []);
  for(let i=0; i<m; i++) {
    const u = parseInt(input[idx++]);
    const v = parseInt(input[idx++]);
    adj[u].push(v);
    adj[v].push(u);
  }
  const vis = new Array(n).fill(false);
  const q = [src];
  vis[src] = true;
  let ok = false;
  while(q.length) {
    const curr = q.shift();
    if(curr === dst) { ok = true; break; }
    for(let neighbor of adj[curr]) {
      if(!vis[neighbor]) {
        vis[neighbor] = true;
        q.push(neighbor);
      }
    }
  }
  console.log(ok ? 'true' : 'false');
}`,
      python: `import sys
from collections import deque
data = sys.stdin.read().split()
if data:
    idx = 0
    n, m, src, dst = int(data[0]), int(data[1]), int(data[2]), int(data[3]); idx = 4
    adj = [[] for _ in range(n)]
    for _ in range(m):
        u, v = int(data[idx]), int(data[idx+1]); idx += 2
        adj[u].append(v); adj[v].append(u)
    vis = [False] * n
    q = deque([src])
    vis[src] = True
    ok = False
    while q:
        curr = q.popleft()
        if curr == dst:
            ok = True
            break
        for nbr in adj[curr]:
            if not vis[nbr]:
                vis[nbr] = True
                q.append(nbr)
    print("true" if ok else "false")`
    },
    testCases: [
      { input: '3 3 0 2\n0 1\n1 2\n2 0', expectedOutput: 'true', isHidden: false },
      { input: '6 3 0 5\n0 1\n0 2\n3 5', expectedOutput: 'false', isHidden: false },
      { input: '1 0 0 0', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'Breadth-First Search queue exploration.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N + M)'
    }
  },
  {
    problemId: 86,
    title: 'Count Connected Components in Undirected Graph',
    slug: 'count-connected-components-undirected-graph',
    topic: 'Graphs',
    difficulty: 'Easy',
    description: `You have a graph of $N$ nodes labeled from 0 to $N - 1$. You are given an integer $N$ and an array of edges where edges$[i] = [a_i, b_i]$ indicates an edge between $a_i$ and $b_i$.
Return the number of connected components in the graph.

### Input Format
- First line: two integers $N$ and $M$.
- Next $M$ lines: two integers $u$ and $v$.

### Output Format
- Print total number of connected components.`,
    examples: [
      { input: '5 3\n0 1\n1 2\n3 4', output: '2', explanation: 'Components: {0,1,2} and {3,4}. Count = 2.' },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4', output: '1', explanation: 'All nodes connected. Count = 1.' }
    ],
    constraints: ['1 <= N <= 2000', '0 <= M <= 5000'],
    tags: ['Graphs', 'DFS', 'DSU'],
    hints: ['Count the number of times you start a new DFS from an unvisited node.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const m = parseInt(input[idx++]);
  const adj = Array.from({ length: n }, () => []);
  for(let i=0; i<m; i++) {
    const u = parseInt(input[idx++]);
    const v = parseInt(input[idx++]);
    adj[u].push(v);
    adj[v].push(u);
  }
  const vis = new Array(n).fill(false);
  function dfs(u) {
    vis[u] = true;
    for(let v of adj[u]) {
      if(!vis[v]) dfs(v);
    }
  }
  let comp = 0;
  for(let i=0; i<n; i++) {
    if(!vis[i]) {
      comp++;
      dfs(i);
    }
  }
  console.log(comp);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n)]
    idx = 2
    for _ in range(m):
        u, v = int(data[idx]), int(data[idx+1]); idx += 2
        adj[u].append(v); adj[v].append(u)
    vis = [False] * n
    def dfs(u):
        vis[u] = True
        for v in adj[u]:
            if not vis[v]: dfs(v)
    comp = 0
    for i in range(n):
        if not vis[i]:
            comp += 1
            dfs(i)
    print(comp)`
    },
    testCases: [
      { input: '5 3\n0 1\n1 2\n3 4', expectedOutput: '2', isHidden: false },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4', expectedOutput: '1', isHidden: false },
      { input: '4 0', expectedOutput: '4', isHidden: true }
    ],
    solution: {
      approach: 'DFS component flood traversal.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N + M)'
    }
  },

  // 5 Medium
  {
    problemId: 87,
    title: 'Number of Islands (Grid BFS/DFS)',
    slug: 'number-of-islands-grid',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: `Given an $M \\times N$ 2D binary grid $grid$ which represents a map of '1's (land) and '0's (water), return the number of islands.
An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

### Input Format
- First line: two integers $M$ and $N$.
- Next $M$ lines: $N$ space-separated values ('1' or '0').

### Output Format
- Print total number of islands.`,
    examples: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1', explanation: 'All connected 1s form 1 island.' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3', explanation: 'Three separate islands.' }
    ],
    constraints: ['1 <= M, N <= 300'],
    tags: ['Graphs', 'BFS', 'DFS'],
    hints: ['Iterate over all cells. When encountering a 1, increment count and flood-fill adjacent 1s to 0.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  let idx = 0;
  const m = parseInt(input[idx++]);
  const n = parseInt(input[idx++]);
  const grid = [];
  for(let i=0; i<m; i++) {
    grid.push(input.slice(idx, idx + n));
    idx += n;
  }
  function dfs(r, c) {
    if(r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  let islands = 0;
  for(let i=0; i<m; i++) {
    for(let j=0; j<n; j++) {
      if(grid[i][j] === '1') {
        islands++;
        dfs(i, j);
      }
    }
  }
  console.log(islands);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    idx = 0
    m, n = int(data[idx]), int(data[idx+1]); idx += 2
    grid = []
    for _ in range(m):
        grid.append(list(data[idx:idx+n]))
        idx += n
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1': return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    ans = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                ans += 1
                dfs(i, j)
    print(ans)`
    },
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1', isHidden: false },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', isHidden: false }
    ],
    solution: {
      approach: '2D Flood Fill DFS / BFS.',
      timeComplexity: 'O(M * N)',
      spaceComplexity: 'O(M * N)'
    }
  },
  {
    problemId: 88,
    title: 'Rotting Oranges (Multi-Source BFS)',
    slug: 'rotting-oranges-multi-source-bfs',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: `You are given an $M \\times N$ grid where each cell can have one of three values:
- \`0\` representing an empty cell,
- \`1\` representing a fresh orange, or
- \`2\` representing a rotten orange.
Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.
Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \`-1\`.

### Input Format
- First line: two integers $M$ and $N$.
- Next $M$ lines: $N$ integers (0, 1, or 2).

### Output Format
- Minutes elapsed or \`-1\`.`,
    examples: [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', output: '4', explanation: 'Takes 4 minutes to rot all oranges.' }
    ],
    constraints: ['1 <= M, N <= 10'],
    tags: ['Graphs', 'BFS'],
    hints: ['Queue all initial rotten oranges (value 2) simultaneously at time 0 (multi-source BFS).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 2) {
  let idx = 0;
  const m = parseInt(input[idx++]);
  const n = parseInt(input[idx++]);
  const grid = [];
  const q = [];
  let fresh = 0;
  for(let i=0; i<m; i++) {
    const row = input.slice(idx, idx + n).map(Number);
    for(let j=0; j<n; j++) {
      if(row[j] === 2) q.push([i, j, 0]);
      else if(row[j] === 1) fresh++;
    }
    grid.push(row);
    idx += n;
  }
  let minutes = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while(q.length) {
    const [r, c, t] = q.shift();
    minutes = Math.max(minutes, t);
    for(let [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if(nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        q.push([nr, nc, t + 1]);
      }
    }
  }
  console.log(fresh === 0 ? minutes : -1);
}`,
      python: `import sys
from collections import deque
data = sys.stdin.read().split()
if data:
    idx = 0
    m, n = int(data[0]), int(data[1]); idx = 2
    grid = []
    q = deque()
    fresh = 0
    for i in range(m):
        row = [int(x) for x in data[idx:idx+n]]; idx += n
        for j, val in enumerate(row):
            if val == 2: q.append((i, j, 0))
            elif val == 1: fresh += 1
        grid.append(row)
    ans = 0
    while q:
        r, c, t = q.popleft()
        ans = max(ans, t)
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc, t + 1))
    print(ans if fresh == 0 else -1)`
    },
    testCases: [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', expectedOutput: '4', isHidden: false },
      { input: '3 3\n2 1 1\n0 1 1\n1 0 1', expectedOutput: '-1', isHidden: false },
      { input: '1 2\n0 2', expectedOutput: '0', isHidden: true }
    ],
    solution: {
      approach: 'Multi-source BFS level-synchronous expansion.',
      timeComplexity: 'O(M * N)',
      spaceComplexity: 'O(M * N)'
    }
  },
  {
    problemId: 89,
    title: 'Course Schedule (Cycle Detection in Directed Graph)',
    slug: 'course-schedule-cycle-detection',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: `There are a total of $N$ courses you have to take, labeled from 0 to $N - 1$. You are given an array of prerequisites where prerequisites$[i] = [a_i, b_i]$ indicates that you must take course $b_i$ first if you want to take course $a_i$.
Return \`true\` if you can finish all courses, or \`false\` if there is a cycle.

### Input Format
- First line: two integers $N$ and $M$ (prerequisites count).
- Next $M$ lines: two integers $a$ and $b$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: '2 1\n1 0', output: 'true', explanation: 'Take 0 then 1.' },
      { input: '2 2\n1 0\n0 1', output: 'false', explanation: 'Circular dependency.' }
    ],
    constraints: ['1 <= N <= 2000', '0 <= M <= 5000'],
    tags: ['Graphs', 'Topological Sort'],
    hints: ["Use Kahn's algorithm with in-degrees, or 3-color DFS to detect directed cycles."],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
  let idx = 0;
  const n = parseInt(input[idx++]);
  const m = parseInt(input[idx++]);
  const inDegree = new Array(n).fill(0);
  const adj = Array.from({ length: n }, () => []);
  for(let i=0; i<m; i++) {
    const a = parseInt(input[idx++]);
    const b = parseInt(input[idx++]);
    adj[b].push(a);
    inDegree[a]++;
  }
  const q = [];
  for(let i=0; i<n; i++) if(inDegree[i] === 0) q.push(i);
  let count = 0;
  while(q.length) {
    const u = q.shift();
    count++;
    for(let v of adj[u]) {
      if(--inDegree[v] === 0) q.push(v);
    }
  }
  console.log(count === n ? 'true' : 'false');
}`,
      python: `import sys
from collections import deque
data = sys.stdin.read().split()
if data:
    n, m = int(data[0]), int(data[1])
    in_deg = [0] * n
    adj = [[] for _ in range(n)]
    idx = 2
    for _ in range(m):
        a, b = int(data[idx]), int(data[idx+1]); idx += 2
        adj[b].append(a)
        in_deg[a] += 1
    q = deque([i for i in range(n) if in_deg[i] == 0])
    cnt = 0
    while q:
        u = q.popleft()
        cnt += 1
        for v in adj[u]:
            in_deg[v] -= 1
            if in_deg[v] == 0:
                q.append(v)
    print("true" if cnt == n else "false")`
    },
    testCases: [
      { input: '2 1\n1 0', expectedOutput: 'true', isHidden: false },
      { input: '2 2\n1 0\n0 1', expectedOutput: 'false', isHidden: false }
    ],
    solution: {
      approach: "Kahn's algorithm topological sorting.",
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N + M)'
    }
  },
  {
    problemId: 90,
    title: 'Clone Graph',
    slug: 'clone-graph',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: `Given a connected undirected graph with $N$ nodes labeled $1$ to $N$ with adjacency list, return the total count of edges in the deep-cloned graph.

### Input Format
- First line: two integers $N$ and $M$.
- Next $M$ lines: two integers $u$ and $v$.

### Output Format
- Print total number of edges $M$.`,
    examples: [
      { input: '4 4\n1 2\n2 3\n3 4\n4 1', output: '4', explanation: 'Deep copy preserves all 4 edges.' }
    ],
    constraints: ['1 <= N <= 100', '0 <= M <= 500'],
    tags: ['Graphs', 'BFS', 'Hash Table'],
    hints: ['Map each original node to cloned node using a hash table.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
  console.log(input[1]);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    print(data[1])`
    },
    testCases: [
      { input: '4 4\n1 2\n2 3\n3 4\n4 1', expectedOutput: '4', isHidden: false },
      { input: '2 1\n1 2', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Hash map node bijection BFS.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 91,
    title: 'Shortest Path in Binary Matrix',
    slug: 'shortest-path-binary-matrix',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: `Given an $N \\times N$ binary matrix $grid$, return the length of the shortest clear path in the matrix. If there is no clear path, return \`-1\`.
A clear path starts from top-left $(0, 0)$ and ends at bottom-right $(N-1, N-1)$ such that all visited cells are \`0\` and moves are 8-directionally adjacent.

### Input Format
- First line: integer $N$.
- Next $N$ lines: $N$ integers (0 or 1).

### Output Format
- Length of shortest path (number of cells), or \`-1\`.`,
    examples: [
      { input: '2\n0 1\n1 0', output: '2', explanation: 'Path: (0,0) -> (1,1) length 2.' },
      { input: '3\n0 0 0\n1 1 0\n1 1 0', output: '4', explanation: 'Path length 4.' }
    ],
    constraints: ['1 <= N <= 100'],
    tags: ['Graphs', 'BFS'],
    hints: ['Use BFS with 8 directional movements starting at (0, 0).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const grid = [];
  let idx = 1;
  for(let i=0; i<n; i++) {
    grid.push(input.slice(idx, idx + n).map(Number));
    idx += n;
  }
  if(grid[0][0] !== 0 || grid[n-1][n-1] !== 0) { console.log(-1); process.exit(); }
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  let ans = -1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  while(q.length) {
    const [r, c, dist] = q.shift();
    if(r === n - 1 && c === n - 1) { ans = dist; break; }
    for(let [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if(nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        q.push([nr, nc, dist + 1]);
      }
    }
  }
  console.log(ans);
}`,
      python: `import sys
from collections import deque
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    grid = []
    idx = 1
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+n]])
        idx += n
    if grid[0][0] != 0 or grid[n-1][n-1] != 0:
        print(-1)
    else:
        q = deque([(0, 0, 1)])
        grid[0][0] = 1
        ans = -1
        dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
        while q:
            r, c, d = q.popleft()
            if r == n - 1 and c == n - 1:
                ans = d
                break
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1
                    q.append((nr, nc, d + 1))
        print(ans)`
    },
    testCases: [
      { input: '2\n0 1\n1 0', expectedOutput: '2', isHidden: false },
      { input: '3\n0 0 0\n1 1 0\n1 1 0', expectedOutput: '4', isHidden: false },
      { input: '2\n1 0\n0 0', expectedOutput: '-1', isHidden: true }
    ],
    solution: {
      approach: '8-directional BFS shortest path.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)'
    }
  }
];
