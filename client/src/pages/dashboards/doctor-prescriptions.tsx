import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import DashboardLayout from "../../components/layout/dashboard-layout";
import PrescriptionList from "../../components/prescription-list";
import PrescriptionModal from "../../components/modals/prescription-modal";
import { FileText, Plus, Download, Upload } from "lucide-react";

export default function DoctorPrescriptionsPage() {
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard/doctor",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/doctor/prescriptions",
      icon: <FileText className="w-5 h-5" />,
      isActive: true,
    },
  ];

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Import
      </Button>
      <Button 
        className="medical-blue text-white hover:bg-blue-700 flex items-center gap-2"
        onClick={() => setIsPrescriptionModalOpen(true)}
      >
        <Plus className="w-4 h-4" />
        New Prescription
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Prescriptions"
      subtitle="Manage patient prescriptions"
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
                <p className="text-2xl font-semibold text-gray-900">24</p>
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
                <p className="text-2xl font-semibold text-gray-900">18</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Follow-up Due</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <PrescriptionList 
            role="doctor" 
            showActions={true} 
            showFilters={true}
          />
        </CardContent>
      </Card>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
      />
    </DashboardLayout>
  );
} 