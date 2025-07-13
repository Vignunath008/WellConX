import React, { createContext, useContext, useState, useEffect } from 'react'
import { EmailService } from '../utils/emailService'
import { GoogleOAuthService, GoogleOneTap } from '../utils/googleOAuth'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'doctor' | 'nurse'
  department: string
  picture?: string
}

interface RegistrationRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  role: 'doctor' | 'nurse'
  licenseNumber: string
  specialization: string
  department: string
  yearsOfExperience: string
  currentEmployer: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

interface OTPData {
  email: string
  otp: string
  expiresAt: number
  attempts: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: (userInfo?: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  currentModule: string | null
  setCurrentModule: (module: string | null) => void
  logoutAndReturnToPlatform: () => void
  registerUser: (userData: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'> & { password: string }) => Promise<boolean>
  registerWithGoogle: (userInfo?: any) => Promise<boolean>
  getRegistrationRequests: () => RegistrationRequest[]
  approveRegistration: (requestId: string) => void
  rejectRegistration: (requestId: string) => void
  // Forgot password methods
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentModule, setCurrentModule] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('wellconx_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Check for Google OAuth session
      const googleUserInfo = GoogleOAuthService.getStoredUserInfo()
      const googleAccessToken = GoogleOAuthService.getAccessToken()
      
      if (googleUserInfo && googleAccessToken) {
        // Check if this Google user exists in our system
        const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
        const existingUser = approvedUsers.find((u: User) => u.email === googleUserInfo.email)
        
        if (existingUser) {
          // User exists, restore their session
          setUser(existingUser)
          localStorage.setItem('wellconx_user', JSON.stringify(existingUser))
        } else {
          // Create new user from Google info
          const newUser: User = {
            id: `google-${Date.now()}`,
            name: googleUserInfo.name || googleUserInfo.email.split('@')[0],
            email: googleUserInfo.email,
            role: 'doctor',
            department: 'General Medicine',
            picture: googleUserInfo.picture
          }
          
          // Add to approved users
          approvedUsers.push(newUser)
          localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))
          
          // Set as current user
          setUser(newUser)
          localStorage.setItem('wellconx_user', JSON.stringify(newUser))
        }
      }
    }
    
    const storedModule = localStorage.getItem('wellconx_current_module')
    if (storedModule) {
      setCurrentModule(storedModule)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Only check registered users
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      const foundRegisteredUser = approvedUsers.find((u: User) => u.email === email)
      if (foundRegisteredUser) {
        // Check user credentials
        const userCredentials = JSON.parse(localStorage.getItem('wellconx_user_credentials') || '[]')
        const credential = userCredentials.find((cred: { email: string; password: string; userId: string }) => cred.email === email)
        if (credential && password === credential.password) {
          setUser(foundRegisteredUser)
          localStorage.setItem('wellconx_user', JSON.stringify(foundRegisteredUser))
          return true
        }
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Sign out from Google OAuth if user was signed in with Google
    if (user?.id?.startsWith('google-')) {
      GoogleOAuthService.signOut()
    }
    
    setUser(null)
    setCurrentModule(null)
    localStorage.removeItem('wellconx_user')
    localStorage.removeItem('wellconx_current_module')
  }

  const logoutAndReturnToPlatform = () => {
    // Sign out from Google OAuth if user was signed in with Google
    if (user?.id?.startsWith('google-')) {
      GoogleOAuthService.signOut()
    }
    
    // Clear user session and module state
    setUser(null)
    setCurrentModule(null)
    localStorage.removeItem('wellconx_user')
    localStorage.removeItem('wellconx_current_module')
  }
  const handleSetCurrentModule = (module: string | null) => {
    setCurrentModule(module)
    if (module) {
      localStorage.setItem('wellconx_current_module', module)
    } else {
      localStorage.removeItem('wellconx_current_module')
    }
  }

  const registerUser = async (userData: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'> & { password: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Create registration request
      const registrationRequest: RegistrationRequest = {
        ...userData,
        id: `req-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'approved' // Auto-approve for immediate access
      }
      // Store in localStorage
      const existingRequests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
      existingRequests.push(registrationRequest)
      localStorage.setItem('wellconx_registration_requests', JSON.stringify(existingRequests))
      // Automatically create a user account for immediate login
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        picture: undefined
      }
      // Add to approved users
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      approvedUsers.push(newUser)
      localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))
      // Store user credentials for login (in a real app, this would be hashed)
      const userCredentials = {
        email: userData.email,
        password: userData.password,
        userId: newUser.id
      }
      const existingCredentials = JSON.parse(localStorage.getItem('wellconx_user_credentials') || '[]')
      existingCredentials.push(userCredentials)
      localStorage.setItem('wellconx_user_credentials', JSON.stringify(existingCredentials))
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getRegistrationRequests = (): RegistrationRequest[] => {
    return JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
  }

  const approveRegistration = (requestId: string) => {
    const requests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
    const requestIndex = requests.findIndex((req: RegistrationRequest) => req.id === requestId)
    
    if (requestIndex !== -1) {
      const request = requests[requestIndex]
      request.status = 'approved'
      
      // Update the request
      requests[requestIndex] = request
      localStorage.setItem('wellconx_registration_requests', JSON.stringify(requests))
      
      // Create a new user from the approved request
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: `${request.firstName} ${request.lastName}`,
        email: request.email,
        role: request.role,
        department: request.department
      }
      
      // Add to approved users
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      approvedUsers.push(newUser)
      localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))
    }
  }

  const rejectRegistration = (requestId: string) => {
    const requests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
    const requestIndex = requests.findIndex((req: RegistrationRequest) => req.id === requestId)
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = 'rejected'
      localStorage.setItem('wellconx_registration_requests', JSON.stringify(requests))
    }
  }

  const loginWithGoogle = async (userInfo?: any): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // If userInfo is provided, use it directly (from completed OAuth flow)
      // Otherwise, try to get from storage (for session restoration)
      const googleUserInfo = userInfo || GoogleOAuthService.getStoredUserInfo()
      
      if (!googleUserInfo) {
        throw new Error('Failed to get Google user information')
      }
      
      // Check if user already exists in our system
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      const existingUser = approvedUsers.find((u: User) => u.email === googleUserInfo.email)
      
      if (existingUser) {
        // User exists, log them in
        setUser(existingUser)
        localStorage.setItem('wellconx_user', JSON.stringify(existingUser))
        return true
      } else {
        // New user, create account automatically
        const newUser: User = {
          id: `google-${Date.now()}`,
          name: googleUserInfo.name || googleUserInfo.email.split('@')[0],
          email: googleUserInfo.email,
          role: 'doctor', // Default role for Google users
          department: 'General Medicine',
          picture: googleUserInfo.picture
        }
        
        // Add to approved users
        approvedUsers.push(newUser)
        localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))
        
        // Set as current user
        setUser(newUser)
        localStorage.setItem('wellconx_user', JSON.stringify(newUser))
        
        return true
      }
    } catch (error) {
      console.error('Google login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithGoogle = async (userInfo?: any): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // If userInfo is provided, use it directly (from completed OAuth flow)
      // Otherwise, try to get from storage (for session restoration)
      const googleUserInfo = userInfo || GoogleOAuthService.getStoredUserInfo()
      
      if (!googleUserInfo) {
        throw new Error('Failed to get Google user information')
      }
      
      // Create registration request with Google user info
      const googleRegistration: RegistrationRequest = {
        id: `google-req-${Date.now()}`,
        firstName: googleUserInfo.given_name || googleUserInfo.name?.split(' ')[0] || 'Google',
        lastName: googleUserInfo.family_name || googleUserInfo.name?.split(' ').slice(1).join(' ') || 'User',
        email: googleUserInfo.email,
        phone: '+1234567890', // Default phone
        dateOfBirth: '1990-01-01', // Default date
        gender: 'male', // Default gender
        role: 'doctor',
        licenseNumber: `GOOGLE${Date.now()}`,
        specialization: 'General Medicine',
        department: 'Primary Care',
        yearsOfExperience: '5',
        currentEmployer: 'Google Health',
        submittedAt: new Date().toISOString(),
        status: 'approved' // Auto-approve Google users
      }
      
      // Store registration request
      const existingRequests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
      existingRequests.push(googleRegistration)
      localStorage.setItem('wellconx_registration_requests', JSON.stringify(existingRequests))
      
      // Also create user account immediately
      const newUser: User = {
        id: `google-${Date.now()}`,
        name: googleUserInfo.name || googleUserInfo.email.split('@')[0],
        email: googleUserInfo.email,
        role: 'doctor',
        department: 'Primary Care',
        picture: googleUserInfo.picture
      }
      
      // Add to approved users
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      approvedUsers.push(newUser)
      localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))
      
      return true
    } catch (error) {
      console.error('Google registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Generate a random 6-digit OTP
  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Send OTP to user's email
  const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if user exists
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      const userExists = approvedUsers.find((u: User) => u.email === email)
      
      if (!userExists) {
        return { success: false, message: 'No account found with this email address.' }
      }

      // Generate OTP
      const otp = generateOTP()
      const expiresAt = Date.now() + (10 * 60 * 1000) // 10 minutes from now
      
      // Store OTP data
      const otpData: OTPData = {
        email,
        otp,
        expiresAt,
        attempts: 0
      }
      
      // Store in localStorage
      const existingOTPs = JSON.parse(localStorage.getItem('wellconx_otps') || '[]')
      // Remove any existing OTP for this email
      const filteredOTPs = existingOTPs.filter((otp: OTPData) => otp.email !== email)
      filteredOTPs.push(otpData)
      localStorage.setItem('wellconx_otps', JSON.stringify(filteredOTPs))
      
      // Get user name for email
      const userName = userExists.name || email.split('@')[0]
      
      // Send email using EmailJS service (or fallback for development)
      const emailResult = await EmailService.sendOTPEmail({
        to_email: email,
        to_name: userName,
        otp_code: otp,
        app_name: 'WellConX'
      })
      
      if (emailResult.success) {
        return { success: true, message: emailResult.message }
      } else {
        // If email fails, return the error message
        return { success: false, message: emailResult.message }
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return { success: false, message: 'Failed to send OTP. Please try again.' }
    }
  }

  // Verify OTP
  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const otps = JSON.parse(localStorage.getItem('wellconx_otps') || '[]')
      const otpData = otps.find((otpEntry: OTPData) => otpEntry.email === email)
      
      if (!otpData) {
        return { success: false, message: 'No OTP found for this email. Please request a new OTP.' }
      }
      
      // Check if OTP has expired
      if (Date.now() > otpData.expiresAt) {
        // Remove expired OTP
        const filteredOTPs = otps.filter((otpEntry: OTPData) => otpEntry.email !== email)
        localStorage.setItem('wellconx_otps', JSON.stringify(filteredOTPs))
        return { success: false, message: 'OTP has expired. Please request a new OTP.' }
      }
      
      // Check attempts
      if (otpData.attempts >= 3) {
        // Remove OTP after too many attempts
        const filteredOTPs = otps.filter((otpEntry: OTPData) => otpEntry.email !== email)
        localStorage.setItem('wellconx_otps', JSON.stringify(filteredOTPs))
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' }
      }
      
      // Verify OTP
      if (otpData.otp === otp) {
        // Remove OTP after successful verification
        const filteredOTPs = otps.filter((otpEntry: OTPData) => otpEntry.email !== email)
        localStorage.setItem('wellconx_otps', JSON.stringify(filteredOTPs))
        return { success: true, message: 'OTP verified successfully.' }
      } else {
        // Increment attempts
        otpData.attempts += 1
        const otpIndex = otps.findIndex((otpEntry: OTPData) => otpEntry.email === email)
        otps[otpIndex] = otpData
        localStorage.setItem('wellconx_otps', JSON.stringify(otps))
        
        return { success: false, message: 'Invalid OTP. Please try again.' }
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return { success: false, message: 'Failed to verify OTP. Please try again.' }
    }
  }

  // Reset password
  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Update user credentials
      const userCredentials = JSON.parse(localStorage.getItem('wellconx_user_credentials') || '[]')
      const credentialIndex = userCredentials.findIndex((cred: { email: string; password: string; userId: string }) => cred.email === email)
      
      if (credentialIndex === -1) {
        return { success: false, message: 'User credentials not found.' }
      }
      
      // Update password
      userCredentials[credentialIndex].password = newPassword
      localStorage.setItem('wellconx_user_credentials', JSON.stringify(userCredentials))
      
      return { success: true, message: 'Password reset successfully. You can now login with your new password.' }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, message: 'Failed to reset password. Please try again.' }
    }
  }

  // Resend OTP
  const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Remove any existing OTP for this email
      const existingOTPs = JSON.parse(localStorage.getItem('wellconx_otps') || '[]')
      const filteredOTPs = existingOTPs.filter((otp: OTPData) => otp.email !== email)
      localStorage.setItem('wellconx_otps', JSON.stringify(filteredOTPs))
      
      // Send new OTP
      return await sendOTP(email)
    } catch (error) {
      console.error('Resend OTP error:', error)
      return { success: false, message: 'Failed to resend OTP. Please try again.' }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle,
      logout, 
      isLoading,
      currentModule,
      setCurrentModule: handleSetCurrentModule,
      logoutAndReturnToPlatform,
      registerUser,
      registerWithGoogle,
      getRegistrationRequests,
      approveRegistration,
      rejectRegistration,
      sendOTP,
      verifyOTP,
      resetPassword,
      resendOTP
    }}>
      {children}
    </AuthContext.Provider>
  )
}