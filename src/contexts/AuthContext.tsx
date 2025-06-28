import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'doctor' | 'nurse'
  department: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
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
    
    const foundUser = demoUsers.find(u => u.email === email)
    
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}