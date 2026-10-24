import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/student/dashboard', label: 'Student Dashboard', icon: 'dashboard' },
  { path: '/student/resume', label: 'Resume Analyzer', icon: 'description' },
  { path: '/student/learning', label: 'Continue Learning', icon: 'school' },
  { path: '/student/dsa', label: 'DSA Practice', icon: 'bolt' },
  { path: '/student/interview', label: 'Mock Interview', icon: 'mic' },
];

const StudentLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-page">
      {/* Fixed Top Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-nav">
        <div className="h-16 w-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <NavLink to="/student/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-lg">rocket_launch</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                Prep<span className="text-brand-600">Mate</span>
              </span>
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {/* <NavLink
                to="/admin/dashboard"
                className="nav-link text-slate-400 hover:text-slate-600"
              >
                Admin Console
              </NavLink> */}
            </nav>
          </div>

          {/* Right: Search + Actions + Profile */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-base">search</span>
              <span className="text-sm">Search prompts, topics...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[11px] border border-slate-300">⌘K</kbd>
            </button>

            {/* AI Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700">
              <span className="material-symbols-outlined text-sm text-brand-600">auto_awesome</span>
              <span className="font-mono text-[11px] tracking-wider uppercase font-semibold">AI v2.4</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Theme Switcher"
            >
              <span className="material-symbols-outlined text-xl">
                {mode === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors" aria-label="Notifications">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white"></span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Profile */}
            <div className="relative flex items-center gap-2">
              <span className="hidden sm:flex items-center px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-mono text-[11px] font-semibold tracking-wide uppercase">
                Student
              </span>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-brand-500/30">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="material-symbols-outlined text-slate-500 text-base">expand_more</span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <NavLink
                      to="/student/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">person</span>
                      Profile Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 shadow-lg animate-slide-up">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16 min-h-screen">
        <div className="w-full px-6 py-6 max-w-[1440px] mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8">
        <div className="w-full px-6 max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900">
              Prep<span className="text-brand-600">Mate</span>
            </span>
            <span className="text-slate-400 text-sm">— AI-Powered Technical Interview Calibration Engine</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a className="hover:text-slate-900 transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-slate-900 transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-slate-900 transition-colors" href="#">API Status</a>
            <a className="hover:text-slate-900 transition-colors" href="#">System Diagnostics</a>
          </div>
          <div className="font-mono text-xs text-slate-400">© 2025 PrepMate Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
