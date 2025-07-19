import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredModule?: string
}

const moduleTokenMap: Record<string, string> = {
  ehr: 'ehr_token',
  hms: 'hms_token',
  iomt: 'iomt_token',
}

const loginPathMap: Record<string, string> = {
  ehr: '/ehr/login',
  hms: '/hms/login',
  iomt: '/iomt/login',
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredModule }) => {
  const { user, isLoading, setCurrentModule } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Check for module-specific token only
  if (requiredModule) {
    const tokenKey = moduleTokenMap[requiredModule]
    const token = localStorage.getItem(tokenKey)
    if (!token) {
      return <Navigate to={loginPathMap[requiredModule]} replace />
    } else {
      setCurrentModule && setCurrentModule(requiredModule)
    }
    return <>{children}</>
  }
  // For main platform routes, you may check for user if needed
  return <>{children}</>
}

export default ProtectedRoute