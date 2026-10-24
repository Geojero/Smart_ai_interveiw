import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SkeletonStat } from '../../components/Skeleton';

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState('2025');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/admin/export-csv', '_blank');
    toast.success('Downloading student progress CSV...', { icon: '📥' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 skeleton w-72 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  const totalStudents = stats?.totalStudents || 1420;
  const weeklyActive = stats?.weeklyActiveUsers || 894;
  const avgDsa = stats?.avgDSA || 64.2;
  const resumeCount = stats?.resumeCount || 3180;
  const activePercent = Math.round((weeklyActive / (totalStudents || 1)) * 100);

  const departments = ['ALL', 'CSE', 'IT', 'ECE', 'AI & DS', 'Mechanical'];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Command Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-semibold">
              Institutional Telemetry Engine
            </span>
            <span className="text-slate-400 text-xs font-mono font-medium">/ 2024-2025 Placement Cycle</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Candidate Intelligence & Performance Control
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Cohort Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedCohort('2025')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCohort === '2025'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2025 Placement Batch
            </button>
            <button
              type="button"
              onClick={() => setSelectedCohort('2026')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCohort === '2026'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2026 Interns
            </button>
          </div>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Progress CSV</span>
          </button>
        </div>
      </div>

      {/* Department Filter Rail */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max">
          <span className="font-mono text-xs uppercase text-slate-500 mr-1 font-semibold">Filter Dept:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {dept === 'ALL' ? 'All Departments (5)' : dept}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-300 mx-2"></div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 font-mono text-xs">
            <span className="material-symbols-outlined text-sm text-blue-600">tune</span>
            <span>Auto-sync enabled</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Grid (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Students */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Candidates</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-lg">school</span>
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-slate-900 tracking-tight">{totalStudents}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-mono text-xs text-blue-600 font-semibold">5 Depts</span>
              <span className="text-xs text-slate-400">• Monitored</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active This Week */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Active Weekly</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <span className="material-symbols-outlined text-lg">offline_bolt</span>
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-slate-900 tracking-tight">{weeklyActive}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[11px] font-bold">
                {activePercent}%
              </span>
              <span className="text-xs text-slate-500 truncate">engagement</span>
            </div>
          </div>
        </div>

        {/* Card 3: Readiness Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Avg Readiness</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <span className="material-symbols-outlined text-lg">analytics</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-slate-900 tracking-tight">78.4</span>
              <span className="font-mono text-xs text-slate-400">/100</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 font-mono text-xs font-semibold">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+4.2% MoM</span>
            </div>
          </div>
        </div>

        {/* Card 4: Avg DSA Solved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">DSA Completion</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-lg">code_blocks</span>
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-slate-900 tracking-tight">{avgDsa}%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${avgDsa}%` }} />
            </div>
          </div>
        </div>

        {/* Card 5: Resumes Audited */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Resumes Audited</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <span className="material-symbols-outlined text-lg">description</span>
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-slate-900 tracking-tight">{resumeCount}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-blue-600">auto_awesome</span>
              <span>AI ATS Parsed</span>
            </div>
          </div>
        </div>

        {/* Card 6: Top Department */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-blue-50/60 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] text-blue-700 uppercase tracking-wider font-bold">Top Dept</span>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <span className="material-symbols-outlined text-lg">military_tech</span>
            </div>
          </div>
          <div>
            <div className="font-display text-sm font-bold text-slate-900 truncate">Computer Science</div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[11px] text-slate-400">Benchmark</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-bold">94.6</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart & Skill Deficit Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Growth Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">trending_up</span>
              <h2 className="font-display text-base font-bold text-slate-900">Student Intake & Onboarding Velocity</h2>
            </div>
            <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              Last 30 Days
            </span>
          </div>

          {stats?.userGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
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
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Sufficient historical velocity data will populate here.
            </div>
          )}
        </div>

        {/* Missing Skills Density (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-xl">bar_chart</span>
                <h2 className="font-display text-base font-bold text-slate-900">Missing Skill Density</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold">
                Cohort Gaps
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Identified skill gaps aggregated across candidate mock interviews and ATS screenings.
            </p>

            <div className="space-y-3">
              {[
                { skill: 'Dynamic Programming & Memoization', deficit: '68% of cohort', bar: '68%', color: 'bg-rose-500' },
                { skill: 'System Design & Distributed Caching', deficit: '54% of cohort', bar: '54%', color: 'bg-amber-500' },
                { skill: 'PostgreSQL Indexing & Optimization', deficit: '42% of cohort', bar: '42%', color: 'bg-sky-500' },
                { skill: 'STAR Behavioral Framework Structure', deficit: '35% of cohort', bar: '35%', color: 'bg-blue-600' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>{item.skill}</span>
                    <span className="font-mono text-slate-500 font-medium">{item.deficit}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.bar }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/analytics')}
            className="w-full mt-4 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Deep Dive Analytics</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Quick Console Navigation Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            label: 'Candidate Management',
            href: '/admin/students',
            icon: 'groups',
            color: 'bg-blue-50 text-blue-600',
            desc: 'Inspect candidate ledgers, filter by CGPA/dept, and toggle account permissions.',
          },
          {
            label: 'Analytics & Weakness Matrix',
            href: '/admin/analytics',
            icon: 'analytics',
            color: 'bg-indigo-50 text-indigo-600',
            desc: 'Topic-level heatmap, recruiter feedback trends, and institutional benchmarking.',
          },
          {
            label: 'Curriculum & Question Bank',
            href: '/admin/content',
            icon: 'quiz',
            color: 'bg-sky-50 text-sky-600',
            desc: 'Manage DSA syllabus, coding challenges, interview rubrics, and role templates.',
          },
        ].map(({ label, href, icon, color, desc }) => (
          <div
            key={href}
            onClick={() => navigate(href)}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                {label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 gap-1 group-hover:gap-2 transition-all">
              <span>Open Module</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
