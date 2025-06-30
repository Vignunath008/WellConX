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
  Database,
  FileText,
  Bell,
  Lock,
  HardDrive,
  Zap,
  Wifi,
  GitBranch,
  Layers,
  Cpu,
  Monitor,
  Save
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
      name: 'Dr. Aditya Gupta',
      email: 'aditya.gupta@wellconx.com',
      role: 'doctor',
      department: 'Neurology',
      specialization: 'Neurology',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
    },
    {
      id: 'staff-004',
      name: 'Dr. Neha Reddy',
      email: 'neha.reddy@wellconx.com',
      role: 'doctor',
      department: 'Pediatrics',
      specialization: 'Pediatric Cardiology',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
    },
    {
      id: 'staff-005',
      name: 'Nurse Arjun Kumar',
      email: 'arjun.kumar@wellconx.com',
      role: 'nurse',
      department: 'Emergency',
      specialization: 'Trauma Care',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
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
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-100 p-3 rounded-medical">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm text-primary-600 font-medium">Users</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{systemStats.activeUsers}</div>
          <p className="text-sm text-text-secondary mt-1">Active users</p>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-health-100 p-3 rounded-medical">
              <Activity className="h-6 w-6 text-health-600" />
            </div>
            <span className="text-sm text-health-600 font-medium">Devices</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{systemStats.onlineDevices}</div>
          <p className="text-sm text-text-secondary mt-1">Online devices</p>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-alert-100 p-3 rounded-medical">
              <BarChart3 className="h-6 w-6 text-alert-600" />
            </div>
            <span className="text-sm text-alert-600 font-medium">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{systemStats.alertsToday}</div>
          <p className="text-sm text-text-secondary mt-1">Alerts today</p>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-100 p-3 rounded-medical">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm text-primary-600 font-medium">Response</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{systemStats.responseTime}</div>
          <p className="text-sm text-text-secondary mt-1">Avg. response time</p>
        </div>
      </div>
      
      {/* System Status */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
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
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
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
      <div className="bg-background-card rounded-card border border-border-light overflow-hidden shadow-soft">
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
            <tbody className="bg-background-card divide-y divide-border-light">
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
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
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
        <div className="bg-background-card rounded-card border border-border-light overflow-hidden shadow-soft">
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
              <tbody className="bg-background-card divide-y divide-border-light">
                {registrationRequests.filter(req => req.status === 'pending').map((request) => (
                  <tr key={request.id} className="hover:bg-background-hover">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">{request.firstName.charAt(0)}</span>
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
        <div className="bg-background-card rounded-card p-8 border border-border-light text-center shadow-soft">
          <UserCheck className="h-12 w-12 text-text-light mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Pending Requests</h3>
          <p className="text-text-secondary">There are no registration requests waiting for approval.</p>
        </div>
      )}

      {/* Processed Requests */}
      {registrationRequests.filter(req => req.status !== 'pending').length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Processed Requests</h3>
          <div className="bg-background-card rounded-card border border-border-light overflow-hidden shadow-soft">
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
                <tbody className="bg-background-card divide-y divide-border-light">
                  {registrationRequests.filter(req => req.status !== 'pending').map((request) => (
                    <tr key={request.id} className="hover:bg-background-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">{request.firstName.charAt(0)}</span>
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
      
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
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
      
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
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
      
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
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
            <button className="bg-text-secondary hover:bg-text-primary text-white px-4 py-2 rounded-medical text-sm">
              Download Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render device management tab
  const renderDeviceManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Device Management</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Device Type</span>
        </button>
      </div>
      
      {/* Device Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-3 rounded-medical">
                <Monitor className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Philips IntelliVue</h3>
                <p className="text-sm text-text-secondary">Patient Monitors</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-health-100 text-health-800">Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Supported Models:</span>
              <span className="text-text-primary">MP70, MP60, MP50, MP30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Protocol:</span>
              <span className="text-text-primary">HL7 v2.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active Devices:</span>
              <span className="text-text-primary">3</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-background-hover hover:bg-border-light text-text-primary px-3 py-2 rounded-medical text-sm">
              Configure
            </button>
            <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              View Devices
            </button>
          </div>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-alert-100 p-3 rounded-medical">
                <Monitor className="h-6 w-6 text-alert-600" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">GE Healthcare</h3>
                <p className="text-sm text-text-secondary">Patient Monitors</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-health-100 text-health-800">Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Supported Models:</span>
              <span className="text-text-primary">DASH 5000, B650, B450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Protocol:</span>
              <span className="text-text-primary">HL7 v2.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active Devices:</span>
              <span className="text-text-primary">2</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-background-hover hover:bg-border-light text-text-primary px-3 py-2 rounded-medical text-sm">
              Configure
            </button>
            <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              View Devices
            </button>
          </div>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-health-100 p-3 rounded-medical">
                <Monitor className="h-6 w-6 text-health-600" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Mindray</h3>
                <p className="text-sm text-text-secondary">Patient Monitors</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-health-100 text-health-800">Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Supported Models:</span>
              <span className="text-text-primary">BeneView T1, T5, T8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Protocol:</span>
              <span className="text-text-primary">HL7 v2.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Active Devices:</span>
              <span className="text-text-primary">1</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-background-hover hover:bg-border-light text-text-primary px-3 py-2 rounded-medical text-sm">
              Configure
            </button>
            <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              View Devices
            </button>
          </div>
        </div>
      </div>
      
      {/* HL7 Configuration */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">HL7 Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-3">Network Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">HL7 Listener IP</label>
                <input
                  type="text"
                  value="192.168.1.50"
                  className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">HL7 Port</label>
                <input
                  type="text"
                  value="2575"
                  className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Backup Port</label>
                <input
                  type="text"
                  value="2576"
                  className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-text-primary mb-3">Protocol Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">HL7 Version</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="2.3">HL7 v2.3</option>
                  <option value="2.4">HL7 v2.4</option>
                  <option value="2.5" selected>HL7 v2.5</option>
                  <option value="2.6">HL7 v2.6</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Transport Protocol</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="mllp" selected>MLLP (Minimal Lower Layer Protocol)</option>
                  <option value="tcp">TCP (Raw Socket)</option>
                  <option value="https">HTTPS (Web Service)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Message Types</label>
                <div className="space-y-1 mt-1">
                  <label className="flex items-center">
                    <input type="checkbox" checked className="rounded border-border-medium text-primary-600 focus:ring-primary-500 mr-2" />
                    <span className="text-sm text-text-primary">ORU^R01 (Observation Results)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked className="rounded border-border-medium text-primary-600 focus:ring-primary-500 mr-2" />
                    <span className="text-sm text-text-primary">ADT^A01 (Admission)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked className="rounded border-border-medium text-primary-600 focus:ring-primary-500 mr-2" />
                    <span className="text-sm text-text-primary">ADT^A08 (Update Patient Info)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )

  // Render integration management tab
  const renderIntegrationManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Integration Management</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Integration</span>
        </button>
      </div>
      
      {/* Active Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-3 rounded-medical">
                <Database className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Hospital EHR System</h3>
                <p className="text-sm text-text-secondary">Electronic Health Records</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-health-100 text-health-800">Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Integration Type:</span>
              <span className="text-text-primary">HL7 FHIR API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Last Sync:</span>
              <span className="text-text-primary">10 minutes ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Status:</span>
              <span className="text-health-600">Connected</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-background-hover hover:bg-border-light text-text-primary px-3 py-2 rounded-medical text-sm">
              Configure
            </button>
            <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              View Logs
            </button>
          </div>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-alert-100 p-3 rounded-medical">
                <FileText className="h-6 w-6 text-alert-600" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Laboratory System</h3>
                <p className="text-sm text-text-secondary">Lab Results Integration</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-health-100 text-health-800">Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Integration Type:</span>
              <span className="text-text-primary">REST API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Last Sync:</span>
              <span className="text-text-primary">25 minutes ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Status:</span>
              <span className="text-health-600">Connected</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-background-hover hover:bg-border-light text-text-primary px-3 py-2 rounded-medical text-sm">
              Configure
            </button>
            <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              View Logs
            </button>
          </div>
        </div>
      </div>
      
      {/* Available Integrations */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border-light rounded-medical p-4 hover:bg-background-hover transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-primary-100 p-2 rounded-medical">
                <Bell className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="font-medium text-text-primary">Notification System</h4>
            </div>
            <p className="text-sm text-text-secondary mb-3">Integrate with hospital-wide notification systems for alerts and critical updates.</p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              Set Up
            </button>
          </div>
          
          <div className="border border-border-light rounded-medical p-4 hover:bg-background-hover transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-alert-100 p-2 rounded-medical">
                <HardDrive className="h-5 w-5 text-alert-600" />
              </div>
              <h4 className="font-medium text-text-primary">PACS System</h4>
            </div>
            <p className="text-sm text-text-secondary mb-3">Connect to Picture Archiving and Communication System for medical imaging.</p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              Set Up
            </button>
          </div>
          
          <div className="border border-border-light rounded-medical p-4 hover:bg-background-hover transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-health-100 p-2 rounded-medical">
                <Zap className="h-5 w-5 text-health-600" />
              </div>
              <h4 className="font-medium text-text-primary">Pharmacy System</h4>
            </div>
            <p className="text-sm text-text-secondary mb-3">Integrate with hospital pharmacy systems for medication management.</p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              Set Up
            </button>
          </div>
        </div>
      </div>
      
      {/* API Management */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">API Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">API Access</p>
              <p className="text-sm text-text-secondary">Enable external API access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-background-hover peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">API Keys</p>
              <p className="text-sm text-text-secondary">Manage API authentication keys</p>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm">
              Manage Keys
            </button>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <div>
              <p className="font-medium text-text-primary">Rate Limiting</p>
              <p className="text-sm text-text-secondary">Maximum requests per minute</p>
            </div>
            <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
              <option value="60">60 requests/min</option>
              <option value="120" selected>120 requests/min</option>
              <option value="300">300 requests/min</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  // Render system monitoring tab
  const renderSystemMonitoring = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">System Monitoring</h2>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h" selected>Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-100 p-3 rounded-medical">
              <Cpu className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm text-primary-600 font-medium">CPU</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">12%</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-text-secondary">Average usage</p>
            <span className="text-xs text-health-600">Normal</span>
          </div>
          <div className="w-full bg-background-hover rounded-full h-2 mt-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '12%' }}></div>
          </div>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-health-100 p-3 rounded-medical">
              <HardDrive className="h-6 w-6 text-health-600" />
            </div>
            <span className="text-sm text-health-600 font-medium">Memory</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">38%</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-text-secondary">8.2 GB / 16 GB</p>
            <span className="text-xs text-health-600">Normal</span>
          </div>
          <div className="w-full bg-background-hover rounded-full h-2 mt-2">
            <div className="bg-health-600 h-2 rounded-full" style={{ width: '38%' }}></div>
          </div>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-alert-100 p-3 rounded-medical">
              <Database className="h-6 w-6 text-alert-600" />
            </div>
            <span className="text-sm text-alert-600 font-medium">Storage</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">68%</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-text-secondary">342 GB / 500 GB</p>
            <span className="text-xs text-alert-600">Moderate</span>
          </div>
          <div className="w-full bg-background-hover rounded-full h-2 mt-2">
            <div className="bg-alert-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
        
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-100 p-3 rounded-medical">
              <Wifi className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm text-primary-600 font-medium">Network</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">5.2 Mbps</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-text-secondary">Current throughput</p>
            <span className="text-xs text-health-600">Normal</span>
          </div>
          <div className="w-full bg-background-hover rounded-full h-2 mt-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Service Status */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Service Status</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-background-hover">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Uptime
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Restart
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-card divide-y divide-border-light">
              {[
                { name: 'HL7 Listener', status: 'Running', uptime: '14d 6h 32m', lastRestart: '2 weeks ago' },
                { name: 'Database Service', status: 'Running', uptime: '14d 6h 32m', lastRestart: '2 weeks ago' },
                { name: 'Web Server', status: 'Running', uptime: '14d 6h 32m', lastRestart: '2 weeks ago' },
                { name: 'Authentication Service', status: 'Running', uptime: '14d 6h 32m', lastRestart: '2 weeks ago' },
                { name: 'Backup Service', status: 'Running', uptime: '6h 15m', lastRestart: '6 hours ago' }
              ].map((service, index) => (
                <tr key={index} className="hover:bg-background-hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-text-primary">{service.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-health-100 text-health-800">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {service.uptime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {service.lastRestart}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      Restart
                    </button>
                    <button className="text-primary-600 hover:text-primary-900">
                      Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* System Logs */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent System Logs</h3>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-medical text-sm flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Logs</span>
          </button>
        </div>
        <div className="bg-background-hover rounded-medical p-4 font-mono text-sm text-text-primary overflow-x-auto">
          <div className="space-y-1">
            <div className="flex">
              <span className="text-health-600 mr-2">[INFO]</span>
              <span className="text-text-light mr-2">2024-05-15 11:45:23</span>
              <span>System backup completed successfully</span>
            </div>
            <div className="flex">
              <span className="text-primary-600 mr-2">[NOTICE]</span>
              <span className="text-text-light mr-2">2024-05-15 11:30:12</span>
              <span>User login: admin@wellconx.com (IP: 192.168.1.25)</span>
            </div>
            <div className="flex">
              <span className="text-alert-600 mr-2">[WARN]</span>
              <span className="text-text-light mr-2">2024-05-15 11:15:45</span>
              <span>High memory usage detected (75%), monitoring situation</span>
            </div>
            <div className="flex">
              <span className="text-primary-600 mr-2">[NOTICE]</span>
              <span className="text-text-light mr-2">2024-05-15 11:10:33</span>
              <span>New patient record created: PAT-123456</span>
            </div>
            <div className="flex">
              <span className="text-health-600 mr-2">[INFO]</span>
              <span className="text-text-light mr-2">2024-05-15 11:05:17</span>
              <span>HL7 connection established with device PHI-MP70-001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render advanced configuration tab
  const renderAdvancedConfiguration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Advanced Configuration</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
      
      {/* System Parameters */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">System Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-3">Performance Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Data Processing Threads</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="2">2 threads</option>
                  <option value="4" selected>4 threads</option>
                  <option value="8">8 threads</option>
                  <option value="16">16 threads</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Database Connection Pool</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="5">5 connections</option>
                  <option value="10" selected>10 connections</option>
                  <option value="20">20 connections</option>
                  <option value="50">50 connections</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Cache Size (MB)</label>
                <input
                  type="number"
                  value="512"
                  className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-text-primary mb-3">Advanced Security</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">IP Whitelisting</label>
                <textarea
                  className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                  rows={3}
                  placeholder="Enter IP addresses, one per line"
                  value="192.168.1.0/24&#10;10.0.0.5&#10;10.0.0.6"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">API Rate Limiting Strategy</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="fixed">Fixed Window</option>
                  <option value="sliding" selected>Sliding Window</option>
                  <option value="token">Token Bucket</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">TLS 1.3 Only</p>
                  <p className="text-xs text-text-secondary">Enforce TLS 1.3 for all connections</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-background-hover peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Monitoring Configuration */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Advanced Monitoring Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-3">Vital Sign Thresholds</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Heart Rate Warning Range (bpm)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value="60"
                    className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                  />
                  <span className="text-text-secondary">to</span>
                  <input
                    type="number"
                    value="100"
                    className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">SpO2 Warning Threshold (%)</label>
                <input
                  type="number"
                  value="95"
                  className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Temperature Warning Range (°F)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value="97"
                    step="0.1"
                    className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                  />
                  <span className="text-text-secondary">to</span>
                  <input
                    type="number"
                    value="99.5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-text-primary mb-3">AI Configuration</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">AI Analysis Frequency</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="5">Every 5 seconds</option>
                  <option value="15" selected>Every 15 seconds</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every minute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Predictive Alert Threshold</label>
                <select className="w-full px-3 py-2 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background-card">
                  <option value="0.6">60% confidence</option>
                  <option value="0.7" selected>70% confidence</option>
                  <option value="0.8">80% confidence</option>
                  <option value="0.9">90% confidence</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Enable AI Diagnostics</p>
                  <p className="text-xs text-text-secondary">Use AI for diagnostic suggestions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-background-hover peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Architecture */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <h3 className="text-lg font-semibold text-text-primary mb-4">System Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border-light rounded-medical p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-primary-100 p-2 rounded-medical">
                <Layers className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="font-medium text-text-primary">Microservices</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Status:</span>
                <span className="text-health-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Services:</span>
                <span className="text-text-primary">8 running</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Health:</span>
                <span className="text-health-600">100%</span>
              </div>
            </div>
          </div>
          
          <div className="border border-border-light rounded-medical p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-alert-100 p-2 rounded-medical">
                <Database className="h-5 w-5 text-alert-600" />
              </div>
              <h4 className="font-medium text-text-primary">Database Cluster</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Status:</span>
                <span className="text-health-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Nodes:</span>
                <span className="text-text-primary">3 active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Replication:</span>
                <span className="text-health-600">Synchronized</span>
              </div>
            </div>
          </div>
          
          <div className="border border-border-light rounded-medical p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-health-100 p-2 rounded-medical">
                <GitBranch className="h-5 w-5 text-health-600" />
              </div>
              <h4 className="font-medium text-text-primary">Load Balancer</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Status:</span>
                <span className="text-health-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Algorithm:</span>
                <span className="text-text-primary">Round Robin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Health Checks:</span>
                <span className="text-health-600">Passing</span>
              </div>
            </div>
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
      case 'devices':
        return renderDeviceManagement()
      case 'integrations':
        return renderIntegrationManagement()
      case 'monitoring':
        return renderSystemMonitoring()
      case 'advanced':
        return renderAdvancedConfiguration()
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
          <div className="bg-background-card rounded-card border border-border-light overflow-hidden shadow-soft">
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
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {registrationRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'devices'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <Monitor className="h-5 w-5" />
                <span className="font-medium">Device Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('integrations')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'integrations'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <GitBranch className="h-5 w-5" />
                <span className="font-medium">Integrations</span>
              </button>
              
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'monitoring'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">System Monitoring</span>
              </button>
              
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex items-center space-x-3 px-4 py-3 text-left ${
                  activeTab === 'advanced'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                    : 'text-text-primary hover:bg-background-hover'
                }`}
              >
                <Cpu className="h-5 w-5" />
                <span className="font-medium">Advanced Config</span>
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