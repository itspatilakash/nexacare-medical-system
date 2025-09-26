import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { setAuthToken } from "../../lib/auth";
import { Stethoscope, ArrowLeft, Shield, Lock } from "lucide-react";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [registrationData, setRegistrationData] = useState({
    mobileNumber: "",
    role: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Get registration data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const mobile = urlParams.get('mobile') || '';
    const role = urlParams.get('role') || '';
    const name = urlParams.get('name') || '';
    
    if (!mobile || !role) {
      setLocation('/register');
      return;
    }

    setRegistrationData({
      mobileNumber: mobile,
      role: role,
      fullName: name,
    });
  }, [setLocation]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: registrationData.mobileNumber,
          otp,
        }),
      });

      if (!response.ok) throw new Error('Invalid OTP');

      // Now register the user with the verified OTP
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationData,
          password,
        }),
      });

      if (!registerResponse.ok) throw new Error('Registration failed');

      const data = await registerResponse.json();
      setAuthToken(data.token);
      toast({
        title: "Registration successful",
        description: `Welcome to NexaCare, ${data.user.fullName}!`,
      });
      setLocation("/dashboard");
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: registrationData.mobileNumber,
          role: registrationData.role,
        }),
      });

      if (!response.ok) throw new Error('Failed to resend OTP');

      const data = await response.json();
      toast({
        title: "OTP sent successfully",
        description: `OTP: ${data.otp} (Check console for development)`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-gray-600 text-sm">Complete Your Registration</p>
        </div>

        {/* OTP Verification Form */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h2>
              <p className="text-gray-600 text-sm">
                Enter the 6-digit code sent to {registrationData.mobileNumber}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-4">
              {/* OTP Input */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  OTP Code
                </Label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-center text-lg tracking-widest"
                  required
                  maxLength={6}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Create Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  required
                  minLength={6}
                />
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
                    Verifying...
                  </div>
                ) : (
                  "Verify & Complete Registration"
                )}
              </Button>

              {/* Resend OTP Button */}
              <div className="text-center">
                <Button 
                  type="button"
                  variant="link" 
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Resend OTP
                </Button>
              </div>

              {/* Back Button */}
              <div className="text-center pt-2">
                <Button 
                  type="button"
                  variant="link" 
                  onClick={() => setLocation('/register')}
                  className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}