import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import DashboardLayout from "../../components/layout/dashboard-layout";
import AppointmentBookingModal from "../../components/modals/appointment-booking-modal";
import { Users, Calendar, UserPlus, Clock, Phone, Settings } from "lucide-react";

export default function ReceptionistDashboard() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments/my'],
  });

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/receptionist",
      icon: <Users className="w-5 h-5" />,
      isActive: true,
    },
    {
      label: "Appointments",
      path: "/dashboard/receptionist/appointments",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Walk-in Registration",
      path: "/dashboard/receptionist/walk-in",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      label: "Patient Check-in",
      path: "/dashboard/receptionist/check-in",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Contact Directory",
      path: "/dashboard/receptionist/contacts",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      label: "Settings",
      path: "/dashboard/receptionist/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const headerActions = (
    <div className="flex space-x-2">
      <Button 
        variant="outline"
        onClick={() => setIsBookingModalOpen(true)}
      >
        Walk-in Appointment
      </Button>
      <Button className="medical-blue text-white hover:bg-blue-700">
        Register Patient
      </Button>
    </div>
  );

  const todayAppointments = appointments?.filter((apt: any) => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-medical-green text-white';
      case 'scheduled':
        return 'bg-medical-blue text-white';
      case 'cancelled':
        return 'bg-medical-red text-white';
      case 'no-show':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  return (
    <DashboardLayout
      title="Reception Desk"
      subtitle="City General Hospital"
      icon={<Users className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
      headerActions={headerActions}
    >
      {/* Reception Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Today's Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : todayAppointments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Walk-ins Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.walkinsToday || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Waiting Patients</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.waitingPatients || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <Users className="w-6 h-6 text-white" />
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
      </div>

      {/* Today's Schedule */}
      <Card className="mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointment Schedule</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Refresh
              </Button>
              <Button 
                size="sm" 
                className="medical-blue hover:bg-blue-700"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Add Walk-in
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
          ) : todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments
                .sort((a: any, b: any) => a.appointmentTime.localeCompare(b.appointmentTime))
                .map((appointment: any) => (
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
                          Dr. {appointment.doctorName || "Doctor"} - {appointment.reason}
                        </p>
                        <p className="text-xs text-medical-gray">
                          Type: {appointment.type === 'walk-in' ? 'Walk-in' : 'Scheduled'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.appointmentTime}
                        </p>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        {appointment.status === 'scheduled' && (
                          <Button size="sm" className="medical-green hover:bg-green-600">
                            Check In
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-medical-gray">No appointments scheduled for today</p>
              <Button 
                className="mt-4 medical-blue hover:bg-blue-700"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Schedule First Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => setIsBookingModalOpen(true)}
        >
          <UserPlus className="w-6 h-6 text-medical-blue" />
          <span className="text-sm font-medium">Walk-in Registration</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Clock className="w-6 h-6 text-medical-green" />
          <span className="text-sm font-medium">Patient Check-in</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Calendar className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium">View Schedule</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Phone className="w-6 h-6 text-yellow-500" />
          <span className="text-sm font-medium">Contact Directory</span>
        </Button>
      </div>

      <AppointmentBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        isWalkIn={true}
      />
    </DashboardLayout>
  );
}
