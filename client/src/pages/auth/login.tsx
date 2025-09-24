import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { authApi, setAuthToken } from "../../lib/auth";
import { Stethoscope, Smartphone, Lock } from "lucide-react";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.fullName}!`,
      });
      setLocation("/dashboard");
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (mobileNumber: string) => {
      const response = await fetch('/api/auth/login/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });
      if (!response.ok) throw new Error('Failed to send OTP');
      return response.json();
    },
    onSuccess: (data) => {
      setOtpSent(true);
      toast({
        title: "OTP Generated",
        description: `OTP: ${data.otp} for ${data.mobileNumber}`,
        duration: 15000, // Show longer for demo
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loginWithOtpMutation = useMutation({
    mutationFn: async ({ mobileNumber, otp }: { mobileNumber: string; otp: string }) => {
      const response = await fetch('/api/auth/login/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp }),
      });
      if (!response.ok) throw new Error('Invalid OTP');
      return response.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.fullName}!`,
      });
      setLocation("/dashboard");
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'password') {
      loginMutation.mutate({ mobileNumber: formData.mobileNumber, password: formData.password });
    } else {
      loginWithOtpMutation.mutate({ mobileNumber: formData.mobileNumber, otp: formData.otp });
    }
  };

  const handleSendOtp = () => {
    if (!formData.mobileNumber) {
      toast({
        title: "Mobile number required",
        description: "Please enter your mobile number first",
        variant: "destructive",
      });
      return;
    }
    sendOtpMutation.mutate(formData.mobileNumber);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">NexaCare</h1>
            <p className="text-medical-gray">Secure Medical Management Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center">Sign In</h2>
            
            {/* Login Method Toggle */}
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'password'
                    ? 'bg-medical-blue text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Lock className="w-4 h-4" />
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'otp'
                    ? 'bg-medical-blue text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                OTP
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  required
                />
              </div>
              
              {loginMethod === 'password' ? (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    required
                  />
                </div>
              ) : (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                      required
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendOtpMutation.isPending || otpSent}
                      className="px-4 py-3 bg-medical-green text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {sendOtpMutation.isPending ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
                    </Button>
                  </div>
                  {otpSent && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-green-800 font-medium">
                        ✅ OTP Generated Successfully!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Check the toast notification above for your OTP code.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending || loginWithOtpMutation.isPending}
              className="w-full medical-blue py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {loginMutation.isPending || loginWithOtpMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-medical-blue hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
