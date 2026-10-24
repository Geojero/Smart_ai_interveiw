import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import EmptyState from '../../components/EmptyState';

const TopicCard = ({ topic, onSelect, isSelected }) => (
  <button
    onClick={() => onSelect(topic)}
    className={`p-5 rounded-2xl text-left border transition-all duration-200 w-full cursor-pointer ${
      isSelected
        ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
    }`}
  >
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-2xl shrink-0">
        {topic.icon || '⚡'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-slate-900 text-sm truncate">{topic.title}</h3>
          <span className="font-mono text-xs text-slate-400 font-medium">{topic.completedCount}/{topic.lessonCount}</span>
        </div>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{topic.description}</p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${topic.progressPercent}%` }} />
        </div>
        <p className="font-mono text-[11px] text-blue-600 mt-1.5 font-semibold">{topic.progressPercent}% complete</p>
      </div>
    </div>
  </button>
);

const LessonItem = ({ lesson, onOpen }) => (
  <button
    onClick={() => onOpen(lesson._id)}
    className={`flex items-center gap-4 p-4 rounded-xl border transition-all w-full text-left cursor-pointer ${
      lesson.completed
        ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70'
        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/80'
    }`}
  >
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
        lesson.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {lesson.completed ? '✓' : lesson.order}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-900 text-sm truncate">{lesson.title}</p>
      <p className="font-mono text-xs text-slate-400 mt-0.5">{lesson.estimatedMinutes} min • {lesson.practiceProblems?.length || 0} problems</p>
    </div>
    <div
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        lesson.completed ? 'text-emerald-700 bg-emerald-100' : 'text-blue-600 bg-blue-50'
      }`}
    >
      {lesson.completed ? 'Cleared' : 'Start →'}
    </div>
  </button>
);

const ContinueLearning = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeTrack, setActiveTrack] = useState('dsa');
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [dsaStats, setDsaStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/learning/topics?track=${activeTrack}`);
        setTopics(data.data || []);
        setSelectedTopic(null);
        setLessons([]);
      } catch {
        toast.error('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [activeTrack]);

  const selectTopic = async (topic) => {
    setSelectedTopic(topic);
    setLessonsLoading(true);
    try {
      const { data } = await api.get(`/learning/topics/${topic._id}/lessons`);
      setLessons(data.data || []);
    } catch {
      toast.error('Failed to load lessons');
    } finally {
      setLessonsLoading(false);
    }
  };

  const openLesson = (lessonId) => navigate(`/student/learning/lesson/${lessonId}`);

  useEffect(() => {
    const fetchDsaStats = async () => {
      try {
        const { data } = await api.get('/dsa/problems');
        if (data.success) {
          setDsaStats(data.data.stats);
        }
      } catch {
        // silent
      }
    };
    fetchDsaStats();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
            Interactive Curriculum
          </span>
          <span className="text-xs text-slate-500 font-medium">Placement Guided Learning</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Continue Learning & Problem Solving
        </h1>
        <p className="text-sm text-slate-500 mt-1">Master DSA, system architecture, and IT core foundations with step-by-step interactive lessons.</p>
      </div>

      {/* Fresher DSA 100 Sheet Feature Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 p-6 sm:p-7 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-3 py-0.5 text-xs font-mono font-bold rounded-full">
              🔥 NEW: Fresher DSA 100 Sheet
            </span>
            <span className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-3 py-0.5 text-xs font-mono font-medium rounded-full">
              Monaco Code Engine • 47 Easy • 53 Medium
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">
            Curated Coding Problems for Top Placement Rounds
          </h2>
          <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
            Solve 100 hand-picked DSA problems across 10 core topics (Arrays, Trees, DP, Graphs, etc.) in our VS Code-powered browser IDE with instant testcase execution.
          </p>

          {/* Quick stats chips */}
          {dsaStats && (
            <div className="flex items-center gap-3 pt-2 text-xs font-mono flex-wrap">
              <span className="bg-black/20 px-2.5 py-1 rounded-md text-white">
                <strong>{dsaStats.solvedCount || 0}</strong> / {dsaStats.totalProblems || 100} Solved
              </span>
              <span className="bg-black/20 px-2.5 py-1 rounded-md text-emerald-200">
                {dsaStats.easy?.solved || 0}/{dsaStats.easy?.total || 47} Easy
              </span>
              <span className="bg-black/20 px-2.5 py-1 rounded-md text-amber-200">
                {dsaStats.medium?.solved || 0}/{dsaStats.medium?.total || 53} Medium
              </span>
              {dsaStats.streak?.currentStreak > 0 && (
                <span className="bg-black/20 px-2.5 py-1 rounded-md text-orange-200">
                  🔥 {dsaStats.streak.currentStreak} Day Streak
                </span>
              )}
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate('/student/dsa')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Launch DSA 100 Sheet</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Track selector */}
      <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs w-fit">
        {[
          { key: 'dsa', label: '⚡ DSA Algorithm Track' },
          { key: 'it', label: '💻 IT Core Fundamentals' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTrack(key)}
            className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTrack === key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Topics list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">Curriculum Modules</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
            </div>
          ) : topics.length === 0 ? (
            <EmptyState icon="📚" title="No topics available" description="Content is being synchronized." />
          ) : (
            topics.map((topic) => (
              <TopicCard key={topic._id} topic={topic} onSelect={selectTopic} isSelected={selectedTopic?._id === topic._id} />
            ))
          )}
        </div>

        {/* Lessons panel */}
        <div className="lg:col-span-3">
          {!selectedTopic ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 h-full min-h-64 flex items-center justify-center">
              <EmptyState icon="👈" title="Select a topic" description="Choose a topic module from the left to explore its interactive lessons and coding tasks." />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <span className="text-3xl">{selectedTopic.icon}</span>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-lg">{selectedTopic.title}</h2>
                  <p className="font-mono text-xs text-blue-600 font-semibold">{selectedTopic.progressPercent}% syllabus completed</p>
                </div>
              </div>

              {lessonsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
              ) : lessons.length === 0 ? (
                <EmptyState icon="📚" title="No lessons yet" description="Lessons for this topic will be available shortly." />
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <LessonItem key={lesson._id} lesson={lesson} onOpen={openLesson} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;
