import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoutConfirmationModal from '../components/LogoutConfirmationModal'
import { 
  Users, 
  Bed, 
  DollarSign, 
  Clock, 
  TrendingUp,
  TrendingDown,
  UserCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Download,
  RefreshCw,
  Building2,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Target,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Settings,
  Bell,
  Shield,
  Database,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Printer,
  Archive,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Minus,
  RotateCcw,
  Save,
  Send,
  Paperclip,
  Star,
  Heart,
  Award,
  Trophy,
  Medal,
  Crown,
  Flag,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Percent,
  Hash as HashIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts'

const HMS: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [refreshTime, setRefreshTime] = useState(new Date())
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // New enhanced features state
  const [aiPredictions, setAiPredictions] = useState<any>(null)
  const [bedOptimization, setBedOptimization] = useState<any>(null)
  const [staffScheduling, setStaffScheduling] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [financialAnalytics, setFinancialAnalytics] = useState<any>(null)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showBedManagement, setShowBedManagement] = useState(false)
  const [showStaffScheduling, setShowStaffScheduling] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showFinancials, setShowFinancials] = useState(false)

  const handleBackToPlatform = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    navigate('/hms/login', { replace: true });
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  // Mock data for HMS
  const [hmsData] = useState({
    overview: {
      totalPatients: 1247,
      activeIPD: 89,
      activeOPD: 156,
      totalBeds: 120,
      occupiedBeds: 89,
      availableBeds: 31,
      dailyRevenue: 125000,
      pendingDischarges: 12,
      emergencyQueue: 8,
      surgeryScheduled: 15
    },
    departments: [
      { name: 'Emergency', patients: 45, revenue: 25000, avgWaitTime: 15, status: 'high' },
      { name: 'Cardiology', patients: 32, revenue: 45000, avgWaitTime: 25, status: 'normal' },
      { name: 'Orthopedics', patients: 28, revenue: 35000, avgWaitTime: 30, status: 'normal' },
      { name: 'Pediatrics', patients: 38, revenue: 20000, avgWaitTime: 20, status: 'normal' },
      { name: 'Surgery', patients: 15, revenue: 55000, avgWaitTime: 45, status: 'critical' },
      { name: 'ICU', patients: 12, revenue: 40000, avgWaitTime: 0, status: 'critical' }
    ],
    bedOccupancy: [
      { floor: 'Ground Floor', total: 30, occupied: 28, available: 2, critical: 5, stable: 23 },
      { floor: '1st Floor', total: 30, occupied: 25, available: 5, critical: 3, stable: 22 },
      { floor: '2nd Floor', total: 30, occupied: 20, available: 10, critical: 2, stable: 18 },
      { floor: '3rd Floor', total: 30, occupied: 16, available: 14, critical: 1, stable: 15 }
    ],
    revenueData: [
      { time: '00:00', revenue: 5000, patients: 12 },
      { time: '04:00', revenue: 8000, patients: 18 },
      { time: '08:00', revenue: 25000, patients: 45 },
      { time: '12:00', revenue: 35000, patients: 62 },
      { time: '16:00', revenue: 28000, patients: 38 },
      { time: '20:00', revenue: 24000, patients: 32 }
    ],
    kpis: {
      alos: 4.2, // Average Length of Stay
      waitTime: 22, // Average wait time in minutes
      mortalityRate: 1.2, // Percentage
      infectionRate: 0.8, // Percentage
      bedTurnover: 85, // Percentage
      patientSatisfaction: 4.3 // Out of 5
    },
    staffSchedule: [
      { name: 'Dr. Rajesh Sharma', department: 'Cardiology', shift: 'Morning', status: 'active', patients: 12 },
      { name: 'Dr. Priya Patel', department: 'Emergency', shift: 'Night', status: 'active', patients: 18 },
      { name: 'Dr. Vikram Singh', department: 'Surgery', shift: 'Morning', status: 'surgery', patients: 6 },
      { name: 'Nurse Anita Kumar', department: 'ICU', shift: 'Day', status: 'active', patients: 8 },
      { name: 'Dr. Meera Joshi', department: 'Pediatrics', shift: 'Evening', status: 'active', patients: 15 }
    ],
    // New enhanced data sections
    aiPredictions: {
      bedDemand: {
        next24Hours: 15,
        next48Hours: 28,
        nextWeek: 45,
        confidence: 87
      },
      patientFlow: {
        expectedAdmissions: 23,
        expectedDischarges: 18,
        emergencyPredictions: 12,
        surgeryPredictions: 8
      },
      resourceOptimization: {
        recommendedStaffing: {
          nurses: 45,
          doctors: 12,
          technicians: 8
        },
        bedUtilization: 74.2,
        optimalDischargeTime: '14:30',
        bottleneckPredictions: ['ICU capacity', 'Emergency overflow']
      },
      clinicalPredictions: {
        highRiskPatients: 7,
        readmissionRisk: 3,
        infectionRisk: 2,
        complicationsPredicted: 4
      }
    },
    bedOptimization: {
      currentStatus: {
        totalBeds: 120,
        occupied: 89,
        available: 31,
        underMaintenance: 5,
        reserved: 8
      },
      optimizationSuggestions: [
        {
          type: 'Bed Reallocation',
          description: 'Move 3 patients from ICU to step-down unit',
          impact: 'Free up 3 ICU beds',
          priority: 'High',
          estimatedSavings: 15000
        },
        {
          type: 'Discharge Optimization',
          description: 'Accelerate discharge for 5 stable patients',
          impact: 'Free up 5 beds by 2 PM',
          priority: 'Medium',
          estimatedSavings: 8000
        },
        {
          type: 'Admission Planning',
          description: 'Schedule elective admissions for optimal bed availability',
          impact: 'Reduce wait times by 30%',
          priority: 'Low',
          estimatedSavings: 5000
        }
      ],
      bedTypes: [
        { type: 'ICU', total: 20, occupied: 18, available: 2, utilization: 90 },
        { type: 'Step-down', total: 30, occupied: 25, available: 5, utilization: 83.3 },
        { type: 'General', total: 50, occupied: 35, available: 15, utilization: 70 },
        { type: 'Private', total: 20, occupied: 11, available: 9, utilization: 55 }
      ]
    },
    staffScheduling: {
      currentStaff: {
        doctors: 25,
        nurses: 68,
        technicians: 15,
        supportStaff: 32
      },
      shiftCoverage: {
        morning: { doctors: 12, nurses: 35, technicians: 8, coverage: 95 },
        afternoon: { doctors: 10, nurses: 30, technicians: 6, coverage: 88 },
        night: { doctors: 8, nurses: 25, technicians: 4, coverage: 82 }
      },
      optimizationRecommendations: [
        {
          department: 'Emergency',
          recommendation: 'Add 2 nurses for night shift',
          impact: 'Reduce wait times by 40%',
          cost: 12000
        },
        {
          department: 'ICU',
          recommendation: 'Extend doctor coverage by 2 hours',
          impact: 'Improve patient outcomes',
          cost: 8000
        },
        {
          department: 'Surgery',
          recommendation: 'Optimize surgery schedule',
          impact: 'Increase capacity by 15%',
          cost: 0
        }
      ],
      staffPerformance: {
        averageResponseTime: '3.2 minutes',
        patientSatisfaction: 4.4,
        overtimeHours: 45,
        burnoutRisk: 'Low'
      }
    },
    inventoryManagement: {
      criticalItems: [
        { item: 'Ventilators', current: 15, required: 18, status: 'Low', reorderPoint: 5 },
        { item: 'ICU Beds', current: 20, required: 20, status: 'Adequate', reorderPoint: 3 },
        { item: 'Oxygen Cylinders', current: 45, required: 50, status: 'Low', reorderPoint: 10 },
        { item: 'Defibrillators', current: 8, required: 8, status: 'Adequate', reorderPoint: 2 }
      ],
      medicationInventory: [
        { medication: 'Insulin', current: 150, required: 200, status: 'Low', expiry: '2024-06-15' },
        { medication: 'Antibiotics', current: 300, required: 250, status: 'Adequate', expiry: '2024-08-20' },
        { medication: 'Painkillers', current: 500, required: 400, status: 'Adequate', expiry: '2024-09-10' }
      ],
      equipmentMaintenance: [
        { equipment: 'MRI Machine', lastService: '2024-01-10', nextService: '2024-04-10', status: 'Good' },
        { equipment: 'CT Scanner', lastService: '2024-01-15', nextService: '2024-04-15', status: 'Good' },
        { equipment: 'X-Ray Machine', lastService: '2024-01-05', nextService: '2024-04-05', status: 'Maintenance Due' }
      ],
      supplyChain: {
        suppliers: 12,
        pendingOrders: 8,
        deliveryTime: '2-3 days',
        costSavings: 25000
      }
    },
    financialAnalytics: {
      revenueBreakdown: {
        inpatient: 650000,
        outpatient: 350000,
        emergency: 200000,
        surgery: 400000,
        diagnostics: 150000
      },
      costAnalysis: {
        staffCosts: 450000,
        medicationCosts: 120000,
        equipmentCosts: 80000,
        operationalCosts: 200000
      },
      profitability: {
        grossMargin: 68.5,
        netMargin: 42.3,
        revenuePerPatient: 850,
        costPerPatient: 490
      },
      trends: {
        monthlyGrowth: 12.5,
        patientVolumeGrowth: 8.3,
        revenueGrowth: 15.2,
        costReduction: 5.8
      },
      projections: {
        nextMonth: 1350000,
        nextQuarter: 4200000,
        nextYear: 16500000,
        confidence: 85
      }
    }
  })

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date())
      // Simulate real-time updates
      // Note: Real-time updates would modify hmsData here
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'normal': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }: any) => (
    <motion.div
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back to Platform */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HMS Module</h1>
                <p className="text-sm text-gray-500">Hospital Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <button
                    onClick={handleBackToPlatform}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Back to Platform
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hospital Management System</h1>
            <p className="text-gray-600 mt-1">Real-time hospital operations dashboard</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Departments</option>
              <option value="emergency">Emergency</option>
              <option value="cardiology">Cardiology</option>
              <option value="surgery">Surgery</option>
              <option value="icu">ICU</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={hmsData.overview.totalPatients.toLocaleString()}
            change={5.2}
            icon={Users}
            color="bg-primary-600"
            subtitle="Active registrations"
          />
          <StatCard
            title="Bed Occupancy"
            value={`${Math.round((hmsData.overview.occupiedBeds / hmsData.overview.totalBeds) * 100)}%`}
            change={-2.1}
            icon={Bed}
            color="bg-green-600"
            subtitle={`${hmsData.overview.occupiedBeds}/${hmsData.overview.totalBeds} beds`}
          />
          <StatCard
            title="Daily Revenue"
            value={`₹${(hmsData.overview.dailyRevenue / 1000).toFixed(0)}K`}
            change={8.7}
            icon={DollarSign}
            color="bg-yellow-600"
            subtitle="Today's earnings"
          />
          <StatCard
            title="Emergency Queue"
            value={hmsData.overview.emergencyQueue}
            icon={AlertTriangle}
            color="bg-red-600"
            subtitle="Waiting patients"
          />
        </div>

        {/* Department Overview & Bed Occupancy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Performance */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {hmsData.departments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
                      {dept.status.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600">{dept.patients} patients</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{(dept.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">{dept.avgWaitTime}min wait</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bed Occupancy Map */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bed Occupancy Map</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Full Map
              </button>
            </div>
            <div className="space-y-4">
              {hmsData.bedOccupancy.map((floor, index) => (
                <motion.div
                  key={floor.floor}
                  className="p-4 border border-gray-200 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{floor.floor}</h4>
                    <span className="text-sm text-gray-600">
                      {floor.occupied}/{floor.total} occupied
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(floor.occupied / floor.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round((floor.occupied / floor.total) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span>Critical: {floor.critical}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Stable: {floor.stable}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span>Available: {floor.available}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Analytics & KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hmsData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Patients'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2970FF" 
                  fill="#2970FF" 
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#12B76A" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key Performance Indicators */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ALOS (Days)</span>
                <span className="font-semibold text-gray-900">{hmsData.kpis.alos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Wait Time</span>
                <span className="font-semibold text-gray-900">{hmsData.kpis.waitTime}min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mortality Rate</span>
                <span className="font-semibold text-red-600">{hmsData.kpis.mortalityRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Infection Rate</span>
                <span className="font-semibold text-orange-600">{hmsData.kpis.infectionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bed Turnover</span>
                <span className="font-semibold text-green-600">{hmsData.kpis.bedTurnover}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Patient Satisfaction</span>
                <span className="font-semibold text-primary-600">{hmsData.kpis.patientSatisfaction}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Schedule & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Staff Schedule */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Staff Schedule</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Last updated: {refreshTime.toLocaleTimeString()}</span>
                <button className="p-1 text-gray-600 hover:text-gray-900">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-900">Staff Member</th>
                    <th className="text-left py-2 font-medium text-gray-900">Department</th>
                    <th className="text-left py-2 font-medium text-gray-900">Shift</th>
                    <th className="text-left py-2 font-medium text-gray-900">Status</th>
                    <th className="text-left py-2 font-medium text-gray-900">Patients</th>
                  </tr>
                </thead>
                <tbody>
                  {hmsData.staffSchedule.map((staff, index) => (
                    <motion.tr
                      key={staff.name}
                      className="border-b border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-3 font-medium text-gray-900">{staff.name}</td>
                      <td className="py-3 text-gray-600">{staff.department}</td>
                      <td className="py-3 text-gray-600">{staff.shift}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          staff.status === 'active' ? 'bg-green-100 text-green-800' :
                          staff.status === 'surgery' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{staff.patients}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
                <QrCode className="h-6 w-6 text-primary-600 mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">QR Check-in</h4>
                <p className="text-xs text-gray-600">Patient registration</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <Bed className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">Bed Transfer</h4>
                <p className="text-xs text-gray-600">Manage bed allocation</p>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left">
                <FileText className="h-6 w-6 text-yellow-600 mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">Discharge</h4>
                <p className="text-xs text-gray-600">Process discharge</p>
              </button>
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left">
                <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
                <h4 className="font-medium text-gray-900 text-sm">Emergency</h4>
                <p className="text-xs text-gray-600">Emergency protocols</p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RefreshCw className="h-4 w-4" />
              <span>Last updated: {refreshTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Patient discharged from ICU</p>
                <p className="text-xs text-gray-600">Rahul Verma • Room ICU-101 • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New patient registered</p>
                <p className="text-xs text-gray-600">Ananya Singh • Emergency • 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Surgery scheduled</p>
                <p className="text-xs text-gray-600">Dr. Vikram Singh • OR-2 • 10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Hospital Management</h2>
          
          {/* Feature Navigation */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showAIPanel ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>AI Predictions</span>
            </button>
            <button
              onClick={() => setShowBedManagement(!showBedManagement)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showBedManagement ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bed className="h-4 w-4" />
              <span>Bed Optimization</span>
            </button>
            <button
              onClick={() => setShowStaffScheduling(!showStaffScheduling)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showStaffScheduling ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Staff Scheduling</span>
            </button>
            <button
              onClick={() => setShowInventory(!showInventory)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showInventory ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Inventory Management</span>
            </button>
            <button
              onClick={() => setShowFinancials(!showFinancials)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showFinancials ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Financial Analytics</span>
            </button>
          </div>

          {/* AI Predictions Panel */}
          {showAIPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary-600" />
                  AI-Powered Predictions
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">AI Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bed Demand Predictions */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Bed Demand Predictions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Next 24 Hours</span>
                      <span className="text-lg font-bold text-blue-900">{hmsData.aiPredictions.bedDemand.next24Hours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Next 48 Hours</span>
                      <span className="text-lg font-bold text-blue-900">{hmsData.aiPredictions.bedDemand.next48Hours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Next Week</span>
                      <span className="text-lg font-bold text-blue-900">{hmsData.aiPredictions.bedDemand.nextWeek}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Confidence</span>
                      <span className="text-lg font-bold text-blue-900">{hmsData.aiPredictions.bedDemand.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Patient Flow Predictions */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Patient Flow Predictions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Expected Admissions</span>
                      <span className="text-lg font-bold text-green-900">{hmsData.aiPredictions.patientFlow.expectedAdmissions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Expected Discharges</span>
                      <span className="text-lg font-bold text-green-900">{hmsData.aiPredictions.patientFlow.expectedDischarges}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Emergency Predictions</span>
                      <span className="text-lg font-bold text-green-900">{hmsData.aiPredictions.patientFlow.emergencyPredictions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Surgery Predictions</span>
                      <span className="text-lg font-bold text-green-900">{hmsData.aiPredictions.patientFlow.surgeryPredictions}</span>
                    </div>
                  </div>
                </div>

                {/* Resource Optimization */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Resource Optimization
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800">Bed Utilization</span>
                      <span className="text-lg font-bold text-purple-900">{hmsData.aiPredictions.resourceOptimization.bedUtilization}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800">Optimal Discharge Time</span>
                      <span className="text-lg font-bold text-purple-900">{hmsData.aiPredictions.resourceOptimization.optimalDischargeTime}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-sm font-medium text-purple-800">Bottleneck Predictions:</span>
                      <div className="mt-2 space-y-1">
                        {hmsData.aiPredictions.resourceOptimization.bottleneckPredictions.map((bottleneck: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span className="text-sm text-purple-700">{bottleneck}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinical Predictions */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Clinical Predictions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-800">High Risk Patients</span>
                      <span className="text-lg font-bold text-orange-900">{hmsData.aiPredictions.clinicalPredictions.highRiskPatients}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-800">Readmission Risk</span>
                      <span className="text-lg font-bold text-orange-900">{hmsData.aiPredictions.clinicalPredictions.readmissionRisk}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-800">Infection Risk</span>
                      <span className="text-lg font-bold text-orange-900">{hmsData.aiPredictions.clinicalPredictions.infectionRisk}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-800">Complications Predicted</span>
                      <span className="text-lg font-bold text-orange-900">{hmsData.aiPredictions.clinicalPredictions.complicationsPredicted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bed Optimization Panel */}
          {showBedManagement && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-primary-600" />
                  Bed Optimization & Management
                </h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Optimize Now
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Bed Status */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">Current Bed Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.bedOptimization.currentStatus.totalBeds}</div>
                      <div className="text-sm text-blue-700">Total Beds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.bedOptimization.currentStatus.occupied}</div>
                      <div className="text-sm text-blue-700">Occupied</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.bedOptimization.currentStatus.available}</div>
                      <div className="text-sm text-blue-700">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.bedOptimization.currentStatus.underMaintenance}</div>
                      <div className="text-sm text-blue-700">Under Maintenance</div>
                    </div>
                  </div>
                </div>

                {/* Optimization Suggestions */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">Optimization Suggestions</h4>
                  <div className="space-y-3">
                    {hmsData.bedOptimization.optimizationSuggestions.map((suggestion: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800">{suggestion.type}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            suggestion.priority === 'High' ? 'bg-red-100 text-red-800' :
                            suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {suggestion.priority}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mb-2">{suggestion.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600">Impact: {suggestion.impact}</span>
                          <span className="text-green-600">Savings: ₹{suggestion.estimatedSavings}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bed Types Utilization */}
                <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Bed Types Utilization</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {hmsData.bedOptimization.bedTypes.map((bedType: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-3">{bedType.type}</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-semibold text-gray-900">{bedType.total}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Occupied</span>
                            <span className="font-semibold text-gray-900">{bedType.occupied}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Available</span>
                            <span className="font-semibold text-gray-900">{bedType.available}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${bedType.utilization}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{bedType.utilization}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Staff Scheduling Panel */}
          {showStaffScheduling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary-600" />
                  Staff Scheduling & Optimization
                </h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Optimize Schedule
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Staff */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">Current Staff</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.staffScheduling.currentStaff.doctors}</div>
                      <div className="text-sm text-blue-700">Doctors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.staffScheduling.currentStaff.nurses}</div>
                      <div className="text-sm text-blue-700">Nurses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.staffScheduling.currentStaff.technicians}</div>
                      <div className="text-sm text-blue-700">Technicians</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hmsData.staffScheduling.currentStaff.supportStaff}</div>
                      <div className="text-sm text-blue-700">Support Staff</div>
                    </div>
                  </div>
                </div>

                {/* Shift Coverage */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">Shift Coverage</h4>
                  <div className="space-y-3">
                    {Object.entries(hmsData.staffScheduling.shiftCoverage).map(([shift, data]: [string, any]) => (
                      <div key={shift} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800 capitalize">{shift}</span>
                          <span className="text-lg font-bold text-green-900">{data.coverage}%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>Doctors: {data.doctors}</div>
                          <div>Nurses: {data.nurses}</div>
                          <div>Tech: {data.technicians}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimization Recommendations */}
                <div className="lg:col-span-2 bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-4">Optimization Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hmsData.staffScheduling.optimizationRecommendations.map((rec: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                        <h5 className="font-medium text-purple-900 mb-2">{rec.department}</h5>
                        <p className="text-sm text-purple-700 mb-3">{rec.recommendation}</p>
                        <div className="space-y-1 text-xs">
                          <div className="text-purple-600">Impact: {rec.impact}</div>
                          <div className="text-purple-600">Cost: ₹{rec.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff Performance */}
                <div className="lg:col-span-2 bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-4">Staff Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{hmsData.staffScheduling.staffPerformance.averageResponseTime}</div>
                      <div className="text-sm text-orange-700">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{hmsData.staffScheduling.staffPerformance.patientSatisfaction}/5</div>
                      <div className="text-sm text-orange-700">Patient Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{hmsData.staffScheduling.staffPerformance.overtimeHours}</div>
                      <div className="text-sm text-orange-700">Overtime Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{hmsData.staffScheduling.staffPerformance.burnoutRisk}</div>
                      <div className="text-sm text-orange-700">Burnout Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Inventory Management Panel */}
          {showInventory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary-600" />
                  Inventory Management
                </h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Place Orders
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Items */}
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-4">Critical Items</h4>
                  <div className="space-y-3">
                    {hmsData.inventoryManagement.criticalItems.map((item: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-red-800">{item.item}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>Current: {item.current}</div>
                          <div>Required: {item.required}</div>
                          <div>Reorder: {item.reorderPoint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medication Inventory */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">Medication Inventory</h4>
                  <div className="space-y-3">
                    {hmsData.inventoryManagement.medicationInventory.map((med: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-800">{med.medication}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            med.status === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {med.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Current: {med.current}</div>
                          <div>Required: {med.required}</div>
                          <div className="col-span-2">Expiry: {med.expiry}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Maintenance */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">Equipment Maintenance</h4>
                  <div className="space-y-3">
                    {hmsData.inventoryManagement.equipmentMaintenance.map((equipment: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800">{equipment.equipment}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            equipment.status === 'Maintenance Due' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {equipment.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Last Service: {equipment.lastService}</div>
                          <div>Next Service: {equipment.nextService}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supply Chain */}
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-4">Supply Chain</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-700">Suppliers</span>
                          <div className="font-semibold text-purple-900">{hmsData.inventoryManagement.supplyChain.suppliers}</div>
                        </div>
                        <div>
                          <span className="text-purple-700">Pending Orders</span>
                          <div className="font-semibold text-purple-900">{hmsData.inventoryManagement.supplyChain.pendingOrders}</div>
                        </div>
                        <div>
                          <span className="text-purple-700">Delivery Time</span>
                          <div className="font-semibold text-purple-900">{hmsData.inventoryManagement.supplyChain.deliveryTime}</div>
                        </div>
                        <div>
                          <span className="text-purple-700">Cost Savings</span>
                          <div className="font-semibold text-purple-900">₹{hmsData.inventoryManagement.supplyChain.costSavings}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Financial Analytics Panel */}
          {showFinancials && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                  Financial Analytics
                </h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Generate Report
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">Revenue Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(hmsData.financialAnalytics.revenueBreakdown).map(([service, revenue]: [string, number]) => (
                      <div key={service} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800 capitalize">{service}</span>
                        <span className="font-semibold text-blue-900">₹{(revenue / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Analysis */}
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-4">Cost Analysis</h4>
                  <div className="space-y-3">
                    {Object.entries(hmsData.financialAnalytics.costAnalysis).map(([cost, amount]: [string, number]) => (
                      <div key={cost} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800 capitalize">{cost.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-semibold text-red-900">₹{(amount / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profitability */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">Profitability Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{hmsData.financialAnalytics.profitability.grossMargin}%</div>
                      <div className="text-sm text-green-700">Gross Margin</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{hmsData.financialAnalytics.profitability.netMargin}%</div>
                      <div className="text-sm text-green-700">Net Margin</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹{hmsData.financialAnalytics.profitability.revenuePerPatient}</div>
                      <div className="text-sm text-green-700">Revenue/Patient</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹{hmsData.financialAnalytics.profitability.costPerPatient}</div>
                      <div className="text-sm text-green-700">Cost/Patient</div>
                    </div>
                  </div>
                </div>

                {/* Trends & Projections */}
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-4">Trends & Projections</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <h5 className="font-medium text-purple-900 mb-2">Growth Trends</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Monthly Growth: {hmsData.financialAnalytics.trends.monthlyGrowth}%</div>
                        <div>Revenue Growth: {hmsData.financialAnalytics.trends.revenueGrowth}%</div>
                        <div>Patient Volume: {hmsData.financialAnalytics.trends.patientVolumeGrowth}%</div>
                        <div>Cost Reduction: {hmsData.financialAnalytics.trends.costReduction}%</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <h5 className="font-medium text-purple-900 mb-2">Projections</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Next Month: ₹{(hmsData.financialAnalytics.projections.nextMonth / 1000000).toFixed(1)}M</div>
                        <div>Next Quarter: ₹{(hmsData.financialAnalytics.projections.nextQuarter / 1000000).toFixed(1)}M</div>
                        <div>Next Year: ₹{(hmsData.financialAnalytics.projections.nextYear / 1000000).toFixed(1)}M</div>
                        <div>Confidence: {hmsData.financialAnalytics.projections.confidence}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </div>
  )
}

export default HMS