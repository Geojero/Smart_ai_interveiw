const DsaProblem = require('../models/DsaProblem');
const DsaProgress = require('../models/DsaProgress');
const DsaSubmission = require('../models/DsaSubmission');
const judge0Service = require('../services/judge0Service');
const allDsaProblems = require('../seed/dsaData');

/**
 * Ensure problems are seeded in DB if empty
 */
const ensureProblemsSeeded = async () => {
  const count = await DsaProblem.countDocuments();
  if (count < 100) {
    console.log(`[DSA Seed] Current problem count: ${count}. Upserting 100 curated DSA problems...`);
    for (const p of allDsaProblems) {
      await DsaProblem.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log('[DSA Seed] Successfully seeded 100 Fresher DSA problems! 🚀');
  }
};

/**
 * Helper to get or create user's DSA progress record
 */
const getOrCreateProgress = async (userId) => {
  let progress = await DsaProgress.findOne({ user: userId });
  if (!progress) {
    progress = await DsaProgress.create({
      user: userId,
      solvedProblems: [],
      attemptedProblems: [],
      bookmarkedProblems: [],
      savedCode: [],
      streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
      stats: { easySolved: 0, mediumSolved: 0, totalSolved: 0 },
    });
  }
  return progress;
};

/**
 * GET /api/dsa/problems
 * List all problems with filter, search, and user's completion status
 */
exports.getDsaProblems = async (req, res, next) => {
  try {
    await ensureProblemsSeeded();
    const userId = req.user.id;
    const { topic, difficulty, status, search } = req.query;

    const progress = await getOrCreateProgress(userId);
    const solvedSet = new Set(progress.solvedProblems.map((id) => id.toString()));
    const attemptedSet = new Set(progress.attemptedProblems.map((id) => id.toString()));
    const bookmarkedSet = new Set(progress.bookmarkedProblems.map((id) => id.toString()));

    const filter = {};
    if (topic && topic !== 'All') {
      filter.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { tags: regex }, { slug: regex }];
    }

    const problems = await DsaProblem.find(filter)
      .select('problemId title slug topic difficulty tags acceptanceRate order')
      .sort({ problemId: 1 })
      .lean();

    // Map each problem with user status
    let mapped = problems.map((prob) => {
      const idStr = prob._id.toString();
      const isSolved = solvedSet.has(idStr);
      const isAttempted = attemptedSet.has(idStr) && !isSolved;
      const isBookmarked = bookmarkedSet.has(idStr);

      return {
        ...prob,
        isSolved,
        isAttempted,
        isBookmarked,
        status: isSolved ? 'solved' : isAttempted ? 'attempted' : 'unsolved',
      };
    });

    // Filter by user solve status if requested
    if (status && status !== 'all') {
      if (status === 'solved') mapped = mapped.filter((p) => p.isSolved);
      else if (status === 'attempted') mapped = mapped.filter((p) => p.isAttempted);
      else if (status === 'unsolved') mapped = mapped.filter((p) => !p.isSolved);
      else if (status === 'bookmarked') mapped = mapped.filter((p) => p.isBookmarked);
    }

    // Compute overview stats for topic breakdown
    const allDbProblems = await DsaProblem.find({}).select('topic difficulty _id').lean();
    const topicStats = {};
    let totalEasy = 0,
      totalMedium = 0,
      solvedEasy = 0,
      solvedMedium = 0;

    for (const p of allDbProblems) {
      const t = p.topic;
      if (!topicStats[t]) {
        topicStats[t] = { total: 0, solved: 0, easy: 0, medium: 0, solvedEasy: 0, solvedMedium: 0 };
      }
      topicStats[t].total++;
      if (p.difficulty === 'Easy') {
        topicStats[t].easy++;
        totalEasy++;
      } else {
        topicStats[t].medium++;
        totalMedium++;
      }

      if (solvedSet.has(p._id.toString())) {
        topicStats[t].solved++;
        if (p.difficulty === 'Easy') {
          topicStats[t].solvedEasy++;
          solvedEasy++;
        } else {
          topicStats[t].solvedMedium++;
          solvedMedium++;
        }
      }
    }

    res.json({
      success: true,
      data: {
        problems: mapped,
        stats: {
          totalProblems: allDbProblems.length,
          solvedCount: solvedSet.size,
          easy: { total: totalEasy, solved: solvedEasy },
          medium: { total: totalMedium, solved: solvedMedium },
          streak: progress.streak,
          topicStats,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dsa/problems/:slug
 * Full problem details for editor view
 */
exports.getDsaProblemBySlug = async (req, res, next) => {
  try {
    await ensureProblemsSeeded();
    const { slug } = req.params;
    const userId = req.user.id;

    const problem = await DsaProblem.findOne({ slug }).lean();
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const progress = await getOrCreateProgress(userId);
    const idStr = problem._id.toString();

    const isSolved = progress.solvedProblems.some((id) => id.toString() === idStr);
    const isBookmarked = progress.bookmarkedProblems.some((id) => id.toString() === idStr);

    // Find saved draft code for this problem if any
    const savedDraft = progress.savedCode?.find((sc) => sc.problem.toString() === idStr);

    // Only return public sample test cases to user client (hide internal judge hidden cases)
    const publicTestCases = (problem.testCases || []).filter((tc) => !tc.isHidden);

    res.json({
      success: true,
      data: {
        problem: {
          ...problem,
          testCases: publicTestCases,
        },
        userState: {
          isSolved,
          isBookmarked,
          savedCode: savedDraft?.code || null,
          savedLanguage: savedDraft?.language || 'javascript',
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/dsa/run
 * Run user code against sample test cases or custom input
 */
exports.runDsaCode = async (req, res, next) => {
  try {
    const { slug, language, code, customInput } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const problem = await DsaProblem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // If custom input is provided, run only on custom input
    if (typeof customInput === 'string' && customInput.trim()) {
      const execResult = await judge0Service.executeCode(language, code, customInput.trim());
      return res.json({
        success: true,
        data: {
          isCustom: true,
          input: customInput,
          stdout: execResult.stdout,
          stderr: execResult.stderr,
          status: execResult.status,
          time: execResult.time,
          memory: execResult.memory,
        },
      });
    }

    // Otherwise run against problem's visible sample test cases
    const sampleCases = (problem.testCases || []).filter((tc) => !tc.isHidden);
    const results = [];
    let allPassed = true;

    for (let i = 0; i < sampleCases.length; i++) {
      const tc = sampleCases[i];
      const execResult = await judge0Service.executeCode(language, code, tc.input);
      const isCorrect = judge0Service.isOutputEqual(execResult.stdout, tc.expectedOutput);

      if (!isCorrect) allPassed = false;

      results.push({
        caseNumber: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: execResult.stdout,
        stderr: execResult.stderr,
        passed: isCorrect,
        status: isCorrect ? 'Passed' : execResult.status === 'Accepted' ? 'Wrong Answer' : execResult.status,
        time: execResult.time,
      });
    }

    res.json({
      success: true,
      data: {
        allPassed,
        testCases: results,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/dsa/submit
 * Submit code against all test cases (both public and hidden), record submission, update streak & stats
 */
exports.submitDsaCode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { slug, language, code } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const problem = await DsaProblem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const allTestCases = problem.testCases || [];
    let passedCount = 0;
    let failedTestCase = null;
    let finalStatus = 'Accepted';
    let errorMessage = '';
    let totalTime = 0;
    let maxMemory = 0;

    for (let i = 0; i < allTestCases.length; i++) {
      const tc = allTestCases[i];
      const execResult = await judge0Service.executeCode(language, code, tc.input);
      totalTime += execResult.time;
      maxMemory = Math.max(maxMemory, execResult.memory);

      if (execResult.status !== 'Accepted') {
        finalStatus = execResult.status;
        errorMessage = execResult.stderr || execResult.compileOutput || 'Runtime Error';
        failedTestCase = {
          caseIndex: i + 1,
          input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
          expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
          actualOutput: execResult.stdout,
        };
        break;
      }

      const isCorrect = judge0Service.isOutputEqual(execResult.stdout, tc.expectedOutput);
      if (isCorrect) {
        passedCount++;
      } else {
        finalStatus = 'Wrong Answer';
        failedTestCase = {
          caseIndex: i + 1,
          input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
          expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
          actualOutput: execResult.stdout,
        };
        break;
      }
    }

    // Save submission record
    const submission = await DsaSubmission.create({
      user: userId,
      problem: problem._id,
      language,
      code,
      status: finalStatus,
      executionTimeMs: Math.round(totalTime / (allTestCases.length || 1)),
      memoryKb: maxMemory,
      passedTestCases: passedCount,
      totalTestCases: allTestCases.length,
      errorMessage,
      failedTestCase,
    });

    // Update user progress
    const progress = await getOrCreateProgress(userId);
    const probIdStr = problem._id.toString();

    // Save current code draft
    const existingDraftIdx = progress.savedCode.findIndex((sc) => sc.problem.toString() === probIdStr);
    if (existingDraftIdx >= 0) {
      progress.savedCode[existingDraftIdx].code = code;
      progress.savedCode[existingDraftIdx].language = language;
      progress.savedCode[existingDraftIdx].updatedAt = new Date();
    } else {
      progress.savedCode.push({ problem: problem._id, language, code, updatedAt: new Date() });
    }

    if (finalStatus === 'Accepted') {
      const alreadySolved = progress.solvedProblems.some((id) => id.toString() === probIdStr);
      if (!alreadySolved) {
        progress.solvedProblems.push(problem._id);
        if (problem.difficulty === 'Easy') progress.stats.easySolved++;
        else if (problem.difficulty === 'Medium') progress.stats.mediumSolved++;
        progress.stats.totalSolved++;

        // Streak computation
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!progress.streak.lastActiveDate) {
          progress.streak.currentStreak = 1;
          progress.streak.longestStreak = 1;
        } else {
          const lastDate = new Date(progress.streak.lastActiveDate);
          lastDate.setHours(0, 0, 0, 0);
          const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            progress.streak.currentStreak++;
            if (progress.streak.currentStreak > progress.streak.longestStreak) {
              progress.streak.longestStreak = progress.streak.currentStreak;
            }
          } else if (diffDays > 1) {
            progress.streak.currentStreak = 1;
          }
        }
        progress.streak.lastActiveDate = new Date();
      }
    } else {
      const alreadyAttempted = progress.attemptedProblems.some((id) => id.toString() === probIdStr);
      if (!alreadyAttempted) {
        progress.attemptedProblems.push(problem._id);
      }
    }

    await progress.save();

    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        status: finalStatus,
        passedTestCases: passedCount,
        totalTestCases: allTestCases.length,
        executionTimeMs: submission.executionTimeMs,
        memoryKb: submission.memoryKb,
        failedTestCase,
        errorMessage,
        streak: progress.streak,
        stats: progress.stats,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/dsa/bookmark/:problemId
 * Toggle bookmark for a problem
 */
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const progress = await getOrCreateProgress(req.user.id);

    const idx = progress.bookmarkedProblems.findIndex((id) => id.toString() === problemId);
    let isBookmarked = false;
    if (idx >= 0) {
      progress.bookmarkedProblems.splice(idx, 1);
      isBookmarked = false;
    } else {
      progress.bookmarkedProblems.push(problemId);
      isBookmarked = true;
    }

    await progress.save();
    res.json({ success: true, data: { isBookmarked } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dsa/submissions/:slug
 * Get submission history for a problem
 */
exports.getProblemSubmissions = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const problem = await DsaProblem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const submissions = await DsaSubmission.find({
      user: req.user.id,
      problem: problem._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: submissions });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/dsa/save-draft
 * Auto-save code draft
 */
exports.saveCodeDraft = async (req, res, next) => {
  try {
    const { slug, language, code } = req.body;
    const problem = await DsaProblem.findOne({ slug });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    const progress = await getOrCreateProgress(req.user.id);
    const probIdStr = problem._id.toString();

    const idx = progress.savedCode.findIndex((sc) => sc.problem.toString() === probIdStr);
    if (idx >= 0) {
      progress.savedCode[idx].code = code;
      progress.savedCode[idx].language = language;
      progress.savedCode[idx].updatedAt = new Date();
    } else {
      progress.savedCode.push({ problem: problem._id, language, code, updatedAt: new Date() });
    }

    await progress.save();
    res.json({ success: true, message: 'Draft saved' });
  } catch (err) {
    next(err);
  }
};

exports.ensureProblemsSeeded = ensureProblemsSeeded;
