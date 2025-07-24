import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import DashboardLayout from "../../components/layout/dashboard-layout";
import PrescriptionList from "../../components/prescription-list";
import { FileText, Download, TrendingUp, Users, Calendar } from "lucide-react";

export default function HospitalPrescriptionsPage() {
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/hospital",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/hospital/prescriptions",
      icon: <FileText className="w-5 h-5" />,
      isActive: true,
    },
  ];

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export Report
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Analytics
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Hospital Prescriptions"
      subtitle="Manage all prescriptions within the hospital"
      icon={<FileText className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
      headerActions={headerActions}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Prescriptions</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Active Doctors</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Growth Rate</p>
                <p className="text-2xl font-semibold text-gray-900">+12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prescriptions by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Cardiology</h4>
                <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
              </div>
              <Badge variant="default">32 prescriptions</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Neurology</h4>
                <p className="text-sm text-gray-600">Dr. Michael Chen</p>
              </div>
              <Badge variant="default">28 prescriptions</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Orthopedics</h4>
                <p className="text-sm text-gray-600">Dr. Emily Rodriguez</p>
              </div>
              <Badge variant="default">24 prescriptions</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Hospital Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <PrescriptionList 
            role="hospital" 
            showActions={false} 
            showFilters={true}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 