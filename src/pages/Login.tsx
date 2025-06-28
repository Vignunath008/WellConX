import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Activity, Eye, EyeOff, Shield, Users, BarChart3 } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { user, login, isLoading } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = await login(email, password)
    if (!success) {
      setError('Invalid credentials. Try demo accounts: doctor@wellconx.com, nurse@wellconx.com, or admin@wellconx.com with password: demo123')
    }
  }

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Live vital signs tracking with instant alerts'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Secure, encrypted data transmission and storage'
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Role-based access for doctors, nurses, and staff'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and trend analysis'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">WellConX</h1>
              <p className="text-blue-100">Medical Monitoring Platform</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Real-Time Patient Monitoring
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Advanced medical device integration with live vital signs tracking, 
                intelligent alerts, and comprehensive analytics for healthcare professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-blue-100 text-sm">
          © 2024 WellConX. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-2xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">WellConX</h2>
            <p className="text-gray-600 mt-2">Medical Monitoring Platform</p>
          </div>
          
          <div className="hidden lg:block text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your WellConX account</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in to WellConX'}
              </button>
            </div>
          </form>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Demo Accounts:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-mono text-gray-800">doctor@wellconx.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nurse:</span>
                <span className="font-mono text-gray-800">nurse@wellconx.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin:</span>
                <span className="font-mono text-gray-800">admin@wellconx.com</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-gray-600">Password:</span>
                <span className="font-mono text-gray-800">demo123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login