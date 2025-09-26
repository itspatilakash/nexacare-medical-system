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
  const [errorMessage, setErrorMessage] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('🔍 Login success - data:', data);
      setAuthToken(data.token);
      console.log('🔍 Token set, navigating to dashboard');
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.fullName}!`,
      });
      setLocation("/dashboard");
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
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobileNumber,
          role: 'patient' // Default role for login OTP
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setOtpSent(true);
      toast({
        title: "✅ OTP Generated Successfully!",
        description: `OTP: ${data.otp} for ${data.mobileNumber}`,
        duration: 30000, // Show longer for demo
        className: "bg-green-50 border-green-200 text-green-800",
      });
      // Also log to console for debugging
      console.log('🔑 OTP Generated:', data.otp, 'for', data.mobileNumber);
    },
    onError: (error) => {
      console.error('❌ OTP Send Error:', error);
      setErrorMessage(`Failed to send OTP: ${error.message}`);
      toast({
        title: "❌ Failed to send OTP",
        description: error.message,
        variant: "destructive",
        duration: 10000,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });

  const loginWithOtpMutation = useMutation({
    mutationFn: async ({ mobileNumber, otp }: { mobileNumber: string; otp: string }) => {
      return await authApi.loginWithOtp({ mobileNumber, otp });
    },
    onSuccess: (data) => {
      console.log('🔍 OTP Login success - data:', data);
      setAuthToken(data.token);
      console.log('🔍 OTP Token set, navigating to dashboard');
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.fullName}!`,
      });
      setLocation("/dashboard");
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
    setErrorMessage(""); // Clear previous error
    sendOtpMutation.mutate(formData.mobileNumber);
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
          <p className="text-gray-600 text-sm">Welcome Back to Medical Excellence</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600 text-sm">Choose your preferred login method</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Login Method Toggle */}
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  loginMethod === 'password'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Lock className="w-4 h-4" />
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  loginMethod === 'otp'
                    ? 'bg-blue-600 text-white shadow-sm'
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
                  className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
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
                    className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
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
                      className="flex-1 h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      required
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendOtpMutation.isPending || otpSent}
                      className="px-4 h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-all duration-200 disabled:opacity-50"
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
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-red-800 font-medium">
                            ❌ {errorMessage}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Please check your mobile number and try again.
                          </p>
                        </div>
                        <button
                          onClick={() => setErrorMessage("")}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending || loginWithOtpMutation.isPending}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              {loginMutation.isPending || loginWithOtpMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
