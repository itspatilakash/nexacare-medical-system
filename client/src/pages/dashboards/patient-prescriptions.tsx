import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/layout/dashboard-layout";
import PrescriptionList from "../../components/prescription-list";
import { FileText, Download, Calendar, AlertCircle } from "lucide-react";

export default function PatientPrescriptionsPage() {
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/patient",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/patient/prescriptions",
      icon: <FileText className="w-5 h-5" />,
      isActive: true,
    },
  ];

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Download All
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Follow-up Reminders
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="My Prescriptions"
      subtitle="View your medical prescriptions"
      icon={<FileText className="w-6 h-6 text-white" />}
      navigationItems={navigationItems}
      headerActions={headerActions}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Prescriptions</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Active</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Follow-up Due</p>
                <p className="text-2xl font-semibold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="mb-6 border-l-4 border-l-medical-blue">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-medical-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Important Information</h4>
              <p className="text-sm text-gray-600">
                Always follow your doctor's instructions and complete the full course of medication. 
                Contact your healthcare provider if you experience any side effects or have questions about your prescriptions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
        </CardHeader>
        <CardContent>
          <PrescriptionList 
            role="patient" 
            showActions={true} 
            showFilters={true}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 