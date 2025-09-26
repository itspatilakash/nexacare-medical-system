import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { Stethoscope, User, Phone, Shield } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!formData.role) {
      toast({
        title: "Role required",
        description: "Please select your role",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First, send OTP for verification
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: formData.mobileNumber,
          role: formData.role,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "OTP sent successfully",
          description: `OTP: ${data.otp} (Check console for development)`,
        });
        console.log('Registration OTP:', data.otp);
        setLocation(`/verify-otp?mobile=${encodeURIComponent(formData.mobileNumber)}&role=${formData.role}&name=${encodeURIComponent(formData.fullName)}`);
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            NexaCare
          </h1>
          <p className="text-gray-600 text-sm">Join the Medical Revolution</p>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 text-sm">Get started with your medical journey</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="Dr. John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">🏥 Hospital Administrator</SelectItem>
                    <SelectItem value="doctor">👨‍⚕️ Doctor</SelectItem>
                    <SelectItem value="patient">👤 Patient</SelectItem>
                    <SelectItem value="lab">🧪 Laboratory</SelectItem>
                    <SelectItem value="receptionist">📋 Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <Link href="/login">
                  <Button variant="link" className="text-blue-600 hover:text-blue-700 font-medium">
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
