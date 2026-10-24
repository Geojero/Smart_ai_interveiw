import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const { user } = useSelector((state) => state.auth);
  const homePath = user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : '/student/dashboard'
    : '/login';

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-6 text-center">
      <div className="glass-card max-w-md w-full p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="text-7xl font-black bg-gradient-to-r from-brand-400 via-indigo-300 to-accent-400 bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            The page you are looking for doesn't exist or has been moved to another location.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link to={homePath} className="btn-brand text-sm px-6 py-2.5">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
