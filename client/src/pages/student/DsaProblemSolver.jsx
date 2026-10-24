import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LANGUAGE_CONFIG = {
  javascript: { name: 'JavaScript', monacoLang: 'javascript' },
  python: { name: 'Python 3', monacoLang: 'python' },
  cpp: { name: 'C++ (GCC)', monacoLang: 'cpp' },
  java: { name: 'Java (OpenJDK)', monacoLang: 'java' },
};

const DsaProblemSolver = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [userState, setUserState] = useState({ isSolved: false, isBookmarked: false });
  const [loading, setLoading] = useState(true);

  // Editor states
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'hints', 'solution', 'submissions'
  const [revealedHints, setRevealedHints] = useState({});

  // Submissions list
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Bottom execution console
  const [consoleTab, setConsoleTab] = useState('cases'); // 'cases', 'custom', 'results'
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Auto-save debounce timer
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/dsa/problems/${slug}`);
        if (data.success) {
          const prob = data.data.problem;
          setProblem(prob);
          setUserState(data.data.userState);

          const preferredLang = data.data.userState.savedLanguage || 'javascript';
          setLanguage(preferredLang);

          const initialCode =
            data.data.userState.savedCode ||
            prob.starterCodes?.[preferredLang] ||
            prob.starterCodes?.javascript ||
            '';
          setCode(initialCode);

          if (prob.testCases && prob.testCases.length > 0) {
            setCustomInput(prob.testCases[0].input || '');
          }
        }
      } catch {
        toast.error('Failed to load problem');
        navigate('/student/dsa');
      } finally {
        setLoading(false);
      }
    };
    fetchProblemData();
  }, [slug]);

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const starter = problem?.starterCodes?.[newLang] || '';
    setCode(starter);
    toast(`Switched to ${LANGUAGE_CONFIG[newLang]?.name || newLang}`, { icon: '🔄' });
  };

  // Reset code to default starter template
  const handleResetCode = () => {
    if (window.confirm('Reset code to initial template? Your current changes will be discarded.')) {
      const defaultCode = problem?.starterCodes?.[language] || '';
      setCode(defaultCode);
      toast.success('Code reset to default starter boilerplate');
    }
  };

  // Code change with auto-save draft debounce
  const handleCodeChange = (newCode) => {
    setCode(newCode || '');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.post('/dsa/save-draft', { slug, language, code: newCode });
      } catch {
        // silent auto-save error
      }
    }, 1500);
  };

  // Toggle bookmark
  const handleToggleBookmark = async () => {
    if (!problem) return;
    try {
      const { data } = await api.post(`/dsa/bookmark/${problem._id}`);
      if (data.success) {
        setUserState((prev) => ({ ...prev, isBookmarked: data.data.isBookmarked }));
        toast.success(data.data.isBookmarked ? 'Problem bookmarked ⭐' : 'Bookmark removed');
      }
    } catch {
      toast.error('Failed to toggle bookmark');
    }
  };

  // Load submissions
  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const { data } = await api.get(`/dsa/submissions/${slug}`);
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch {
      toast.error('Failed to load submissions history');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'submissions') {
      loadSubmissions();
    }
  };

  // Run Code
  const handleRunCode = async (useCustom = false) => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }
    setIsRunning(true);
    setConsoleTab('results');
    setSubmissionResult(null);
    try {
      const payload = {
        slug,
        language,
        code,
        customInput: useCustom ? customInput : undefined,
      };
      const { data } = await api.post('/dsa/run', payload);
      if (data.success) {
        setRunResults(data.data);
        if (data.data.allPassed) {
          toast.success('All sample testcases passed! 🎉');
        } else if (data.data.isCustom) {
          toast.success('Custom testcase executed');
        } else {
          toast.error('Some sample testcases failed. Check outputs.');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }
    setIsSubmitting(true);
    setConsoleTab('results');
    setRunResults(null);
    try {
      const { data } = await api.post('/dsa/submit', { slug, language, code });
      if (data.success) {
        setSubmissionResult(data.data);
        if (data.data.status === 'Accepted') {
          setUserState((prev) => ({ ...prev, isSolved: true }));
          toast.success(`Accepted! 🏆 Passed ${data.data.passedTestCases}/${data.data.totalTestCases} test cases!`);
        } else {
          toast.error(`${data.data.status}: Passed ${data.data.passedTestCases}/${data.data.totalTestCases} cases.`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Loading problem environment...</p>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="space-y-4 animate-fade-in -mx-2 sm:mx-0">
      {/* Top Navbar / Breadcrumbs & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/dsa')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>←</span> Back to Sheet
          </button>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">
              {problem.problemId}. {problem.title}
            </span>
            <span
              className={`badge text-xs px-2.5 py-0.5 rounded-full font-medium ${
                problem.difficulty === 'Easy'
                  ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {problem.difficulty}
            </span>
            {userState.isSolved && (
              <span className="badge bg-success-500/20 text-success-300 border border-success-500/40 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                ✓ Solved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            title={userState.isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
            className={`p-2 rounded-xl text-sm border transition-colors flex items-center gap-1.5 ${
              userState.isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            <span>{userState.isBookmarked ? '★' : '☆'}</span>
            <span className="text-xs hidden md:inline">
              {userState.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>

          {/* Quick Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500 font-medium cursor-pointer"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key} className="bg-slate-900 text-white">
                {cfg.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: Left Info Pane, Right Code & Console Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-10rem)] min-h-[700px]">
        {/* LEFT PANE: Description / Hints / Solution / Submissions */}
        <div className="lg:col-span-5 flex flex-col glass-card overflow-hidden border border-white/10">
          {/* Left Tabs */}
          <div className="flex items-center border-b border-white/10 bg-white/[0.02] px-2 pt-2 gap-1 overflow-x-auto">
            {[
              { id: 'description', label: 'Problem', icon: '📝' },
              { id: 'hints', label: `Hints (${problem.hints?.length || 0})`, icon: '💡' },
              { id: 'solution', label: 'Solution', icon: '📖' },
              { id: 'submissions', label: 'Submissions', icon: '📜' },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 border-t border-x ${
                  activeTab === id
                    ? 'bg-white/10 text-white border-white/20 border-b-transparent shadow-sm'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Left Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-gray-200 text-sm scrollbar-thin">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{problem.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-brand-400 font-medium">{problem.topic}</span>
                    <span>•</span>
                    <span>Acceptance: {problem.acceptanceRate || 75}%</span>
                  </div>
                </div>

                {/* Markdown Problem Statement */}
                <div className="markdown-content prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>

                {/* Formatted Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-xs">
                      Examples
                    </h3>
                    {problem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-2 font-mono text-xs"
                      >
                        <p className="font-bold text-gray-400 uppercase text-[10px]">Example {i + 1}:</p>
                        <div className="space-y-1">
                          <p>
                            <span className="text-brand-400 font-semibold">Input:</span>{' '}
                            <span className="text-gray-200 whitespace-pre-wrap">{ex.input}</span>
                          </p>
                          <p>
                            <span className="text-success-400 font-semibold">Output:</span>{' '}
                            <span className="text-gray-200 whitespace-pre-wrap">{ex.output}</span>
                          </p>
                          {ex.explanation && (
                            <p className="font-sans text-xs text-gray-400 pt-1 border-t border-white/5">
                              <span className="text-gray-300 font-medium">Explanation:</span>{' '}
                              {ex.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-gray-400">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">Tags:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hints Tab */}
            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-300">
                  💡 Stuck? Unlock hints one step at a time to solve it yourself!
                </div>
                {problem.hints && problem.hints.length > 0 ? (
                  problem.hints.map((hint, i) => {
                    const isRevealed = revealedHints[i];
                    return (
                      <div
                        key={i}
                        className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">Hint {i + 1}</span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHints((prev) => ({ ...prev, [i]: true }))}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                            >
                              Reveal Hint →
                            </button>
                          )}
                        </div>
                        {isRevealed && (
                          <p className="text-sm text-gray-200 pt-1 leading-relaxed border-t border-white/5 animate-fade-in">
                            {hint}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-xs">No specific hints for this problem.</p>
                )}
              </div>
            )}

            {/* Solution Tab */}
            {activeTab === 'solution' && (
              <div className="space-y-4">
                <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20 text-xs text-brand-300">
                  📖 Optimal Solution & Complexity Analysis
                </div>
                {problem.solution ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">Approach</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {problem.solution.approach || 'Optimal two-pointer / hashing algorithm.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Time Complexity</span>
                        <span className="text-brand-300 font-bold">{problem.solution.timeComplexity || 'O(N)'}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Space Complexity</span>
                        <span className="text-purple-300 font-bold">{problem.solution.spaceComplexity || 'O(1)'}</span>
                      </div>
                    </div>

                    {problem.solution.code && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-sm">Reference Code</h4>
                        <pre className="code-block text-xs max-h-72 overflow-y-auto">
                          <code>
                            {problem.solution.code[language] ||
                              problem.solution.code.javascript ||
                              problem.solution.code.python ||
                              '// Solution reference'}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs">Solution notes coming soon.</p>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Your Submission History</h4>
                {loadingSubmissions ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton h-12 rounded-xl" />
                    ))}
                  </div>
                ) : submissions.length === 0 ? (
                  <p className="text-gray-400 text-xs">No submissions yet for this problem.</p>
                ) : (
                  <div className="space-y-2">
                    {submissions.map((sub) => (
                      <div
                        key={sub._id}
                        className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                sub.status === 'Accepted' ? 'text-success-400' : 'text-rose-400'
                              }`}
                            >
                              {sub.status}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 uppercase">{sub.language}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            {new Date(sub.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300 font-semibold">{sub.executionTimeMs} ms</p>
                          <p className="text-gray-500 text-[10px]">
                            {sub.passedTestCases}/{sub.totalTestCases} Passed
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Monaco Editor + Bottom Console Panel */}
        <div className="lg:col-span-7 flex flex-col glass-card overflow-hidden border border-white/10">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-brand-400 font-bold">💻 Code Editor</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 font-mono text-[11px]">
                {LANGUAGE_CONFIG[language]?.name || language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                title="Reset boilerplate"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>↺</span> Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] relative bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={LANGUAGE_CONFIG[language]?.monacoLang || 'javascript'}
              value={code}
              theme="vs-dark"
              onChange={handleCodeChange}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                bracketPairColorization: { enabled: true },
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Bottom Execution Console & Actions */}
          <div className="border-t border-white/10 bg-slate-950 flex flex-col h-64">
            {/* Console Tabs & Run/Submit Buttons */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-1">
                {[
                  { id: 'cases', label: 'Testcases' },
                  { id: 'custom', label: 'Custom Input' },
                  { id: 'results', label: 'Run Verdict' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setConsoleTab(id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      consoleTab === id
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={isRunning || isSubmitting}
                  onClick={() => handleRunCode(consoleTab === 'custom')}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <span>▶</span> Run Code
                    </>
                  )}
                </button>

                <button
                  disabled={isRunning || isSubmitting}
                  onClick={handleSubmitCode}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-success-600 to-brand-600 hover:from-success-500 hover:to-brand-500 text-white font-bold text-xs shadow-md hover:shadow-brand transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Judging...
                    </>
                  ) : (
                    <>
                      <span>🚀</span> Submit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Console Body */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs scrollbar-thin">
              {/* Tab 1: Standard Sample Testcases */}
              {consoleTab === 'cases' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {problem.testCases?.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          selectedCaseIdx === idx
                            ? 'bg-brand-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {problem.testCases && problem.testCases[selectedCaseIdx] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                          Input
                        </span>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-gray-200 whitespace-pre-wrap">
                          {problem.testCases[selectedCaseIdx].input}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                          Expected Output
                        </span>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-gray-200 whitespace-pre-wrap">
                          {problem.testCases[selectedCaseIdx].expectedOutput}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Custom Input */}
              {consoleTab === 'custom' && (
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">
                    Custom Stdin Input (Passes directly to code execution)
                  </span>
                  <textarea
                    rows={4}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input..."
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-200 text-xs font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {/* Tab 3: Execution / Submission Results */}
              {consoleTab === 'results' && (
                <div>
                  {/* Submission Full Results */}
                  {submissionResult && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`badge text-sm font-bold px-3 py-1 rounded-xl ${
                            submissionResult.status === 'Accepted'
                              ? 'bg-success-500/20 text-success-400 border border-success-500/40 shadow-sm'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {submissionResult.status === 'Accepted'
                            ? '🎉 Accepted'
                            : `❌ ${submissionResult.status}`}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {submissionResult.passedTestCases} / {submissionResult.totalTestCases} test cases passed
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-xs font-mono">
                          {submissionResult.executionTimeMs} ms
                        </span>
                      </div>

                      {submissionResult.failedTestCase && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
                          <p className="text-xs font-bold text-rose-300">
                            Failed on Testcase {submissionResult.failedTestCase.caseIndex}:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500 text-[10px] uppercase block">Input</span>
                              <div className="p-2 bg-black/40 rounded text-gray-200">
                                {submissionResult.failedTestCase.input}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 text-[10px] uppercase block">Expected</span>
                              <div className="p-2 bg-black/40 rounded text-gray-200">
                                {submissionResult.failedTestCase.expectedOutput}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 text-[10px] uppercase block">Actual Output</span>
                            <div className="p-2 bg-black/40 rounded text-rose-300">
                              {submissionResult.failedTestCase.actualOutput || 'None'}
                            </div>
                          </div>
                        </div>
                      )}

                      {submissionResult.errorMessage && (
                        <div className="p-3 bg-black/50 border border-rose-500/30 rounded-xl text-rose-400 font-mono text-xs whitespace-pre-wrap">
                          {submissionResult.errorMessage}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Run Code Sample Results */}
                  {runResults && !submissionResult && (
                    <div className="space-y-3">
                      {runResults.isCustom ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="badge bg-brand-500/20 text-brand-300 text-xs px-2.5 py-0.5 rounded-lg">
                              Status: {runResults.status}
                            </span>
                            <span className="text-gray-400 text-xs">{runResults.time} ms</span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-[10px] uppercase block">Output</span>
                            <div className="p-2.5 bg-black/40 rounded-xl text-gray-200 whitespace-pre-wrap">
                              {runResults.stdout || '(Empty output)'}
                            </div>
                          </div>
                          {runResults.stderr && (
                            <div>
                              <span className="text-rose-400 text-[10px] uppercase block">Errors</span>
                              <div className="p-2.5 bg-black/40 rounded-xl text-rose-400 whitespace-pre-wrap">
                                {runResults.stderr}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`badge text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                                runResults.allPassed
                                  ? 'bg-success-500/20 text-success-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {runResults.allPassed ? '✓ All Sample Cases Passed' : '❌ Sample Test Failed'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {runResults.testCases?.map((tc) => (
                              <div
                                key={tc.caseNumber}
                                className={`p-3 rounded-xl border space-y-1.5 ${
                                  tc.passed
                                    ? 'bg-success-500/5 border-success-500/20'
                                    : 'bg-rose-500/5 border-rose-500/20'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-gray-300">Case {tc.caseNumber}</span>
                                  <span
                                    className={`text-xs font-bold ${
                                      tc.passed ? 'text-success-400' : 'text-rose-400'
                                    }`}
                                  >
                                    {tc.status} ({tc.time} ms)
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500 text-[10px] uppercase block">Expected</span>
                                    <div className="p-1.5 bg-black/30 rounded text-gray-300">
                                      {tc.expectedOutput}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-[10px] uppercase block">Your Output</span>
                                    <div
                                      className={`p-1.5 bg-black/30 rounded ${
                                        tc.passed ? 'text-gray-300' : 'text-rose-300 font-bold'
                                      }`}
                                    >
                                      {tc.actualOutput || '(Empty)'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!runResults && !submissionResult && (
                    <div className="text-gray-500 text-center py-6">
                      Click <strong className="text-gray-400">"Run Code"</strong> to test sample cases or{' '}
                      <strong className="text-gray-400">"Submit"</strong> to run against all 100% test cases.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DsaProblemSolver;
