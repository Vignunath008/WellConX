# EmailJS Setup Guide for WellConX

## 🎯 Goal
Set up EmailJS to send real OTP emails for the forgot password functionality.

## 📧 EmailJS Overview
- ✅ **200 emails per month** for free
- ✅ **Simple setup** - no server required
- ✅ **Works directly in browser**
- ✅ **Professional email delivery**

---

## 🚀 Step-by-Step Setup

### Step 1: Sign Up for EmailJS
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Get Started"
3. Sign up with your email address
4. Verify your email

### Step 2: Create Email Service
1. **Login to EmailJS Dashboard**
2. Go to **"Email Services"** section
3. Click **"Add New Service"**
4. Choose **"Gmail"** (recommended) or **"Outlook"**
5. **Connect your email account**
6. **Copy the Service ID** (starts with `service_`)

### Step 3: Create Email Template
1. Go to **"Email Templates"** section
2. Click **"Create New Template"**
3. **Template Name**: `WellConX OTP`
4. **Subject**: `WellConX Verification Code`
5. **HTML Content**:

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

6. **Save the template**
7. **Copy the Template ID** (starts with `template_`)

### Step 4: Get Public Key
1. Go to **"Account"** section
2. Click **"API Keys"**
3. **Copy your Public Key** (starts with `user_`)

### Step 5: Update Your Code
1. **Open** `src/utils/emailService.ts`
2. **Replace the placeholder values**:

```typescript
private static SERVICE_ID = 'service_your_actual_service_id';
private static TEMPLATE_ID = 'template_your_actual_template_id';
private static PUBLIC_KEY = 'user_your_actual_public_key';
```

3. **Save the file**

### Step 6: Test Immediately
1. Go to your app: `http://localhost:3003/forgot-password`
2. Enter your email
3. Check your inbox for the OTP!

---

## 🔧 Alternative: Quick Configuration

If you want to configure EmailJS programmatically, you can use:

```typescript
import { EmailService } from '../utils/emailService';

// Configure EmailJS
EmailService.configure(
  'service_your_service_id',
  'template_your_template_id', 
  'user_your_public_key'
);
```

---

## 🧪 Testing Your Setup

### Current Status
- **Development Mode**: OTPs show in browser console
- **Production Mode**: OTPs sent via EmailJS

### Test Steps
1. **Open browser console** (F12)
2. **Go to forgot password**: `http://localhost:3003/forgot-password`
3. **Enter your email**
4. **Check console** for OTP (development mode)
5. **Check email inbox** (if configured)

---

## 🚨 Important Notes

### Free Limits
- **EmailJS**: 200 emails per month
- **Gmail**: 500 emails per day (if using Gmail service)

### For Production
- Consider upgrading to paid plans
- Set up email delivery monitoring
- Implement rate limiting

### Security
- Keep API keys secure
- Use environment variables in production
- Monitor for abuse

---

## 🎉 Success!
Once configured, users will receive professional HTML emails with OTP codes when they request password resets.

---

## 📞 Need Help?

If you're having issues:
1. **Check EmailJS dashboard** for service status
2. **Verify template variables** match the code
3. **Check browser console** for error messages
4. **Ensure email service is connected** properly 