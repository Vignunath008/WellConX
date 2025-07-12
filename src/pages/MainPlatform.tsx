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
  ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'

const MainPlatform: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

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
    navigate(route)
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
              
              {/* Mobile status indicator */}
              <div className="lg:hidden flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 font-medium text-xs">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-primary-600">WellConX</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              The world's most advanced enterprise healthcare platform, connecting medical devices, 
              managing patient records, and optimizing hospital operations with AI-powered intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform Statistics */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Impact</h2>
            <p className="text-gray-600">Real-time statistics from our global healthcare network</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformStats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About WellConX</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Founded in {companyInfo.founded}, WellConX is the leading enterprise healthcare technology platform 
                trusted by hospitals, clinics, and healthcare systems worldwide. Our mission is to revolutionize 
                healthcare delivery through intelligent technology integration, real-time monitoring, and 
                data-driven insights.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{companyInfo.employees}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{companyInfo.countries}</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Compliance</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {companyInfo.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{cert}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Awards</h3>
              <div className="space-y-2">
                {companyInfo.awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards - Enhanced */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Healthcare Modules</h2>
            <p className="text-gray-600">Comprehensive solutions for every aspect of healthcare management</p>
          </div>
          
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
                  
                  {/* Module Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-gray-900">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                    {module.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trusted by Healthcare Leaders</h2>
            <p className="text-gray-600">See what our customers say about WellConX</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
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
              </motion.div>
            ))}
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
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">+1 (555) 123-WELL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">contact@wellconx.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">San Francisco, CA</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Schedule Demo</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Brochure</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
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
    </div>
  )
}

export default MainPlatform
