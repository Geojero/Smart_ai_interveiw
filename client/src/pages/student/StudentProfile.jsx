import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ targetRole: '', college: '', graduationYear: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/student/profile');
        setProfile(data.data);
        setForm({
          targetRole: data.data.targetRole || '',
          college: data.data.college || '',
          graduationYear: data.data.graduationYear || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/student/profile', form);
      toast.success('Profile updated! ✅');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl font-sans">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
            Candidate Dossier
          </span>
          <span className="text-xs text-slate-500 font-medium">Placement Calibration Profile</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Candidate Profile & Credentials
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage target roles, institutional credentials, and placement cohort settings.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-display font-bold text-white shadow-md shadow-blue-500/20 shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500 font-mono mt-0.5">{user?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              {user?.role} Terminal
            </span>
            <span className="text-xs text-slate-400">
              Joined {new Date(profile?.user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Performance Indicators */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Streak Record', value: `${profile?.streak || 0} Days`, icon: 'local_fire_department', color: 'text-amber-600 bg-amber-50' },
          { label: 'Mock Sessions', value: profile?.interviewsPracticed || 0, icon: 'mic', color: 'text-blue-600 bg-blue-50' },
          { label: 'Placement Class', value: profile?.graduationYear || '2025', icon: 'school', color: 'text-indigo-600 bg-indigo-50' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-slate-200/80 shadow-xs">
            <div className={`w-9 h-9 mx-auto rounded-xl ${color} flex items-center justify-center mb-2`}>
              <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
        <h2 className="font-display text-base font-bold text-slate-900 mb-4">Edit Candidate Preferences</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Target Engineering Role</label>
            <input
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              placeholder="e.g. Full Stack Software Engineer"
              className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">University / Institution</label>
            <input
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              placeholder="e.g. National Institute of Technology"
              className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Target Graduation Batch Year</label>
            <input
              type="number"
              value={form.graduationYear}
              onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
              placeholder="e.g. 2025"
              min="2020" max="2030"
              className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
