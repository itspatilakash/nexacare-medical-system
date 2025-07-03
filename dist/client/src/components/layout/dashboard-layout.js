import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, X } from "lucide-react";
export default function DashboardLayout({ children, title, subtitle, icon, navigationItems, headerActions, }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const [location] = useLocation();
    const handleLogout = () => {
        logout();
    };
    return (<div className="min-h-screen bg-medical-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6"/>
            </Button>
            <div className="flex items-center space-x-4">
              <div className="medical-blue rounded-lg w-10 h-10 flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-medical-gray">{subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {headerActions}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-medical-gray hover:text-gray-900">
              <LogOut className="w-6 h-6"/>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <nav className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen pt-6">
          <div className="px-6 space-y-2">
            {navigationItems.map((item, index) => (<Link key={index} href={item.path}>
                <Button variant="ghost" className={`w-full justify-start px-4 py-3 ${location === item.path || item.isActive
                ? "text-medical-blue bg-blue-50"
                : "text-medical-gray hover:text-gray-900 hover:bg-gray-50"}`}>
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>))}
          </div>
        </nav>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (<div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}/>
            <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 slide-in">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6"/>
                </Button>
              </div>
              <div className="px-6 pt-6 space-y-2">
                {navigationItems.map((item, index) => (<Link key={index} href={item.path}>
                    <Button variant="ghost" className={`w-full justify-start px-4 py-3 ${location === item.path || item.isActive
                    ? "text-medical-blue bg-blue-50"
                    : "text-medical-gray hover:text-gray-900 hover:bg-gray-50"}`} onClick={() => setSidebarOpen(false)}>
                      <span className="w-5 h-5 mr-3">{item.icon}</span>
                      {item.label}
                    </Button>
                  </Link>))}
              </div>
            </nav>
          </div>)}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>);
}
