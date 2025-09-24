// Notification service for NexaCare Medical System
// Supports both local development and production environments

export interface NotificationMessage {
  id: string;
  type: 'sms' | 'email' | 'system';
  recipient: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'pending' | 'failed';
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationMessage[] = [];
  private isDevelopmentMode = process.env.NODE_ENV === 'development';

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Send SMS notification
  async sendSMS(recipient: string, message: string): Promise<boolean> {
    const notification: NotificationMessage = {
      id: `sms_${Date.now()}`,
      type: 'sms',
      recipient,
      content: message,
      timestamp: new Date(),
      status: 'sent',
    };
    
    this.notifications.push(notification);
    
    if (this.isDevelopmentMode) {
      // Development mode: Log to console
      console.log(`📱 SMS to ${recipient}: ${message}`);
      console.log(`⏰ Sent at: ${new Date().toLocaleTimeString()}`);
    } else {
      // Production mode: Integrate with SMS provider (Twilio, AWS SNS, etc.)
      // TODO: Implement actual SMS sending
      console.log(`📱 SMS sent to ${recipient}`);
    }
    
    return true;
  }

  // Send email notification
  async sendEmail(recipient: string, subject: string, body: string): Promise<boolean> {
    const notification: NotificationMessage = {
      id: `email_${Date.now()}`,
      type: 'email',
      recipient,
      content: `${subject}: ${body}`,
      timestamp: new Date(),
      status: 'sent',
    };
    
    this.notifications.push(notification);
    
    if (this.isDevelopmentMode) {
      // Development mode: Log to console
      console.log(`📧 Email to ${recipient}`);
      console.log(`📋 Subject: ${subject}`);
      console.log(`📄 Body: ${body}`);
      console.log(`⏰ Sent at: ${new Date().toLocaleTimeString()}`);
    } else {
      // Production mode: Integrate with email provider (SendGrid, AWS SES, etc.)
      // TODO: Implement actual email sending
      console.log(`📧 Email sent to ${recipient}`);
    }
    
    return true;
  }

  // Send system notification
  sendSystemNotification(title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') {
    const notification: NotificationMessage = {
      id: `system_${Date.now()}`,
      type: 'system',
      recipient: 'system',
      content: `${title}: ${message}`,
      timestamp: new Date(),
      status: 'sent',
    };
    
    this.notifications.push(notification);
    
    console.log(`🔔 System Notification: ${title} - ${message}`);
    
    return notification;
  }

  // Get all notifications
  getNotifications(): NotificationMessage[] {
    return this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get notifications by type
  getNotificationsByType(type: 'sms' | 'email' | 'system'): NotificationMessage[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Clear notifications
  clearNotifications(): void {
    this.notifications = [];
  }

  // Get notification statistics
  getNotificationStats() {
    const total = this.notifications.length;
    const byType = this.notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byType,
      lastSent: this.notifications[0]?.timestamp || null,
    };
  }
}

export const notificationService = NotificationService.getInstance();
