const arraysStrings = require('./arraysStrings');
const hashing = require('./hashing');
const twoPointersSlidingWindow = require('./twoPointersSlidingWindow');
const sortingSearching = require('./sortingSearching');
const linkedList = require('./linkedList');
const stackQueue = require('./stackQueue');
const recursionBacktracking = require('./recursionBacktracking');
const trees = require('./trees');
const graphs = require('./graphs');
const dynamicProgramming = require('./dynamicProgramming');

const allDsaProblems = [
  ...arraysStrings,
  ...hashing,
  ...twoPointersSlidingWindow,
  ...sortingSearching,
  ...linkedList,
  ...stackQueue,
  ...recursionBacktracking,
  ...trees,
  ...graphs,
  ...dynamicProgramming,
];

// Re-verify ordering and unique IDs
allDsaProblems.forEach((prob, idx) => {
  prob.order = idx + 1;
  prob.problemId = idx + 1;
});

module.exports = allDsaProblems;
