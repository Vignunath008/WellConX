import React, { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Activity, Eye, EyeOff, ArrowLeft, Monitor, Heart, Zap, Shield, Users, BarChart3 } from 'lucide-react'

const IoMTLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { user, login, isLoading, setCurrentModule } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/iomt/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = await login(email, password)
    if (success) {
      setCurrentModule('iomt')
      navigate('/iomt/dashboard')
    } else {
      setError('Invalid credentials. Try demo accounts: doctor@wellconx.com, nurse@wellconx.com, or admin@wellconx.com with password: demo123')
    }
  }

  const features = [
    {
      icon: Monitor,
      title: 'Device Integration',
      description: 'Connect and monitor medical devices from Philips, GE, and Mindray'
    },
    {
      icon: Heart,
      title: 'Vital Signs Monitoring',
      description: 'Real-time tracking of heart rate, blood pressure, SpO2, and temperature'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Critical alerts and notifications for immediate clinical response'
    },
    {
      icon: Activity,
      title: 'Live Waveforms',
      description: 'ECG, plethysmography, and respiratory waveform visualization'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with encrypted data transmission'
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Role-based access control for doctors, nurses, and staff'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting, trend analysis, and insights'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-25 flex">
      {/* Left Side - IoMT Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-display-md font-bold">IoMT Module</h1>
              <p className="text-purple-100 text-text-lg">Internet of Medical Things</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-display-lg font-bold mb-6">
                Real-Time Medical Device Monitoring
              </h2>
              <p className="text-text-xl text-purple-100 leading-relaxed">
                Advanced IoMT platform for seamless medical device integration, real-time vital signs monitoring, 
                and intelligent clinical alerts for enhanced patient care.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-purple-100 text-text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-purple-200 text-text-sm">
          © 2024 WellConX IoMT Module. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-gray-600">Back to Platform</span>
          </div>

          {/* Mobile Logo */}
          <div className="text-center lg:hidden">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-600 p-4 rounded-2xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-display-md font-bold text-gray-900">IoMT Module</h2>
            <p className="text-gray-600 mt-2">Internet of Medical Things</p>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block text-center">
            <h2 className="text-display-md font-bold text-gray-900 mb-3">Access IoMT Module</h2>
            <p className="text-gray-600">Sign in to monitor medical devices</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-purple-600 hover:text-purple-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Access IoMT Module'}
              </button>
            </div>
          </form>
          
          {/* Demo Accounts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-text-lg font-semibold text-gray-900 mb-4">Demo Accounts</h3>
            <div className="space-y-3 text-text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-mono text-gray-900">doctor@wellconx.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nurse:</span>
                <span className="font-mono text-gray-900">nurse@wellconx.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admin:</span>
                <span className="font-mono text-gray-900">admin@wellconx.com</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Password:</span>
                <span className="font-mono text-gray-900">demo123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IoMTLogin