import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import DashboardLayout from "../../components/layout/dashboard-layout";
import AppointmentBookingModal from "../../components/modals/appointment-booking-modal";
import { 
  User, 
  Calendar, 
  FileText, 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Search
} from "lucide-react";

interface Appointment {
  id: number;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
  timeSlot: string;
  reason: string;
  status: string;
  type: string;
  priority: string;
  symptoms: string;
  notes: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export default function PatientAppointments() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demo purposes
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        doctorName: "Dr. John Smith",
        doctorSpecialty: "Cardiology",
        hospitalName: "City General Hospital",
        appointmentDate: "2024-09-26T10:00:00Z",
        appointmentTime: "10:00 AM",
        timeSlot: "10:00-10:30",
        reason: "Regular checkup",
        status: "confirmed",
        type: "online",
        priority: "normal",
        symptoms: "None",
        notes: "First appointment",
        createdAt: "2024-09-25T08:00:00Z"
      },
      {
        id: 2,
        doctorName: "Dr. Sarah Johnson",
        doctorSpecialty: "Dermatology",
        hospitalName: "City General Hospital",
        appointmentDate: "2024-09-27T14:00:00Z",
        appointmentTime: "2:00 PM",
        timeSlot: "14:00-14:30",
        reason: "Skin consultation",
        status: "pending",
        type: "online",
        priority: "normal",
        symptoms: "Skin rash",
        notes: "Follow-up from previous visit",
        createdAt: "2024-09-24T10:00:00Z"
      },
      {
        id: 3,
        doctorName: "Dr. Michael Brown",
        doctorSpecialty: "Orthopedics",
        hospitalName: "City General Hospital",
        appointmentDate: "2024-09-20T09:00:00Z",
        appointmentTime: "9:00 AM",
        timeSlot: "09:00-09:30",
        reason: "Knee pain consultation",
        status: "completed",
        type: "online",
        priority: "normal",
        symptoms: "Knee pain",
        notes: "Completed successfully",
        createdAt: "2024-09-19T08:00:00Z",
        completedAt: "2024-09-20T09:30:00Z"
      },
      {
        id: 4,
        doctorName: "Dr. Emily Davis",
        doctorSpecialty: "Pediatrics",
        hospitalName: "City General Hospital",
        appointmentDate: "2024-09-18T11:00:00Z",
        appointmentTime: "11:00 AM",
        timeSlot: "11:00-11:30",
        reason: "Child vaccination",
        status: "cancelled",
        type: "online",
        priority: "normal",
        symptoms: "None",
        notes: "Cancelled by patient",
        createdAt: "2024-09-17T10:00:00Z",
        cancelledAt: "2024-09-18T08:00:00Z"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/patient",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Appointments",
      path: "/dashboard/patient/appointments",
      icon: <Calendar className="w-5 h-5" />,
      isActive: true,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const headerActions = (
    <Button 
      className="medical-blue text-white hover:bg-blue-700"
      onClick={() => setIsBookingModalOpen(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Book Appointment
    </Button>
  );

  return (
    <DashboardLayout
      title="My Appointments"
      subtitle="Manage your medical appointments"
      icon={<Calendar className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
      headerActions={headerActions}
    >
      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment: any) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 medical-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {appointment.doctorName?.charAt(0) || "D"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.doctorName}
                        </h3>
                        {getStatusIcon(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {appointment.doctorSpecialty} • {appointment.hospitalName}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        {appointment.reason}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.appointmentTime}
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(appointment.status)}
                    <div className="flex space-x-2">
                      {appointment.status === 'pending' && (
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                          Join Call
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
                
                {appointment.symptoms && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                    </p>
                  </div>
                )}
                
                {appointment.notes && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t booked any appointments yet'
              }
            </p>
            <Button 
              className="medical-blue text-white hover:bg-blue-700"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Book Your First Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      <AppointmentBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
