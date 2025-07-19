# Google OAuth Setup Guide for WellConX

This guide will help you set up Google OAuth authentication for your WellConX application.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your WellConX application running locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "WellConX OAuth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: WellConX
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. On "Scopes" page, click "Save and Continue"
7. On "Test users" page, add your email address as a test user
8. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Fill in the details:
   - **Name**: WellConX Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:3001`
     - `http://localhost:3002`
     - `http://localhost:3003`
     - `http://localhost:3004`
     - `http://localhost:3005`
     - Add your production domain when ready
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/google/callback`
     - `http://localhost:3001/auth/google/callback`
     - Add your production callback URL when ready
5. Click "Create"

## Step 5: Get Your Credentials

After creating the OAuth client, you'll see:
- **Client ID**: A long string starting with numbers
- **Client Secret**: A secret string (keep this secure)

## Step 6: Update Your Application

1. Open `src/utils/googleOAuth.ts`
2. Replace the placeholder values:

```typescript
export const GOOGLE_OAUTH_CONFIG = {
  clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE', // Replace with your Client ID
  clientSecret: 'YOUR_ACTUAL_CLIENT_SECRET_HERE', // Replace with your Client Secret
  redirectUri: window.location.origin + '/auth/google/callback',
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
}
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Go to your application
3. Click "Sign in with Google" or "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you should be logged in

## Step 8: Production Deployment

When deploying to production:

1. Update the OAuth consent screen:
   - Go to "OAuth consent screen"
   - Click "Publish App" (removes the "unverified app" warning)

2. Update authorized origins and redirect URIs:
   - Add your production domain to authorized JavaScript origins
   - Add your production callback URL to authorized redirect URIs

3. Update the `googleOAuth.ts` file with production URLs

## Troubleshooting

### Common Issues:

1. **"Error: redirect_uri_mismatch"**
   - Make sure your redirect URI in Google Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Error: invalid_client"**
   - Verify your Client ID is correct
   - Make sure you're using the right credentials

3. **"Error: access_denied"**
   - Check if your app is in testing mode
   - Add your email as a test user
   - Make sure you've enabled the necessary APIs

4. **"Error: popup_closed_by_user"**
   - This is normal if user cancels the OAuth flow
   - Handle gracefully in your application

### Debug Tips:

1. Check browser console for detailed error messages
2. Verify all URLs are HTTPS in production
3. Make sure your domain is added to authorized origins
4. Check that the Google+ API is enabled

## Security Best Practices

1. **Never expose Client Secret in frontend code**
   - The client secret should only be used on your backend
   - For frontend-only apps, use the Client ID only

2. **Use HTTPS in production**
   - Google OAuth requires HTTPS for production domains

3. **Validate tokens on your backend**
   - Always verify tokens server-side for sensitive operations

4. **Implement proper error handling**
   - Handle OAuth errors gracefully
   - Provide fallback authentication methods

## Environment Variables (Recommended)

For better security, use environment variables:

```typescript
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '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',
  // ... other config
}
```

Create a `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=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
```

## Support

If you encounter issues:
1. Check the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
2. Review the [Google Identity Services guide](https://developers.google.com/identity/gsi/web)
3. Check browser console for detailed error messages

## Next Steps

After setting up Google OAuth:
1. Test the login flow thoroughly
2. Implement proper error handling
3. Add loading states and user feedback
4. Consider implementing Google One Tap sign-in
5. Add logout functionality
6. Test on different browsers and devices 