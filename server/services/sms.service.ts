// Local SMS service for NexaCare Medical System
// Shows SMS content immediately without external services

export interface SMSData {
  to: string;
  message: string;
  type?: 'otp' | 'appointment' | 'prescription' | 'lab_report' | 'notification' | 'reminder';
}

export class SMSService {
  private static instance: SMSService;
  private smsMessages: SMSData[] = [];

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  // Send SMS (local only - no external service)
  async sendSMS(smsData: SMSData): Promise<{ success: boolean; smsId: string }> {
    const smsId = `sms_${Date.now()}`;
    
    // Store SMS locally
    this.smsMessages.push({
      ...smsData,
      type: smsData.type || 'notification'
    });

    // Log to console
    console.log(`\n📱 SMS Generated:`);
    console.log(`📞 To: ${smsData.to}`);
    console.log(`💬 Message: ${smsData.message}`);
    console.log(`🎯 Type: ${smsData.type || 'notification'}`);
    console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

    return {
      success: true,
      smsId
    };
  }

  // Send OTP SMS
  async sendOTP(mobileNumber: string, otp: string, purpose: string = 'verification') {
    const smsData: SMSData = {
      to: mobileNumber,
      message: `Your NexaCare ${purpose} OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`,
      type: 'otp'
    };

    return this.sendSMS(smsData);
  }

  // Send appointment confirmation SMS
  async sendAppointmentConfirmation(
    mobileNumber: string,
    patientName: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ) {
    const smsData: SMSData = {
      to: mobileNumber,
      message: `Hi ${patientName}, your appointment with Dr. ${doctorName} is confirmed for ${appointmentDate} at ${appointmentTime}. Please arrive 15 mins early. - NexaCare`,
      type: 'appointment'
    };

    return this.sendSMS(smsData);
  }

  // Send prescription notification SMS
  async sendPrescriptionNotification(
    mobileNumber: string,
    patientName: string,
    prescriptionId: string
  ) {
    const smsData: SMSData = {
      to: mobileNumber,
      message: `Hi ${patientName}, your new prescription (ID: ${prescriptionId}) is ready. Please check your NexaCare account. - NexaCare`,
      type: 'prescription'
    };

    return this.sendSMS(smsData);
  }

  // Send lab report notification SMS
  async sendLabReportNotification(
    mobileNumber: string,
    patientName: string,
    reportName: string
  ) {
    const smsData: SMSData = {
      to: mobileNumber,
      message: `Hi ${patientName}, your ${reportName} test results are ready. Please check your NexaCare account. - NexaCare`,
      type: 'lab_report'
    };

    return this.sendSMS(smsData);
  }

  // Send appointment reminder SMS
  async sendAppointmentReminder(
    mobileNumber: string,
    patientName: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ) {
    const smsData: SMSData = {
      to: mobileNumber,
      message: `Reminder: Hi ${patientName}, you have an appointment with Dr. ${doctorName} tomorrow at ${appointmentTime}. Please arrive 15 mins early. - NexaCare`,
      type: 'reminder'
    };

    return this.sendSMS(smsData);
  }

  // Get all sent SMS messages
  getSMSMessages(): SMSData[] {
    return this.smsMessages.sort((a, b) => new Date().getTime() - new Date().getTime());
  }

  // Get SMS messages by type
  getSMSByType(type: string): SMSData[] {
    return this.smsMessages.filter(sms => sms.type === type);
  }

  // Clear all SMS messages
  clearSMSMessages(): void {
    this.smsMessages = [];
  }
}

export const smsService = SMSService.getInstance();
