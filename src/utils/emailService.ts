import emailjs from '@emailjs/browser';

export interface EmailData {
  to_email: string;
  to_name: string;
  otp_code: string;
  app_name: string;
}

export class EmailService {
  // EmailJS Configuration
  private static SERVICE_ID = 'service_e2wosqg'; // ✅ Your EmailJS service ID
  private static TEMPLATE_ID = 'template_s0kxnul'; // ✅ Your EmailJS template ID
  private static PUBLIC_KEY = 'OPzNoxV3IszhG0iay'; // ✅ Your EmailJS public key

  static async sendOTPEmail(emailData: EmailData): Promise<{ success: boolean; message: string }> {
    // Try different parameter structures that EmailJS might expect
    const templateParams = {
      user_name: emailData.to_name,
      otp_code: emailData.otp_code,
      to_email: emailData.to_email,
      user_email: emailData.to_email, // Alternative parameter name
      email: emailData.to_email, // Another common parameter name
      message: `Hello ${emailData.to_name}, your verification code is ${emailData.otp_code}. This code will expire in 10 minutes.`
    };

    try {
      console.log('📧 Sending email via EmailJS to:', emailData.to_email);
      console.log('📋 Template params:', templateParams);

      const result = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );

      console.log('✅ Email sent successfully via EmailJS');
      return { success: true, message: 'OTP sent successfully to your email address.' };

    } catch (error: any) {
      console.error('❌ EmailJS error:', error);
      console.error('Error details:', {
        serviceId: this.SERVICE_ID,
        templateId: this.TEMPLATE_ID,
        publicKey: this.PUBLIC_KEY?.substring(0, 10) + '...',
        templateParams: templateParams,
        errorText: error.text,
        errorStatus: error.status
      });
      
      // Provide more specific error messages
      if (error.text === 'The recipients address is empty') {
        return { 
          success: false, 
          message: 'Email configuration error: Recipient address not found. Please check EmailJS template configuration. Make sure your template uses {{to_email}}, {{user_email}}, or {{email}} as the recipient variable.' 
        };
      }
      
      return { success: false, message: `Failed to send OTP: ${error.text || 'Unknown error'}` };
    }
  }

  // Method to check if EmailJS is configured
  static isConfigured(): boolean {
    return true; // All credentials are configured
  }
}

 