import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/layout/dashboard-layout";
import { Building2, UserRound, User, Calendar, FileText, Settings } from "lucide-react";
export default function HospitalDashboard() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['/api/dashboard/stats'],
        queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
    });
    const { data: appointments, isLoading: appointmentsLoading } = useQuery({
        queryKey: ['/api/appointments/my'],
        queryFn: () => fetch('/api/appointments/my').then(res => res.json()),
    });
    const navigationItems = [
        {
            label: "Dashboard",
            path: "/dashboard/hospital",
            icon: <Building2 className="w-5 h-5"/>,
            isActive: true,
        },
        {
            label: "Doctors",
            path: "/dashboard/hospital/doctors",
            icon: <UserRound className="w-5 h-5"/>,
        },
        {
            label: "Patients",
            path: "/dashboard/hospital/patients",
            icon: <User className="w-5 h-5"/>,
        },
        {
            label: "Appointments",
            path: "/dashboard/hospital/appointments",
            icon: <Calendar className="w-5 h-5"/>,
        },
        {
            label: "Lab Reports",
            path: "/dashboard/hospital/lab-reports",
            icon: <FileText className="w-5 h-5"/>,
        },
        {
            label: "Settings",
            path: "/dashboard/hospital/settings",
            icon: <Settings className="w-5 h-5"/>,
        },
    ];
    return (<DashboardLayout title="City General Hospital" subtitle="Hospital Administrator" icon={<Building2 className="w-6 h-6 text-white"/>} navigationItems={navigationItems}>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <UserRound className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Doctors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.doctorsCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <User className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.patientsCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-white"/>
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
              <div className="bg-purple-500 rounded-lg p-3">
                <FileText className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.totalAppointments || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
          </div>
          <CardContent className="p-6">
            {appointmentsLoading ? (<div className="space-y-3">
                {[1, 2, 3].map((i) => (<div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>))}
              </div>) : appointments && appointments.length > 0 ? (<div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (<div key={appointment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {appointment.patientName?.charAt(0) || "P"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.patientName || "Patient"}
                        </p>
                        <p className="text-sm text-medical-gray">
                          {appointment.reason || "Appointment"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.appointmentTime}
                      </p>
                      <p className="text-sm text-medical-gray">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>))}
              </div>) : (<div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
                <p className="text-medical-gray">No appointments found</p>
              </div>)}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <UserRound className="w-5 h-5 mr-3"/>
                Add New Doctor
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="w-5 h-5 mr-3"/>
                Register Patient
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-5 h-5 mr-3"/>
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-5 h-5 mr-3"/>
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>);
}
