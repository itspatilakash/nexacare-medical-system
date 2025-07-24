import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/layout/dashboard-layout";
import AppointmentBookingModal from "../../components/modals/appointment-booking-modal";
import { User, Calendar, FileText, ClipboardList, MessageCircle } from "lucide-react";

export default function PatientDashboard() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments/my'],
    queryFn: () => fetch('/api/appointments/my').then(res => res.json()),
  });

  const { data: labReports, isLoading: labReportsLoading } = useQuery({
    queryKey: ['/api/lab-reports/my'],
    queryFn: () => fetch('/api/lab-reports/my').then(res => res.json()),
  });

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/patient",
      icon: <User className="w-5 h-5" />,
      isActive: true,
    },
    {
      label: "Appointments",
      path: "/dashboard/patient/appointments",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Medical Records",
      path: "/dashboard/patient/medical-records",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Lab Reports",
      path: "/dashboard/patient/lab-reports",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      label: "Profile",
      path: "/dashboard/patient/profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const headerActions = (
    <Button 
      className="medical-blue text-white hover:bg-blue-700"
      onClick={() => setIsBookingModalOpen(true)}
    >
      Book Appointment
    </Button>
  );

  const upcomingAppointments = appointments?.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date() && apt.status === 'scheduled'
  ) || [];

  return (
    <DashboardLayout
      title="John Smith"
      subtitle="Patient Portal"
      icon={<User className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
      headerActions={headerActions}
    >
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Upcoming Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.upcomingAppointments || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Prescriptions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.activePrescriptions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Lab Reports</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.labReports || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-200 hover:border-medical-blue hover:bg-blue-50"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Calendar className="w-8 h-8 text-medical-blue" />
              <span className="text-sm font-medium text-gray-900">Book Appointment</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-200 hover:border-medical-green hover:bg-green-50"
              onClick={() => window.location.href = '/dashboard/patient/prescriptions'}
            >
              <FileText className="w-8 h-8 text-medical-green" />
              <span className="text-sm font-medium text-gray-900">View Prescriptions</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50"
            >
              <ClipboardList className="w-8 h-8 text-purple-500" />
              <span className="text-sm font-medium text-gray-900">Download Reports</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-200 hover:border-yellow-500 hover:bg-yellow-50"
            >
              <MessageCircle className="w-8 h-8 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">Contact Doctor</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <CardContent className="p-6">
            {appointmentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 medical-green rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {appointment.doctorName?.charAt(0) || "D"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.doctorName || "Doctor"}
                        </p>
                        <p className="text-sm text-medical-gray">
                          {appointment.specialty || "General Medicine"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-medical-gray">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-medical-gray">No upcoming appointments</p>
                <Button 
                  className="mt-4 medical-blue hover:bg-blue-700"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  Book Your First Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Lab Reports */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Lab Reports</h3>
          </div>
          <CardContent className="p-6">
            {labReportsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : labReports && labReports.length > 0 ? (
              <div className="space-y-4">
                {labReports.slice(0, 5).map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {report.testName}
                        </p>
                        <p className="text-sm text-medical-gray">
                          {report.labName || "Lab Center"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(report.reportDate).toLocaleDateString()}
                      </p>
                      <Button size="sm" variant="link" className="text-medical-blue hover:text-blue-700 text-sm p-0 h-auto">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-medical-gray">No lab reports available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
