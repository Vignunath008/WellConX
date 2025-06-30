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
  Plus
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
      <h2 className="text-xl font-bold text-text-primary">System Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-50 rounded-card p-6 border border-primary-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-100 p-3 rounded-medical">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm text-primary-600 font-medium">Users</span>
          </div>
          <div className="text-2xl font-bold text-primary-700">{systemStats.activeUsers}</div>
          <p className="text-sm text-primary-600 mt-1">Active users</p>
        </div>
        
        <div className="bg-health-50 rounded-card p-6 border border-health-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-health-100 p-3 rounded-medical">
              <Activity className="h-6 w-6 text-health-600" />
            </div>
            <span className="text-sm text-health-600 font-medium">Devices</span>
          </div>
          <div className="text-2xl font-bold text-health-700">{systemStats.onlineDevices}</div>
          <p className="text-sm text-health-600 mt-1">Online devices</p>
        </div>
        
        <div className="bg-purple-50 rounded-card p-6 border border-purple-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-medical">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{systemStats.alertsToday}</div>
          <p className="text-sm text-purple-600 mt-1">Alerts today</p>
        </div>
        
        <div className="bg-alert-50 rounded-card p-6 border border-alert-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-alert-100 p-3 rounded-medical">
              <Clock className="h-6 w-6 text-alert-600" />
            </div>
            <span className="text-sm text-alert-600 font-medium">Response</span>
          </div>
          <div className="text-2xl font-bold text-alert-700">{systemStats.responseTime}</div>
          <p className="text-sm text-alert-600 mt-1">Avg. response time</p>
        </div>
      </div>
      
      {/* System Status */}
      <div className="bg-white rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">System Uptime:</span>
              <span className="text-health-600 font-medium">{systemStats.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Storage Usage:</span>
              <div className="flex items-center">
                <div className="w-32 bg-background-hover rounded-full h-2 mr-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: systemStats.storageUsed }}
                  ></div>
                </div>
                <span className="text-text-primary">{systemStats.storageUsed}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Last Backup:</span>
              <span className="text-text-primary">{systemStats.lastBackup.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">HL7 Service:</span>
              <span className="text-health-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Database:</span>
              <span className="text-health-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Authentication:</span>
              <span className="text-health-600 font-medium">Secure</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'User Login', user: 'Dr. Rajesh Sharma', time: '10 minutes ago' },
            { action: 'Patient Added', user: 'Nurse Priya Patel', time: '25 minutes ago' },
            { action: 'Alert Acknowledged', user: 'Dr. Rajesh Sharma', time: '42 minutes ago' },
            { action: 'Device Configured', user: 'Vikram Mehta', time: '1 hour ago' },
            { action: 'System Backup', user: 'System', time: '6 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border-light">
              <div>
                <p className="font-medium text-text-primary">{activity.action}</p>
                <p className="text-sm text-text-secondary">{activity.user}</p>
              </div>
              <span className="text-xs text-text-light">{activity.time}</span>
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
        <h2 className="text-xl font-bold text-text-primary">Staff Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
            />
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>
      
      {/* Staff List */}
      <div className="bg-white rounded-card border border-border-light overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-background-hover">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-light">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-background-hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">{staff.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{staff.name}</div>
                        <div className="text-sm text-text-secondary">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary capitalize">{staff.role}</div>
                    <div className="text-sm text-text-secondary">{staff.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary">{staff.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === 'active' ? 'bg-health-100 text-health-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {staff.lastLogin.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
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
        <h2 className="text-xl font-bold text-text-primary">Registration Requests</h2>
        <button 
          onClick={refreshRegistrationRequests}
          className="bg-background-hover hover:bg-border-light text-text-primary px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
      
      {registrationRequests.filter(req => req.status === 'pending').length > 0 ? (
        <div className="bg-white rounded-card border border-border-light overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light">
              <thead className="bg-background-hover">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border-light">
                {registrationRequests.filter(req => req.status === 'pending').map((request) => (
                  <tr key={request.id} className="hover:bg-background-hover">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-alert-100 rounded-full flex items-center justify-center">
                          <span className="text-alert-600 font-medium">{request.firstName.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-primary">{request.firstName} {request.lastName}</div>
                          <div className="text-sm text-text-secondary">{request.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary capitalize">{request.role}</div>
                      <div className="text-sm text-text-secondary">{request.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{request.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-alert-100 text-alert-800">
                        PENDING
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleRegistrationAction(request.id, 'approve')}
                        className="text-health-600 hover:text-health-900 mr-3"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleRegistrationAction(request.id, 'reject')}
                        className="text-red-600 hover:text-red-900"
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
        <div className="bg-white rounded-card p-8 border border-border-light text-center shadow-soft">
          <UserCheck className="h-12 w-12 text-text-light mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Pending Requests</h3>
          <p className="text-text-secondary">There are no registration requests waiting for approval.</p>
        </div>
      )}

      {/* Processed Requests */}
      {registrationRequests.filter(req => req.status !== 'pending').length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Processed Requests</h3>
          <div className="bg-white rounded-card border border-border-light overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-light">
                <thead className="bg-background-hover">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {registrationRequests.filter(req => req.status !== 'pending').map((request) => (
                    <tr key={request.id} className="hover:bg-background-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-alert-100 rounded-full flex items-center justify-center">
                            <span className="text-alert-600 font-medium">{request.firstName.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text-primary">{request.firstName} {request.lastName}</div>
                            <div className="text-sm text-text-secondary">{request.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary capitalize">{request.role}</div>
                        <div className="text-sm text-text-secondary">{request.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">{request.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'approved' ? 'bg-health-100 text-health-800' : 'bg-red-100 text-red-800'
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
      <h2 className="text-xl font-bold text-text-primary">System Settings</h2>
      
      <div className="bg-white rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Two-Factor Authentication</p>
              <p className="text-sm text-text-secondary">Require 2FA for all admin users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-background-hover peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Session Timeout</p>
              <p className="text-sm text-text-secondary">Automatically log out inactive users</p>
            </div>
            <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Password Policy</p>
              <p className="text-sm text-text-secondary">Minimum requirements for passwords</p>
            </div>
            <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
              <option value="standard">Standard (8+ chars)</option>
              <option value="strong" selected>Strong (12+ chars, special)</option>
              <option value="very-strong">Very Strong (16+ chars, complex)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Data Retention</p>
              <p className="text-sm text-text-secondary">How long to keep patient data</p>
            </div>
            <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365" selected>1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Automatic Backups</p>
              <p className="text-sm text-text-secondary">Schedule regular database backups</p>
            </div>
            <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
              <option value="daily" selected>Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Export Format</p>
              <p className="text-sm text-text-secondary">Default format for data exports</p>
            </div>
            <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
              <option value="json" selected>JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">System Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Clear Cache</p>
              <p className="text-sm text-text-secondary">Remove temporary files and cached data</p>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical text-sm">
              Clear Now
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Manual Backup</p>
              <p className="text-sm text-text-secondary">Create a full system backup</p>
            </div>
            <button className="bg-health-600 hover:bg-health-700 text-white px-4 py-2 rounded-medical text-sm">
              Backup Now
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">System Logs</p>
              <p className="text-sm text-text-secondary">Download system logs for troubleshooting</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-medical text-sm">
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
          <div className="bg-red-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h2>
          <p className="text-text-secondary mb-4">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical"
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
        <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshRegistrationRequests}
            className="bg-background-hover hover:bg-border-light text-text-primary px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => alert('System configuration exported')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Config</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-card border border-border-light overflow-hidden shadow-soft">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <Server className="h-5 w-5" />
                <span className="font-medium">System Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'staff'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Staff Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('registration')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'registration'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span className="font-medium">Registration Requests</span>
                {registrationRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-alert-100 text-alert-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {registrationRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">System Settings</span>
              </button>
            </nav>
          </div>
          
          {/* Admin Info Card */}
          <motion.div 
            className="medical-gradient-primary rounded-card p-6 mt-6 text-white shadow-medical"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 p-3 rounded-medical backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Admin Access</h3>
                <p className="text-blue-100 text-sm">Full system privileges</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-100">User:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Role:</span>
                <span className="font-medium capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Department:</span>
                <span className="font-medium">{user?.department}</span>
              </div>
            </div>
          </motion.div>
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