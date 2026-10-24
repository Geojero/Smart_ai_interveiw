require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const JobRole = require('../models/JobRole');
const Progress = require('../models/Progress');
const ActivityLog = require('../models/ActivityLog');
const MockInterview = require('../models/MockInterview');
const DsaProblem = require('../models/DsaProblem');
const allDsaProblems = require('./dsaData');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/prepmate';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    Topic.deleteMany({}),
    Lesson.deleteMany({}),
    Quiz.deleteMany({}),
    JobRole.deleteMany({}),
    Progress.deleteMany({}),
    ActivityLog.deleteMany({}),
    MockInterview.deleteMany({}),
    DsaProblem.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  await DsaProblem.insertMany(allDsaProblems);
  console.log(`⚡ Seeded ${allDsaProblems.length} Curated Fresher DSA Problems`);

  // Create Admin
  const admin = await User.create({
    name: 'PrepMate Admin',
    email: 'admin@prepmate.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
  });
  console.log('👑 Admin created: admin@prepmate.com / Admin@123');

  // Create 5 Students
  const studentData = [
    { name: 'Arjun Sharma', email: 'arjun@example.com', college: 'IIT Delhi', targetRole: 'Software Engineer', graduationYear: 2025, streak: 12 },
    { name: 'Priya Patel', email: 'priya@example.com', college: 'NIT Trichy', targetRole: 'Frontend Developer', graduationYear: 2025, streak: 5 },
    { name: 'Rahul Kumar', email: 'rahul@example.com', college: 'BITS Pilani', targetRole: 'Full Stack Developer', graduationYear: 2024, streak: 20 },
    { name: 'Sneha Reddy', email: 'sneha@example.com', college: 'VIT Vellore', targetRole: 'Data Scientist', graduationYear: 2025, streak: 3 },
    { name: 'Karthik Nair', email: 'karthik@example.com', college: 'IIIT Hyderabad', targetRole: 'Backend Developer', graduationYear: 2024, streak: 15 },
  ];

  const students = await User.create(
    studentData.map((s) => ({ name: s.name, email: s.email, password: 'Student@123', role: 'student', isActive: true }))
  );
  console.log('👤 5 students created (password: Student@123)');

  const skillSets = [
    { communication: 75, dsa: 60, problemSolving: 70, coreCS: 65, resume: 78, aptitude: 72 },
    { communication: 82, dsa: 45, problemSolving: 55, coreCS: 70, resume: 65, aptitude: 68 },
    { communication: 90, dsa: 80, problemSolving: 85, coreCS: 88, resume: 92, aptitude: 80 },
    { communication: 65, dsa: 40, problemSolving: 50, coreCS: 60, resume: 55, aptitude: 62 },
    { communication: 78, dsa: 70, problemSolving: 75, coreCS: 80, resume: 72, aptitude: 76 },
  ];

  await Promise.all(
    students.map((student, i) =>
      StudentProfile.create({
        user: student._id,
        targetRole: studentData[i].targetRole,
        college: studentData[i].college,
        graduationYear: studentData[i].graduationYear,
        streak: studentData[i].streak,
        lastActiveDate: new Date(),
        skillScores: skillSets[i],
        interviewsPracticed: Math.floor(Math.random() * 10),
      })
    )
  );
  console.log('📊 Student profiles created');

  // Create DSA Topics
  const dsaTopicData = [
    { title: 'Arrays', track: 'dsa', order: 1, description: 'Master array operations and techniques', icon: '📦' },
    { title: 'Strings', track: 'dsa', order: 2, description: 'String manipulation and pattern matching', icon: '🔤' },
    { title: 'Recursion', track: 'dsa', order: 3, description: 'Recursive thinking and backtracking', icon: '🔄' },
    { title: 'Linked Lists', track: 'dsa', order: 4, description: 'Singly, doubly and circular linked lists', icon: '🔗' },
    { title: 'Stacks & Queues', track: 'dsa', order: 5, description: 'LIFO and FIFO data structures', icon: '📚' },
    { title: 'Trees', track: 'dsa', order: 6, description: 'Binary trees, BST, AVL, heaps', icon: '🌳' },
    { title: 'Graphs', track: 'dsa', order: 7, description: 'BFS, DFS, shortest path algorithms', icon: '🕸️' },
    { title: 'Dynamic Programming', track: 'dsa', order: 8, description: 'Memoization, tabulation and optimization', icon: '⚡' },
  ];

  const itTopicData = [
    { title: 'OOP Concepts', track: 'it', order: 1, description: 'Classes, inheritance, polymorphism', icon: '🏗️' },
    { title: 'DBMS & SQL', track: 'it', order: 2, description: 'Relational databases, normalization, SQL', icon: '🗄️' },
    { title: 'Operating Systems', track: 'it', order: 3, description: 'Processes, threads, memory management', icon: '💻' },
    { title: 'Computer Networks', track: 'it', order: 4, description: 'TCP/IP, OSI model, protocols', icon: '🌐' },
    { title: 'System Design', track: 'it', order: 5, description: 'Scalability, load balancing, caching', icon: '🏛️' },
    { title: 'Git & Version Control', track: 'it', order: 6, description: 'Git workflows, branching strategies', icon: '🔀' },
    { title: 'Web Fundamentals', track: 'it', order: 7, description: 'HTTP, REST APIs, web security', icon: '🌍' },
  ];

  const dsaTopics = await Topic.create(dsaTopicData);
  const itTopics = await Topic.create(itTopicData);
  console.log('📚 Topics created (8 DSA + 7 IT)');

  // Create Lessons for Arrays topic
  const arrayLessons = await Lesson.create([
    {
      topic: dsaTopics[0]._id,
      title: 'Introduction to Arrays',
      content: `# Arrays in Programming

## What is an Array?
An array is a collection of elements stored at **contiguous memory locations**. It's the simplest and most widely used data structure.

## Key Properties
- Fixed size (in most languages)
- Elements are of the same data type
- Zero-indexed (index starts from 0)
- O(1) random access

## Time Complexities
| Operation | Complexity |
|-----------|-----------|
| Access    | O(1)      |
| Search    | O(n)      |
| Insertion | O(n)      |
| Deletion  | O(n)      |

## Memory Layout
Elements occupy consecutive memory locations, enabling O(1) access via: \`address = base + index × element_size\``,
      examples: [
        {
          title: 'Basic Array Operations in JavaScript',
          code: `// Declaration
const arr = [1, 2, 3, 4, 5];

// Access
console.log(arr[0]); // 1

// Traversal
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// Insert at end - O(1) amortized
arr.push(6);

// Insert at beginning - O(n)
arr.unshift(0);

// Delete from end - O(1)
arr.pop();

// Find max element
const max = Math.max(...arr);`,
          explanation: 'Demonstrates basic array operations with their time complexities.'
        }
      ],
      practiceProblems: [
        {
          title: 'Find the Maximum Element',
          difficulty: 'easy',
          description: 'Given an array of integers, find and return the maximum element.',
          hint: 'Initialize max to the first element, then iterate comparing each element.',
          solution: 'function findMax(arr) { return Math.max(...arr); }'
        },
        {
          title: 'Reverse an Array',
          difficulty: 'easy',
          description: 'Reverse the elements of an array in-place without using extra space.',
          hint: 'Use two pointers, one at start and one at end, swap and move inward.',
          solution: 'function reverse(arr) { let l=0,r=arr.length-1; while(l<r){[arr[l],arr[r]]=[arr[r],arr[l]];l++;r--;} return arr; }'
        },
        {
          title: 'Two Sum',
          difficulty: 'medium',
          description: 'Given an array and target, find two indices such that the numbers at those indices add up to target.',
          hint: 'Use a hash map to store complement values as you iterate.',
          solution: 'function twoSum(nums, target) { const map={}; for(let i=0;i<nums.length;i++){const c=target-nums[i];if(map[c]!==undefined)return[map[c],i];map[nums[i]]=i;} }'
        }
      ],
      order: 1,
      estimatedMinutes: 25,
    },
    {
      topic: dsaTopics[0]._id,
      title: 'Two Pointer Technique',
      content: `# Two Pointer Technique

## Overview
The two-pointer technique uses two pointers to iterate through a data structure, often from opposite ends or at different speeds.

## When to Use
- Sorted arrays (finding pairs, triplets)
- Partitioning problems
- Sliding window variations
- Palindrome checking

## Types
1. **Opposite ends**: Start from both ends and move inward
2. **Same direction**: Fast and slow pointers (Floyd's cycle detection)
3. **Different arrays**: Merge two sorted arrays

## Template
\`\`\`javascript
let left = 0, right = arr.length - 1;
while (left < right) {
  if (condition) {
    // process
    left++;
  } else {
    right--;
  }
}
\`\`\``,
      examples: [
        {
          title: 'Check if array is a palindrome',
          code: `function isPalindrome(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    if (arr[left] !== arr[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome([1, 2, 3, 2, 1])); // true
console.log(isPalindrome([1, 2, 3, 4, 5])); // false`,
          explanation: 'Classic two-pointer palindrome check in O(n) time, O(1) space.'
        }
      ],
      practiceProblems: [
        {
          title: 'Container With Most Water',
          difficulty: 'medium',
          description: 'Given n non-negative integers representing heights, find two lines that together with the x-axis form a container that contains the most water.',
          hint: 'Use two pointers at extremes. Move the pointer with smaller height inward.',
          solution: 'function maxArea(h){let l=0,r=h.length-1,max=0;while(l<r){max=Math.max(max,Math.min(h[l],h[r])*(r-l));h[l]<h[r]?l++:r--;}return max;}'
        }
      ],
      order: 2,
      estimatedMinutes: 35,
    },
  ]);

  // Create Quiz for first lesson
  const quiz1 = await Quiz.create({
    lesson: arrayLessons[0]._id,
    questions: [
      {
        question: 'What is the time complexity for accessing an element by index in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0,
        explanation: 'Arrays provide constant-time O(1) random access because elements are stored at contiguous memory locations.'
      },
      {
        question: 'Which operation on an array has O(n) time complexity?',
        options: ['Accessing element at index', 'Inserting at the beginning', 'Reading length', 'Accessing last element'],
        correctIndex: 1,
        explanation: 'Inserting at the beginning requires shifting all existing elements, resulting in O(n) complexity.'
      },
      {
        question: 'What is the space complexity of reversing an array in-place using two pointers?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'The two-pointer in-place reversal only uses a constant amount of extra space for the swap variable.'
      },
      {
        question: 'In a zero-indexed array of size n, what is the index of the last element?',
        options: ['n', 'n-1', 'n+1', '0'],
        correctIndex: 1,
        explanation: 'Arrays are 0-indexed, so the first element is at index 0 and the last element is at index n-1.'
      },
      {
        question: 'Which technique is best for finding pairs that sum to a target in a sorted array?',
        options: ['Brute force O(n²)', 'Two pointers O(n)', 'Binary search O(n log n)', 'Hash map O(n)'],
        correctIndex: 1,
        explanation: 'Two pointers work optimally on sorted arrays, achieving O(n) time to find pairs with a given sum.'
      }
    ]
  });
  console.log('📝 Lessons and quizzes created');

  // Create some progress records for students
  await Progress.create([
    { user: students[0]._id, lesson: arrayLessons[0]._id, completed: true, completedAt: new Date(), topicProgressPercent: 50 },
    { user: students[2]._id, lesson: arrayLessons[0]._id, completed: true, completedAt: new Date(), topicProgressPercent: 50 },
    { user: students[2]._id, lesson: arrayLessons[1]._id, completed: true, completedAt: new Date(), topicProgressPercent: 100 },
  ]);

  // Create Job Roles
  await JobRole.create([
    {
      title: 'Software Engineer',
      requiredSkills: ['JavaScript', 'Python', 'Data Structures', 'Algorithms', 'System Design', 'SQL', 'Git', 'REST APIs', 'OOP'],
      description: 'Full-stack software development role'
    },
    {
      title: 'Frontend Developer',
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Redux', 'REST APIs', 'Git', 'Responsive Design'],
      description: 'Frontend web development specialization'
    },
    {
      title: 'Backend Developer',
      requiredSkills: ['Node.js', 'Python', 'SQL', 'MongoDB', 'REST APIs', 'System Design', 'Docker', 'AWS', 'Microservices'],
      description: 'Backend server-side development'
    },
    {
      title: 'Data Scientist',
      requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'TensorFlow', 'Data Visualization', 'Jupyter'],
      description: 'Data analysis and machine learning'
    },
    {
      title: 'Full Stack Developer',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'SQL', 'JavaScript', 'TypeScript', 'Docker', 'REST APIs', 'Git'],
      description: 'End-to-end web application development'
    },
    {
      title: 'DevOps Engineer',
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Git', 'Python', 'Monitoring'],
      description: 'Infrastructure and deployment automation'
    },
  ]);
  console.log('💼 Job roles created');

  // Create Activity Logs for students
  const activityTypes = ['lesson_complete', 'quiz_attempt', 'interview_practice', 'login'];
  const descriptions = [
    'Completed lesson: Introduction to Arrays',
    'Quiz completed – Score: 80%',
    'Completed technical interview for Software Engineer – Score: 75',
    'Logged in',
  ];

  const logs = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const idx = Math.floor(Math.random() * 4);
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      logs.push({
        user: students[i]._id,
        type: activityTypes[idx],
        description: descriptions[idx],
        timestamp: date,
      });
    }
  }
  await ActivityLog.create(logs);
  console.log('📊 Activity logs created');

  console.log('\n🎉 Seeding complete!\n');
  console.log('📧 Admin: admin@prepmate.com | Password: Admin@123');
  console.log('📧 Student: arjun@example.com | Password: Student@123');
  console.log('📧 Student: rahul@example.com | Password: Student@123');
  console.log('\nRun: cd server && npm run dev\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
