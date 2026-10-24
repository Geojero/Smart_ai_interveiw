import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TOPICS = [
  'All',
  'Arrays & Strings',
  'Hashing',
  'Two Pointers / Sliding Window',
  'Sorting & Searching',
  'Linked List',
  'Stack & Queue',
  'Recursion & Backtracking',
  'Trees',
  'Graphs',
  'Dynamic Programming',
];

const topicIcons = {
  'Arrays & Strings': '🔡',
  'Hashing': '#️⃣',
  'Two Pointers / Sliding Window': '↔️',
  'Sorting & Searching': '🔍',
  'Linked List': '🔗',
  'Stack & Queue': '🥞',
  'Recursion & Backtracking': '🔄',
  'Trees': '🌳',
  'Graphs': '🕸️',
  'Dynamic Programming': '⚡',
};

const DsaProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'table'
  const [expandedTopics, setExpandedTopics] = useState({});

  const navigate = useNavigate();

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTopic !== 'All') params.append('topic', selectedTopic);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const { data } = await api.get(`/dsa/problems?${params.toString()}`);
      if (data.success) {
        setProblems(data.data.problems);
        setStats(data.data.stats);
        // Expand all topics initially in grouped mode
        const expandMap = {};
        TOPICS.forEach((t) => (expandMap[t] = true));
        setExpandedTopics((prev) => (Object.keys(prev).length ? prev : expandMap));
      }
    } catch {
      toast.error('Failed to load DSA problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedTopic, selectedDifficulty, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  const handleToggleBookmark = async (e, problemId) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/dsa/bookmark/${problemId}`);
      if (data.success) {
        setProblems((prev) =>
          prev.map((p) => (p._id === problemId ? { ...p, isBookmarked: data.data.isBookmarked } : p))
        );
        toast.success(data.data.isBookmarked ? 'Problem bookmarked ⭐' : 'Bookmark removed');
      }
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const handlePickRandom = () => {
    const unsolved = problems.filter((p) => !p.isSolved);
    const pool = unsolved.length > 0 ? unsolved : problems;
    if (pool.length > 0) {
      const randomProb = pool[Math.floor(Math.random() * pool.length)];
      navigate(`/student/dsa/${randomProb.slug}`);
    }
  };

  // Group problems by topic for grouped view
  const groupedProblems = useMemo(() => {
    const groups = {};
    for (const prob of problems) {
      if (!groups[prob.topic]) groups[prob.topic] = [];
      groups[prob.topic].push(prob);
    }
    return groups;
  }, [problems]);

  const toggleTopicExpand = (topicName) => {
    setExpandedTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
  };

  const overallPercent = stats?.totalProblems ? Math.round((stats.solvedCount / stats.totalProblems) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900/60 via-purple-900/40 to-slate-900 p-6 md:p-8 border border-brand-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full">
                Fresher-Focused Curated Track
              </span>
              <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1">
                🔥 100 Curated Problems
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>⚡</span> DSA 100 Mastery Sheet
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
              Master the essential 47 Easy and 53 Medium coding interview questions asked in Fresher, SDE-1, and Campus Placement rounds. Code inside Monaco Editor with sandboxed execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePickRandom}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 text-white font-semibold text-sm shadow-lg hover:shadow-brand transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <span>🎲</span> Pick Next Unsolved
            </button>
            <button
              onClick={() => navigate('/student/learning')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-sm font-medium border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>🎓</span> Learning Tracks
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Solved */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Progress</span>
            <span className="text-xl">🏆</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-white">{stats?.solvedCount || 0}</span>
            <span className="text-sm text-gray-400">/ {stats?.totalProblems || 100} Solved</span>
          </div>
          <div className="progress-bar h-2 bg-white/10">
            <div
              className="progress-fill bg-gradient-to-r from-brand-500 to-purple-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <p className="text-xs text-brand-400 mt-2 font-medium">{overallPercent}% Completed</p>
        </div>

        {/* Easy Solved */}
        <div className="glass-card p-5 border-success-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-success-400 uppercase tracking-wider">Easy Problems</span>
            <span className="badge bg-success-500/20 text-success-300 text-xs px-2 py-0.5 rounded-full">Foundation</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-success-400">{stats?.easy?.solved || 0}</span>
            <span className="text-sm text-gray-400">/ {stats?.easy?.total || 47} Solved</span>
          </div>
          <div className="progress-bar h-2 bg-white/10">
            <div
              className="progress-fill bg-success-500"
              style={{
                width: `${stats?.easy?.total ? Math.round(((stats?.easy?.solved || 0) / stats.easy.total) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats?.easy?.total ? Math.round(((stats?.easy?.solved || 0) / stats.easy.total) * 100) : 0}% Complete
          </p>
        </div>

        {/* Medium Solved */}
        <div className="glass-card p-5 border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Medium Problems</span>
            <span className="badge bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">Interview Core</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-amber-400">{stats?.medium?.solved || 0}</span>
            <span className="text-sm text-gray-400">/ {stats?.medium?.total || 53} Solved</span>
          </div>
          <div className="progress-bar h-2 bg-white/10">
            <div
              className="progress-fill bg-amber-500"
              style={{
                width: `${stats?.medium?.total ? Math.round(((stats?.medium?.solved || 0) / stats.medium.total) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats?.medium?.total ? Math.round(((stats?.medium?.solved || 0) / stats.medium.total) * 100) : 0}% Complete
          </p>
        </div>

        {/* Current Streak */}
        <div className="glass-card p-5 border-orange-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Daily Streak</span>
            <span className="text-xl">🔥</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-orange-400">{stats?.streak?.currentStreak || 0}</span>
            <span className="text-sm text-gray-400">Days Active</span>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center justify-between">
            <span>Longest Streak:</span>
            <span className="font-semibold text-white">{stats?.streak?.longestStreak || 0} Days</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-5 space-y-4">
        {/* Row 1: Search, Difficulty, Status, View mode */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              placeholder="Search problems by name, tag, or #ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
          </form>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            {['All', 'Easy', 'Medium'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === d
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { key: 'all', label: 'All' },
              { key: 'solved', label: '✓ Solved' },
              { key: 'attempted', label: '⏳ Attempted' },
              { key: 'unsolved', label: 'Unsolved' },
              { key: 'bookmarked', label: '⭐ Saved' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedStatus === key
                    ? 'bg-purple-600 text-white shadow-brand'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grouped')}
              title="Group by Topic"
              className={`p-2 rounded-lg text-xs transition-all ${
                viewMode === 'grouped' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📑 Grouped
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="All in List"
              className={`p-2 rounded-lg text-xs transition-all ${
                viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 Flat List
            </button>
          </div>
        </div>

        {/* Row 2: Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {TOPICS.map((topic) => {
            const topicStat = stats?.topicStats?.[topic];
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedTopic === topic
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-brand font-semibold'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{topicIcons[topic] || '📚'}</span>
                {topic}
                {topicStat && (
                  <span className="ml-1.5 text-[10px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded-full">
                    {topicStat.solved}/{topicStat.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Problems Display */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-semibold text-white">No matching problems found</h3>
          <p className="text-sm text-gray-400">Try clearing filters or search query.</p>
          <button
            onClick={() => {
              setSelectedTopic('All');
              setSelectedDifficulty('All');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="btn-brand text-xs px-4 py-2 mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grouped' && selectedTopic === 'All' ? (
        /* Grouped by Topic View */
        <div className="space-y-6">
          {Object.entries(groupedProblems).map(([topicName, probList]) => {
            const isExpanded = expandedTopics[topicName] !== false;
            const solvedInTopic = probList.filter((p) => p.isSolved).length;
            const topicPercent = Math.round((solvedInTopic / probList.length) * 100);

            return (
              <div key={topicName} className="glass-card overflow-hidden border border-white/10">
                {/* Topic Header Accordion */}
                <button
                  onClick={() => toggleTopicExpand(topicName)}
                  className="w-full p-4 flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] transition-colors border-b border-white/10 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{topicIcons[topicName] || '⚡'}</span>
                    <div>
                      <h3 className="font-bold text-white text-base">{topicName}</h3>
                      <p className="text-xs text-gray-400">
                        {probList.length} problems • {solvedInTopic} solved ({topicPercent}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 hidden sm:block">
                      <div className="progress-bar h-1.5 bg-white/10">
                        <div
                          className="progress-fill bg-brand-500"
                          style={{ width: `${topicPercent}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Problem items in topic */}
                {isExpanded && (
                  <div className="divide-y divide-white/5">
                    {probList.map((problem) => (
                      <ProblemRow
                        key={problem._id}
                        problem={problem}
                        onSolve={() => navigate(`/student/dsa/${problem.slug}`)}
                        onToggleBookmark={(e) => handleToggleBookmark(e, problem._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat Table / List View */
        <div className="glass-card overflow-hidden border border-white/10">
          <div className="divide-y divide-white/5">
            {problems.map((problem) => (
              <ProblemRow
                key={problem._id}
                problem={problem}
                onSolve={() => navigate(`/student/dsa/${problem.slug}`)}
                onToggleBookmark={(e) => handleToggleBookmark(e, problem._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Individual Problem Row Component
 */
const ProblemRow = ({ problem, onSolve, onToggleBookmark }) => {
  return (
    <div
      onClick={onSolve}
      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Status Indicator */}
        <div
          title={problem.isSolved ? 'Solved' : problem.isAttempted ? 'Attempted' : 'Unsolved'}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold transition-all ${
            problem.isSolved
              ? 'bg-success-500/20 text-success-400 border border-success-500/40 shadow-sm'
              : problem.isAttempted
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-white/5 text-gray-500 border border-white/10 group-hover:border-white/20'
          }`}
        >
          {problem.isSolved ? '✓' : problem.isAttempted ? '⏳' : problem.problemId}
        </div>

        {/* Title & Topic */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
              {problem.problemId}. {problem.title}
            </span>
            {problem.tags && problem.tags.length > 0 && (
              <span className="hidden md:inline-block text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                {problem.tags[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 sm:hidden mt-0.5">{problem.topic}</p>
        </div>
      </div>

      {/* Right details: Difficulty, Acceptance, Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pl-9 sm:pl-0">
        <span
          className={`badge text-xs px-2.5 py-0.5 rounded-full font-medium ${
            problem.difficulty === 'Easy'
              ? 'bg-success-500/10 text-success-400 border border-success-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}
        >
          {problem.difficulty}
        </span>

        <span className="text-xs text-gray-400 hidden lg:inline-block font-mono">
          {problem.acceptanceRate || 75}% pass
        </span>

        {/* Bookmark star */}
        <button
          onClick={onToggleBookmark}
          title={problem.isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
          className={`p-1.5 rounded-lg transition-colors text-sm ${
            problem.isBookmarked
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          {problem.isBookmarked ? '★' : '☆'}
        </button>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSolve();
          }}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white/5 group-hover:bg-brand-600 group-hover:text-white text-gray-300 border border-white/10 group-hover:border-transparent transition-all shadow-sm"
        >
          {problem.isSolved ? 'Review →' : 'Solve →'}
        </button>
      </div>
    </div>
  );
};

export default DsaProblemList;
