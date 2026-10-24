import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/Skeleton';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'roles'
  const [topics, setTopics] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Topic Form state
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicForm, setTopicForm] = useState({
    title: '',
    track: 'dsa',
    order: 1,
    icon: '📚',
    description: '',
  });

  // Role Form state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({
    title: '',
    requiredSkills: '',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [topicsRes, rolesRes] = await Promise.all([
        api.get('/learning/topics'),
        api.get('/admin/roles'),
      ]);
      setTopics(topicsRes.data.data || []);
      setRoles(rolesRes.data.data || []);
    } catch {
      toast.error('Failed to load content data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle create Topic
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.title.trim()) {
      return toast.error('Topic title is required');
    }
    try {
      await api.post('/admin/topics', {
        ...topicForm,
        order: Number(topicForm.order) || 1,
      });
      toast.success('Topic created successfully');
      setShowTopicModal(false);
      setTopicForm({ title: '', track: 'dsa', order: topics.length + 1, icon: '📚', description: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create topic');
    }
  };

  // Handle delete Topic
  const handleDeleteTopic = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete topic "${title}"?`)) return;
    try {
      await api.delete(`/admin/topics/${id}`);
      toast.success('Topic deleted');
      setTopics((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    }
  };

  // Handle create Job Role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleForm.title.trim()) {
      return toast.error('Role title is required');
    }
    const skillsArray = roleForm.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await api.post('/admin/roles', {
        title: roleForm.title.trim(),
        description: roleForm.description.trim(),
        requiredSkills: skillsArray,
      });
      toast.success('Job role created successfully');
      setShowRoleModal(false);
      setRoleForm({ title: '', requiredSkills: '', description: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job role');
    }
  };

  // Handle delete Job Role
  const handleDeleteRole = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete role "${title}"?`)) return;
    try {
      await api.delete(`/admin/roles/${id}`);
      toast.success('Job role deleted');
      setRoles((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job role');
    }
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.track?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRoles = roles.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.requiredSkills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📚</span> Content & Curriculum Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Add and manage learning tracks, topic modules, and industry job roles
          </p>
        </div>

        <button
          onClick={() => (activeTab === 'topics' ? setShowTopicModal(true) : setShowRoleModal(true))}
          className="btn-brand text-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>➕</span>
          <span>{activeTab === 'topics' ? 'Add Topic' : 'Add Job Role'}</span>
        </button>
      </div>

      {/* Tabs and Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('topics');
              setSearch('');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'topics'
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-brand'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📦 Curriculum Topics ({topics.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('roles');
              setSearch('');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'roles'
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-brand'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💼 Target Job Roles ({roles.length})
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field py-2 text-sm"
          />
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : activeTab === 'topics' ? (
        /* Topics Tab */
        filteredTopics.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No Topics Found"
            description="Create topics to structure your DSA or IT learning tracks."
            action={{ label: 'Add First Topic', onClick: () => setShowTopicModal(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic._id}
                className="glass-card p-5 flex flex-col justify-between hover:border-brand-500/30 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl p-2 rounded-xl bg-white/5">{topic.icon || '📚'}</span>
                    <span
                      className={`badge ${
                        topic.track === 'dsa' ? 'badge-brand' : 'badge-warning'
                      } uppercase tracking-wider text-[10px] font-bold`}
                    >
                      {topic.track}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{topic.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {topic.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-400">
                  <span>Order: #{topic.order}</span>
                  <button
                    onClick={() => handleDeleteTopic(topic._id, topic.title)}
                    className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                    title="Delete Topic"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Job Roles Tab */
        filteredRoles.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No Job Roles Found"
            description="Add job roles to match resumes and generate tailored interview simulations."
            action={{ label: 'Add Job Role', onClick: () => setShowRoleModal(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <div
                key={role._id}
                className="glass-card p-5 flex flex-col justify-between hover:border-brand-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{role.title}</h3>
                    <button
                      onClick={() => handleDeleteRole(role._id, role.title)}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                      title="Delete Role"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{role.description}</p>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Target Skills ({role.requiredSkills?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(role.requiredSkills || []).map((skill, i) => (
                        <span key={i} className="badge badge-brand text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 bg-[#131326] border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>➕</span> Add Curriculum Topic
            </h2>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Track</label>
                  <select
                    value={topicForm.track}
                    onChange={(e) => setTopicForm({ ...topicForm, track: e.target.value })}
                    className="input-field text-sm bg-[#1a1a2e]"
                  >
                    <option value="dsa">DSA</option>
                    <option value="it">IT & CS Core</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={topicForm.order}
                    onChange={(e) => setTopicForm({ ...topicForm, order: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Icon Emoji</label>
                <input
                  type="text"
                  placeholder="e.g. ⚡"
                  value={topicForm.icon}
                  onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of concepts covered..."
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-brand text-sm py-2 px-5">
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 bg-[#131326] border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💼</span> Add Job Role
            </h2>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Engineer"
                  value={roleForm.title}
                  onChange={(e) => setRoleForm({ ...roleForm, title: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  Required Skills (comma separated)
                </label>
                <textarea
                  rows="3"
                  placeholder="AWS, Docker, Kubernetes, Linux, Terraform"
                  value={roleForm.requiredSkills}
                  onChange={(e) => setRoleForm({ ...roleForm, requiredSkills: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Role description..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-brand text-sm py-2 px-5">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
