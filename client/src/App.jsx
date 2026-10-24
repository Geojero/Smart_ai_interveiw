import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import LoginPage from './pages/LoginPage';
import StudentOverview from './pages/student/StudentOverview';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import ContinueLearning from './pages/student/ContinueLearning';
import LessonPage from './pages/student/LessonPage';
import DsaProblemList from './pages/student/DsaProblemList';
import DsaProblemSolver from './pages/student/DsaProblemSolver';
import MockInterview from './pages/student/MockInterview';
import StudentProfile from './pages/student/StudentProfile';
import AdminOverview from './pages/admin/AdminOverview';
import StudentManagement from './pages/admin/StudentManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ContentManagement from './pages/admin/ContentManagement';
import NotFound from './pages/NotFound';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

function App() {
  const dispatch = useDispatch();
  const { user, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} /> : <LoginPage />}
        />

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleRoute role="student">
                <StudentLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentOverview />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="learning" element={<ContinueLearning />} />
          <Route path="learning/lesson/:id" element={<LessonPage />} />
          <Route path="dsa" element={<DsaProblemList />} />
          <Route path="dsa/:slug" element={<DsaProblemSolver />} />
          <Route path="learning/dsa" element={<DsaProblemList />} />
          <Route path="learning/dsa/:slug" element={<DsaProblemSolver />} />
          <Route path="interview" element={<MockInterview />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="content" element={<ContentManagement />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Default redirects */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/login'} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
