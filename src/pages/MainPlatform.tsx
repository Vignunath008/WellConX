import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield, 
  Users, 
  Zap, 
  Activity,
  TrendingUp,
  Monitor,
  Building2,
  Globe,
  Award,
  CheckCircle,
  Star,
  Wifi,
  Database,
  Lock,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '../components/ScrollReveal';

const MainPlatform: React.FC = () => {
  const navigate = useNavigate()
  const { user, logoutAndReturnToPlatform } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // No auto-logout on main platform - users can stay logged in
  // The main platform is the central hub where users can access different modules
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Enhanced platform statistics with real-time simulation
  const [platformStats, setPlatformStats] = useState([
    {
      title: 'Healthcare Facilities',
      value: '2,847',
      change: '+12% from last month',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Hospitals and clinics using WellConX'
    },
    {
      title: 'Active Patients',
      value: '156,432',
      change: '+8% from last week',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Patients monitored daily'
    },
    {
      title: 'Connected Devices',
      value: '94,567',
      change: '+15% from last month',
      icon: Monitor,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Medical devices integrated'
    },
    {
      title: 'Data Points/Day',
      value: '12.8M',
      change: '+22% from last week',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Vital signs captured daily'
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlatformStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.title === 'Data Points/Day' 
          ? `${(12.8 + Math.random() * 0.4).toFixed(1)}M`
          : stat.value
      })))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const modules = [
    {
      id: 'ehr',
      title: 'EHR Module',
      subtitle: 'Electronic Health Records Management',
      description: 'Comprehensive patient records, clinical documentation, and seamless care coordination across healthcare teams',
      icon: Shield,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      features: [
        'Digital Patient Profiles',
        'Clinical Documentation', 
        'E-Prescriptions & Drug Interactions',
        'SOAP Notes with Voice-to-Text',
        'Medical History Timeline',
        'Lab Results Integration'
      ],
      stats: {
        records: '2.4M+',
        facilities: '1,200+',
        uptime: '99.9%'
      },
      route: '/ehr/login'
    },
    {
      id: 'hms',
      title: 'HMS Module',
      subtitle: 'Hospital Management System',
      description: 'Complete hospital operations management including patient flow, resource optimization, and operational excellence',
      icon: Building2,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      features: [
        'Patient Registration & Queue',
        'Smart Appointment Scheduling',
        'Real-time Bed Management',
        'Billing & Insurance Claims',
        'Staff Scheduling & Resources',
        'Inventory & Supply Chain'
      ],
      stats: {
        hospitals: '850+',
        beds: '125K+',
        efficiency: '94%'
      },
      route: '/hms/login'
    },
    {
      id: 'iomt',
      title: 'IoMT Module',
      subtitle: 'Internet of Medical Things',
      description: 'Advanced medical device integration with real-time monitoring, AI-driven analytics, and intelligent clinical alerts',
      icon: Zap,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      features: [
        'Multi-vendor Device Integration',
        'Real-time Vital Signs Monitoring',
        'AI-powered Clinical Alerts',
        'Live Waveform Visualization',
        'Predictive Analytics',
        'HL7 Protocol Support'
      ],
      stats: {
        devices: '94K+',
        alerts: '99.2%',
        latency: '<50ms'
      },
      route: '/iomt/login'
    }
  ]

  const companyInfo = {
    founded: '2019',
    headquarters: 'San Francisco, CA',
    employees: '2,500+',
    countries: '45+',
    certifications: ['HIPAA', 'SOC 2', 'ISO 27001', 'FDA 510(k)'],
    awards: [
      'Healthcare Innovation Award 2024',
      'Best Digital Health Platform 2023',
      'Top 50 Healthcare Startups 2022'
    ]
  }

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Medical Officer',
      hospital: 'Metropolitan General Hospital',
      quote: 'WellConX has transformed our patient care delivery. The real-time monitoring capabilities have reduced our response times by 40%.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'IT Director',
      hospital: 'Regional Medical Center',
      quote: 'The integration was seamless. Our staff adapted quickly, and we saw immediate improvements in operational efficiency.',
      rating: 5
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Emergency Department Head',
      hospital: 'City Emergency Hospital',
      quote: 'The AI-powered alerts have been game-changing for our emergency department. We can now predict and prevent critical situations.',
      rating: 5
    }
  ]

  const handleModuleAccess = (route: string) => {
    // Determine module from route
    let moduleKey = ''
    let loginRoute = ''
    let dashboardRoute = ''
    if (route.includes('ehr')) {
      moduleKey = 'ehr_token'
      loginRoute = '/ehr/login'
      dashboardRoute = '/ehr/dashboard'
    } else if (route.includes('hms')) {
      moduleKey = 'hms_token'
      loginRoute = '/hms/login'
      dashboardRoute = '/hms/dashboard'
    } else if (route.includes('iomt')) {
      moduleKey = 'iomt_token'
      loginRoute = '/iomt/login'
      dashboardRoute = '/iomt/dashboard'
    }

    // Always check module token, never main platform user
    if (!localStorage.getItem(moduleKey)) {
      navigate(loginRoute)
      return
    }
    // If authenticated for the module, go to module dashboard
    navigate(dashboardRoute)
  }

  // Handle Schedule Demo
  const handleScheduleDemo = () => {
    // Show notification
    setNotification({ type: 'info', message: 'Opening email client to schedule demo...' })
    
    // Open email client with pre-filled demo request
    const subject = encodeURIComponent('WellConX Platform Demo Request')
    const body = encodeURIComponent(`Hello WellConX Team,

I'm interested in scheduling a demo of the WellConX platform for our healthcare organization.

Organization Details:
- Organization Name: 
- Contact Person: 
- Phone: 
- Email: 
- Number of Beds/Facilities: 
- Current Systems: 
- Primary Use Case: 

Please contact me to schedule a convenient time for the demo.

Best regards,
${user?.name || 'Healthcare Professional'}`)
    
    window.open(`mailto:contact@wellconx.com?subject=${subject}&body=${body}`, '_blank')
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle Download Brochure
  const handleDownloadBrochure = () => {
    // Show notification
    setNotification({ type: 'success', message: 'Downloading WellConX brochure...' })
    
    // Create a simple brochure content
    const brochureContent = `
WellConX Enterprise Healthcare Platform
=====================================

COMPREHENSIVE HEALTHCARE SOLUTIONS

EHR Module - Electronic Health Records Management
• Digital Patient Profiles
• Clinical Documentation
• E-Prescriptions & Drug Interactions
• SOAP Notes with Voice-to-Text
• Medical History Timeline
• Lab Results Integration

HMS Module - Hospital Management System
• Patient Registration & Queue
• Smart Appointment Scheduling
• Real-time Bed Management
• Billing & Insurance Claims
• Staff Scheduling & Resources
• Inventory & Supply Chain

IoMT Module - Internet of Medical Things
• Multi-vendor Device Integration
• Real-time Vital Signs Monitoring
• AI-powered Clinical Alerts
• Live Waveform Visualization
• Predictive Analytics
• HL7 Protocol Support

PLATFORM STATISTICS
• 2,847+ Healthcare Facilities
• 156,432+ Active Patients
• 94,567+ Connected Devices
• 12.8M+ Data Points/Day

CERTIFICATIONS & COMPLIANCE
• HIPAA Compliant
• SOC 2 Certified
• ISO 27001
• FDA 510(k)

CONTACT INFORMATION
Phone: +1 (555) 123-WELL
Email: contact@wellconx.com
Address: San Francisco, CA

Visit: https://wellconx.com
    `
    
    // Create and download the brochure
    const blob = new Blob([brochureContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'WellConX-Platform-Brochure.txt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle View Documentation
  const handleViewDocumentation = () => {
    // Show notification
    setNotification({ type: 'info', message: 'Opening WellConX documentation...' })
    
    // Open documentation in a new tab
    window.open('https://docs.wellconx.com', '_blank')
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle Contact Actions
  const handleContactAction = (type: 'phone' | 'email' | 'address') => {
    let message = ''
    
    switch (type) {
      case 'phone':
        message = 'Opening phone dialer...'
        window.open('tel:+1555123WELL', '_self')
        break
      case 'email':
        message = 'Opening email client...'
        window.open('mailto:contact@wellconx.com', '_blank')
        break
      case 'address':
        message = 'Opening Google Maps...'
        window.open('https://maps.google.com/?q=San+Francisco+CA', '_blank')
        break
    }
    
    setNotification({ type: 'info', message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Toggle module expansion
  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const StatCard = ({ stat, index }: any) => (
    <motion.div
      className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}>
          <stat.icon className="h-6 w-6" />
        </div>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
        <p className="text-xs text-gray-500 mb-2">{stat.description}</p>
        <p className="text-xs text-green-600 font-medium">{stat.change}</p>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 safe-area-inset-top">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 sm:p-2.5 rounded-xl shadow-sm">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">WellConX</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Enterprise Healthcare Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-4 sm:space-x-6 text-sm">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 font-medium text-xs sm:text-sm">Operational</span>
                </div>
                <div className="text-gray-600 font-mono text-xs sm:text-sm bg-gray-50 px-3 py-1.5 rounded-full">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
              </div>
              
              {/* User Profile Section */}
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Avatar and Info */}
                  <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.picture ? (
                      // Google OAuth user with profile picture
                      <img 
                        src={user.picture} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      // Regular user with initials
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <div className="hidden md:block">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logoutAndReturnToPlatform()
                      navigate('/login')
                    }}
                    className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                /* Authentication Buttons */
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-secondary btn-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="btn-primary btn-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {/* Mobile status indicator */}
              <div className="lg:hidden flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 font-medium text-xs">Live</span>
                </div>
              </div>
              
              {/* Mobile User Profile (when logged in) */}
              {user && (
                <div className="sm:hidden flex items-center space-x-2">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      logoutAndReturnToPlatform()
                      navigate('/login')
                    }}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Display */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
          {notification.type === 'info' && <Activity className="h-5 w-5" />}
          <span className="font-medium">{notification.message}</span>
        </motion.div>
      )}

      {/* Hero Section */}
      <ScrollReveal>
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to WellConX</h1>
            <p className="text-xl text-primary-100 max-w-2xl">Your comprehensive healthcare platform for seamless patient care and medical device management.</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformStats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300`}>
                <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Modules</h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ScrollReveal key={module.id} delay={index * 150} direction={index % 2 === 0 ? 'left' : 'right'}>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Module content */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`${module.color} p-3 rounded-xl`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  {/* Features list */}
                  <div className="space-y-2">
                    {module.features.slice(0, expandedModules.has(module.id) ? module.features.length : 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Module actions */}
                <div className="px-6 pb-6 space-y-3">
                  <button
                    onClick={() => handleModuleAccess(module.route)}
                    className={`w-full ${module.color} ${module.hoverColor} text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2`}
                  >
                    <span>{user ? `Enter ${module.title}` : `Access ${module.title}`}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Healthcare Leaders</h2>
              <p className="text-xl text-gray-600">See what our customers say about WellConX</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 200} direction={index % 2 === 0 ? 'up' : 'down'}>
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.hospital}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl text-white p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Built with Enterprise-Grade Technology</h2>
          <p className="text-primary-100">Scalable, secure, and reliable infrastructure</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
              <Wifi className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Real-time</h3>
            <p className="text-sm text-primary-100">Sub-second data processing</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Secure</h3>
            <p className="text-sm text-primary-100">End-to-end encryption</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Global</h3>
            <p className="text-sm text-primary-100">Multi-region deployment</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Mobile</h3>
            <p className="text-sm text-primary-100">Native mobile apps</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h2>
            <p className="text-gray-700 mb-6">
              Ready to transform your healthcare operations? Contact our team to schedule a demo 
              and see how WellConX can benefit your organization.
            </p>
            <div className="space-y-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-primary-600 transition-colors"
                onClick={() => handleContactAction('phone')}
              >
                <Phone className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">+1 (555) 123-WELL</span>
              </div>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-primary-600 transition-colors"
                onClick={() => handleContactAction('email')}
              >
                <Mail className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">contact@wellconx.com</span>
              </div>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-primary-600 transition-colors"
                onClick={() => handleContactAction('address')}
              >
                <MapPin className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleScheduleDemo}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Schedule Demo</span>
            </button>
            <button 
              onClick={handleDownloadBrochure}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Brochure</span>
            </button>
            <button 
              onClick={handleViewDocumentation}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Documentation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2024 WellConX Enterprise Healthcare Platform. All rights reserved.</p>
        <p className="mt-2">Transforming healthcare through intelligent technology integration.</p>
      </div>
    </div>
  )
}

export default MainPlatform
