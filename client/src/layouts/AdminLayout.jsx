import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import toast from 'react-hot-toast';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Platform Overview', icon: 'space_dashboard' },
  { path: '/admin/students', label: 'Candidate Cohorts', icon: 'group' },
  { path: '/admin/content', label: 'Question Bank', icon: 'quiz' },
  { path: '/admin/analytics', label: 'AI Analytics', icon: 'analytics' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-surface-page">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white border-r border-slate-200 shadow-sm
                   transform transition-transform duration-300 lg:translate-x-0 lg:static
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-lg">rocket_launch</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-slate-900 text-lg leading-none">
              Prep<span className="text-brand-600">Mate</span>
            </h1>
            <p className="text-xs text-brand-600 mt-0.5 font-medium">Admin Console</p>
          </div>
        </div>

        {/* Admin info */}
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-brand-600 truncate font-medium">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-slate-200 space-y-2">
          <button onClick={() => dispatch(toggleTheme())} className="sidebar-item w-full">
            <span className="material-symbols-outlined text-lg">
              {mode === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="font-medium">{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <span className="material-symbols-outlined text-lg">logout</span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shadow-nav">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
          <span className="font-display font-bold text-slate-900">
            Prep<span className="text-brand-600">Mate</span> <span className="text-sm text-brand-600">Admin</span>
          </span>
          <button onClick={() => dispatch(toggleTheme())} className="p-2 text-slate-500 hover:text-slate-900">
            <span className="material-symbols-outlined text-xl">
              {mode === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-surface-page">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
