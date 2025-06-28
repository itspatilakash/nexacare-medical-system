import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, ArrowLeft } from "lucide-react";

const hospitalRegistrationSchema = z.object({
  // Hospital Info
  name: z.string().min(2, "Hospital name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  licenseNumber: z.string().min(5, "License number is required"),
  contactEmail: z.string().email("Valid email is required"),
  website: z.string().optional(),
  establishedYear: z.string().transform(Number).pipe(z.number().min(1800).max(new Date().getFullYear())),
  totalBeds: z.string().transform(Number).pipe(z.number().min(1)),
  departments: z.array(z.string()).min(1, "Select at least one department"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  emergencyServices: z.boolean(),
});

type HospitalRegistrationForm = z.infer<typeof hospitalRegistrationSchema>;

const departments = [
  "Emergency", "ICU", "Surgery", "Pediatrics", "Cardiology", 
  "Neurology", "Orthopedics", "Radiology", "Laboratory", "Pharmacy",
  "Maternity", "Dermatology", "ENT", "Oncology", "Psychiatry"
];

const services = [
  "Emergency Care", "Surgery", "Diagnostics", "Pharmacy", 
  "Ambulance", "Blood Bank", "Radiology", "Laboratory",
  "ICU", "NICU", "Maternity Ward", "24x7 Services", "Home Care"
];

export default function HospitalRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<HospitalRegistrationForm>({
    resolver: zodResolver(hospitalRegistrationSchema),
    defaultValues: {
      departments: [],
      services: [],
      emergencyServices: false,
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: HospitalRegistrationForm) => {
      const response = await apiRequest('/api/hospitals/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Hospital profile created successfully! You can now login.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create hospital profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HospitalRegistrationForm) => {
    const formData = {
      ...data,
      departments: selectedDepartments,
      services: selectedServices,
    };
    registrationMutation.mutate(formData);
  };

  const handleDepartmentChange = (department: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedDepartments, department]
      : selectedDepartments.filter(d => d !== department);
    setSelectedDepartments(updated);
    setValue('departments', updated);
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedServices, service]
      : selectedServices.filter(s => s !== service);
    setSelectedServices(updated);
    setValue('services', updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/register")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Building2 className="w-8 h-8 text-medical-blue mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hospital Registration</h1>
              <p className="text-medical-gray">Complete your hospital profile</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name *
                </Label>
                <Input
                  {...register("name")}
                  placeholder="Enter hospital name"
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number *
                </Label>
                <Input
                  {...register("licenseNumber")}
                  placeholder="Enter license number"
                  className="w-full"
                />
                {errors.licenseNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.licenseNumber.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </Label>
                <Input
                  {...register("contactEmail")}
                  type="email"
                  placeholder="contact@hospital.com"
                  className="w-full"
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </Label>
                <Input
                  {...register("website")}
                  placeholder="www.hospital.com"
                  className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year *
                </Label>
                <Input
                  {...register("establishedYear")}
                  type="number"
                  placeholder="1990"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full"
                />
                {errors.establishedYear && (
                  <p className="text-red-500 text-sm mt-1">{errors.establishedYear.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Beds *
                </Label>
                <Input
                  {...register("totalBeds")}
                  type="number"
                  placeholder="100"
                  min="1"
                  className="w-full"
                />
                {errors.totalBeds && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalBeds.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </Label>
              <Textarea
                {...register("address")}
                placeholder="Enter complete address"
                className="w-full"
                rows={3}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </Label>
                <Input
                  {...register("city")}
                  placeholder="Enter city"
                  className="w-full"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </Label>
                <Input
                  {...register("state")}
                  placeholder="Enter state"
                  className="w-full"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code *
                </Label>
                <Input
                  {...register("zipCode")}
                  placeholder="110001"
                  className="w-full"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            {/* Departments */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Available Departments * (Select at least one)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {departments.map((department) => (
                  <div key={department} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dept-${department}`}
                      checked={selectedDepartments.includes(department)}
                      onCheckedChange={(checked) => 
                        handleDepartmentChange(department, checked as boolean)
                      }
                    />
                    <Label htmlFor={`dept-${department}`} className="text-sm">
                      {department}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.departments && (
                <p className="text-red-500 text-sm mt-1">{errors.departments.message}</p>
              )}
            </div>

            {/* Services */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Services Offered * (Select at least one)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) => 
                        handleServiceChange(service, checked as boolean)
                      }
                    />
                    <Label htmlFor={`service-${service}`} className="text-sm">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-1">{errors.services.message}</p>
              )}
            </div>

            {/* Emergency Services */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency"
                {...register("emergencyServices")}
              />
              <Label htmlFor="emergency" className="text-sm">
                24x7 Emergency Services Available
              </Label>
            </div>

            <Button
              type="submit"
              disabled={registrationMutation.isPending}
              className="w-full medical-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {registrationMutation.isPending ? "Creating Profile..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}