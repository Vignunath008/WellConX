// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CREDENTIALS = {
  // Get these from your EmailJS dashboard
  SERVICE_ID: 'your_service_id', // From Email Services section
  TEMPLATE_ID: 'your_template_id', // From Email Templates section  
  PUBLIC_KEY: 'your_public_key' // From Account section
}

// Instructions:
// 1. Go to EmailJS dashboard: https://dashboard.emailjs.com/
// 2. Copy your Service ID from "Email Services"
// 3. Copy your Template ID from "Email Templates"
// 4. Copy your Public Key from "Account"
// 5. Replace the values above with your actual credentials
// 6. Save this file
// 7. The forgot password system will now send real emails!

export const EMAILJS_SETUP_STATUS = {
  isConfigured: EMAILJS_CREDENTIALS.SERVICE_ID !== 'your_service_id' &&
                EMAILJS_CREDENTIALS.TEMPLATE_ID !== 'your_template_id' &&
                EMAILJS_CREDENTIALS.PUBLIC_KEY !== 'your_public_key',
  
  getStatusMessage: () => {
    if (EMAILJS_CREDENTIALS.SERVICE_ID === 'your_service_id') {
      return '❌ Service ID not configured'
    }
    if (EMAILJS_CREDENTIALS.TEMPLATE_ID === 'your_template_id') {
      return '❌ Template ID not configured'
    }
    if (EMAILJS_CREDENTIALS.PUBLIC_KEY === 'your_public_key') {
      return '❌ Public Key not configured'
    }
    return '✅ EmailJS is properly configured'
  }
} 