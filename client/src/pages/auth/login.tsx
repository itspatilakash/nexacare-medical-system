import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { authApi, setAuthToken } from "../../lib/auth";
import { Stethoscope } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
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
      // Redirect to dashboard - role-based routing will handle the correct dashboard
      setLocation("/dashboard");
      window.location.reload(); // Refresh to update auth context
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
    loginMutation.mutate(formData);
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
            <h2 className="text-xl font-semibold text-gray-900 text-center">Sign In</h2>
            
            <div className="space-y-4">
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
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full medical-blue py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Link href="/register">
                <Button variant="link" className="text-medical-blue hover:text-blue-700 text-sm font-medium">
                  Don't have an account? Register
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
