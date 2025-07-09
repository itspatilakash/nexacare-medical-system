import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import OtpVerification from "./pages/auth/otp-verification";
import HospitalDashboard from "./pages/dashboards/hospital-dashboard";
import DoctorDashboard from "./pages/dashboards/doctor-dashboard";
import PatientDashboard from "./pages/dashboards/patient-dashboard";
import LabDashboard from "./pages/dashboards/lab-dashboard";
import ReceptionistDashboard from "./pages/dashboards/receptionist-dashboard";
import NotFound from "./pages/not-found";
import { useEffect } from "react";
import { useLocation } from "wouter";
function ProtectedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [, setLocation] = useLocation();
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            setLocation('/login');
        }
        else if (!isLoading && isAuthenticated && allowedRoles && !allowedRoles.includes(user?.role || '')) {
            setLocation('/unauthorized');
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, setLocation]);
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue"></div>
      </div>);
    }
    if (!isAuthenticated) {
        return null;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
        return null;
    }
    return <>{children}</>;
}
function DashboardRouter() {
    const { user, isAuthenticated } = useAuth();
    const [, setLocation] = useLocation();
    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect to appropriate dashboard based on role
            switch (user.role) {
                case 'hospital':
                    setLocation('/dashboard/hospital');
                    break;
                case 'doctor':
                    setLocation('/dashboard/doctor');
                    break;
                case 'patient':
                    setLocation('/dashboard/patient');
                    break;
                case 'lab':
                    setLocation('/dashboard/lab');
                    break;
                case 'receptionist':
                    setLocation('/dashboard/receptionist');
                    break;
                default:
                    setLocation('/login');
            }
        }
    }, [isAuthenticated, user, setLocation]);
    return null;
}
function Router() {
    const { isAuthenticated } = useAuth();
    return (<Switch>
      {/* Auth routes */}
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard"/> : <Login />}
      </Route>
      <Route path="/register">
        {isAuthenticated ? <Redirect to="/dashboard"/> : <Register />}
      </Route>
      <Route path="/verify-otp" component={OtpVerification}/>

      {/* Dashboard redirect route */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardRouter />
        </ProtectedRoute>
      </Route>

      {/* Role-specific dashboard routes */}
      <Route path="/dashboard/hospital">
        <ProtectedRoute allowedRoles={['hospital']}>
          <HospitalDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/doctor">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/patient">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/lab">
        <ProtectedRoute allowedRoles={['lab']}>
          <LabDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/receptionist">
        <ProtectedRoute allowedRoles={['receptionist']}>
          <ReceptionistDashboard />
        </ProtectedRoute>
      </Route>

      {/* Root route */}
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard"/> : <Redirect to="/login"/>}
      </Route>

      {/* 404 */}
      <Route component={NotFound}/>
    </Switch>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
