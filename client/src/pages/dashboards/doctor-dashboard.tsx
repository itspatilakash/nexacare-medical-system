import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/layout/dashboard-layout";
import { UserRound, Calendar, User, FileText, ClipboardList } from "lucide-react";

export default function DoctorDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
  queryKey: ['/api/dashboard/stats'],
  queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
});

  const { data: todayAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments/today'],
    queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),

  });

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/doctor",
      icon: <UserRound className="w-5 h-5" />,
      isActive: true,
    },
    {
      label: "Appointments",
      path: "/dashboard/doctor/appointments",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Patients",
      path: "/dashboard/doctor/patients",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/doctor/prescriptions",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Lab Reports",
      path: "/dashboard/doctor/lab-reports",
      icon: <ClipboardList className="w-5 h-5" />,
    },
  ];

  const headerActions = (
    <Button 
      className="medical-blue text-white hover:bg-blue-700"
      onClick={() => window.location.href = '/dashboard/doctor/prescriptions'}
    >
      New Prescription
    </Button>
  );

  return (
    <DashboardLayout
      title="Dr. Sarah Johnson"
      subtitle="Cardiology"
      icon={<UserRound className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
      headerActions={headerActions}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Today's Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.todayAppointments || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.totalPatients || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Prescriptions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.totalPrescriptions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
        </div>
        <CardContent className="p-6">
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : todayAppointments && todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment: any) => (
                <div key={appointment.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {appointment.patientName?.charAt(0) || "P"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.patientName || "Patient"}
                      </p>
                      <p className="text-sm text-medical-gray">
                        {appointment.reason || "Routine Checkup"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.appointmentTime}
                      </p>
                      <p className="text-sm text-medical-gray">30 min</p>
                    </div>
                    <Button size="sm" className="medical-blue hover:bg-blue-700">
                      Start Consultation
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-medical-gray">No appointments scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <FileText className="w-6 h-6 text-medical-blue" />
          <span className="text-sm font-medium">New Prescription</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <ClipboardList className="w-6 h-6 text-medical-green" />
          <span className="text-sm font-medium">Lab Orders</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <User className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium">Patient History</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <Calendar className="w-6 h-6 text-yellow-500" />
          <span className="text-sm font-medium">Schedule</span>
        </Button>
      </div>
    </DashboardLayout>
  );
}
