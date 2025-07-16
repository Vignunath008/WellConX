// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '355099186973-t0pcddr0rvogf3n9rgtafm40s4d6lbgq.apps.googleusercontent.com',
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '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',
  redirectUri: import.meta.env.PROD 
    ? 'https://fascinating-meringue-b69602.netlify.app/auth/google/callback'
    : window.location.origin + '/auth/google/callback',
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
}

// Google OAuth utility functions
export class GoogleOAuthService {
  private static googleAuth: any = null;
  private static isInitialized = false;

  // Initialize Google OAuth
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // @ts-ignore
        if (window.google) {
          // @ts-ignore
          this.googleAuth = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_OAUTH_CONFIG.clientId,
            scope: GOOGLE_OAUTH_CONFIG.scope,
            callback: (response: any) => {
              if (response.error) {
                console.error('Google OAuth error:', response.error);
                // We'll handle this in the signIn method
              } else {
                this.handleAuthSuccess(response);
              }
            },
          });
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Failed to load Google Identity Services'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Handle successful authentication
  private static handleAuthSuccess(response: any): void {
    console.log('Google OAuth success:', response);
    
    // Store the access token
    localStorage.setItem('google_access_token', response.access_token);
    
    // Get user info using the access token
    this.getUserInfo(response.access_token);
  }

  // Get user information from Google
  private static async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userInfo = await response.json();
      console.log('Google user info:', userInfo);
      
      // Store user info
      localStorage.setItem('google_user_info', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Start Google OAuth flow
  static async signIn(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Set up a timeout to handle cases where the callback doesn't fire
        const timeout = setTimeout(() => {
          reject(new Error('Google OAuth timeout - authentication took too long'));
        }, 30000); // 30 second timeout

        // Override the callback to handle the complete flow
        const originalCallback = this.googleAuth.callback;
        this.googleAuth.callback = async (response: any) => {
          clearTimeout(timeout);
          
          if (response.error) {
            console.error('Google OAuth error:', response.error);
            reject(new Error(response.error));
            return;
          }
          
          try {
            // Store the access token
            localStorage.setItem('google_access_token', response.access_token);
            
            // Get user info and wait for it to complete
            const userInfo = await this.getUserInfo(response.access_token);
            
            // Resolve with the complete user info
            resolve({ success: true, userInfo });
          } catch (error) {
            console.error('Error in Google OAuth callback:', error);
            reject(error);
          }
        };

        // Request the access token
        this.googleAuth.requestAccessToken();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Sign out from Google
  static signOut(): void {
    // @ts-ignore
    if (window.google && window.google.accounts.oauth2.revoke) {
      const accessToken = localStorage.getItem('google_access_token');
      if (accessToken) {
        // @ts-ignore
        window.google.accounts.oauth2.revoke(accessToken, () => {
          console.log('Google OAuth token revoked');
        });
      }
    }
    
    // Clear stored data
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_user_info');
  }

  // Check if user is signed in with Google
  static isSignedIn(): boolean {
    return !!localStorage.getItem('google_access_token');
  }

  // Get stored Google user info
  static getStoredUserInfo(): any {
    const userInfo = localStorage.getItem('google_user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Get stored access token
  static getAccessToken(): string | null {
    return localStorage.getItem('google_access_token');
  }
}

// Google One Tap Sign-In
export class GoogleOneTap {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // @ts-ignore
        if (window.google) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: GOOGLE_OAUTH_CONFIG.clientId,
            callback: (response: any) => {
              if (response.credential) {
                this.handleOneTapSuccess(response);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Failed to load Google Identity Services'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };
      
      document.head.appendChild(script);
    });
  }

  private static handleOneTapSuccess(response: any): void {
    console.log('Google One Tap success:', response);
    
    // Decode the JWT token to get user info
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('Decoded user info:', payload);
    
    // Store user info
    localStorage.setItem('google_user_info', JSON.stringify(payload));
    localStorage.setItem('google_credential', response.credential);
  }

  static async prompt(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // @ts-ignore
    if (window.google && window.google.accounts.id) {
      // @ts-ignore
      window.google.accounts.id.prompt();
    }
  }

  static cancel(): void {
    // @ts-ignore
    if (window.google && window.google.accounts.id) {
      // @ts-ignore
      window.google.accounts.id.cancel();
    }
  }
} 