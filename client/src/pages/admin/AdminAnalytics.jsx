import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SkeletonStat, SkeletonCard } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const BAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, statsRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/stats'),
        ]);
        setAnalytics(analyticsRes.data.data);
        setStats(statsRes.data.data);
      } catch {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 skeleton w-64 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const missingSkillsData = (analytics?.missingSkills || []).map((item) => ({
    skill: item._id,
    count: item.count,
  }));

  const topicWeaknessData = (analytics?.topicWeakness || []).map((item) => ({
    topic: item.topic,
    completionRate: item.completionRate,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Learning & Skill Gap Analytics
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Deep dive into student weaknesses, missing skills across resumes, and curriculum completion
          </p>
        </div>
        <a
          href="/api/admin/export-csv"
          className="btn-secondary text-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          📥 Export Full Report (CSV)
        </a>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-brand-500/30">
          <span className="text-2xl block mb-2">🎯</span>
          <p className="text-2xl font-bold text-white">{stats?.avgATS ?? 0}%</p>
          <p className="text-xs text-gray-400 mt-1">Avg ATS Resume Score</p>
        </div>
        <div className="glass-card p-5 border-success-500/30">
          <span className="text-2xl block mb-2">⚡</span>
          <p className="text-2xl font-bold text-white">{stats?.avgDSA ?? 0}%</p>
          <p className="text-xs text-gray-400 mt-1">Average DSA Mastery</p>
        </div>
        <div className="glass-card p-5 border-warning-500/30">
          <span className="text-2xl block mb-2">🔍</span>
          <p className="text-2xl font-bold text-white">{missingSkillsData.length}</p>
          <p className="text-xs text-gray-400 mt-1">Identified Skill Gaps</p>
        </div>
        <div className="glass-card p-5 border-accent-500/30">
          <span className="text-2xl block mb-2">📚</span>
          <p className="text-2xl font-bold text-white">{topicWeaknessData.length}</p>
          <p className="text-xs text-gray-400 mt-1">Active Curriculum Tracks</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Skills Chart */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span>⚠️</span> Top Missing Resume Skills
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Most common skill deficiencies flagged by ATS</p>
            </div>
            <span className="badge badge-brand">Resume ATS</span>
          </div>

          {missingSkillsData.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon="🎉"
                title="No Major Skill Gaps"
                description="Resumes analyzed have matched the required role skills well."
              />
            </div>
          ) : (
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={missingSkillsData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tick={{ fill: '#e5e7eb', fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value} students missing`, 'Deficiency Count']}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {missingSkillsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Topic Completion & Weakness */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span>🧩</span> Topic Completion Rates
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Student completion progress across DSA topics</p>
            </div>
            <span className="badge badge-accent">Curriculum</span>
          </div>

          {topicWeaknessData.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon="📖"
                title="No Progress Recorded"
                description="Students haven't started completing lessons yet."
              />
            </div>
          ) : (
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicWeaknessData} margin={{ left: 0, right: 10, top: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="topic"
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value}% completed`, 'Completion Rate']}
                  />
                  <Bar dataKey="completionRate" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="glass-card p-6 border-white/10">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Curriculum Recommendations for Administrators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-brand-400 font-semibold block mb-1">1. Boost Underperforming Topics</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              Topics with less than 30% completion may benefit from supplementary video links or beginner-level practice questions.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-accent-400 font-semibold block mb-1">2. Target High-Frequency Missing Skills</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              Introduce mini-workshops or flashcards covering the top missing keywords to improve ATS pass rates.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-emerald-400 font-semibold block mb-1">3. Mock Interview Readiness</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              Schedule targeted technical drills for students who have completed foundational array and string topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
