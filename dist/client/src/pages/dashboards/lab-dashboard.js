import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { FlaskConical, ClipboardList, User, FileText, Upload, Settings } from "lucide-react";
export default function LabDashboard() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['/api/dashboard/stats'],
    });
    const { data: labReports, isLoading: reportsLoading } = useQuery({
        queryKey: ['/api/lab-reports/my'],
    });
    const navigationItems = [
        {
            label: "Dashboard",
            path: "/dashboard/lab",
            icon: <FlaskConical className="w-5 h-5"/>,
            isActive: true,
        },
        {
            label: "Test Reports",
            path: "/dashboard/lab/reports",
            icon: <ClipboardList className="w-5 h-5"/>,
        },
        {
            label: "Patients",
            path: "/dashboard/lab/patients",
            icon: <User className="w-5 h-5"/>,
        },
        {
            label: "Upload Results",
            path: "/dashboard/lab/upload",
            icon: <Upload className="w-5 h-5"/>,
        },
        {
            label: "Settings",
            path: "/dashboard/lab/settings",
            icon: <Settings className="w-5 h-5"/>,
        },
    ];
    const headerActions = (<Button className="medical-blue text-white hover:bg-blue-700">
      Upload Report
    </Button>);
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-medical-green text-white';
            case 'pending':
                return 'bg-yellow-500 text-white';
            case 'reviewed':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    return (<DashboardLayout title="City Lab Center" subtitle="Laboratory Management" icon={<FlaskConical className="w-6 h-6 text-white"/>} navigationItems={navigationItems} headerActions={headerActions}>
      {/* Lab Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-blue rounded-lg p-3">
                <ClipboardList className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Reports</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.totalReports || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-3">
                <ClipboardList className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Pending Tests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.pendingTests || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="medical-green rounded-lg p-3">
                <FileText className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Completed Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.completedToday || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3">
                <User className="w-6 h-6 text-white"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-medical-gray">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats?.totalPatients || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lab Reports */}
      <Card className="mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Lab Reports</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          {reportsLoading ? (<div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>))}
            </div>) : labReports && labReports.length > 0 ? (<div className="space-y-4">
              {labReports.slice(0, 10).map((report) => (<div key={report.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-medical-blue rounded-full flex items-center justify-center">
                      <FlaskConical className="w-6 h-6 text-white"/>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {report.testName}
                      </p>
                      <p className="text-sm text-medical-gray">
                        Patient: {report.patientName || "Unknown"}
                      </p>
                      <p className="text-xs text-medical-gray">
                        Test Type: {report.testType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status?.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-medical-gray mt-1">
                        {new Date(report.reportDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      {report.status === 'pending' ? 'Upload Results' : 'View Report'}
                    </Button>
                  </div>
                </div>))}
            </div>) : (<div className="text-center py-8">
              <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
              <p className="text-medical-gray">No lab reports found</p>
              <Button className="mt-4 medical-blue hover:bg-blue-700">
                Upload First Report
              </Button>
            </div>)}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <Upload className="w-6 h-6 text-medical-blue"/>
          <span className="text-sm font-medium">Upload Results</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <ClipboardList className="w-6 h-6 text-medical-green"/>
          <span className="text-sm font-medium">View All Reports</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <User className="w-6 h-6 text-purple-500"/>
          <span className="text-sm font-medium">Patient Database</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <FileText className="w-6 h-6 text-yellow-500"/>
          <span className="text-sm font-medium">Generate Report</span>
        </Button>
      </div>
    </DashboardLayout>);
}
