import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState('student'); // 'student' | 'signup' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const isSignUp = authMode === 'signup';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleTabChange = (mode) => {
    setAuthMode(mode);
    dispatch(clearError());
    if (mode === 'admin') {
      setForm((prev) => ({ ...prev, email: 'admin@prepmate.com', password: 'Admin@123' }));
    } else if (mode === 'student') {
      setForm((prev) => ({ ...prev, email: 'arjun@example.com', password: 'Student@123' }));
    } else {
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!form.name.trim()) {
        toast.error('Please enter your full name');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
      if (registerUser.fulfilled.match(result)) {
        toast.success('Account created! Welcome to PrepMate 🚀');
        navigate('/student/dashboard');
      } else {
        toast.error(result.payload || 'Registration failed');
      }
    } else {
      const result = await dispatch(loginUser({ email: form.email, password: form.password }));
      if (loginUser.fulfilled.match(result)) {
        const user = result.payload;
        toast.success(`Welcome back, ${user.name}! 👋`);
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      } else {
        toast.error(result.payload || 'Invalid credentials');
      }
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') {
      setAuthMode('student');
      setForm({ name: '', email: 'arjun@example.com', password: 'Student@123', confirmPassword: '' });
    } else {
      setAuthMode('admin');
      setForm({ name: '', email: 'admin@prepmate.com', password: 'Admin@123', confirmPassword: '' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 font-sans text-slate-800 antialiased min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col w-full max-w-6xl mx-auto py-4">
        {/* Main Elevated Authentication Card */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-white border border-slate-200 text-slate-800">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            
            {/* LEFT COLUMN: Authentication Flow (7 Columns) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
              <div>
                {/* Brand Anchor & Security Badge */}
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                      <span className="material-symbols-outlined text-xl">terminal</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display text-xl font-bold text-slate-900 tracking-tight">PrepMate</span>
                      <span className="font-mono text-[11px] text-blue-600 uppercase tracking-widest font-semibold">Career Cockpit OS</span>
                    </div>
                  </div>
                  
                  {/* Role Routing Indicator Badge */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>
                      {authMode === 'admin' ? 'Admin Portal → /admin' : 'Students → /student/dashboard'}
                    </span>
                  </div>
                </div>

                {/* Mode Navigation Segmented Control */}
                <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 flex items-center gap-1 mb-7">
                  <button
                    type="button"
                    onClick={() => handleTabChange('student')}
                    className={`flex-1 py-2 px-3 rounded-lg text-center font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'student'
                        ? 'bg-white text-blue-600 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">school</span>
                    <span>Student Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('signup')}
                    className={`flex-1 py-2 px-3 rounded-lg text-center font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'signup'
                        ? 'bg-white text-blue-600 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    <span>Create Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('admin')}
                    className={`flex-1 py-2 px-3 rounded-lg text-center font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'admin'
                        ? 'bg-white text-blue-600 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">shield_person</span>
                    <span>Admin Portal</span>
                  </button>
                </div>

                {/* Section Headings */}
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                    {authMode === 'signup'
                      ? 'Create your candidate terminal'
                      : authMode === 'admin'
                      ? 'Sign in to administrative console'
                      : 'Sign in to your candidate terminal'}
                  </h1>
                  <p className="font-sans text-sm text-slate-500">
                    {authMode === 'signup'
                      ? 'Start your AI-evaluated interview preparation curriculum.'
                      : authMode === 'admin'
                      ? 'Manage cohorts, track rubric performance, and monitor assessments.'
                      : 'Continue your AI-evaluated interview preparation curriculum.'}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs font-medium">
                    <span className="material-symbols-outlined text-lg text-red-600 shrink-0">error</span>
                    <div className="flex-1">
                      <span className="font-bold block mb-0.5">Authentication Error</span>
                      <span>{error}</span>
                    </div>
                    <button type="button" onClick={() => dispatch(clearError())} className="text-red-700 hover:text-red-950">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}

                {/* Developer Demo Pill Row */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs text-slate-400 font-medium">Quick Demo:</span>
                  <button
                    type="button"
                    onClick={() => fillDemo('student')}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    ⚡ Arjun (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('admin')}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    🛡️ Admin
                  </button>
                </div>

                {/* Credential Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Full Name (Sign Up Only) */}
                  {isSignUp && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between" htmlFor="input-fullname">
                        <span>Candidate Full Name</span>
                        <span className="font-mono text-[11px] text-blue-600 font-semibold">Required</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-lg text-slate-400">badge</span>
                        <input
                          id="input-fullname"
                          name="name"
                          type="text"
                          required={isSignUp}
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Arjun Sharma"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-300 text-sm rounded-xl py-2.5 pl-11 pr-4 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between" htmlFor="input-email">
                      <span>{authMode === 'admin' ? 'Admin Institutional Email' : 'Candidate Work/Personal Email'}</span>
                      <span className="font-mono text-[11px] text-slate-400">user@institution.edu</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-lg text-slate-400">mail</span>
                      <input
                        id="input-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder={authMode === 'admin' ? 'admin@prepmate.com' : 'candidate@prepmate.ai'}
                        className="w-full bg-slate-50 text-slate-900 border border-slate-300 text-sm rounded-xl py-2.5 pl-11 pr-10 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      {form.email.includes('@') && form.email.includes('.') && (
                        <span className="material-symbols-outlined absolute right-3.5 text-base text-emerald-600">check_circle</span>
                      )}
                    </div>
                  </div>

                  {/* Password with Show/Hide toggle */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700" htmlFor="input-password">Access Secret / Password</label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => toast('Password recovery link available via your admin.', { icon: 'ℹ️' })}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-lg text-slate-400">key</span>
                      <input
                        id="input-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 text-slate-900 border border-slate-300 text-sm rounded-xl py-2.5 pl-11 pr-10 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition-colors flex items-center"
                      >
                        <span className="material-symbols-outlined text-base">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up Only) */}
                  {isSignUp && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                      <label className="text-xs font-semibold text-slate-700" htmlFor="input-confirm-password">Confirm Password</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-lg text-slate-400">lock_reset</span>
                        <input
                          id="input-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          required={isSignUp}
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-300 text-sm rounded-xl py-2.5 pl-11 pr-10 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Remember Me & Security Context */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" type="checkbox" />
                      <span className="text-xs text-slate-600">Remember session (30 days)</span>
                    </label>
                    <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <span className="material-symbols-outlined text-sm text-blue-600">lock</span>
                      <span>TLS 1.3 Strict</span>
                    </div>
                  </div>

                  {/* Primary Action Submit Button */}
                  <button
                    id="submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating Session...</span>
                      </>
                    ) : (
                      <>
                        <span>{isSignUp ? 'Initialize Candidate Account' : 'Authenticate Session'}</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Footer Security Indicators */}
              <div className="mt-8 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 sm:-mx-10 lg:-mx-12 -mb-6 sm:-mb-10 lg:-mb-12 px-6 sm:px-10 lg:px-12 py-3.5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">fingerprint</span>
                  <span>bcrypt-hashed & JWT secured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-sky-600">verified_user</span>
                  <span>Role-Based Access Control (RBAC)</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Feature Highlights & Telemetry (5 Columns) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 via-blue-50/70 to-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-200/40 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-sky-200/40 blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-sm text-blue-600">bolt</span>
                    <span>LIVE SYSTEM v2.4</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-medium text-slate-600">Gemini & Claude AI</span>
                  </div>
                </div>

                <h2 className="font-display text-xl font-bold text-slate-900 mb-2 tracking-tight">
                  Simulate real technical loops before the actual interview
                </h2>
                <p className="font-sans text-xs sm:text-sm text-slate-600 mb-6">
                  Benchmarked against hiring engineering rubrics from Tier-1 tech firms and high-velocity startups.
                </p>

                {/* Feature Highlight Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 flex items-start gap-3 shadow-xs">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                      <span className="material-symbols-outlined text-lg">neurology</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">AI Code & Verbal Feedback</span>
                        <span className="font-mono text-[11px] text-sky-700 font-semibold">&lt;140ms</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Sub-second AST code linting, complexity checks, and design evaluations.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 flex items-start gap-3 shadow-xs">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                      <span className="material-symbols-outlined text-lg">document_scanner</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">Instant ATS Scoring</span>
                        <span className="font-mono text-[11px] text-indigo-700 font-semibold">Parser v4.1</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Real-time keyword extraction vs. JD requirements with gap breakdown.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 flex items-start gap-3 shadow-xs">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                      <span className="material-symbols-outlined text-lg">mic</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">Live Mock Audio Simulator</span>
                        <span className="font-mono text-[11px] text-blue-700 font-semibold">WebRTC Core</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Realistic behavioral and technical interview questions with live feedback.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  PM
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Trusted by 10,000+ candidates</p>
                  <p className="text-[11px] text-slate-500">From Stanford, IIT, BITS, and top universities</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
