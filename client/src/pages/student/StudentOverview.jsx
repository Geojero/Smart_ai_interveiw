import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { SkeletonStat } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const StudentOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="h-28 skeleton rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!stats) return <EmptyState icon="❌" title="Failed to load dashboard" description="Please refresh the page." />;

  const readiness = stats.overallReadiness || 0;
  const commScore = stats.skillScores?.communication || 0;
  const dsaComp = stats.dsaCompletion || 0;
  const streak = stats.profile?.streak || 0;
  const mockCount = stats.profile?.interviewsPracticed || 0;
  const resumeScore = stats.skillScores?.resume || 0;

  const radarData = [
    { subject: 'Communication', A: commScore },
    { subject: 'DSA', A: stats.skillScores?.dsa || 0 },
    { subject: 'Problem Solving', A: stats.skillScores?.problemSolving || 0 },
    { subject: 'Core CS', A: stats.skillScores?.coreCS || 0 },
    { subject: 'Resume', A: resumeScore },
    { subject: 'Aptitude', A: stats.skillScores?.aptitude || 0 },
  ];

  const activityIcon = {
    lesson_complete: 'menu_book',
    quiz_attempt: 'quiz',
    resume_upload: 'description',
    interview_practice: 'mic',
    login: 'login'
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Dynamic Atmospheric Glow Backgrounds */}
      <div className="relative overflow-hidden -mx-4 sm:-mx-8 px-4 sm:px-8 pt-2">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

        {/* Section 1: Cockpit Header / Welcome Banner */}
        <section className="relative z-10 w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50/80 via-transparent to-blue-50/50 pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold tracking-wider border border-blue-200/60">
                  Candidate Cockpit
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 font-mono text-xs font-semibold">
                  <span>🔥</span> {streak}-day streak
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/70 font-mono text-xs font-semibold">
                  <span className="material-symbols-outlined text-xs text-sky-600">bolt</span> Tier-1 Velocity
                </span>
              </div>
              
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, <span className="text-blue-600">{user?.name}</span>
              </h1>
              
              <p className="text-sm text-slate-600 flex items-center gap-2 flex-wrap">
                <span className="material-symbols-outlined text-sm text-blue-600">target</span>
                <span>Target Role: <strong className="text-slate-900 font-semibold">{user?.targetRole || 'Full Stack Software Engineer'}</strong></span>
                <span className="text-slate-300">•</span>
                <span>Active Placement Sprint</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => navigate('/student/resume')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm transition-all border border-slate-200 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-blue-600">description</span>
                <span>Resume ({resumeScore}/100)</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/mock')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-blue-200 animate-pulse">videocam</span>
                <span>Start Daily Mock</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: 5 Performance Metric Cards */}
        <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Card 1: Readiness Score */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Readiness Score</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">verified</span>
            </div>
            <div className="flex items-center justify-between my-2">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-slate-900">{readiness}</span>
                  <span className="text-xs text-slate-400 font-medium">/100</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-mono text-[11px] font-semibold mt-0.5">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  <span>+6% this week</span>
                </div>
              </div>
              {/* Radial circle */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                  <path className="text-blue-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray={`${readiness}, 100`} strokeLinecap="round" strokeWidth="3.5" stroke="currentColor" />
                </svg>
                <span className="absolute font-mono text-[10px] text-slate-800 font-bold">{readiness}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${readiness}%` }} />
            </div>
          </div>

          {/* Card 2: Communication AI */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Communication AI</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">record_voice_over</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-slate-900">{commScore}</span>
                <span className="text-xs text-slate-400 font-medium">/100</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Top 7% articulation index</p>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
              <span>{mockCount} Sessions Logged</span>
              <span className="text-blue-600 font-semibold">Strong clarity</span>
            </div>
          </div>

          {/* Card 3: DSA Progress */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">DSA Progress</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">terminal</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-slate-900">{dsaComp}%</span>
                <span className="text-xs text-slate-400 font-medium">completed</span>
              </div>
              <p className="text-xs text-slate-500">Curated interview questions</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${dsaComp}%` }} />
            </div>
          </div>

          {/* Card 4: Active Streak */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Active Streak</span>
              <span className="material-symbols-outlined text-amber-500 text-lg">local_fire_department</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-slate-900">{streak}</span>
                <span className="text-sm font-semibold text-amber-600">Days</span>
              </div>
              <p className="text-xs text-slate-500">Personal streak record</p>
            </div>
            <div className="flex gap-1.5 items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              ))}
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Card 5: Mock Interviews Practiced */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Mock Sessions</span>
              <span className="material-symbols-outlined text-blue-700 text-lg">psychology</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-slate-900">{mockCount}</span>
                <span className="text-xs text-slate-400 font-medium">Sessions</span>
              </div>
              <p className="text-xs text-slate-500">Speech & code calibrated</p>
            </div>
            <div className="font-mono text-[11px] text-blue-600 font-semibold">
              Ready for Tier-1 rounds
            </div>
          </div>
        </section>
      </div>

      {/* Section 3: Charts Row (Radar Chart & Weekly Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">radar</span>
              <h2 className="font-display text-base font-bold text-slate-900">Skill Competency Radar</h2>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
              6 Assessment Pillars
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} outerRadius={90}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
              <Radar name="Candidate Competency" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">show_chart</span>
              <h2 className="font-display text-base font-bold text-slate-900">Weekly Activity Velocity</h2>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-semibold">
              Last 7 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.weeklyActivity}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#2563eb" fill="url(#actGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 4: DSA Topic Progress */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">account_tree</span>
            <h2 className="font-display text-base font-bold text-slate-900">Data Structures & Algorithms Syllabus</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/learn')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Topics</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {stats.topicProgress?.length === 0 ? (
          <EmptyState icon="📚" title="No topics started yet" description="Begin your DSA journey in the Learning section." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.topicProgress?.map((tp, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-800 font-semibold">{tp.topic}</span>
                  <span className="font-mono text-xs text-blue-600 font-bold">{tp.percent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${tp.percent}%` }} />
                </div>
                <p className="font-mono text-[11px] text-slate-500 mt-1.5">{tp.completed}/{tp.total} lessons cleared</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 5: Bottom Grid (Recent Activity & AI Next Steps) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">history</span>
              <h2 className="font-display text-base font-bold text-slate-900">Telemetry Log & Events</h2>
            </div>
            <span className="font-mono text-xs text-slate-400">Real-time Stream</span>
          </div>

          {stats.recentActivity?.length === 0 ? (
            <EmptyState icon="📭" title="No activity recorded yet" description="Start a lesson or mock interview to log your activity." />
          ) : (
            <div className="space-y-2.5">
              {stats.recentActivity?.slice(0, 5).map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors">
                  <div className="p-1.5 rounded-md bg-blue-100/80 text-blue-700 shrink-0">
                    <span className="material-symbols-outlined text-base">
                      {activityIcon[act.type] || 'bolt'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold">{act.description}</p>
                    <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                      {new Date(act.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Next Step */}
        <div className="bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white rounded-xl p-6 shadow-xs border border-blue-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-600 text-xl">tips_and_updates</span>
              <h2 className="font-display text-base font-bold text-slate-900">AI Priority Directives</h2>
            </div>
            
            <div className="space-y-3">
              {stats.dsaCompletion < 50 && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="material-symbols-outlined text-blue-600 text-base">menu_book</span>
                    <span>Continue DSA Curriculum</span>
                  </div>
                  <p className="text-xs text-slate-500">You are {stats.dsaCompletion}% through core algorithmic patterns. Target graphs & DP next.</p>
                </div>
              )}
              {stats.skillScores?.communication < 70 && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="material-symbols-outlined text-blue-600 text-base">record_voice_over</span>
                    <span>Simulate Behavioral Round</span>
                  </div>
                  <p className="text-xs text-slate-500">Practice STAR method articulation with live audio evaluator feedback.</p>
                </div>
              )}
              {resumeScore < 70 && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <span className="material-symbols-outlined text-blue-600 text-base">description</span>
                    <span>Optimize Resume ATS Score</span>
                  </div>
                  <p className="text-xs text-slate-500">Upload your latest PDF for semantic keyword density extraction.</p>
                </div>
              )}
              {stats.dsaCompletion >= 50 && stats.skillScores?.communication >= 70 && resumeScore >= 70 && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                    <span className="material-symbols-outlined text-emerald-600 text-base">celebration</span>
                    <span>Outstanding Velocity</span>
                  </div>
                  <p className="text-xs text-emerald-700">All core competency metrics meet Tier-1 baseline requirements. Maintain streak!</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student/mock')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Launch Quick Assessment</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
