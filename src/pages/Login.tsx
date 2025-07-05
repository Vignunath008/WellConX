import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
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
      description: 'Live vital signs tracking with instant alerts and comprehensive waveform analysis'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with encrypted data transmission and audit logging'
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Role-based access control for doctors, nurses, and administrative staff'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting, trend analysis, and predictive insights'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-25 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-display-md font-bold">WellConX</h1>
              <p className="text-primary-100 text-text-lg">Medical Monitoring Platform</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-display-lg font-bold mb-6">
                Advanced Patient Monitoring
              </h2>
              <p className="text-text-xl text-primary-100 leading-relaxed">
                Professional-grade medical device integration with real-time vital signs tracking, 
                intelligent alerts, and comprehensive analytics for healthcare teams.
              </p>
            </div>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-primary-100 text-text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-primary-200 text-text-sm">
          © 2024 WellConX. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="text-center lg:hidden">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-600 p-4 rounded-2xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-display-md font-bold text-gray-900">WellConX</h2>
            <p className="text-gray-600 mt-2">Medical Monitoring Platform</p>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block text-center">
            <h2 className="text-display-md font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your WellConX account</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
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

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              New to WellConX?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Create your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login