import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import DashboardLayout from "../../components/layout/dashboard-layout";
import { 
  User, 
  Calendar, 
  FileText, 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Users,
  Stethoscope
} from "lucide-react";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demo purposes
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        patientName: "Jane Doe",
        patientAge: 28,
        patientGender: "Female",
        appointmentDate: "2024-09-26T10:00:00Z",
        appointmentTime: "10:00 AM",
        timeSlot: "10:00-10:30",
        reason: "Regular checkup",
        status: "confirmed",
        type: "online",
        priority: "normal",
        symptoms: "None",
        notes: "First appointment",
        medicalHistory: "No significant medical history",
        allergies: "None known",
        createdAt: "2024-09-25T08:00:00Z"
      },
      {
        id: 2,
        patientName: "John Smith",
        patientAge: 45,
        patientGender: "Male",
        appointmentDate: "2024-09-26T11:00:00Z",
        appointmentTime: "11:00 AM",
        timeSlot: "11:00-11:30",
        reason: "Chest pain consultation",
        status: "pending",
        type: "online",
        priority: "high",
        symptoms: "Chest pain, shortness of breath",
        notes: "Urgent consultation needed",
        medicalHistory: "Hypertension, diabetes",
        allergies: "Penicillin",
        createdAt: "2024-09-25T09:00:00Z"
      },
      {
        id: 3,
        patientName: "Sarah Wilson",
        patientAge: 32,
        patientGender: "Female",
        appointmentDate: "2024-09-25T14:00:00Z",
        appointmentTime: "2:00 PM",
        timeSlot: "14:00-14:30",
        reason: "Follow-up consultation",
        status: "completed",
        type: "online",
        priority: "normal",
        symptoms: "Headache",
        notes: "Follow-up from previous visit",
        medicalHistory: "Migraine history",
        allergies: "None known",
        createdAt: "2024-09-24T10:00:00Z",
        completedAt: "2024-09-25T14:30:00Z"
      },
      {
        id: 4,
        patientName: "Mike Johnson",
        patientAge: 55,
        patientGender: "Male",
        appointmentDate: "2024-09-24T09:00:00Z",
        appointmentTime: "9:00 AM",
        timeSlot: "09:00-09:30",
        reason: "Blood pressure check",
        status: "completed",
        type: "online",
        priority: "normal",
        symptoms: "High blood pressure",
        notes: "Routine checkup",
        medicalHistory: "Hypertension, heart disease",
        allergies: "None known",
        createdAt: "2024-09-23T08:00:00Z",
        completedAt: "2024-09-24T09:30:00Z"
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
      path: "/dashboard/doctor",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Appointments",
      path: "/dashboard/doctor/appointments",
      icon: <Calendar className="w-5 h-5" />,
      isActive: true,
    },
    {
      label: "Patients",
      path: "/dashboard/doctor/patients",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/doctor/prescriptions",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Profile",
      path: "/dashboard/doctor/profile",
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

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      normal: "bg-green-100 text-green-800",
      low: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={`${variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmAppointment = (appointmentId: number) => {
    setAppointments((prev: any[]) => 
      prev.map((apt: any) => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : apt
      )
    );
  };

  const handleCompleteAppointment = (appointmentId: number) => {
    setAppointments((prev: any[]) => 
      prev.map((apt: any) => 
        apt.id === appointmentId 
          ? { ...apt, status: 'completed', completedAt: new Date().toISOString() }
          : apt
      )
    );
  };

  return (
    <DashboardLayout
      title="My Appointments"
      subtitle="Manage your patient appointments"
      icon={<Calendar className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
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
                  placeholder="Search patients or appointments..."
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
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('confirmed')}
              >
                Confirmed
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
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
                    <div className="w-12 h-12 medical-green rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {appointment.patientName?.charAt(0) || "P"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patientName}
                        </h3>
                        {getStatusIcon(appointment.status)}
                        {getPriorityBadge(appointment.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {appointment.patientAge} years old • {appointment.patientGender}
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
                        <Button 
                          size="sm" 
                          className="medical-green text-white hover:bg-green-700"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                        >
                          Confirm
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Start Call
                          </Button>
                          <Button 
                            size="sm" 
                            className="medical-blue text-white hover:bg-blue-700"
                            onClick={() => handleCompleteAppointment(appointment.id)}
                          >
                            Complete
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
                
                {appointment.symptoms && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                    </p>
                  </div>
                )}
                
                {appointment.medicalHistory && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Medical History:</span> {appointment.medicalHistory}
                    </p>
                  </div>
                )}
                
                {appointment.allergies && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Allergies:</span> {appointment.allergies}
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
                : 'You don\'t have any appointments scheduled'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
