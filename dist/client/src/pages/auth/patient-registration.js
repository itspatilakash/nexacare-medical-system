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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, ArrowLeft } from "lucide-react";
const patientRegistrationSchema = z.object({
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Please select gender"),
    bloodGroup: z.string().min(1, "Please select blood group"),
    height: z.string().transform(Number).pipe(z.number().min(50).max(250, "Height should be between 50-250 cm")),
    weight: z.string().transform(Number).pipe(z.number().min(10).max(300, "Weight should be between 10-300 kg")),
    address: z.string().min(10, "Complete address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "Valid zip code is required"),
    emergencyContact: z.string().min(10, "Emergency contact number is required"),
    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyRelation: z.string().min(1, "Please select relation"),
    medicalHistory: z.string().optional(),
    allergies: z.string().optional(),
    currentMedications: z.string().optional(),
    chronicConditions: z.string().optional(),
    insuranceProvider: z.string().optional(),
    insuranceNumber: z.string().optional(),
    occupation: z.string().min(2, "Occupation is required"),
    maritalStatus: z.string().min(1, "Please select marital status"),
});
const bloodGroups = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
const relations = ["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"];
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
const insuranceProviders = ["Star Health", "HDFC ERGO", "Bajaj Allianz", "Max Bupa", "ICICI Lombard", "None"];
export default function PatientRegistration() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(patientRegistrationSchema),
        defaultValues: {
            height: "170",
            weight: "70",
        }
    });
    const registrationMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiRequest('/api/patients/register', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    currentMedications: data.currentMedications ? data.currentMedications.split(',').map(m => m.trim()) : [],
                    chronicConditions: data.chronicConditions ? data.chronicConditions.split(',').map(c => c.trim()) : [],
                }),
            });
            return response;
        },
        onSuccess: () => {
            toast({
                title: "Registration Successful",
                description: "Patient profile created successfully! You can now login.",
            });
            setLocation("/login");
        },
        onError: (error) => {
            toast({
                title: "Registration Failed",
                description: error.message || "Failed to create patient profile",
                variant: "destructive",
            });
        },
    });
    const onSubmit = (data) => {
        registrationMutation.mutate(data);
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setLocation("/register")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back
            </Button>
            <User className="w-8 h-8 text-medical-blue mr-3"/>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
              <p className="text-medical-gray">Complete your medical profile</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </Label>
                <Input {...register("dateOfBirth")} type="date" className="w-full"/>
                {errors.dateOfBirth && (<p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </Label>
                <Select onValueChange={(value) => setValue('gender', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (<p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group *
                </Label>
                <Select onValueChange={(value) => setValue('bloodGroup', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blood group"/>
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (<SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.bloodGroup && (<p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) *
                </Label>
                <Input {...register("height")} type="number" placeholder="170" min="50" max="250" className="w-full"/>
                {errors.height && (<p className="text-red-500 text-sm mt-1">{errors.height.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </Label>
                <Input {...register("weight")} type="number" placeholder="70" min="10" max="300" className="w-full"/>
                {errors.weight && (<p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status *
                </Label>
                <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatuses.map((status) => (<SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.maritalStatus && (<p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>)}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </Label>
              <Textarea {...register("address")} placeholder="Enter complete address" className="w-full" rows={3}/>
              {errors.address && (<p className="text-red-500 text-sm mt-1">{errors.address.message}</p>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </Label>
                <Input {...register("city")} placeholder="Enter city" className="w-full"/>
                {errors.city && (<p className="text-red-500 text-sm mt-1">{errors.city.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </Label>
                <Input {...register("state")} placeholder="Enter state" className="w-full"/>
                {errors.state && (<p className="text-red-500 text-sm mt-1">{errors.state.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code *
                </Label>
                <Input {...register("zipCode")} placeholder="110001" className="w-full"/>
                {errors.zipCode && (<p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>)}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation *
              </Label>
              <Input {...register("occupation")} placeholder="Enter your occupation" className="w-full"/>
              {errors.occupation && (<p className="text-red-500 text-sm mt-1">{errors.occupation.message}</p>)}
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name *
                </Label>
                <Input {...register("emergencyContactName")} placeholder="Contact person name" className="w-full"/>
                {errors.emergencyContactName && (<p className="text-red-500 text-sm mt-1">{errors.emergencyContactName.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Number *
                </Label>
                <Input {...register("emergencyContact")} placeholder="10-digit mobile number" className="w-full"/>
                {errors.emergencyContact && (<p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation *
                </Label>
                <Select onValueChange={(value) => setValue('emergencyRelation', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relation"/>
                  </SelectTrigger>
                  <SelectContent>
                    {relations.map((relation) => (<SelectItem key={relation} value={relation}>
                        {relation}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.emergencyRelation && (<p className="text-red-500 text-sm mt-1">{errors.emergencyRelation.message}</p>)}
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History (Optional)
                </Label>
                <Textarea {...register("medicalHistory")} placeholder="Describe any past medical conditions, surgeries, or significant health events" className="w-full" rows={3}/>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies (Optional)
                </Label>
                <Textarea {...register("allergies")} placeholder="List any known allergies (medications, food, environmental)" className="w-full" rows={2}/>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications (Optional)
                </Label>
                <Textarea {...register("currentMedications")} placeholder="List current medications (separate with commas)" className="w-full" rows={2}/>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Chronic Conditions (Optional)
                </Label>
                <Textarea {...register("chronicConditions")} placeholder="List any chronic conditions (separate with commas)" className="w-full" rows={2}/>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Insurance Information (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </Label>
                  <Select onValueChange={(value) => setValue('insuranceProvider', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select provider"/>
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceProviders.map((provider) => (<SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Number
                  </Label>
                  <Input {...register("insuranceNumber")} placeholder="Enter insurance policy number" className="w-full"/>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={registrationMutation.isPending} className="w-full medical-green text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              {registrationMutation.isPending ? "Creating Profile..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>);
}
