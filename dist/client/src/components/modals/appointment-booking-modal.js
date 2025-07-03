import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { X, MapPin, Stethoscope, IndianRupee, Calendar, AlertCircle } from "lucide-react";
// Generate time slots from 10 AM to 8 PM with 30-minute intervals, excluding 1-2 PM lunch
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour < 20; hour++) {
        if (hour === 13)
            continue; // Skip lunch hour
        slots.push(`${hour.toString().padStart(2, '0')}:00-${hour.toString().padStart(2, '0')}:30`);
        if (hour !== 19) {
            slots.push(`${hour.toString().padStart(2, '0')}:30-${(hour + 1).toString().padStart(2, '0')}:00`);
        }
    }
    return slots;
};
export default function AppointmentBookingModal({ isOpen, onClose, isWalkIn = false }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1); // 1: Hospital, 2: Doctor, 3: Slot, 4: Details
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [appointmentDetails, setAppointmentDetails] = useState({
        reason: "",
        symptoms: "",
        priority: "normal",
    });
    // Get available hospitals
    const { data: hospitals, isLoading: hospitalsLoading } = useQuery({
        queryKey: ['/api/hospitals/list'],
        enabled: isOpen,
    });
    // Get doctors by selected hospital
    const { data: doctors, isLoading: doctorsLoading } = useQuery({
        queryKey: ['/api/doctors/by-hospital', selectedHospital?.id],
        enabled: !!selectedHospital && isOpen,
    });
    // Get available slots for selected doctor and date
    const { data: doctorAvailability, isLoading: slotsLoading } = useQuery({
        queryKey: ['/api/doctors/availability', selectedDoctor?.id, selectedDate],
        enabled: !!selectedDoctor && !!selectedDate && isOpen,
    });
    const createAppointmentMutation = useMutation({
        mutationFn: async (appointmentData) => {
            const response = await apiRequest('/api/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
            });
            return response;
        },
        onSuccess: () => {
            toast({
                title: "Appointment Request Sent",
                description: "Your appointment request has been sent to the receptionist for confirmation. You'll receive a notification once confirmed.",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/appointments/my'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
            resetForm();
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Booking Failed",
                description: error.message || "Failed to book appointment",
                variant: "destructive",
            });
        },
    });
    const resetForm = () => {
        setStep(1);
        setSelectedHospital(null);
        setSelectedDoctor(null);
        setSelectedDate("");
        setSelectedSlot("");
        setAppointmentDetails({
            reason: "",
            symptoms: "",
            priority: "normal",
        });
    };
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };
    const getAvailableSlots = () => {
        if (doctorAvailability?.availableSlots) {
            return doctorAvailability.availableSlots;
        }
        return generateTimeSlots();
    };
    const handleSubmit = () => {
        if (!selectedHospital || !selectedDoctor || !selectedDate || !selectedSlot || !appointmentDetails.reason) {
            toast({
                title: "Missing Information",
                description: "Please complete all required fields",
                variant: "destructive",
            });
            return;
        }
        const appointmentDateTime = new Date(`${selectedDate}T${selectedSlot.split('-')[0]}`);
        const appointmentData = {
            hospitalId: selectedHospital.id,
            doctorId: selectedDoctor.id,
            appointmentDate: appointmentDateTime.toISOString(),
            appointmentTime: selectedSlot.split('-')[0],
            timeSlot: selectedSlot,
            reason: appointmentDetails.reason,
            symptoms: appointmentDetails.symptoms,
            priority: appointmentDetails.priority,
            type: isWalkIn ? 'walk-in' : 'online',
            status: 'pending', // Will be confirmed by receptionist
        };
        createAppointmentMutation.mutate(appointmentData);
    };
    // Render step content
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (<div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Hospital</h3>
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {hospitalsLoading ? (<div className="text-center py-4">Loading hospitals...</div>) : hospitals && hospitals.length > 0 ? (hospitals.map((hospital) => (<Card key={hospital.id} className={`cursor-pointer border-2 transition-colors ${selectedHospital?.id === hospital.id
                            ? 'border-medical-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedHospital(hospital)}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-medical-blue mt-1"/>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                          <p className="text-sm text-gray-600">{hospital.city}, {hospital.state}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary">{hospital.totalBeds} beds</Badge>
                            {hospital.emergencyServices && (<Badge variant="outline" className="text-red-600">24x7 Emergency</Badge>)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>))) : (<div className="text-center py-4 text-gray-500">No hospitals available</div>)}
            </div>
          </div>);
            case 2:
                return (<div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <h3 className="text-lg font-medium text-gray-900">Select Doctor</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{selectedHospital?.name}</strong> - {selectedHospital?.city}
              </p>
            </div>
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {doctorsLoading ? (<div className="text-center py-4">Loading doctors...</div>) : doctors && doctors.length > 0 ? (doctors.map((doctor) => (<Card key={doctor.id} className={`cursor-pointer border-2 transition-colors ${selectedDoctor?.id === doctor.id
                            ? 'border-medical-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedDoctor(doctor)}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Stethoscope className="w-5 h-5 text-medical-blue mt-1"/>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{doctor.user?.fullName}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary">{doctor.experience} years exp</Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <IndianRupee className="w-4 h-4"/>
                              {doctor.consultationFee}
                            </div>
                            <Badge variant={doctor.status === 'in' ? 'default' : 'outline'} className={doctor.status === 'in' ? 'bg-green-100 text-green-800' : ''}>
                              {doctor.status === 'in' ? 'Available' : 'Busy'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>))) : (<div className="text-center py-4 text-gray-500">No doctors available</div>)}
            </div>
          </div>);
            case 3:
                return (<div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                ← Back
              </Button>
              <h3 className="text-lg font-medium text-gray-900">Select Date & Time</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{selectedDoctor?.user?.fullName}</strong> - {selectedDoctor?.specialty}
              </p>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getTomorrowDate()} className="w-full"/>
            </div>

            {selectedDate && (<div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Time Slots *
                </Label>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {getAvailableSlots().map((slot) => (<Button key={slot} type="button" variant={selectedSlot === slot ? "default" : "outline"} size="sm" className={`text-xs ${selectedSlot === slot
                                ? "bg-medical-blue text-white"
                                : "border-gray-300 hover:border-medical-blue"}`} onClick={() => setSelectedSlot(slot)}>
                      {slot}
                    </Button>))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Lunch break: 1:00 PM - 2:00 PM (Not available)
                </p>
              </div>)}
          </div>);
            case 4:
                return (<div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                ← Back
              </Button>
              <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg space-y-1">
              <p className="text-sm"><strong>Hospital:</strong> {selectedHospital?.name}</p>
              <p className="text-sm"><strong>Doctor:</strong> {selectedDoctor?.user?.fullName}</p>
              <p className="text-sm"><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Time:</strong> {selectedSlot}</p>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </Label>
              <Select value={appointmentDetails.priority} onValueChange={(value) => setAppointmentDetails(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit *
              </Label>
              <Textarea value={appointmentDetails.reason} onChange={(e) => setAppointmentDetails(prev => ({ ...prev, reason: e.target.value }))} placeholder="Brief description of your concern..." className="w-full" rows={3} required/>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms (Optional)
              </Label>
              <Textarea value={appointmentDetails.symptoms} onChange={(e) => setAppointmentDetails(prev => ({ ...prev, symptoms: e.target.value }))} placeholder="Describe any symptoms you're experiencing..." className="w-full" rows={2}/>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5"/>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Appointment Confirmation Process</p>
                  <p>Your appointment request will be sent to the hospital receptionist for confirmation. You'll receive a notification once it's approved.</p>
                </div>
              </div>
            </div>
          </div>);
            default:
                return null;
        }
    };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-medical-blue"/>
              <DialogTitle>
                {isWalkIn ? "Register Walk-in Appointment" : "Book Appointment"}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6"/>
            </Button>
          </div>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3, 4].map((stepNumber) => (<div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                ? 'bg-medical-blue text-white'
                : 'bg-gray-200 text-gray-600'}`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (<div className={`w-12 h-1 ${step > stepNumber ? 'bg-medical-blue' : 'bg-gray-200'}`}/>)}
            </div>))}
        </div>

        {/* Step content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <div className="flex space-x-2">
            {step < 4 && (<Button type="button" onClick={() => {
                if (step === 1 && selectedHospital)
                    setStep(2);
                else if (step === 2 && selectedDoctor)
                    setStep(3);
                else if (step === 3 && selectedDate && selectedSlot)
                    setStep(4);
            }} disabled={(step === 1 && !selectedHospital) ||
                (step === 2 && !selectedDoctor) ||
                (step === 3 && (!selectedDate || !selectedSlot))} className="medical-blue text-white hover:bg-blue-700">
                Next →
              </Button>)}
            
            {step === 4 && (<Button type="button" onClick={handleSubmit} disabled={createAppointmentMutation.isPending || !appointmentDetails.reason} className="medical-green text-white hover:bg-green-700">
                {createAppointmentMutation.isPending
                ? "Booking..."
                : "Confirm Appointment"}
              </Button>)}
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}
