import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    // Determine which login page to redirect to based on the current path
    let loginPath = '/iomt/login'
    
    if (location.pathname.startsWith('/hms')) {
      loginPath = '/hms/login'
    } else if (location.pathname.startsWith('/ehr')) {
      loginPath = '/ehr/login'
    }
    
    return <Navigate to={loginPath} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute