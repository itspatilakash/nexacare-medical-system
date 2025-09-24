// Local email service for NexaCare Medical System
// Shows email content immediately without external services

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  type?: 'appointment' | 'prescription' | 'lab_report' | 'notification' | 'reminder';
}

export class EmailService {
  private static instance: EmailService;
  private emails: EmailData[] = [];

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email (local only - no external service)
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; emailId: string }> {
    const emailId = `email_${Date.now()}`;
    
    // Store email locally
    this.emails.push({
      ...emailData,
      type: emailData.type || 'notification'
    });

    // Log to console
    console.log(`\n📧 Email Generated:`);
    console.log(`📬 To: ${emailData.to}`);
    console.log(`📋 Subject: ${emailData.subject}`);
    console.log(`📄 Body: ${emailData.body}`);
    console.log(`🎯 Type: ${emailData.type || 'notification'}`);
    console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

    return {
      success: true,
      emailId
    };
  }

  // Send appointment confirmation email
  async sendAppointmentConfirmation(
    patientEmail: string, 
    patientName: string, 
    doctorName: string, 
    appointmentDate: string,
    appointmentTime: string
  ) {
    const emailData: EmailData = {
      to: patientEmail,
      subject: 'Appointment Confirmed - NexaCare',
      body: `Dear ${patientName},\n\nYour appointment with Dr. ${doctorName} has been confirmed.\n\nAppointment Details:\n- Date: ${appointmentDate}\n- Time: ${appointmentTime}\n\nPlease arrive 15 minutes early for your appointment.\n\nBest regards,\nNexaCare Medical System`,
      type: 'appointment'
    };

    return this.sendEmail(emailData);
  }

  // Send prescription notification email
  async sendPrescriptionNotification(
    patientEmail: string,
    patientName: string,
    doctorName: string,
    prescriptionId: string
  ) {
    const emailData: EmailData = {
      to: patientEmail,
      subject: 'New Prescription Available - NexaCare',
      body: `Dear ${patientName},\n\nDr. ${doctorName} has created a new prescription for you.\n\nPrescription ID: ${prescriptionId}\n\nPlease log in to your NexaCare account to view and download your prescription.\n\nBest regards,\nNexaCare Medical System`,
      type: 'prescription'
    };

    return this.sendEmail(emailData);
  }

  // Send lab report notification email
  async sendLabReportNotification(
    patientEmail: string,
    patientName: string,
    reportName: string,
    reportId: string
  ) {
    const emailData: EmailData = {
      to: patientEmail,
      subject: 'Lab Report Ready - NexaCare',
      body: `Dear ${patientName},\n\nYour lab test results are now available.\n\nReport Details:\n- Test: ${reportName}\n- Report ID: ${reportId}\n\nPlease log in to your NexaCare account to view your results.\n\nBest regards,\nNexaCare Medical System`,
      type: 'lab_report'
    };

    return this.sendEmail(emailData);
  }

  // Send appointment reminder email
  async sendAppointmentReminder(
    patientEmail: string,
    patientName: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ) {
    const emailData: EmailData = {
      to: patientEmail,
      subject: 'Appointment Reminder - NexaCare',
      body: `Dear ${patientName},\n\nThis is a reminder for your upcoming appointment.\n\nAppointment Details:\n- Doctor: Dr. ${doctorName}\n- Date: ${appointmentDate}\n- Time: ${appointmentTime}\n\nPlease arrive 15 minutes early.\n\nBest regards,\nNexaCare Medical System`,
      type: 'reminder'
    };

    return this.sendEmail(emailData);
  }

  // Get all sent emails
  getEmails(): EmailData[] {
    return this.emails.sort((a, b) => new Date().getTime() - new Date().getTime());
  }

  // Get emails by type
  getEmailsByType(type: string): EmailData[] {
    return this.emails.filter(email => email.type === type);
  }

  // Clear all emails
  clearEmails(): void {
    this.emails = [];
  }
}

export const emailService = EmailService.getInstance();
