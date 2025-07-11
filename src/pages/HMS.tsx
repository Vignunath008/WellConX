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
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const HMS: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [refreshTime, setRefreshTime] = useState(new Date())
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleBackToPlatform = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    logout()
    // Navigate to main platform after logout
    navigate('/', { replace: true })
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
    ]
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
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Staff Schedule</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {hmsData.staffSchedule.map((staff, index) => (
                <motion.div
                  key={staff.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{staff.name}</h4>
                      <p className="text-xs text-gray-600">{staff.department} • {staff.shift}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' :
                      staff.status === 'surgery' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status.toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{staff.patients} patients</p>
                  </div>
                </motion.div>
              ))}
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