import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield, 
  Users, 
  Zap, 
  Calendar,
  Bed,
  Activity,
  TrendingUp,
  Monitor,
  Heart,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'

const MainPlatform: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Mock platform statistics
  const platformStats = [
    {
      title: 'Active Patients',
      value: '2,847',
      change: '+12% from last week',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: "Today's Appointments",
      value: '156',
      change: '+8% from last week',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Bed Occupancy',
      value: '87%',
      change: '+3% from last week',
      icon: Bed,
      color: 'text-orange-600'
    },
    {
      title: 'Connected Devices',
      value: '94',
      change: '+15% from last week',
      icon: Monitor,
      color: 'text-purple-600'
    }
  ]

  const modules = [
    {
      id: 'ehr',
      title: 'EHR Module',
      subtitle: 'Electronic Health Records Management',
      description: 'Comprehensive patient records, clinical documentation, and care coordination',
      icon: Shield,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      features: [
        'Patient Profiles',
        'Clinical Documentation', 
        'Digital Prescriptions',
        'SOAP Notes'
      ],
      route: '/ehr/login'
    },
    {
      id: 'hms',
      title: 'HMS Module',
      subtitle: 'Hospital Management System',
      description: 'Complete hospital operations, patient flow, and resource management',
      icon: Building2,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      features: [
        'Patient Registration',
        'Appointment Scheduling',
        'Bed Management',
        'Billing'
      ],
      route: '/hms/login'
    },
    {
      id: 'iomt',
      title: 'IoMT Module',
      subtitle: 'Internet of Medical Things',
      description: 'Real-time device monitoring, vital signs tracking, and clinical alerts',
      icon: Zap,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      features: [
        'Device Integration',
        'Vital Signs Monitoring',
        'Real-time Alerts',
        'Analytics'
      ],
      route: '/iomt/login'
    }
  ]

  const handleModuleAccess = (route: string) => {
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WellConX</h1>
                <p className="text-sm text-gray-500">Enterprise Healthcare Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="text-sm text-gray-600">
                  Signed in to WellConX Platform
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Welcome to WellConX Platform
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to WellConX
          </h1>
          <p className="text-gray-600">
            {user 
              ? 'Enterprise Healthcare Platform - Access your modules and manage your workflow' 
              : 'Enterprise Healthcare Platform - Choose a module to get started'
            }
          </p>
        </div>

        {/* Platform Statistics - Only show if user is logged in */}
        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {platformStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Module Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Module Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`${module.color} p-4 rounded-2xl`}>
                    <module.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                    <p className="text-gray-600 text-sm">{module.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{module.description}</p>
                
                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {module.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Action */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleModuleAccess(module.route)}
                  className={`w-full ${module.color} ${module.hoverColor} text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2`}
                >
                  <span>Access {module.title}</span>
                  <module.icon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-xl inline-block mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Care</h3>
              <p className="text-gray-600 text-sm">Comprehensive patient management and clinical workflows</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-xl inline-block mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Operations</h3>
              <p className="text-gray-600 text-sm">Streamlined hospital operations and resource management</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-50 p-4 rounded-xl inline-block mb-4">
                <Monitor className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology</h3>
              <p className="text-gray-600 text-sm">Advanced medical device integration and monitoring</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 WellConX Enterprise Healthcare Platform. All rights reserved.</p>
        </div>
      </div>

    </div>
  )
}

export default MainPlatform