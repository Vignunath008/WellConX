// Email Configuration for WellConX
// This file allows easy switching between development and production email services

export const EMAIL_CONFIG = {
  // Development Mode (shows OTP in console)
  DEVELOPMENT: {
    mode: 'development',
    service: 'console',
    description: 'OTP displayed in browser console'
  },
  
  // Production Mode - EmailJS
  EMAILJS: {
    mode: 'production',
    service: 'emailjs',
    serviceId: process.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
    templateId: process.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
    publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'
  },
  
  // Production Mode - SendGrid
  SENDGRID: {
    mode: 'production',
    service: 'sendgrid',
    apiKey: process.env.VITE_SENDGRID_API_KEY || 'your_sendgrid_api_key',
    fromEmail: process.env.VITE_SENDGRID_FROM_EMAIL || 'noreply@wellconx.com'
  },
  
  // Production Mode - Backend API
  BACKEND: {
    mode: 'production',
    service: 'backend',
    apiUrl: process.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/send-otp'
  }
}

// Current email service configuration
// Change this to switch between different email services
export const CURRENT_EMAIL_SERVICE = EMAIL_CONFIG.DEVELOPMENT

// Helper function to check if we're in development mode
export const isDevelopmentMode = () => {
  return CURRENT_EMAIL_SERVICE.mode === 'development'
}

// Helper function to get service type
export const getEmailServiceType = () => {
  return CURRENT_EMAIL_SERVICE.service
}

// Environment variables setup guide
export const ENV_VARIABLES_GUIDE = `
# Add these to your .env file for production email services

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# SendGrid Configuration
VITE_SENDGRID_API_KEY=your_sendgrid_api_key
VITE_SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Backend API Configuration
VITE_EMAIL_API_URL=http://localhost:3001/api/send-otp
` 