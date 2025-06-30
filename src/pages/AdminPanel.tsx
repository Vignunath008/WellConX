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
  Trash
} from 'lucide-react'

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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">System Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Users className="h-5 w-5 text-gray-700" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemStats.activeUsers}</div>
          <p className="text-sm text-gray-600 mt-1">Active users</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Activity className="h-5 w-5 text-gray-700" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Devices</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemStats.onlineDevices}</div>
          <p className="text-sm text-gray-600 mt-1">Online devices</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <BarChart3 className="h-5 w-5 text-gray-700" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemStats.alertsToday}</div>
          <p className="text-sm text-gray-600 mt-1">Alerts today</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-gray-700" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Response</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemStats.responseTime}</div>
          <p className="text-sm text-gray-600 mt-1">Avg. response time</p>
        </div>
      </div>
      
      {/* System Status */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">System Uptime:</span>
              <span className="text-gray-900 font-medium">{systemStats.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage Usage:</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gray-600 h-2 rounded-full" 
                    style={{ width: systemStats.storageUsed }}
                  ></div>
                </div>
                <span className="text-gray-900">{systemStats.storageUsed}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Backup:</span>
              <span className="text-gray-900">{systemStats.lastBackup.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">HL7 Service:</span>
              <span className="text-gray-900 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="text-gray-900 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Authentication:</span>
              <span className="text-gray-900 font-medium">Secure</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'User Login', user: 'Dr. Rajesh Sharma', time: '10 minutes ago' },
            { action: 'Patient Added', user: 'Nurse Priya Patel', time: '25 minutes ago' },
            { action: 'Alert Acknowledged', user: 'Dr. Rajesh Sharma', time: '42 minutes ago' },
            { action: 'Device Configured', user: 'Vikram Mehta', time: '1 hour ago' },
            { action: 'System Backup', user: 'System', time: '6 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render staff management tab
  const renderStaffManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Add Staff
          </button>
        </div>
      </div>
      
      {/* Staff List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 font-medium">{staff.name.charAt(0)}</span>
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
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.lastLogin.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Render registration requests tab
  const renderRegistrationRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Registration Requests</h2>
        <button 
          onClick={refreshRegistrationRequests}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
      
      {registrationRequests.filter(req => req.status === 'pending').length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
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
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 font-medium">{request.firstName.charAt(0)}</span>
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
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        PENDING
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleRegistrationAction(request.id, 'approve')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleRegistrationAction(request.id, 'reject')}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">There are no registration requests waiting for approval.</p>
        </div>
      )}

      {/* Processed Requests */}
      {registrationRequests.filter(req => req.status !== 'pending').length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processed Requests</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
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
                            <span className="text-gray-700 font-medium">{request.firstName.charAt(0)}</span>
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
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render system settings tab
  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">Automatically log out inactive users</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Password Policy</p>
              <p className="text-sm text-gray-600">Minimum requirements for passwords</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <option value="standard">Standard (8+ chars)</option>
              <option value="strong" selected>Strong (12+ chars, special)</option>
              <option value="very-strong">Very Strong (16+ chars, complex)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Data Retention</p>
              <p className="text-sm text-gray-600">How long to keep patient data</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365" selected>1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Automatic Backups</p>
              <p className="text-sm text-gray-600">Schedule regular database backups</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <option value="daily" selected>Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Export Format</p>
              <p className="text-sm text-gray-600">Default format for data exports</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <option value="json" selected>JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Clear Cache</p>
              <p className="text-sm text-gray-600">Remove temporary files and cached data</p>
            </div>
            <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm">
              Clear Now
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Manual Backup</p>
              <p className="text-sm text-gray-600">Create a full system backup</p>
            </div>
            <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm">
              Backup Now
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">System Logs</p>
              <p className="text-sm text-gray-600">Download system logs for troubleshooting</p>
            </div>
            <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Shield className="h-8 w-8 text-gray-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Config</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'dashboard'
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Server className="h-5 w-5" />
                <span className="font-medium">System Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'staff'
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Staff Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('registration')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'registration'
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span className="font-medium">Registration Requests</span>
                {registrationRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {registrationRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'settings'
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">System Settings</span>
              </button>
            </nav>
          </div>
          
          {/* Admin Info Card */}
          <div className="bg-gray-900 rounded-lg p-6 mt-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Admin Access</h3>
                <p className="text-gray-300 text-sm">Full system privileges</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">User:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Role:</span>
                <span className="font-medium capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Department:</span>
                <span className="font-medium">{user?.department}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel