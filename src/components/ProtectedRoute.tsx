import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredModule?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredModule }) => {
  const { user, isLoading, currentModule } = useAuth()
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

  // Check if user is trying to access a different module than they're logged into
  if (requiredModule && currentModule && currentModule !== requiredModule) {
    // User is trying to access a different module - redirect to appropriate login
    let loginPath = '/iomt/login'
    
    if (requiredModule === 'hms') {
      loginPath = '/hms/login'
    } else if (requiredModule === 'ehr') {
      loginPath = '/ehr/login'
    }
    
    return <Navigate to={loginPath} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute