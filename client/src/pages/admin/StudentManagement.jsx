import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchStudents = async (pg = 1, q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 10 });
      if (q) params.set('search', q);
      const { data } = await api.get(`/admin/students?${params}`);
      setStudents(data.data.students);
      setTotal(data.data.total);
      setPages(data.data.pages);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents(1, search);
  };

  const toggleStatus = async (id, currentStatus) => {
    setToggling(id);
    try {
      await api.patch(`/admin/students/${id}/toggle-status`);
      setStudents((prev) => prev.map((s) => s._id === id ? { ...s, isActive: !s.isActive } : s));
      toast.success(`Student ${currentStatus ? 'deactivated' : 'activated'}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  const viewStudent = async (student) => {
    setSelectedStudent(student);
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/admin/students/${student._id}`);
      setStudentDetail(data.data);
    } catch {
      toast.error('Failed to load student details');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Management</h1>
          <p className="text-gray-400 mt-1">{total} students registered</p>
        </div>
        <a href="/api/admin/export-csv" className="btn-secondary text-sm flex items-center gap-2">
          📥 Export CSV
        </a>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-brand px-6">Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setPage(1); fetchStudents(1, ''); }} className="btn-secondary px-4">
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : students.length === 0 ? (
          <div className="p-6"><EmptyState icon="👥" title="No students found" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Student', 'Email', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                          {student.name[0]}
                        </div>
                        <span className="font-medium text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge px-3 py-1 text-xs ${student.isActive ? 'bg-success-500/20 text-success-400' : 'bg-accent-500/20 text-accent-400'}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => viewStudent(student)} className="text-xs text-brand-400 hover:text-brand-300 px-3 py-1 rounded-lg border border-brand-500/30 hover:border-brand-500 transition-all">
                          View
                        </button>
                        <button
                          onClick={() => toggleStatus(student._id, student.isActive)}
                          disabled={toggling === student._id}
                          className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                            student.isActive
                              ? 'text-accent-400 border-accent-500/30 hover:border-accent-500'
                              : 'text-success-400 border-success-500/30 hover:border-success-500'
                          }`}
                        >
                          {toggling === student._id ? '...' : student.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-white/10">
            <p className="text-sm text-gray-400">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedStudent(null)}>
          <div className="glass-card w-full max-w-lg mx-4 p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white text-lg">{selectedStudent.name}</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            {detailLoading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
            ) : studentDetail && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Target Role', value: studentDetail.profile?.targetRole || '-' },
                    { label: 'College', value: studentDetail.profile?.college || '-' },
                    { label: 'Streak', value: `${studentDetail.profile?.streak || 0} days 🔥` },
                    { label: 'Interviews', value: studentDetail.profile?.interviewsPracticed || 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-white/5 rounded-xl">
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-medium text-white mt-1">{value}</p>
                    </div>
                  ))}
                </div>
                {studentDetail.profile?.skillScores && (
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-3">Skill Scores</p>
                    <div className="space-y-2">
                      {Object.entries(studentDetail.profile.skillScores).map(([skill, score]) => (
                        <div key={skill}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400 capitalize">{skill}</span>
                            <span className="text-white">{score}%</span>
                          </div>
                          <div className="progress-bar h-1.5">
                            <div className="progress-fill" style={{ width: `${score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {studentDetail.recentActivity?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">Recent Activity</p>
                    <div className="space-y-2">
                      {studentDetail.recentActivity.map((act, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400 p-2 bg-white/5 rounded-lg">
                          <span>{act.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
