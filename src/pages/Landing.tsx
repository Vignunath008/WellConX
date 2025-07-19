import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Always redirect to the main platform for now to show the new design
    navigate('/platform')
  }, [navigate])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading WellConX Healthcare Platform...</p>
      </div>
    </div>
  )
}

export default Landing 