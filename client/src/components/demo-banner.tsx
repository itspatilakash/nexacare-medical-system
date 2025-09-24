import { useState } from 'react';
import { X, Info, Zap, Users, Shield } from 'lucide-react';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-yellow-300" />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  🚀 DEMO VERSION - NexaCare Medical System
                </span>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>Multi-Role System</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>HIPAA Ready</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {showDetails && (
            <div className="mt-3 pb-2 border-t border-white/20 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Demo Features</h4>
                  <ul className="space-y-1 text-white/90">
                    <li>• Complete appointment booking</li>
                    <li>• Digital prescriptions</li>
                    <li>• Lab report management</li>
                    <li>• Real-time notifications</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">👥 User Roles</h4>
                  <ul className="space-y-1 text-white/90">
                    <li>• Patients</li>
                    <li>• Doctors</li>
                    <li>• Hospital Admins</li>
                    <li>• Lab Technicians</li>
                    <li>• Receptionists</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💡 Demo Notes</h4>
                  <ul className="space-y-1 text-white/90">
                    <li>• All services run locally</li>
                    <li>• SMS/Email logged to console</li>
                    <li>• No external API calls</li>
                    <li>• Production-ready architecture</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
