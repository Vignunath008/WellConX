import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  UserCheck, 
  Settings, 
  Shield, 
  Server, 
  Activity, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash,
  Plus,
  Menu,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'

interface StaffMember {
  id: string
  name: string
  email: string
  role: 'doctor' | 'nurse'
  department: string
  specialization: string
  status: 'active' | 'inactive'
  lastLogin: Date
}

const AdminPanel: React.FC = () => {
  const { user, getRegistrationRequests, approveRegistration, rejectRegistration } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [registrationRequests, setRegistrationRequests] = useState<any[]>([])
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  
  // For staff management
  const [staffMembers] = useState<StaffMember[]>([
    {
      id: 'staff-001',
      name: 'Dr. Rajesh Sharma',
      email: 'doctor@wellconx.com',
      role: 'doctor',
      department: 'Cardiology',
      specialization: 'Cardiology',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: 'staff-002',
      name: 'Nurse Priya Patel',
      email: 'nurse@wellconx.com',
      role: 'nurse',
      department: 'ICU',
      specialization: 'Critical Care',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    },
    {
      id: 'staff-003',
      name: 'Dr. Amit Kumar',
      email: 'amit.kumar@wellconx.com',
      role: 'doctor',
      department: 'Neurology',
      specialization: 'Neurology',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
    }
  ])

  // Load registration requests
  useEffect(() => {
    const requests = getRegistrationRequests()
    setRegistrationRequests(requests.map(req => ({
      ...req,
      submittedAt: new Date(req.submittedAt)
    })))
  }, [getRegistrationRequests])

  // System stats for dashboard
  const systemStats = {
    activeUsers: 12,
    onlineDevices: 8,
    totalPatients: 24,
    alertsToday: 18,
    uptime: '99.98%',
    responseTime: '245ms',
    storageUsed: '42%',
    lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
  }

  // Filter staff members based on search term
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle registration approval/rejection
  const handleRegistrationAction = (requestId: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      approveRegistration(requestId)
      alert('Registration approved. The user can now log in.')
    } else {
      rejectRegistration(requestId)
      alert('Registration rejected.')
    }
    
    // Update the local state
    setRegistrationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } 
          : req
      )
    )
  }

  // Refresh registration requests
  const refreshRegistrationRequests = () => {
    const requests = getRegistrationRequests()
    setRegistrationRequests(requests.map(req => ({
      ...req,
      submittedAt: new Date(req.submittedAt)
    })))
  }

  // Render dashboard tab
  const renderDashboard = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">System Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 font-medium">System Online</span>
        </div>
      </div>
      
      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <motion.div
          className="bg-primary-50 rounded-lg p-3 lg:p-6 border border-primary-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="bg-primary-100 p-2 lg:p-3 rounded-lg">
              <Users className="h-4 w-4 lg:h-6 lg:w-6 text-primary-600" />
            </div>
            <span className="text-xs lg:text-sm text-primary-600 font-medium">Users</span>
          </div>
          <div className="text-lg lg:text-2xl font-bold text-primary-700">{systemStats.activeUsers}</div>
          <p className="text-xs lg:text-sm text-primary-600 mt-1">Active users</p>
        </motion.div>
        
        <motion.div
          className="bg-green-50 rounded-lg p-3 lg:p-6 border border-green-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="bg-green-100 p-2 lg:p-3 rounded-lg">
              <Activity className="h-4 w-4 lg:h-6 lg:w-6 text-green-600" />
            </div>
            <span className="text-xs lg:text-sm text-green-600 font-medium">Devices</span>
          </div>
          <div className="text-lg lg:text-2xl font-bold text-green-700">{systemStats.onlineDevices}</div>
          <p className="text-xs lg:text-sm text-green-600 mt-1">Online devices</p>
        </motion.div>
        
        <motion.div
          className="bg-purple-50 rounded-lg p-3 lg:p-6 border border-purple-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="bg-purple-100 p-2 lg:p-3 rounded-lg">
              <BarChart3 className="h-4 w-4 lg:h-6 lg:w-6 text-purple-600" />
            </div>
            <span className="text-xs lg:text-sm text-purple-600 font-medium">Alerts</span>
          </div>
          <div className="text-lg lg:text-2xl font-bold text-purple-700">{systemStats.alertsToday}</div>
          <p className="text-xs lg:text-sm text-purple-600 mt-1">Alerts today</p>
        </motion.div>
        
        <motion.div
          className="bg-orange-50 rounded-lg p-3 lg:p-6 border border-orange-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="bg-orange-100 p-2 lg:p-3 rounded-lg">
              <Clock className="h-4 w-4 lg:h-6 lg:w-6 text-orange-600" />
            </div>
            <span className="text-xs lg:text-sm text-orange-600 font-medium">Response</span>
          </div>
          <div className="text-lg lg:text-2xl font-bold text-orange-700">{systemStats.responseTime}</div>
          <p className="text-xs lg:text-sm text-orange-600 mt-1">Avg. response time</p>
        </motion.div>
      </div>
      
      {/* System Status */}
      <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Uptime:</span>
              <span className="text-green-600 font-medium text-sm">{systemStats.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Usage:</span>
              <div className="flex items-center">
                <div className="w-20 lg:w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: systemStats.storageUsed }}
                  ></div>
                </div>
                <span className="text-gray-900 text-sm">{systemStats.storageUsed}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup:</span>
              <span className="text-gray-900 text-sm">{systemStats.lastBackup.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">HL7 Service:</span>
              <span className="text-green-600 font-medium text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database:</span>
              <span className="text-green-600 font-medium text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Authentication:</span>
              <span className="text-green-600 font-medium text-sm">Secure</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3 lg:space-y-4">
          {[
            { action: 'User Login', user: 'Dr. Rajesh Sharma', time: '10 minutes ago' },
            { action: 'Patient Added', user: 'Nurse Priya Patel', time: '25 minutes ago' },
            { action: 'Alert Acknowledged', user: 'Dr. Rajesh Sharma', time: '42 minutes ago' },
            { action: 'Device Configured', user: 'Vikram Mehta', time: '1 hour ago' },
            { action: 'System Backup', user: 'System', time: '6 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm truncate">{activity.action}</p>
                <p className="text-xs text-gray-500 truncate">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render staff management tab
  const renderStaffManagement = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">Staff Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm w-full sm:w-auto"
            />
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm">
            <Plus className="h-4 w-4" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>
      
      {/* Staff List - Mobile Optimized */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">{staff.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{staff.role}</div>
                    <div className="text-sm text-gray-500">{staff.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.lastLogin.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">{staff.name.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{staff.name}</p>
                      <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-gray-600 capitalize">{staff.role}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">{staff.department}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ml-2 ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last login: {staff.lastLogin.toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render registration requests tab
  const renderRegistrationRequests = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">Registration Requests</h2>
        <button 
          onClick={refreshRegistrationRequests}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
      
      {registrationRequests.filter(req => req.status === 'pending').length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrationRequests.filter(req => req.status === 'pending').map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-medium">{request.firstName.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.firstName} {request.lastName}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{request.role}</div>
                      <div className="text-sm text-gray-500">{request.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        PENDING
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleRegistrationAction(request.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleRegistrationAction(request.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {registrationRequests.filter(req => req.status === 'pending').map((request) => (
              <div key={request.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-medium text-sm">{request.firstName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{request.firstName} {request.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{request.email}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-xs text-gray-600 capitalize">{request.role}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{request.department}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 ml-2">
                        PENDING
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleRegistrationAction(request.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleRegistrationAction(request.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 lg:p-8 border border-gray-200 text-center shadow-sm">
          <UserCheck className="h-8 lg:h-12 w-8 lg:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-sm text-gray-500">There are no registration requests waiting for approval.</p>
        </div>
      )}

      {/* Processed Requests */}
      {registrationRequests.filter(req => req.status !== 'pending').length > 0 && (
        <div className="mt-6 lg:mt-8">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Processed Requests</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrationRequests.filter(req => req.status !== 'pending').map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{request.firstName.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.firstName} {request.lastName}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{request.role}</div>
                        <div className="text-sm text-gray-500">{request.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {registrationRequests.filter(req => req.status !== 'pending').map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">{request.firstName.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{request.firstName} {request.lastName}</p>
                          <p className="text-xs text-gray-500 truncate">{request.email}</p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-xs text-gray-600 capitalize">{request.role}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">{request.department}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ml-2 ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render system settings tab
  const renderSystemSettings = () => (
    <div className="space-y-4 lg:space-y-6">
      <h2 className="text-lg lg:text-xl font-bold text-gray-900">System Settings</h2>
      
      <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Require 2FA for all admin users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Session Timeout</p>
              <p className="text-xs text-gray-500">Automatically log out inactive users</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm">
              <option value="15">15 minutes</option>
              <option value="30" defaultValue="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Password Policy</p>
              <p className="text-xs text-gray-500">Minimum requirements for passwords</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm">
              <option value="standard">Standard (8+ chars)</option>
              <option value="strong" defaultValue="strong">Strong (12+ chars, special)</option>
              <option value="very-strong">Very Strong (16+ chars, complex)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Data Retention</p>
              <p className="text-xs text-gray-500">How long to keep patient data</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm">
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365" defaultValue="365">1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Automatic Backups</p>
              <p className="text-xs text-gray-500">Schedule regular database backups</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm">
              <option value="daily" defaultValue="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200 gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Export Format</p>
              <p className="text-xs text-gray-500">Default format for data exports</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm">
              <option value="json" defaultValue="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Clear Cache</p>
              <p className="text-xs text-gray-500">Remove temporary files and cached data</p>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Clear Now
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">Manual Backup</p>
              <p className="text-xs text-gray-500">Create a full system backup</p>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Backup Now
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">System Logs</p>
              <p className="text-xs text-gray-500">Download system logs for troubleshooting</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Download Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'staff':
        return renderStaffManagement()
      case 'registration':
        return renderRegistrationRequests()
      case 'settings':
        return renderSystemSettings()
      default:
        return renderDashboard()
    }
  }

  // If not an admin, show access denied
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4 text-sm">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshRegistrationRequests}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => alert('System configuration exported')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Config</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Server className="h-5 w-5" />
                  <span className="font-medium">System Dashboard</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    activeTab === 'staff'
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Staff Management</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('registration')}
                  className={`flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    activeTab === 'registration'
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Registration Requests</span>
                  {registrationRequests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="ml-auto bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {registrationRequests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">System Settings</span>
                </button>
              </nav>
            </div>
            
            {/* Admin Info Card */}
            <motion.div 
              className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-4 lg:p-6 mt-6 text-white shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 p-2 lg:p-3 rounded-lg backdrop-blur-sm">
                  <Shield className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base lg:text-lg">Admin Access</h3>
                  <p className="text-primary-100 text-xs lg:text-sm">Full system privileges</p>
                </div>
              </div>
              <div className="space-y-2 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-100">User:</span>
                  <span className="font-medium truncate ml-2">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Role:</span>
                  <span className="font-medium capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Department:</span>
                  <span className="font-medium truncate ml-2">{user?.department}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Sidebar */}
          {showMobileSidebar && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileSidebar(false)} />
              <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="px-4 py-6">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard')
                        setShowMobileSidebar(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === 'dashboard'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Server className="h-5 w-5" />
                      <span className="font-medium">System Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('staff')
                        setShowMobileSidebar(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === 'staff'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="h-5 w-5" />
                      <span className="font-medium">Staff Management</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('registration')
                        setShowMobileSidebar(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === 'registration'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <UserCheck className="h-5 w-5" />
                      <span className="font-medium">Registration Requests</span>
                      {registrationRequests.filter(r => r.status === 'pending').length > 0 && (
                        <span className="ml-auto bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {registrationRequests.filter(r => r.status === 'pending').length}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('settings')
                        setShowMobileSidebar(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === 'settings'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-medium">System Settings</span>
                    </button>
                  </div>
                </nav>

                {/* Mobile Admin Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-4 text-white">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Admin Access</h3>
                        <p className="text-primary-100 text-xs">Full system privileges</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-primary-100">User:</span>
                        <span className="font-medium truncate ml-2">{user?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-100">Role:</span>
                        <span className="font-medium capitalize">{user?.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel