import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    const redirect = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RoleRoute;
