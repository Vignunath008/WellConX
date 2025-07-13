import React, { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building2, Eye, EyeOff, ArrowLeft, Calendar, Bed, Users, DollarSign, UserCheck, ClipboardList, BarChart3, Shield } from 'lucide-react'

const HMSLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { user, login, isLoading, setCurrentModule } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/hms" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = await login(email, password)
    if (success) {
      setCurrentModule('hms')
      navigate('/hms')
    } else {
      setError('Invalid credentials. Please contact your HMS administrator for access or use demo accounts for testing.')
    }
  }

  const features = [
    {
      icon: Users,
      title: 'Patient Registration',
      description: 'Streamlined patient admission, registration, and queue management'
    },
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description: 'Comprehensive scheduling system with smart routing and notifications'
    },
    {
      icon: Bed,
      title: 'Bed Management',
      description: 'Real-time bed occupancy tracking with automated transfers'
    },
    {
      icon: DollarSign,
      title: 'Billing & Revenue',
      description: 'Financial management with billing, insurance claims, and reporting'
    },
    {
      icon: UserCheck,
      title: 'Staff Management',
      description: 'Employee scheduling, shift management, and resource allocation'
    },
    {
      icon: ClipboardList,
      title: 'Inventory Control',
      description: 'Medical supplies tracking and automated reorder management'
    },
    {
      icon: BarChart3,
      title: 'Operational Analytics',
      description: 'Performance metrics, KPIs, and operational intelligence dashboards'
    },
    {
      icon: Shield,
      title: 'Compliance Management',
      description: 'Regulatory compliance tracking and audit trail management'
    }
  ]

  // HMS-specific demo accounts
  const demoAccounts = [
    { role: 'Hospital Administrator', email: 'admin@wellconx.com', description: 'Full system access' },
    { role: 'Department Manager', email: 'manager@wellconx.com', description: 'Department oversight' },
    { role: 'Registration Staff', email: 'registration@wellconx.com', description: 'Patient registration' },
    { role: 'Billing Coordinator', email: 'billing@wellconx.com', description: 'Financial operations' },
    { role: 'Bed Coordinator', email: 'bedcoord@wellconx.com', description: 'Bed management' },
    { role: 'Scheduler', email: 'scheduler@wellconx.com', description: 'Appointment scheduling' }
  ]

  return (
    <div className="min-h-screen bg-gray-25 flex">
      {/* Left Side - HMS Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-display-md font-bold">HMS Module</h1>
              <p className="text-green-100 text-text-lg">Hospital Management System</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-display-lg font-bold mb-6">
                Complete Hospital Operations Management
              </h2>
              <p className="text-text-xl text-green-100 leading-relaxed">
                Comprehensive hospital management platform for patient flow, resource optimization, 
                staff coordination, and operational excellence across all departments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-green-100 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-green-200 text-text-sm">
          © 2024 WellConX HMS Module. Joint Commission Ready • HIMSS Certified
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
              <div className="bg-green-600 p-4 rounded-2xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-display-md font-bold text-gray-900">HMS Module</h2>
            <p className="text-gray-600 mt-2">Hospital Management System</p>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block text-center">
            <h2 className="text-display-md font-bold text-gray-900 mb-3">Access HMS Module</h2>
            <p className="text-gray-600">Sign in to manage hospital operations</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="text-sm font-medium text-green-600 hover:text-green-500"
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
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Access HMS Module'}
              </button>
            </div>
          </form>
          
          {/* Demo Accounts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-text-lg font-semibold text-gray-900 mb-4">Demo Access Accounts</h3>
            <div className="space-y-3 text-text-sm">
              {demoAccounts.map((account, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="font-medium text-gray-900">{account.role}:</span>
                    <span className="font-mono text-gray-700 ml-2">{account.email}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-600">Password (All accounts):</span>
                <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">demo123</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-800">
                <strong>Note:</strong> These are demonstration accounts for testing purposes. 
                In production, access would be integrated with your hospital's HR and identity management systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HMSLogin