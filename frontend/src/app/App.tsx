import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/auth-context';
import { RoleGuard } from '../guards/RoleGuard';
import { getRoleHomePath } from '../guards/permissions';

// Landing  Page
import { LandingPage as NewLandingPage } from './pages/LandingPage';

// Auth pages
import { SignInPage } from './auth/sign-in-page';
import { SignUpPage } from './auth/sign-up-page';
import { RoleSelectionPage } from './auth/role-selection-page';

// Customer Module
import { CustomerDashboard } from '../modules/customer/pages/CustomerDashboard';
import { AIEstimatorPage } from '../modules/customer/pages/AIEstimatorPage';
import { AgriculturePage } from '../modules/customer/pages/AgriculturePage';

// Organization Module
import { OrganizationDashboard } from '../modules/organization/pages/OrganizationDashboard';

// Provider Module
import { ProviderDashboard } from '../modules/provider/pages/ProviderDashboard';

// Admin Module
import { AdminDashboard } from '../modules/admin/pages/AdminDashboard';

// Layout
import { DashboardLayout } from '../shared/components/layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />

        {/* Customer Module - Protected */}
        <Route
          path="/customer/dashboard"
          element={
            <RoleGuard allowedRoles={['customer', 'admin']}>
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/customer/estimator"
          element={
            <RoleGuard allowedRoles={['customer', 'admin']}>
              <DashboardLayout>
                <AIEstimatorPage />
              </DashboardLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/customer/agriculture"
          element={
            <RoleGuard allowedRoles={['customer', 'admin']}>
              <DashboardLayout>
                <AgriculturePage />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        {/* Organization Module - Protected */}
        <Route
          path="/organization/dashboard"
          element={
            <RoleGuard allowedRoles={['organization', 'admin']}>
              <DashboardLayout>
                <OrganizationDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        {/* Provider Module - Protected */}
        <Route
          path="/provider/dashboard"
          element={
            <RoleGuard allowedRoles={['provider', 'admin']}>
              <DashboardLayout>
                <ProviderDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        {/* Admin Module - Protected (Admin only) */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </RoleGuard>
          }
        />

        {/* Catch-all redirect based on auth status */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

// Landing Page Component with redirect logic
function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return <NewLandingPage />;
}

// 404 Redirect Component
function NotFoundRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return <Navigate to="/" replace />;
}

export default App;