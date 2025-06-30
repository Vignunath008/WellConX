import React, { createContext, useContext, useState, useEffect } from 'react'

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

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  registerUser: (userData: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'>) => Promise<boolean>
  getRegistrationRequests: () => RegistrationRequest[]
  approveRegistration: (requestId: string) => void
  rejectRegistration: (requestId: string) => void
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

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('wellconx_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo users with Indian names
    const demoUsers: User[] = [
      {
        id: '1',
        name: 'Dr. Rajesh Sharma',
        email: 'doctor@wellconx.com',
        role: 'doctor',
        department: 'Cardiology'
      },
      {
        id: '2',
        name: 'Nurse Priya Patel',
        email: 'nurse@wellconx.com',
        role: 'nurse',
        department: 'ICU'
      },
      {
        id: '3',
        name: 'Vikram Mehta',
        email: 'admin@wellconx.com',
        role: 'admin',
        department: 'IT'
      }
    ]

    // Check approved users from registration system
    const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
    const allUsers = [...demoUsers, ...approvedUsers]
    
    const foundUser = allUsers.find(u => u.email === email)
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser)
      localStorage.setItem('wellconx_user', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wellconx_user')
  }

  const registerUser = async (userData: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'>): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Create registration request
      const registrationRequest: RegistrationRequest = {
        ...userData,
        id: `req-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }
      
      // Store in localStorage
      const existingRequests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
      existingRequests.push(registrationRequest)
      localStorage.setItem('wellconx_registration_requests', JSON.stringify(existingRequests))
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return false
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      registerUser,
      getRegistrationRequests,
      approveRegistration,
      rejectRegistration
    }}>
      {children}
    </AuthContext.Provider>
  )
}