# EmailJS Setup Guide - Step by Step

## 🎯 Goal
Set up real email OTP functionality for WellConX forgot password system using EmailJS.

## 📋 Prerequisites
- Gmail or Outlook account
- Access to your email account for verification

---

## Step 1: Create EmailJS Account

### 1.1 Sign Up
1. Go to [EmailJS](https://www.emailjs.com/)
2. Click "Sign Up" button
3. Fill in your details:
   - **Email**: Your email address
   - **Password**: Create a strong password
4. Click "Create Account"
5. **Verify your email** by clicking the link sent to your inbox

### 1.2 Login
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Login with your credentials

---

## Step 2: Add Email Service

### 2.1 Access Email Services
1. In the left sidebar, click **"Email Services"**
2. Click **"Add New Service"** button

### 2.2 Choose Email Provider

#### Option A: Gmail (Recommended)
1. Click **"Gmail"** icon
2. Click **"Connect Account"**
3. Sign in with your Google account
4. Grant permissions to EmailJS
5. **Note down the Service ID** (e.g., `service_abc123`)

#### Option B: Outlook
1. Click **"Outlook"** icon
2. Click **"Connect Account"**
3. Sign in with your Microsoft account
4. Grant permissions to EmailJS
5. **Note down the Service ID**

### 2.3 Verify Service
- You should see your email service listed with a green checkmark
- The Service ID will be displayed (you'll need this later)

---

## Step 3: Create Email Template

### 3.1 Access Templates
1. In the left sidebar, click **"Email Templates"**
2. Click **"Create New Template"** button

### 3.2 Configure Template
1. **Template Name**: `WellConX OTP Template`
2. **Subject**: `WellConX Verification Code`

### 3.3 Add Template Content
Replace the default content with this HTML:

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

### 3.4 Save Template
1. Click **"Save"** button
2. **Note down the Template ID** (e.g., `template_xyz789`)

---

## Step 4: Get Your Credentials

### 4.1 Get Public Key
1. In the left sidebar, click **"Account"**
2. Scroll down to **"API Keys"** section
3. **Copy your Public Key** (e.g., `user_public_key_123`)

### 4.2 Collect All Credentials
You should now have:
- ✅ **Service ID**: `service_abc123` (from Step 2)
- ✅ **Template ID**: `template_xyz789` (from Step 3)
- ✅ **Public Key**: `user_public_key_123` (from Step 4.1)

---

## Step 5: Update Your Code

### 5.1 Open Configuration File
Open `src/config/emailjs-config.ts` in your code editor

### 5.2 Update Credentials
Replace the placeholder values with your actual credentials:

```typescript
export const EMAILJS_CREDENTIALS = {
  SERVICE_ID: 'service_abc123', // Your actual Service ID
  TEMPLATE_ID: 'template_xyz789', // Your actual Template ID
  PUBLIC_KEY: 'user_public_key_123' // Your actual Public Key
}
```

### 5.3 Save the File
Save the file and the changes will be automatically applied.

---

## Step 6: Test Your Setup

### 6.1 Check Configuration Status
1. Go to your WellConX app: `http://localhost:3004/forgot-password`
2. Look for the **EmailJS Configuration** status box in the bottom-right corner
3. It should show: **"✅ EmailJS is properly configured"**

### 6.2 Test Email OTP
1. Enter your email address (use a real email you can access)
2. Click "Send Verification Code"
3. Check your email inbox (and spam folder)
4. You should receive a beautifully formatted email with the OTP

### 6.3 Verify OTP Works
1. Enter the OTP from your email
2. Create a new password
3. Test logging in with the new password

---

## 🎉 Success!

If everything works correctly:
- ✅ You'll receive real emails with OTPs
- ✅ The emails will be professionally formatted
- ✅ The forgot password system is fully functional
- ✅ No more console-only OTPs!

---

## 🔧 Troubleshooting

### Issue: "EmailJS not configured" message
**Solution**: Double-check your credentials in `src/config/emailjs-config.ts`

### Issue: No email received
**Solutions**:
1. Check spam/junk folder
2. Verify email address is correct
3. Check EmailJS dashboard for delivery status
4. Ensure email service is properly connected

### Issue: "Failed to send OTP" error
**Solutions**:
1. Verify all three credentials are correct
2. Check EmailJS dashboard for error logs
3. Ensure your email service is active

### Issue: Template variables not working
**Solution**: Make sure you're using the exact variable names:
- `{{to_name}}` - recipient's name
- `{{otp_code}}` - the 6-digit OTP
- `{{app_name}}` - "WellConX"

---

## 📞 Support

If you encounter issues:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Review EmailJS dashboard for error logs
3. Verify your email service is properly connected

---

## 🚀 Next Steps

Once EmailJS is working:
1. Test with different email addresses
2. Consider setting up email delivery monitoring
3. For production, consider using environment variables for credentials
4. Set up rate limiting for OTP requests

**Congratulations! You now have a fully functional email OTP system! 🎉** 