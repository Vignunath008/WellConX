# Email OTP Setup Guide for WellConX

## Overview

This guide will help you set up real email OTP functionality for the WellConX forgot password system. Currently, the system uses a development fallback that displays OTPs in the browser console.

## Current Status

✅ **Development Mode**: OTPs are displayed in browser console  
🔄 **Production Ready**: Configure any email service below

## Option 1: EmailJS (Recommended - No Backend Required)

### Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up
2. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail**: Use your Gmail account
   - **Outlook**: Use your Outlook account
   - **Custom SMTP**: For any email provider

### Step 3: Create Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WellConX Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">WellConX</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Healthcare Innovation Platform</p>
        </div>
        
        <h2 style="color: #1f2937; margin-bottom: 20px;">Verification Code</h2>
        
        <p style="color: #374151; margin-bottom: 20px;">Hello {{to_name}},</p>
        
        <p style="color: #374151; margin-bottom: 20px;">You requested a password reset for your WellConX account. Use the verification code below to complete the process:</p>
        
        <div style="background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
            <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 12px; margin: 0; font-weight: bold;">{{otp_code}}</h1>
        </div>
        
        <p style="color: #374151; margin-bottom: 20px;"><strong>This code will expire in 10 minutes.</strong></p>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't request this code, please ignore this email and ensure your account is secure.
            </p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
            This is an automated message from WellConX. Please do not reply to this email.<br>
            For support, contact your system administrator.
        </p>
    </div>
</body>
</html>
```

### Step 4: Update Configuration

1. Get your credentials from EmailJS dashboard:
   - Service ID
   - Template ID  
   - Public Key

2. Update `src/utils/emailService.ts`:

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id', // From EmailJS dashboard
  TEMPLATE_ID: 'your_actual_template_id', // From EmailJS dashboard
  PUBLIC_KEY: 'your_actual_public_key' // From EmailJS dashboard
}
```

3. Update AuthContext to use real email:

```typescript
// In src/contexts/AuthContext.tsx, change this line:
const emailResult = await EmailService.sendOTPEmailFallback({

// To this:
const emailResult = await EmailService.sendOTPEmail({
```

## Option 2: SendGrid (Professional Email Service)

### Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/) and sign up
2. Verify your email and domain

### Step 2: Install SendGrid

```bash
npm install @sendgrid/mail
```

### Step 3: Create SendGrid Service

Create `src/utils/sendgridService.ts`:

```typescript
import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = 'your_sendgrid_api_key'

export class SendGridService {
  static async sendOTPEmail(emailData: {
    to_email: string
    to_name: string
    otp_code: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      sgMail.setApiKey(SENDGRID_API_KEY)
      
      const msg = {
        to: emailData.to_email,
        from: 'noreply@yourdomain.com', // Verified sender
        subject: 'WellConX Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">WellConX Verification Code</h2>
            <p>Hello ${emailData.to_name},</p>
            <p>Your verification code is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">${emailData.otp_code}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `
      }
      
      await sgMail.send(msg)
      return { success: true, message: 'OTP sent successfully to your email address.' }
    } catch (error) {
      console.error('SendGrid error:', error)
      return { success: false, message: 'Failed to send OTP. Please try again.' }
    }
  }
}
```

## Option 3: Backend API (Most Secure)

### Step 1: Create Backend API

Create a simple backend endpoint (Node.js/Express example):

```javascript
// server.js
const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
})

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, name, otp } = req.body
    
    const mailOptions = {
      from: 'noreply@wellconx.com',
      to: email,
      subject: 'WellConX Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">WellConX Verification Code</h2>
          <p>Hello ${name},</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    }
    
    await transporter.sendMail(mailOptions)
    res.json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})
```

### Step 2: Update Frontend

Update `src/utils/emailService.ts` to use the backend API:

```typescript
export class BackendEmailService {
  static async sendOTPEmail(emailData: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('http://localhost:3001/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailData.to_email,
          name: emailData.to_name,
          otp: emailData.otp_code
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Backend email error:', error)
      return { success: false, message: 'Failed to send OTP. Please try again.' }
    }
  }
}
```

## Testing Your Email Setup

### 1. Development Testing

1. Open browser developer tools (F12)
2. Go to Console tab
3. Try the forgot password flow
4. Check console for OTP or email delivery status

### 2. Production Testing

1. Use a real email address
2. Check your email inbox (and spam folder)
3. Verify OTP works in the application

## Troubleshooting

### Common Issues

1. **OTP not received**:
   - Check spam/junk folder
   - Verify email address is correct
   - Check EmailJS/SendGrid dashboard for delivery status

2. **EmailJS errors**:
   - Verify Service ID, Template ID, and Public Key
   - Check EmailJS dashboard for error logs
   - Ensure email service is properly configured

3. **SendGrid errors**:
   - Verify API key is correct
   - Check sender email is verified
   - Review SendGrid activity logs

### Security Best Practices

1. **Rate Limiting**: Implement rate limiting for OTP requests
2. **Email Verification**: Verify email addresses before sending OTPs
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Store API keys in environment variables
5. **Monitoring**: Set up email delivery monitoring

## Quick Start (Recommended)

For immediate testing, use **EmailJS**:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Add Gmail service
3. Create email template (use the one above)
4. Update `src/utils/emailService.ts` with your credentials
5. Change `sendOTPEmailFallback` to `sendOTPEmail` in AuthContext
6. Test with your email address

This will give you real email OTP functionality without needing a backend server! 