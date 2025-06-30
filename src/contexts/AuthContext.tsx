import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'doctor' | 'nurse'
  department: string
  picture?: string
}

interface GoogleUser {
  iss: string
  nbf: number
  aud: string
  sub: string
  email: string
  email_verified: boolean
  azp: string
  name: string
  picture: string
  given_name: string
  family_name: string
  iat: number
  exp: number
  jti: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: (credential: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
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
    
    // Demo users
    const demoUsers: User[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'doctor@wellconx.com',
        role: 'doctor',
        department: 'Cardiology'
      },
      {
        id: '2',
        name: 'Nurse Mary Wilson',
        email: 'nurse@wellconx.com',
        role: 'nurse',
        department: 'ICU'
      },
      {
        id: '3',
        name: 'Admin User',
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

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Decode the JWT token from Google
      const decodedUser = jwtDecode<GoogleUser>(credential)
      
      // Check if this Google user is in our approved users
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      let foundUser = approvedUsers.find((u: User) => u.email === decodedUser.email)
      
      // For demo purposes, auto-approve Google users with specific domains
      // In a real app, you would check against your database
      if (!foundUser) {
        // Check if it's one of our demo users
        const demoUsers: User[] = [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            email: 'doctor@wellconx.com',
            role: 'doctor',
            department: 'Cardiology'
          },
          {
            id: '2',
            name: 'Nurse Mary Wilson',
            email: 'nurse@wellconx.com',
            role: 'nurse',
            department: 'ICU'
          },
          {
            id: '3',
            name: 'Admin User',
            email: 'admin@wellconx.com',
            role: 'admin',
            department: 'IT'
          }
        ]
        
        foundUser = demoUsers.find(u => u.email === decodedUser.email)
        
        // If not a demo user, create a new user with default role
        if (!foundUser) {
          // Auto-approve for demo purposes
          // In a real app, you might want to put this in a pending state
          foundUser = {
            id: `google-${Date.now()}`,
            name: decodedUser.name,
            email: decodedUser.email,
            role: 'doctor', // Default role
            department: 'General', // Default department
            picture: decodedUser.picture
          }
          
          // Save to approved users
          approvedUsers.push(foundUser)
          localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))
        } else {
          // Add picture from Google if not present
          foundUser.picture = decodedUser.picture
        }
      }
      
      // Set the user in state and localStorage
      setUser(foundUser)
      localStorage.setItem('wellconx_user', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Google login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wellconx_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}