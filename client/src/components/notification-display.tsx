import { useState, useEffect } from 'react';
import { Bell, X, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface NotificationItem {
  id: string;
  type: 'sms' | 'email' | 'notification';
  recipient: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'pending' | 'failed';
}

export default function NotificationDisplay() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Simulate fetching notifications (in real app, this would be from API)
  useEffect(() => {
    // This would be replaced with actual API calls
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'sms',
        recipient: '+1234567890',
        content: 'Your NexaCare verification OTP is: 123456. Valid for 5 minutes.',
        timestamp: new Date(),
        status: 'sent'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <Smartphone className="h-4 w-4 text-blue-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-purple-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sms':
        return 'bg-blue-50 border-blue-200';
      case 'email':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Local Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                  <p className="text-sm">Notifications will appear here when actions are performed</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b last:border-b-0 ${getTypeColor(notification.type)}`}
                  >
                    <div className="flex items-start space-x-2">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-900 uppercase">
                            {notification.type}
                          </p>
                          <span className="text-xs text-gray-500">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          To: {notification.recipient}
                        </p>
                        <p className="text-sm text-gray-800 mt-1">
                          {notification.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 text-center">
                All notifications are generated locally for demonstration
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
