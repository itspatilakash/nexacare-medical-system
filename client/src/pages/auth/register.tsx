import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { authApi } from "../../lib/auth";
import { Stethoscope } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    role: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      toast({
        title: "OTP sent successfully",
        description: `Verification code sent to ${data.mobileNumber}`,
      });
      // Pass registration data to OTP verification page
      setLocation(`/verify-otp?mobile=${encodeURIComponent(data.mobileNumber)}&role=${data.role}&name=${encodeURIComponent(formData.fullName)}`);
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      toast({
        title: "Role required",
        description: "Please select your role",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md fade-in">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <div className="medical-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">MedCare System</h1>
            <p className="text-medical-gray">Secure Medical Management Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center">Create Account</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="Dr. John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital Administrator</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full medical-green text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              {registerMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>

            <div className="text-center">
              <Link href="/login">
                <Button variant="link" className="text-medical-blue hover:text-blue-700 text-sm font-medium">
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
