import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserRound, ArrowLeft } from "lucide-react";
const doctorRegistrationSchema = z.object({
    hospitalId: z.string().transform(Number).pipe(z.number().min(1, "Please select a hospital")),
    specialty: z.string().min(2, "Specialty is required"),
    licenseNumber: z.string().min(5, "License number is required"),
    qualification: z.string().min(5, "Qualification is required"),
    experience: z.string().transform(Number).pipe(z.number().min(0).max(50)),
    consultationFee: z.string().transform(Number).pipe(z.number().min(100)),
    languages: z.array(z.string()).min(1, "Select at least one language"),
    bio: z.string().min(50, "Please provide a detailed bio (minimum 50 characters)"),
    awards: z.string().optional(),
});
const specialties = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Dermatology", "Oncology", "Psychiatry", "ENT",
    "Gynecology", "Urology", "Ophthalmology", "Anesthesiology",
    "Radiology", "Pathology", "Emergency Medicine", "Family Medicine"
];
const languages = [
    "English", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi",
    "Bengali", "Gujarati", "Punjabi", "Malayalam", "Oriya", "Assamese"
];
export default function DoctorRegistration() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const { data: hospitals, isLoading: hospitalsLoading } = useQuery({
        queryKey: ['/api/hospitals/list'],
    });
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(doctorRegistrationSchema),
        defaultValues: {
            languages: [],
            experience: "0",
            consultationFee: "500",
        }
    });
    const registrationMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiRequest('/api/doctors/register', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        },
        onSuccess: () => {
            toast({
                title: "Registration Successful",
                description: "Doctor profile created successfully! You can now login.",
            });
            setLocation("/login");
        },
        onError: (error) => {
            toast({
                title: "Registration Failed",
                description: error.message || "Failed to create doctor profile",
                variant: "destructive",
            });
        },
    });
    const onSubmit = (data) => {
        const formData = {
            ...data,
            languages: selectedLanguages,
            awards: data.awards ? data.awards.split(',').map(a => a.trim()) : [],
        };
        registrationMutation.mutate(formData);
    };
    const handleLanguageChange = (language, checked) => {
        const updated = checked
            ? [...selectedLanguages, language]
            : selectedLanguages.filter(l => l !== language);
        setSelectedLanguages(updated);
        setValue('languages', updated);
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setLocation("/register")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back
            </Button>
            <UserRound className="w-8 h-8 text-medical-blue mr-3"/>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Registration</h1>
              <p className="text-medical-gray">Complete your professional profile</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hospital Selection */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Affiliation *
              </Label>
              <Select onValueChange={(value) => setValue('hospitalId', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a hospital"/>
                </SelectTrigger>
                <SelectContent>
                  {hospitalsLoading ? (<SelectItem value="loading" disabled>Loading hospitals...</SelectItem>) : (hospitals?.map((hospital) => (<SelectItem key={hospital.id} value={hospital.id.toString()}>
                        {hospital.name} - {hospital.city}
                      </SelectItem>)))}
                </SelectContent>
              </Select>
              {errors.hospitalId && (<p className="text-red-500 text-sm mt-1">{errors.hospitalId.message}</p>)}
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty *
                </Label>
                <Select onValueChange={(value) => setValue('specialty', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your specialty"/>
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (<SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.specialty && (<p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Number *
                </Label>
                <Input {...register("licenseNumber")} placeholder="DOC123456" className="w-full"/>
                {errors.licenseNumber && (<p className="text-red-500 text-sm mt-1">{errors.licenseNumber.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification *
                </Label>
                <Input {...register("qualification")} placeholder="MBBS, MD (Specialty)" className="w-full"/>
                {errors.qualification && (<p className="text-red-500 text-sm mt-1">{errors.qualification.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </Label>
                <Input {...register("experience")} type="number" placeholder="5" min="0" max="50" className="w-full"/>
                {errors.experience && (<p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>)}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee (₹) *
                </Label>
                <Input {...register("consultationFee")} type="number" placeholder="500" min="100" className="w-full"/>
                {errors.consultationFee && (<p className="text-red-500 text-sm mt-1">{errors.consultationFee.message}</p>)}
              </div>
            </div>

            {/* Languages */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Languages Spoken * (Select at least one)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((language) => (<div key={language} className="flex items-center space-x-2">
                    <Checkbox id={`lang-${language}`} checked={selectedLanguages.includes(language)} onCheckedChange={(checked) => handleLanguageChange(language, checked)}/>
                    <Label htmlFor={`lang-${language}`} className="text-sm">
                      {language}
                    </Label>
                  </div>))}
              </div>
              {errors.languages && (<p className="text-red-500 text-sm mt-1">{errors.languages.message}</p>)}
            </div>

            {/* Bio */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio * (Minimum 50 characters)
              </Label>
              <Textarea {...register("bio")} placeholder="Tell patients about your experience, expertise, and approach to healthcare..." className="w-full" rows={4}/>
              {errors.bio && (<p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>)}
            </div>

            {/* Awards */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Awards & Recognition (Optional)
              </Label>
              <Textarea {...register("awards")} placeholder="List your awards, certifications, and achievements (separate with commas)" className="w-full" rows={3}/>
              <p className="text-sm text-gray-500 mt-1">
                Example: Best Doctor Award 2020, Excellence in Medical Service 2021
              </p>
            </div>

            <Button type="submit" disabled={registrationMutation.isPending} className="w-full medical-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              {registrationMutation.isPending ? "Creating Profile..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>);
}
