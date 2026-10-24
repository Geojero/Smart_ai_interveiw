module.exports = [
  // 10 Easy
  {
    problemId: 1,
    title: 'Reverse an Array',
    slug: 'reverse-an-array',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given an array of integers, reverse the order of elements in place and return or print the reversed array as space-separated numbers.

### Input Format
- First line contains integer $N$, the size of the array.
- Second line contains $N$ space-separated integers.

### Output Format
- Print the reversed array elements separated by space.`,
    examples: [
      { input: '4\n1 2 3 4', output: '4 3 2 1', explanation: 'Elements reversed from 1 2 3 4 to 4 3 2 1.' },
      { input: '5\n10 20 30 40 50', output: '50 40 30 20 10', explanation: 'Array reversed in order.' }
    ],
    constraints: ['1 <= N <= 10^5', '-10^9 <= A[i] <= 10^9'],
    tags: ['Arrays', 'Two Pointers'],
    hints: ['Use two pointers: one at the start, one at the end, and swap until they meet.'],
    starterCodes: {
      javascript: `// Read input from stdin or readline
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1);
  console.log(arr.reverse().join(' '));
}`,
      python: `import sys
input_data = sys.stdin.read().split()
if input_data:
    n = int(input_data[0])
    arr = input_data[1:n+1]
    print(' '.join(arr[::-1]))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        vector<int> a(n);
        for(int i=0; i<n; ++i) cin >> a[i];
        reverse(a.begin(), a.end());
        for(int i=0; i<n; ++i) cout << a[i] << (i==n-1?"":" ");
        cout << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = sc.nextInt();
            for (int i = n - 1; i >= 0; i--) {
                System.out.print(a[i] + (i == 0 ? "" : " "));
            }
            System.out.println();
        }
    }
}`
    },
    testCases: [
      { input: '4\n1 2 3 4', expectedOutput: '4 3 2 1', isHidden: false },
      { input: '5\n10 20 30 40 50', expectedOutput: '50 40 30 20 10', isHidden: false },
      { input: '1\n99', expectedOutput: '99', isHidden: true },
      { input: '6\n7 -2 0 4 -9 11', expectedOutput: '11 -9 4 0 -2 7', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer swap or linear reverse in O(N) time and O(1) auxiliary space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      code: {
        javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1);
let l = 0, r = n - 1;
while(l < r) {
  [arr[l], arr[r]] = [arr[r], arr[l]];
  l++; r--;
}
console.log(arr.join(' '));`,
        python: `import sys
data = sys.stdin.read().split()
n = int(data[0])
print(' '.join(data[1:n+1][::-1]))`
      }
    }
  },
  {
    problemId: 2,
    title: 'Find Maximum and Minimum in Array',
    slug: 'find-max-min-in-array',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given an array of $N$ integers, find the maximum and minimum elements in the array.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print two space-separated integers: \`min_value max_value\`.`,
    examples: [
      { input: '5\n3 5 4 1 9', output: '1 9', explanation: 'Minimum is 1, Maximum is 9.' }
    ],
    constraints: ['1 <= N <= 10^5', '-10^9 <= A[i] <= 10^9'],
    tags: ['Arrays'],
    hints: ['Traverse the array once while keeping track of current min and max.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1).map(Number);
  let min = arr[0], max = arr[0];
  for(let x of arr) {
    if(x < min) min = x;
    if(x > max) max = x;
  }
  console.log(min + ' ' + max);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    print(f"{min(nums)} {max(nums)}")`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if(cin >> n && n > 0) {
        long long mn = 2e18, mx = -2e18, x;
        for(int i=0; i<n; ++i) {
            cin >> x;
            mn = min(mn, x);
            mx = max(mx, x);
        }
        cout << mn << " " << mx << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            long mn = Long.MAX_VALUE, mx = Long.MIN_VALUE;
            for(int i = 0; i < n; i++) {
                long x = sc.nextLong();
                if(x < mn) mn = x;
                if(x > mx) mx = x;
            }
            System.out.println(mn + " " + mx);
        }
    }
}`
    },
    testCases: [
      { input: '5\n3 5 4 1 9', expectedOutput: '1 9', isHidden: false },
      { input: '4\n-10 -20 -3 -5', expectedOutput: '-20 -3', isHidden: true },
      { input: '1\n42', expectedOutput: '42 42', isHidden: true }
    ],
    solution: {
      approach: 'Single pass comparison.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 3,
    title: 'Valid Palindrome String',
    slug: 'valid-palindrome-string',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
Print \`true\` if it is a palindrome, or \`false\` otherwise.

### Input Format
- A single line containing string $S$.

### Output Format
- Print \`true\` or \`false\`.`,
    examples: [
      { input: 'A man, a plan, a canal: Panama', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 'race a car', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: ['1 <= |S| <= 2 * 10^5'],
    tags: ['Strings', 'Two Pointers'],
    hints: ['Filter alphanumeric characters and compare characters from both ends.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
const rev = cleaned.split('').reverse().join('');
console.log(cleaned === rev ? 'true' : 'false');`,
      python: `import sys, re
s = sys.stdin.read().strip()
cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
print('true' if cleaned == cleaned[::-1] else 'false')`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s, clean = "";
    getline(cin, s);
    for(char c : s) if(isalnum(c)) clean += tolower(c);
    int l = 0, r = clean.size() - 1;
    bool ok = true;
    while(l < r) {
        if(clean[l] != clean[r]) { ok = false; break; }
        l++; r--;
    }
    cout << (ok ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int l = 0, r = clean.length() - 1;
        boolean ok = true;
        while(l < r) {
            if(clean.charAt(l) != clean.charAt(r)) { ok = false; break; }
            l++; r--;
        }
        System.out.println(ok ? "true" : "false");
    }
}`
    },
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', isHidden: false },
      { input: 'race a car', expectedOutput: 'false', isHidden: false },
      { input: ' ', expectedOutput: 'true', isHidden: true },
      { input: '0P', expectedOutput: 'false', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer scan or filtered string reversal.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 4,
    title: 'Check If Two Strings Are Anagrams',
    slug: 'check-anagram-strings',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given two lowercase strings $S1$ and $S2$, determine if $S2$ is an anagram of $S1$ (contains the same characters with the same frequencies).

### Input Format
- Two lines containing $S1$ and $S2$.

### Output Format
- Print \`YES\` if they are anagrams, otherwise \`NO\`.`,
    examples: [
      { input: 'anagram\nnagaram', output: 'YES', explanation: 'Both strings have identical frequency of each letter.' },
      { input: 'rat\ncar', output: 'NO', explanation: 'Different character sets.' }
    ],
    constraints: ['1 <= |S1|, |S2| <= 10^5'],
    tags: ['Strings', 'Hashing'],
    hints: ['Count letter frequencies with an array of size 26.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const [s1, s2] = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(s => s.trim());
if (!s1 || !s2 || s1.length !== s2.length) {
  console.log('NO');
} else {
  const sorted1 = s1.split('').sort().join('');
  const sorted2 = s2.split('').sort().join('');
  console.log(sorted1 === sorted2 ? 'YES' : 'NO');
}`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().strip().splitlines() if l.strip()]
if len(lines) >= 2:
    s1, s2 = lines[0], lines[1]
    print("YES" if sorted(s1) == sorted(s2) else "NO")
else:
    print("NO")`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;
int main() {
    string s1, s2;
    if (cin >> s1 >> s2) {
        if(s1.size() != s2.size()) { cout << "NO\\n"; return 0; }
        vector<int> cnt(26, 0);
        for(char c: s1) cnt[c-'a']++;
        for(char c: s2) cnt[c-'a']--;
        for(int x: cnt) if(x != 0) { cout << "NO\\n"; return 0; }
        cout << "YES\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s1 = sc.next();
            String s2 = sc.next();
            char[] a = s1.toCharArray();
            char[] b = s2.toCharArray();
            Arrays.sort(a);
            Arrays.sort(b);
            System.out.println(Arrays.equals(a, b) ? "YES" : "NO");
        }
    }
}`
    },
    testCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'YES', isHidden: false },
      { input: 'rat\ncar', expectedOutput: 'NO', isHidden: false },
      { input: 'listen\nsilent', expectedOutput: 'YES', isHidden: true }
    ],
    solution: {
      approach: 'Frequency count array of length 26.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 5,
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-sorted-array',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given a sorted array of $N$ integers, remove duplicates in-place such that each unique element appears only once.
Print the number of unique elements $K$, followed on the next line by the unique elements space-separated.

### Input Format
- First line: integer $N$.
- Second line: $N$ sorted integers.

### Output Format
- Line 1: count of unique elements $K$.
- Line 2: the $K$ unique elements.`,
    examples: [
      { input: '6\n1 1 2 2 3 4', output: '4\n1 2 3 4', explanation: 'There are 4 unique elements: 1, 2, 3, 4.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Arrays', 'Two Pointers'],
    hints: ['Maintain an index for the position of the last found unique element.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1).map(Number);
  const unique = [];
  for(let i=0; i<n; i++) {
    if(i === 0 || arr[i] !== arr[i-1]) unique.push(arr[i]);
  }
  console.log(unique.length);
  console.log(unique.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    res = []
    for i, x in enumerate(arr):
        if i == 0 or x != arr[i-1]:
            res.append(x)
    print(len(res))
    print(' '.join(map(str, res)))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    if(cin >> n && n > 0) {
        vector<int> a(n), u;
        for(int i=0; i<n; ++i) {
            cin >> a[i];
            if(i==0 || a[i] != a[i-1]) u.push_back(a[i]);
        }
        cout << u.size() << "\\n";
        for(int i=0; i<u.size(); ++i) cout << u[i] << (i+1==u.size()?"":" ");
        cout << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
import java.util.ArrayList;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            ArrayList<Integer> u = new ArrayList<>();
            int prev = 0;
            for(int i=0; i<n; i++) {
                int x = sc.nextInt();
                if(i==0 || x != prev) u.add(x);
                prev = x;
            }
            System.out.println(u.size());
            for(int i=0; i<u.size(); i++) {
                System.out.print(u.get(i) + (i==u.size()-1 ? "" : " "));
            }
            System.out.println();
        }
    }
}`
    },
    testCases: [
      { input: '6\n1 1 2 2 3 4', expectedOutput: '4\n1 2 3 4', isHidden: false },
      { input: '3\n1 1 1', expectedOutput: '1\n1', isHidden: true },
      { input: '5\n10 20 30 40 50', expectedOutput: '5\n10 20 30 40 50', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer unique placement.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 6,
    title: 'Move Zeroes to End',
    slug: 'move-zeroes-to-end',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given an integer array, move all $0$'s to the end of it while maintaining the relative order of the non-zero elements.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print the modified array separated by space.`,
    examples: [
      { input: '5\n0 1 0 3 12', output: '1 3 12 0 0', explanation: 'All zeroes shifted to the end.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Arrays', 'Two Pointers'],
    hints: ['Count non-zeroes and place them at the front.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1).map(Number);
  const nonZeros = arr.filter(x => x !== 0);
  const zeros = new Array(n - nonZeros.length).fill(0);
  console.log([...nonZeros, ...zeros].join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    non_zeros = [x for x in arr if x != 0]
    print(' '.join(map(str, non_zeros + [0]*(n - len(non_zeros)))))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    if(cin >> n) {
        vector<int> nz;
        for(int i=0; i<n; ++i) {
            int x; cin >> x;
            if(x != 0) nz.push_back(x);
        }
        while(nz.size() < n) nz.push_back(0);
        for(int i=0; i<n; ++i) cout << nz[i] << (i==n-1?"":" ");
        cout << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] res = new int[n];
            int idx = 0;
            for(int i=0; i<n; i++) {
                int x = sc.nextInt();
                if(x != 0) res[idx++] = x;
            }
            for(int i=0; i<n; i++) System.out.print(res[i] + (i==n-1?"":" "));
            System.out.println();
        }
    }
}`
    },
    testCases: [
      { input: '5\n0 1 0 3 12', expectedOutput: '1 3 12 0 0', isHidden: false },
      { input: '2\n0 0', expectedOutput: '0 0', isHidden: true },
      { input: '4\n4 5 6 7', expectedOutput: '4 5 6 7', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer partition.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 7,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given an integer array $nums$, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- \`true\` or \`false\`.`,
    examples: [
      { input: '4\n1 2 3 1', output: 'true', explanation: '1 appears twice.' },
      { input: '4\n1 2 3 4', output: 'false', explanation: 'All elements are distinct.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Arrays', 'Hashing'],
    hints: ['Use a hash set to check if you have seen the number before.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1);
  const set = new Set(arr);
  console.log(set.size !== arr.length ? 'true' : 'false');
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    arr = data[1:n+1]
    print('true' if len(set(arr)) != len(arr) else 'false')`,
      cpp: `#include <iostream>
#include <unordered_set>
using namespace std;
int main() {
    int n;
    if(cin >> n) {
        unordered_set<int> s;
        bool dup = false;
        for(int i=0; i<n; ++i) {
            int x; cin >> x;
            if(s.count(x)) dup = true;
            s.insert(x);
        }
        cout << (dup ? "true" : "false") << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
import java.util.HashSet;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            HashSet<Integer> s = new HashSet<>();
            boolean dup = false;
            for(int i=0; i<n; i++) {
                int x = sc.nextInt();
                if(!s.add(x)) dup = true;
            }
            System.out.println(dup ? "true" : "false");
        }
    }
}`
    },
    testCases: [
      { input: '4\n1 2 3 1', expectedOutput: 'true', isHidden: false },
      { input: '4\n1 2 3 4', expectedOutput: 'false', isHidden: false },
      { input: '5\n1 1 1 3 3', expectedOutput: 'true', isHidden: true }
    ],
    solution: {
      approach: 'Hash set lookup in O(1) average time.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 8,
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Write a program to find the longest common prefix string amongst an array of strings. If there is no common prefix, print \`-1\`.

### Input Format
- First line: integer $N$.
- Next $N$ lines: each contains a non-empty string.

### Output Format
- The longest common prefix, or \`-1\` if empty.`,
    examples: [
      { input: '3\nflower\nflow\nflight', output: 'fl', explanation: '"fl" is the longest common prefix.' },
      { input: '3\ndog\nracecar\ncar', output: '-1', explanation: 'No common prefix exists.' }
    ],
    constraints: ['1 <= N <= 200', '1 <= |S[i]| <= 200'],
    tags: ['Strings'],
    hints: ['Compare characters position by position across all strings.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).map(s => s.trim()).filter(Boolean);
if (lines.length > 0) {
  const n = parseInt(lines[0]);
  const strs = lines.slice(1, n + 1);
  if (!strs.length) { console.log('-1'); process.exit(); }
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (!prefix) break;
    }
  }
  console.log(prefix === '' ? '-1' : prefix);
}`,
      python: `import sys
lines = [l.strip() for l in sys.stdin.read().strip().splitlines() if l.strip()]
if lines:
    n = int(lines[0])
    strs = lines[1:n+1]
    if not strs:
        print("-1")
    else:
        prefix = strs[0]
        for s in strs[1:]:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    break
        print(prefix if prefix else "-1")`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    int n;
    if(cin >> n) {
        vector<string> s(n);
        for(int i=0; i<n; ++i) cin >> s[i];
        if(n == 0) { cout << "-1\\n"; return 0; }
        string pfx = s[0];
        for(int i=1; i<n; ++i) {
            while(s[i].find(pfx) != 0) {
                pfx = pfx.substr(0, pfx.size()-1);
                if(pfx.empty()) break;
            }
        }
        cout << (pfx.empty() ? "-1" : pfx) << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            String[] s = new String[n];
            for(int i=0; i<n; i++) s[i] = sc.next();
            if(n==0) { System.out.println("-1"); return; }
            String pfx = s[0];
            for(int i=1; i<n; i++) {
                while(s[i].indexOf(pfx) != 0) {
                    pfx = pfx.substring(0, pfx.length()-1);
                    if(pfx.isEmpty()) break;
                }
            }
            System.out.println(pfx.isEmpty() ? "-1" : pfx);
        }
    }
}`
    },
    testCases: [
      { input: '3\nflower\nflow\nflight', expectedOutput: 'fl', isHidden: false },
      { input: '3\ndog\nracecar\ncar', expectedOutput: '-1', isHidden: false },
      { input: '2\napple\napp', expectedOutput: 'app', isHidden: true }
    ],
    solution: {
      approach: 'Horizontal scanning or prefix truncation.',
      timeComplexity: 'O(S)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 9,
    title: 'Find Missing Number in Array (1 to N)',
    slug: 'find-missing-number-1-to-n',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `You are given an array of size $N-1$ containing distinct integers in the range $[1, N]$. Find the missing integer.

### Input Format
- First line: integer $N$.
- Second line: $N-1$ space-separated integers.

### Output Format
- Print the missing number.`,
    examples: [
      { input: '5\n1 2 4 5', output: '3', explanation: '3 is missing from 1 to 5.' }
    ],
    constraints: ['2 <= N <= 10^5'],
    tags: ['Arrays', 'Math'],
    hints: ['The sum of numbers 1 to N is N*(N+1)/2. Subtract the array sum from it.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = BigInt(input[0]);
  const expectedSum = (n * (n + 1n)) / 2n;
  let actualSum = 0n;
  for(let i=1; i<input.length; i++) {
    actualSum += BigInt(input[i]);
  }
  console.log((expectedSum - actualSum).toString());
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    nums = [int(x) for x in data[1:]]
    print(n*(n+1)//2 - sum(nums))`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    long long n;
    if(cin >> n) {
        long long sum = n * (n + 1) / 2;
        for(int i=0; i<n-1; ++i) {
            long long x; cin >> x;
            sum -= x;
        }
        cout << sum << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextLong()) {
            long n = sc.nextLong();
            long total = n * (n + 1) / 2;
            for(int i = 0; i < n - 1; i++) {
                total -= sc.nextLong();
            }
            System.out.println(total);
        }
    }
}`
    },
    testCases: [
      { input: '5\n1 2 4 5', expectedOutput: '3', isHidden: false },
      { input: '3\n1 3', expectedOutput: '2', isHidden: true },
      { input: '2\n2', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Gaussian arithmetic sum formula: N*(N+1)/2 - sum(arr).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 10,
    title: 'Count Frequency of Each Character',
    slug: 'count-character-frequencies',
    topic: 'Arrays & Strings',
    difficulty: 'Easy',
    description: `Given a string $S$ of lowercase English letters, print each distinct character and its frequency in alphabetical order.

### Input Format
- A single line containing string $S$.

### Output Format
- Each character followed by its count separated by a colon, on separate lines (e.g., \`a:2\`).`,
    examples: [
      { input: 'banana', output: 'a:3\nb:1\nn:2', explanation: 'Alphabetical frequency report.' }
    ],
    constraints: ['1 <= |S| <= 10^5'],
    tags: ['Strings', 'Hashing'],
    hints: ['Count occurrences in a frequency array of size 26.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const freq = {};
for(let c of s) freq[c] = (freq[c] || 0) + 1;
const keys = Object.keys(freq).sort();
for(let k of keys) console.log(k + ':' + freq[k]);`,
      python: `import sys
s = sys.stdin.read().strip()
counts = {}
for c in s:
    counts[c] = counts.get(c, 0) + 1
for k in sorted(counts.keys()):
    print(f"{k}:{counts[k]}")`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;
int main() {
    string s;
    if(cin >> s) {
        vector<int> cnt(26, 0);
        for(char c: s) cnt[c-'a']++;
        for(int i=0; i<26; ++i) {
            if(cnt[i] > 0) {
                cout << (char)('a' + i) << ":" << cnt[i] << "\\n";
            }
        }
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNext()) {
            String s = sc.next();
            int[] cnt = new int[26];
            for(char c : s.toCharArray()) cnt[c - 'a']++;
            for(int i = 0; i < 26; i++) {
                if(cnt[i] > 0) System.out.println((char)('a' + i) + ":" + cnt[i]);
            }
        }
    }
}`
    },
    testCases: [
      { input: 'banana', expectedOutput: 'a:3\nb:1\nn:2', isHidden: false },
      { input: 'hello', expectedOutput: 'e:1\nh:1\nl:2\no:1', isHidden: true }
    ],
    solution: {
      approach: 'Frequency table and sorted iteration.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },

  // 8 Medium
  {
    problemId: 11,
    title: 'Rotate Array by K Steps',
    slug: 'rotate-array-by-k-steps',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given an integer array of size $N$, rotate the array to the right by $K$ steps, where $K$ is non-negative.

### Input Format
- First line: two integers $N$ and $K$.
- Second line: $N$ integers.

### Output Format
- Print the rotated array elements separated by spaces.`,
    examples: [
      { input: '7 3\n1 2 3 4 5 6 7', output: '5 6 7 1 2 3 4', explanation: 'Rotated 3 steps to right.' }
    ],
    constraints: ['1 <= N <= 10^5', '0 <= K <= 10^9'],
    tags: ['Arrays'],
    hints: ['K = K % N. Reverse the entire array, then reverse the first K elements, then the remaining N - K.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if(input.length >= 2) {
  const n = parseInt(input[0]);
  let k = parseInt(input[1]) % n;
  const arr = input.slice(2, n + 2);
  const rotated = [...arr.slice(n - k), ...arr.slice(0, n - k)];
  console.log(rotated.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n, k = int(data[0]), int(data[1]) % int(data[0])
    arr = data[2:n+2]
    rotated = arr[n-k:] + arr[:n-k]
    print(' '.join(rotated))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n, k;
    if(cin >> n >> k) {
        k %= n;
        vector<int> a(n);
        for(int i=0; i<n; ++i) cin >> a[i];
        reverse(a.begin(), a.end());
        reverse(a.begin(), a.begin() + k);
        reverse(a.begin() + k, a.end());
        for(int i=0; i<n; ++i) cout << a[i] << (i==n-1?"":" ");
        cout << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    static void reverse(int[] a, int l, int r) {
        while(l < r) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
            l++; r--;
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            int k = sc.nextInt() % n;
            int[] a = new int[n];
            for(int i=0; i<n; i++) a[i] = sc.nextInt();
            reverse(a, 0, n-1);
            reverse(a, 0, k-1);
            reverse(a, k, n-1);
            for(int i=0; i<n; i++) System.out.print(a[i] + (i==n-1?"":" "));
            System.out.println();
        }
    }
}`
    },
    testCases: [
      { input: '7 3\n1 2 3 4 5 6 7', expectedOutput: '5 6 7 1 2 3 4', isHidden: false },
      { input: '4 2\n-1 -100 3 99', expectedOutput: '3 99 -1 -100', isHidden: true },
      { input: '5 5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', isHidden: true }
    ],
    solution: {
      approach: 'Triple reversal algorithm in O(N) time and O(1) space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 12,
    title: 'Kadane’s Algorithm - Maximum Subarray Sum',
    slug: 'maximum-subarray-sum-kadane',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given an integer array $nums$, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print the maximum subarray sum.`,
    examples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'Subarray [4, -1, 2, 1] has the largest sum = 6.' },
      { input: '1\n1', output: '1', explanation: 'Single element.' }
    ],
    constraints: ['1 <= N <= 10^5', '-10^4 <= A[i] <= 10^4'],
    tags: ['Arrays', 'Dynamic Programming'],
    hints: ['Track current_sum = max(num, current_sum + num) at each position.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1).map(Number);
  let maxSoFar = arr[0], curr = arr[0];
  for(let i=1; i<n; i++) {
    curr = Math.max(arr[i], curr + arr[i]);
    maxSoFar = Math.max(maxSoFar, curr);
  }
  console.log(maxSoFar);
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    max_so_far = curr = arr[0]
    for x in arr[1:]:
        curr = max(x, curr + x)
        max_so_far = max(max_so_far, curr)
    print(max_so_far)`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if(cin >> n && n > 0) {
        long long x; cin >> x;
        long long curr = x, ans = x;
        for(int i=1; i<n; ++i) {
            cin >> x;
            curr = max(x, curr + x);
            ans = max(ans, curr);
        }
        cout << ans << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            long curr = sc.nextLong(), ans = curr;
            for(int i=1; i<n; i++) {
                long x = sc.nextLong();
                curr = Math.max(x, curr + x);
                ans = Math.max(ans, curr);
            }
            System.out.println(ans);
        }
    }
}`
    },
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: false },
      { input: '4\n-5 -2 -8 -1', expectedOutput: '-1', isHidden: true }
    ],
    solution: {
      approach: "Kadane's algorithm single pass.",
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 13,
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given an integer array $nums$, return an array $answer$ such that $answer[i]$ is equal to the product of all the elements of $nums$ except $nums[i]$.
You must write an algorithm that runs in $O(N)$ time and without using the division operation.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print $N$ space-separated integers.`,
    examples: [
      { input: '4\n1 2 3 4', output: '24 12 8 6', explanation: 'Product except self.' },
      { input: '5\n-1 1 0 -3 3', output: '0 0 9 0 0', explanation: 'Zero handling.' }
    ],
    constraints: ['2 <= N <= 10^5', '-30 <= nums[i] <= 30'],
    tags: ['Arrays', 'Prefix Sum'],
    hints: ['Compute prefix products from left to right, then suffix products from right to left.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const arr = input.slice(1, n + 1).map(Number);
  const res = new Array(n).fill(1);
  let left = 1;
  for(let i=0; i<n; i++) {
    res[i] = left;
    left *= arr[i];
  }
  let right = 1;
  for(let i=n-1; i>=0; i--) {
    res[i] *= right;
    right *= arr[i];
  }
  console.log(res.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    res = [1] * n
    left = 1
    for i in range(n):
        res[i] = left
        left *= arr[i]
    right = 1
    for i in range(n-1, -1, -1):
        res[i] *= right
        right *= arr[i]
    print(' '.join(map(str, res)))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    if(cin >> n && n > 0) {
        vector<long long> a(n), res(n, 1);
        for(int i=0; i<n; ++i) cin >> a[i];
        long long left = 1;
        for(int i=0; i<n; ++i) { res[i] = left; left *= a[i]; }
        long long right = 1;
        for(int i=n-1; i>=0; --i) { res[i] *= right; right *= a[i]; }
        for(int i=0; i<n; ++i) cout << res[i] << (i==n-1?"":" ");
        cout << "\\n";
    }
    return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            long[] a = new long[n];
            for(int i=0; i<n; i++) a[i] = sc.nextLong();
            long[] res = new long[n];
            long left = 1;
            for(int i=0; i<n; i++) { res[i] = left; left *= a[i]; }
            long right = 1;
            for(int i=n-1; i>=0; i--) { res[i] *= right; right *= a[i]; }
            for(int i=0; i<n; i++) System.out.print(res[i] + (i==n-1?"":" "));
            System.out.println();
        }
    }
}`
    },
    testCases: [
      { input: '4\n1 2 3 4', expectedOutput: '24 12 8 6', isHidden: false },
      { input: '5\n-1 1 0 -3 3', expectedOutput: '0 0 9 0 0', isHidden: false }
    ],
    solution: {
      approach: 'Prefix and Suffix cumulative product array.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 14,
    title: 'Longest Consecutive Sequence',
    slug: 'longest-consecutive-sequence',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given an unsorted array of integers $nums$, return the length of the longest consecutive elements sequence.
You must write an algorithm that runs in $O(N)$ time.

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print the length of the longest consecutive sequence.`,
    examples: [
      { input: '6\n100 4 200 1 3 2', output: '4', explanation: 'The longest sequence is [1, 2, 3, 4], length 4.' }
    ],
    constraints: ['0 <= N <= 10^5'],
    tags: ['Arrays', 'Hashing'],
    hints: ['Store elements in a set. Only start counting consecutive elements if num - 1 is not in the set.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  if(n === 0) { console.log(0); process.exit(); }
  const set = new Set(input.slice(1, n + 1).map(Number));
  let longest = 0;
  for(let x of set) {
    if(!set.has(x - 1)) {
      let curr = x;
      let count = 1;
      while(set.has(curr + 1)) {
        curr++;
        count++;
      }
      longest = Math.max(longest, count);
    }
  }
  console.log(longest);
}`,
      python: `import sys
data = sys.stdin.read().split()
if not data:
    print(0)
else:
    n = int(data[0])
    s = set(int(x) for x in data[1:n+1])
    longest = 0
    for x in s:
        if x - 1 not in s:
            y = x
            while y + 1 in s:
                y += 1
            longest = max(longest, y - x + 1)
    print(longest)`
    },
    testCases: [
      { input: '6\n100 4 200 1 3 2', expectedOutput: '4', isHidden: false },
      { input: '10\n0 3 7 2 5 8 4 6 0 1', expectedOutput: '9', isHidden: false },
      { input: '1\n42', expectedOutput: '1', isHidden: true }
    ],
    solution: {
      approach: 'Hash set intelligent streak starting only at sequence heads.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 15,
    title: 'Next Permutation',
    slug: 'next-permutation',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given an array of integers $nums$, find the next lexicographically greater permutation.
If no such permutation is possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

### Input Format
- First line: integer $N$.
- Second line: $N$ integers.

### Output Format
- Print the next permutation space-separated.`,
    examples: [
      { input: '3\n1 2 3', output: '1 3 2', explanation: 'Next permutation is 1 3 2.' },
      { input: '3\n3 2 1', output: '1 2 3', explanation: '3 2 1 is highest, wraps to 1 2 3.' }
    ],
    constraints: ['1 <= N <= 10^5'],
    tags: ['Arrays', 'Two Pointers'],
    hints: ['Find the first decreasing element from the right, swap it with the next larger element, and reverse the suffix.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const a = input.slice(1, n + 1).map(Number);
  let i = n - 2;
  while(i >= 0 && a[i] >= a[i+1]) i--;
  if(i >= 0) {
    let j = n - 1;
    while(a[j] <= a[i]) j--;
    [a[i], a[j]] = [a[j], a[i]];
  }
  let l = i + 1, r = n - 1;
  while(l < r) {
    [a[l], a[r]] = [a[r], a[l]];
    l++; r--;
  }
  console.log(a.join(' '));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    a = [int(x) for x in data[1:n+1]]
    i = n - 2
    while i >= 0 and a[i] >= a[i+1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while a[j] <= a[i]:
            j -= 1
        a[i], a[j] = a[j], a[i]
    a[i+1:] = reversed(a[i+1:])
    print(' '.join(map(str, a)))`
    },
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '1 3 2', isHidden: false },
      { input: '3\n3 2 1', expectedOutput: '1 2 3', isHidden: false },
      { input: '3\n1 1 5', expectedOutput: '1 5 1', isHidden: true }
    ],
    solution: {
      approach: 'Single pass scan from right + swap pivot + reverse tail.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    }
  },
  {
    problemId: 16,
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given an array of strings, group the anagrams together.
Print each group sorted alphabetically on its own line (words separated by space), and print groups ordered by their first word.

### Input Format
- First line: integer $N$.
- Second line: $N$ space-separated words.

### Output Format
- Lines of grouped anagrams.`,
    examples: [
      { input: '6\neat tea tan ate nat bat', output: 'ate eat tea\nbat\nnat tan', explanation: 'Grouped anagrams.' }
    ],
    constraints: ['1 <= N <= 10^4'],
    tags: ['Strings', 'Hashing'],
    hints: ['Sort the characters of each string to use as a hash map key.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
  const n = parseInt(input[0]);
  const words = input.slice(1, n + 1);
  const map = new Map();
  for(let w of words) {
    const key = w.split('').sort().join('');
    if(!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  const groups = Array.from(map.values()).map(g => g.sort().join(' ')).sort();
  console.log(groups.join('\\n'));
}`,
      python: `import sys
data = sys.stdin.read().split()
if data:
    n = int(data[0])
    words = data[1:n+1]
    groups = {}
    for w in words:
        key = ''.join(sorted(w))
        groups.setdefault(key, []).append(w)
    res = [sorted(g) for g in groups.values()]
    res.sort(key=lambda x: x[0])
    for g in res:
        print(' '.join(g))`
    },
    testCases: [
      { input: '6\neat tea tan ate nat bat', expectedOutput: 'ate eat tea\nbat\nnat tan', isHidden: false },
      { input: '1\na', expectedOutput: 'a', isHidden: true }
    ],
    solution: {
      approach: 'Canonical sorted key hashing.',
      timeComplexity: 'O(N * K log K)',
      spaceComplexity: 'O(N * K)'
    }
  },
  {
    problemId: 17,
    title: 'String Compression (Run-Length Encoding)',
    slug: 'string-compression-rle',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given a string $S$, compress it using character counts. If a character appears once, do not append a count. (e.g., \`aabcccccaaa\` -> \`a2bc5a3\`).

### Input Format
- A single line containing string $S$.

### Output Format
- Print the compressed string.`,
    examples: [
      { input: 'aabcccccaaa', output: 'a2bc5a3', explanation: 'Run-length encoding format.' },
      { input: 'abcd', output: 'abcd', explanation: 'All single characters.' }
    ],
    constraints: ['1 <= |S| <= 10^5'],
    tags: ['Strings'],
    hints: ['Iterate through the string keeping track of consecutive run lengths.'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
if(s) {
  let res = '';
  let i = 0;
  while(i < s.length) {
    let j = i;
    while(j < s.length && s[j] === s[i]) j++;
    const count = j - i;
    res += s[i] + (count > 1 ? count : '');
    i = j;
  }
  console.log(res);
}`,
      python: `import sys
s = sys.stdin.read().strip()
if s:
    res = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        cnt = j - i
        res.append(s[i] + (str(cnt) if cnt > 1 else ''))
        i = j
    print(''.join(res))`
    },
    testCases: [
      { input: 'aabcccccaaa', expectedOutput: 'a2bc5a3', isHidden: false },
      { input: 'abcd', expectedOutput: 'abcd', isHidden: false },
      { input: 'zzzzzzzzzz', expectedOutput: 'z10', isHidden: true }
    ],
    solution: {
      approach: 'Two-pointer segment count.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    }
  },
  {
    problemId: 18,
    title: 'Longest Palindromic Substring Length',
    slug: 'longest-palindromic-substring-length',
    topic: 'Arrays & Strings',
    difficulty: 'Medium',
    description: `Given a string $S$, return the length of the longest palindromic substring in $S$.

### Input Format
- A single line with string $S$.

### Output Format
- Print the integer length of the longest palindromic substring.`,
    examples: [
      { input: 'babad', output: '3', explanation: '"bab" or "aba" has length 3.' },
      { input: 'cbbd', output: '2', explanation: '"bb" has length 2.' }
    ],
    constraints: ['1 <= |S| <= 2000'],
    tags: ['Strings', 'Dynamic Programming'],
    hints: ['Expand around every center: both single character centers (odd) and two character centers (even).'],
    starterCodes: {
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
if(!s) { console.log(0); process.exit(); }
let maxLen = 1;
function expand(l, r) {
  while(l >= 0 && r < s.length && s[l] === s[r]) {
    l--; r++;
  }
  return r - l - 1;
}
for(let i=0; i<s.length; i++) {
  maxLen = Math.max(maxLen, expand(i, i), expand(i, i + 1));
}
console.log(maxLen);`,
      python: `import sys
s = sys.stdin.read().strip()
if not s:
    print(0)
else:
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return r - l - 1
    ans = 1
    for i in range(len(s)):
        ans = max(ans, expand(i, i), expand(i, i + 1))
    print(ans)`
    },
    testCases: [
      { input: 'babad', expectedOutput: '3', isHidden: false },
      { input: 'cbbd', expectedOutput: '2', isHidden: false },
      { input: 'racecar', expectedOutput: '7', isHidden: true }
    ],
    solution: {
      approach: 'Expand around center algorithm.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)'
    }
  }
];
