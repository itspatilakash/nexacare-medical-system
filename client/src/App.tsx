import React from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/use-auth';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

// Import pages
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import OtpVerification from './pages/auth/otp-verification';
import PatientDashboard from './pages/dashboards/patient-dashboard';
import PatientAppointments from './pages/dashboards/patient-appointments';
import DoctorDashboard from './pages/dashboards/doctor-dashboard';
import DoctorAppointments from './pages/dashboards/doctor-appointments';
import HospitalDashboard from './pages/dashboards/hospital-dashboard';
import LabDashboard from './pages/dashboards/lab-dashboard';
import ReceptionistDashboard from './pages/dashboards/receptionist-dashboard';
import NotFound from './pages/not-found';

// Create a client
const queryClient = new QueryClient();

// Dashboard redirect component
function DashboardRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  // Redirect based on user role
  switch (user.role) {
    case 'patient':
      return <Redirect to="/dashboard/patient" />;
    case 'doctor':
      return <Redirect to="/dashboard/doctor" />;
    case 'hospital':
      return <Redirect to="/dashboard/hospital" />;
    case 'lab':
      return <Redirect to="/dashboard/lab" />;
    case 'receptionist':
      return <Redirect to="/dashboard/receptionist" />;
    default:
      return <Redirect to="/dashboard/patient" />;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Switch>
              {/* Auth Routes */}
              <Route path="/" component={Login} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/otp-verification" component={OtpVerification} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" component={DashboardRedirect} />
              <Route path="/dashboard/patient" component={PatientDashboard} />
              <Route path="/dashboard/patient/appointments" component={PatientAppointments} />
              <Route path="/dashboard/doctor" component={DoctorDashboard} />
              <Route path="/dashboard/doctor/appointments" component={DoctorAppointments} />
              <Route path="/dashboard/hospital" component={HospitalDashboard} />
              <Route path="/dashboard/lab" component={LabDashboard} />
              <Route path="/dashboard/receptionist" component={ReceptionistDashboard} />
              
              {/* Catch all route */}
              <Route component={NotFound} />
            </Switch>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;