import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../../components/ui/input-otp";
import { useToast } from "../../hooks/use-toast";
import { authApi, setAuthToken } from "../../lib/auth";
import { Stethoscope } from "lucide-react";
export default function OtpVerification() {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [registrationData, setRegistrationData] = useState({
        mobileNumber: "",
        role: "",
        fullName: "",
    });
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
    const verifyOtpMutation = useMutation({
        mutationFn: authApi.verifyOtp,
        onSuccess: (data) => {
            setAuthToken(data.token);
            toast({
                title: "Registration successful",
                description: `Welcome to MedCare, ${data.user.fullName}!`,
            });
            // Redirect to dashboard - role-based routing will handle the correct dashboard
            setLocation("/dashboard");
            window.location.reload(); // Refresh to update auth context
        },
        onError: (error) => {
            toast({
                title: "Verification failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
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
        verifyOtpMutation.mutate({
            mobileNumber: registrationData.mobileNumber,
            otp,
            password,
            role: registrationData.role,
            fullName: registrationData.fullName,
        });
    };
    return (<div className="min-h-screen bg-gradient-to-br from-medical-blue to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md fade-in">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <div className="medical-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">MedCare System</h1>
            <p className="text-medical-gray">Secure Medical Management Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Verify OTP</h2>
              <p className="text-sm text-medical-gray mt-2">
                Enter the 6-digit code sent to {registrationData.mobileNumber}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-2">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12"/>
                    <InputOTPSlot index={1} className="w-12 h-12"/>
                    <InputOTPSlot index={2} className="w-12 h-12"/>
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-12 h-12"/>
                    <InputOTPSlot index={4} className="w-12 h-12"/>
                    <InputOTPSlot index={5} className="w-12 h-12"/>
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password
                </Label>
                <Input type="password" placeholder="Enter a secure password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent" required minLength={6}/>
              </div>
            </div>

            <Button type="submit" disabled={verifyOtpMutation.isPending} className="w-full medical-green text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-medical-blue hover:text-blue-700 text-sm font-medium">
                Resend OTP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
