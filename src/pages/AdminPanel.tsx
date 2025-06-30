import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Plus,
  Save,
  X,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  Building,
  Award,
  Calendar,
  FileText,
  Shield
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface RegistrationRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  role: 'doctor' | 'nurse'
  licenseNumber: string
  specialization: string
  department: string
  yearsOfExperience: string
  currentEmployer: string
  submittedAt: string
  status: 'pending_approval' | 'approved' | 'rejected'
  licenseDocument?: File
  certificationDocument?: File
}

interface StaffMember {
  id: string
  name: string
  email: string
  role: 'doctor' | 'nurse'
  department: string
  specialization: string
  licenseNumber: string
  phone: string
  yearsOfExperience: string
  status: 'active' | 'inactive'
  lastLogin: Date
  joinedDate: Date
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth()
  const { patients, devices } = useData()
  const [activeTab, setActiveTab] = useState('overview')
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'doctor' | 'nurse'>('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Load registration requests
    const requests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
    setRegistrationRequests(requests)

    // Load approved staff members and add demo users
    const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
    
    // Add demo staff members if none exist
    const demoStaff: StaffMember[] = [
      {
        id: 'STAFF-001',
        name: 'Dr. Sarah Johnson',
        email: 'doctor@wellconx.com',
        role: 'doctor',
        department: 'Cardiology',
        specialization: 'Interventional Cardiology',
        licenseNumber: 'MD-12345',
        phone: '+1 (555) 123-4567',
        yearsOfExperience: '10-15',
        status: 'active',
        lastLogin: new Date(),
        joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 year ago
      },
      {
        id: 'STAFF-002',
        name: 'Nurse Mary Wilson',
        email: 'nurse@wellconx.com',
        role: 'nurse',
        department: 'ICU',
        specialization: 'Critical Care',
        licenseNumber: 'RN-67890',
        phone: '+1 (555) 234-5678',
        yearsOfExperience: '6-10',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 6 months ago
      }
    ]

    const staff = [...demoStaff, ...approvedUsers.map((user: any) => ({
      ...user,
      lastLogin: new Date(user.lastLogin || Date.now()),
      joinedDate: new Date(user.joinedDate || Date.now()),
      status: user.status || 'active'
    }))]
    
    setStaffMembers(staff)
  }, [])

  const handleApproveRequest = (requestId: string) => {
    const request = registrationRequests.find(r => r.id === requestId)
    if (!request) return

    // Create new staff member
    const newStaffMember: StaffMember = {
      id: `STAFF-${Date.now()}`,
      name: `${request.firstName} ${request.lastName}`,
      email: request.email,
      role: request.role,
      department: request.department,
      specialization: request.specialization,
      licenseNumber: request.licenseNumber,
      phone: request.phone,
      yearsOfExperience: request.yearsOfExperience,
      status: 'active',
      lastLogin: new Date(),
      joinedDate: new Date()
    }

    // Update staff list
    const updatedStaff = [...staffMembers, newStaffMember]
    setStaffMembers(updatedStaff)

    // Add to approved users for login
    const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
    approvedUsers.push(newStaffMember)
    localStorage.setItem('wellconx_approved_users', JSON.stringify(approvedUsers))

    // Update request status
    const updatedRequests = registrationRequests.map(r =>
      r.id === requestId ? { ...r, status: 'approved' as const } : r
    )
    setRegistrationRequests(updatedRequests)
    localStorage.setItem('wellconx_registration_requests', JSON.stringify(updatedRequests))

    alert(`✅ ${request.firstName} ${request.lastName} has been approved and added to the system!\n\nThey can now log in with:\nEmail: ${request.email}\nPassword: demo123`)
  }

  const handleRejectRequest = (requestId: string) => {
    const request = registrationRequests.find(r => r.id === requestId)
    if (!request) return

    if (confirm(`Are you sure you want to reject ${request.firstName} ${request.lastName}'s registration request?`)) {
      const updatedRequests = registrationRequests.map(r =>
        r.id === requestId ? { ...r, status: 'rejected' as const } : r
      )
      setRegistrationRequests(updatedRequests)
      localStorage.setItem('wellconx_registration_requests', JSON.stringify(updatedRequests))

      alert(`❌ ${request.firstName} ${request.lastName}'s registration request has been rejected.`)
    }
  }

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff({ ...staff })
    setShowEditModal(true)
  }

  const handleSaveStaffEdit = () => {
    if (!editingStaff) return

    const updatedStaff = staffMembers.map(s =>
      s.id === editingStaff.id ? editingStaff : s
    )
    setStaffMembers(updatedStaff)

    // Update approved users (excluding demo users)
    if (!editingStaff.id.startsWith('STAFF-00')) {
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      const updatedApprovedUsers = approvedUsers.map((user: any) =>
        user.id === editingStaff.id ? editingStaff : user
      )
      localStorage.setItem('wellconx_approved_users', JSON.stringify(updatedApprovedUsers))
    }

    setShowEditModal(false)
    setEditingStaff(null)
    alert('✅ Staff member details updated successfully!')
  }

  const handleRemoveStaff = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId)
    if (!staff) return

    // Prevent removal of demo users
    if (staffId.startsWith('STAFF-00')) {
      alert('❌ Cannot remove demo users. This is a demonstration account.')
      return
    }

    if (confirm(`Are you sure you want to remove ${staff.name} from the system?\n\nThis action cannot be undone and will:\n• Remove their access to WellConX\n• Delete their account\n• Remove them from all assignments`)) {
      // Remove from staff list
      const updatedStaff = staffMembers.filter(s => s.id !== staffId)
      setStaffMembers(updatedStaff)

      // Remove from approved users
      const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      const updatedApprovedUsers = approvedUsers.filter((user: any) => user.id !== staffId)
      localStorage.setItem('wellconx_approved_users', JSON.stringify(updatedApprovedUsers))

      alert(`🗑️ ${staff.name} has been removed from the system.`)
    }
  }

  const handleToggleStaffStatus = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId)
    if (!staff) return

    const newStatus = staff.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? 'activate' : 'deactivate'

    if (confirm(`Are you sure you want to ${action} ${staff.name}?\n\n${newStatus === 'active' ? 'They will regain access to WellConX.' : 'They will lose access to WellConX until reactivated.'}`)) {
      const updatedStaff = staffMembers.map(s =>
        s.id === staffId ? { ...s, status: newStatus } : s
      )
      setStaffMembers(updatedStaff)

      // Update approved users (excluding demo users)
      if (!staffId.startsWith('STAFF-00')) {
        const approvedUsers = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
        const updatedApprovedUsers = approvedUsers.map((user: any) =>
          user.id === staffId ? { ...user, status: newStatus } : user
        )
        localStorage.setItem('wellconx_approved_users', JSON.stringify(updatedApprovedUsers))
      }

      alert(`✅ ${staff.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`)
    }
  }

  const filteredRequests = registrationRequests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      `${request.firstName} ${request.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesRole = roleFilter === 'all' || request.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = searchTerm === '' || 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const exportData = () => {
    const exportData = {
      registrationRequests,
      staffMembers,
      patients,
      devices,
      exportDate: new Date().toISOString(),
      exportedBy: user?.name
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wellconx-admin-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStats = () => {
    const pendingRequests = registrationRequests.filter(r => r.status === 'pending_approval').length
    const totalStaff = staffMembers.length
    const activeStaff = staffMembers.filter(s => s.status === 'active').length
    const totalPatients = patients.length
    const onlineDevices = devices.filter(d => d.status === 'online').length
    const totalDoctors = staffMembers.filter(s => s.role === 'doctor').length
    const totalNurses = staffMembers.filter(s => s.role === 'nurse').length

    return {
      pendingRequests,
      totalStaff,
      activeStaff,
      totalPatients,
      onlineDevices,
      totalDevices: devices.length,
      totalDoctors,
      totalNurses
    }
  }

  const stats = getStats()

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pendingRequests}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-50 rounded-xl p-6 border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Staff</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalStaff}</p>
              <p className="text-xs text-blue-500">{stats.totalDoctors} doctors, {stats.totalNurses} nurses</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-xl p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active Patients</p>
              <p className="text-2xl font-bold text-green-700">{stats.totalPatients}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-purple-50 rounded-xl p-6 border border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Online Devices</p>
              <p className="text-2xl font-bold text-purple-700">{stats.onlineDevices}/{stats.totalDevices}</p>
            </div>
            <Building className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registration Requests</h3>
          <div className="space-y-3">
            {registrationRequests.slice(0, 5).map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{request.firstName} {request.lastName}</p>
                  <p className="text-sm text-gray-600">{request.role} • {request.specialization}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            ))}
            {registrationRequests.length === 0 && (
              <p className="text-gray-500 text-center py-4">No registration requests</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Activity</h3>
          <div className="space-y-3">
            {staffMembers.slice(0, 5).map(staff => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{staff.name}</p>
                  <p className="text-sm text-gray-600">{staff.role} • {staff.department}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Last login: {staff.lastLogin.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Room</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Device</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 10).map((patient) => (
                <tr key={patient.id} className="border-t border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        {patient.age}y {patient.gender} • MRN: {patient.medicalRecordNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{patient.room}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                      patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">{patient.deviceId || 'Not assigned'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-500">
                      {patient.lastUpdated.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No patients in the system</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderRegistrationRequests = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending_approval">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="nurse">Nurses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Applicant</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Role & Specialization</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">License</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Experience</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Submitted</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">
                        {request.firstName} {request.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                      <div className="text-sm text-gray-500">{request.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{request.role}</div>
                      <div className="text-sm text-gray-500">{request.specialization}</div>
                      <div className="text-sm text-gray-500">{request.department}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm">{request.licenseNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{request.yearsOfExperience}</div>
                    <div className="text-sm text-gray-500">{request.currentEmployer}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowViewModal(true)
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {request.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registration requests found</h3>
            <p className="text-gray-600">No requests match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderStaffManagement = () => (
    <div className="space-y-6">
      {/* Staff List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Staff Directory</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="doctor">Doctors</option>
                <option value="nurse">Nurses</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Staff Member</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Role & Department</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">License</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Experience</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Last Login</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                      <div className="text-sm text-gray-500">{staff.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{staff.role}</div>
                      <div className="text-sm text-gray-500">{staff.specialization}</div>
                      <div className="text-sm text-gray-500">{staff.department}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm">{staff.licenseNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{staff.yearsOfExperience}</div>
                    <div className="text-sm text-gray-500">
                      Joined: {staff.joinedDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {staff.lastLogin.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleStaffStatus(staff.id)}
                        className={`p-1 rounded ${
                          staff.status === 'active' 
                            ? 'text-yellow-600 hover:bg-yellow-100' 
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={staff.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {staff.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleRemoveStaff(staff.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-600">No staff members match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderPatientOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Patient Overview</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Room</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Device</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Vitals</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        {patient.age}y {patient.gender} • MRN: {patient.medicalRecordNumber}
                      </div>
                      <div className="text-sm text-gray-500">{patient.diagnosis}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{patient.room}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                      patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{patient.deviceId || 'Not assigned'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm space-y-1">
                      <div>HR: {patient.vitals.heartRate} bpm</div>
                      <div>SpO2: {patient.vitals.oxygenSaturation}%</div>
                      <div>Temp: {patient.vitals.temperature}°F</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {patient.lastUpdated.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in system</h3>
              <p className="text-gray-600">No patients are currently being monitored.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building },
    { id: 'requests', name: 'Registration Requests', icon: Clock },
    { id: 'staff', name: 'Staff Management', icon: Users },
    { id: 'patients', name: 'Patient Overview', icon: UserCheck },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage users, requests, and system overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
              {tab.id === 'requests' && stats.pendingRequests > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'requests' && renderRegistrationRequests()}
        {activeTab === 'staff' && renderStaffManagement()}
        {activeTab === 'patients' && renderPatientOverview()}
      </div>

      {/* Edit Staff Modal */}
      <AnimatePresence>
        {showEditModal && editingStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Edit Staff Member</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingStaff.email}
                      onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingStaff.phone}
                      onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={editingStaff.role}
                      onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as 'doctor' | 'nurse' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={editingStaff.department}
                      onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      value={editingStaff.specialization}
                      onChange={(e) => setEditingStaff({ ...editingStaff, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      value={editingStaff.licenseNumber}
                      onChange={(e) => setEditingStaff({ ...editingStaff, licenseNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="text"
                      value={editingStaff.yearsOfExperience}
                      onChange={(e) => setEditingStaff({ ...editingStaff, yearsOfExperience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStaffEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Request Modal */}
      <AnimatePresence>
        {showViewModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Registration Request Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900">{selectedRequest.firstName} {selectedRequest.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{selectedRequest.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                        <p className="text-gray-900">{selectedRequest.dateOfBirth}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Gender</label>
                        <p className="text-gray-900 capitalize">{selectedRequest.gender}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Role</label>
                        <p className="text-gray-900 capitalize">{selectedRequest.role}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">License Number</label>
                        <p className="text-gray-900 font-mono">{selectedRequest.licenseNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Specialization</label>
                        <p className="text-gray-900">{selectedRequest.specialization}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Department</label>
                        <p className="text-gray-900">{selectedRequest.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Years of Experience</label>
                        <p className="text-gray-900">{selectedRequest.yearsOfExperience}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Current Employer</label>
                        <p className="text-gray-900">{selectedRequest.currentEmployer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Status</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedRequest.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                      selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedRequest.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Submitted: {new Date(selectedRequest.submittedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedRequest.status === 'pending_approval' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApproveRequest(selectedRequest.id)
                        setShowViewModal(false)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id)
                        setShowViewModal(false)
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPanel