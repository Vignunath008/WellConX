import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { Navigate } from 'react-router-dom'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  Building,
  FileText,
  AlertCircle,
  User,
  UserCheck,
  Activity,
  Heart,
  Monitor,
  Calendar,
  MapPin,
  Stethoscope,
  Shield,
  Database
} from 'lucide-react'

interface RegistrationRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
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

const AdminPanel: React.FC = () => {
  const { user } = useAuth()
  const { patients, devices } = useData()
  const [activeTab, setActiveTab] = useState<'requests' | 'staff' | 'patients' | 'overview'>('overview')
  const [requests, setRequests] = useState<RegistrationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    // Load registration requests from localStorage
    const storedRequests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
    setRequests(storedRequests)
  }, [])

  // Get approved staff members
  const approvedStaff = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
  const allStaff = [
    // Demo users
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'doctor@wellconx.com',
      role: 'doctor',
      department: 'Cardiology',
      specialization: 'Cardiology',
      licenseNumber: 'MD-12345',
      yearsOfExperience: '10+ years',
      phone: '+1 (555) 123-4567',
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      joinedDate: '2020-01-15'
    },
    {
      id: '2',
      name: 'Nurse Mary Wilson',
      email: 'nurse@wellconx.com',
      role: 'nurse',
      department: 'ICU',
      specialization: 'Critical Care',
      licenseNumber: 'RN-67890',
      yearsOfExperience: '8 years',
      phone: '+1 (555) 234-5678',
      status: 'active',
      lastLogin: new Date(Date.now() - 1800000).toISOString(),
      joinedDate: '2021-03-20'
    },
    ...approvedStaff
  ]

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const filteredStaff = allStaff.filter(staff => {
    const matchesSearch = searchTerm === '' ||
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleApprove = (requestId: string) => {
    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as const, approvedAt: new Date().toISOString() }
        : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('wellconx_registration_requests', JSON.stringify(updatedRequests))
    
    // Add to approved users
    const request = requests.find(r => r.id === requestId)
    if (request) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: `${request.firstName} ${request.lastName}`,
        email: request.email,
        role: request.role,
        department: request.department,
        specialization: request.specialization,
        licenseNumber: request.licenseNumber,
        yearsOfExperience: request.yearsOfExperience,
        phone: request.phone,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        lastLogin: null
      }
      
      const existingApproved = JSON.parse(localStorage.getItem('wellconx_approved_users') || '[]')
      existingApproved.push(newUser)
      localStorage.setItem('wellconx_approved_users', JSON.stringify(existingApproved))
      
      alert(`✅ Registration Approved!\n\nUser: ${request.firstName} ${request.lastName}\nEmail: ${request.email}\nRole: ${request.role}\n\n• Account has been created\n• Welcome email sent\n• User can now log in`)
    }
    
    setShowModal(false)
  }

  const handleReject = (requestId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const, rejectedAt: new Date().toISOString(), rejectionReason: reason }
        : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('wellconx_registration_requests', JSON.stringify(updatedRequests))
    
    const request = requests.find(r => r.id === requestId)
    if (request) {
      alert(`❌ Registration Rejected\n\nUser: ${request.firstName} ${request.lastName}\nReason: ${reason}\n\n• Rejection email sent\n• User notified of decision`)
    }
    
    setShowModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': 
      case 'active': return 'text-green-600 bg-green-100'
      case 'rejected': 
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'stable': return 'text-green-600 bg-green-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
      case 'stable': return <CheckCircle className="h-4 w-4" />
      case 'rejected':
      case 'inactive':
      case 'critical': return <XCircle className="h-4 w-4" />
      case 'warning': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const stats = {
    requests: {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending_approval').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    },
    staff: {
      total: allStaff.length,
      doctors: allStaff.filter(s => s.role === 'doctor').length,
      nurses: allStaff.filter(s => s.role === 'nurse').length,
      active: allStaff.filter(s => s.status === 'active').length
    },
    patients: {
      total: patients.length,
      stable: patients.filter(p => p.status === 'stable').length,
      warning: patients.filter(p => p.status === 'warning').length,
      critical: patients.filter(p => p.status === 'critical').length
    },
    devices: {
      total: devices.length,
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      maintenance: devices.filter(d => d.status === 'maintenance').length
    }
  }

  const exportData = () => {
    const exportData = {
      requests: filteredRequests,
      staff: filteredStaff,
      patients: filteredPatients,
      devices: devices,
      stats,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wellconx-admin-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Database },
    { id: 'requests', name: 'Registration Requests', icon: UserCheck },
    { id: 'staff', name: 'Staff Management', icon: Users },
    { id: 'patients', name: 'Patient Overview', icon: Heart }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Staff</p>
              <p className="text-2xl font-bold text-blue-700">{stats.staff.total}</p>
              <p className="text-xs text-blue-500">{stats.staff.doctors} Doctors, {stats.staff.nurses} Nurses</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active Patients</p>
              <p className="text-2xl font-bold text-green-700">{stats.patients.total}</p>
              <p className="text-xs text-green-500">{stats.patients.stable} Stable, {stats.patients.critical} Critical</p>
            </div>
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Devices Online</p>
              <p className="text-2xl font-bold text-purple-700">{stats.devices.online}/{stats.devices.total}</p>
              <p className="text-xs text-purple-500">{Math.round((stats.devices.online / stats.devices.total) * 100)}% Uptime</p>
            </div>
            <Monitor className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.requests.pending}</p>
              <p className="text-xs text-yellow-500">Awaiting approval</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Staff Activity</h3>
          <div className="space-y-3">
            {allStaff.slice(0, 5).map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <p className="text-sm text-gray-500">{staff.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {staff.lastLogin ? `Active ${new Date(staff.lastLogin).toLocaleTimeString()}` : 'Never logged in'}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Status Summary</h3>
          <div className="space-y-3">
            {patients.slice(0, 5).map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.room} • {patient.diagnosis}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">HR: {patient.vitals.heartRate} bpm</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStaffManagement = () => (
    <div className="space-y-6">
      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{stats.staff.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Doctors</p>
              <p className="text-2xl font-bold text-blue-700">{stats.staff.doctors}</p>
            </div>
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Nurses</p>
              <p className="text-2xl font-bold text-green-700">{stats.staff.nurses}</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600">Active</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.staff.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

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
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Staff Member</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Role & Department</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">License</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Experience</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${staff.role === 'doctor' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {staff.role === 'doctor' ? 
                          <Stethoscope className="h-4 w-4 text-blue-600" /> : 
                          <Shield className="h-4 w-4 text-green-600" />
                        }
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{staff.role}</div>
                      <div className="text-sm text-gray-500">{staff.department}</div>
                      <div className="text-sm text-gray-500">{staff.specialization}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm">{staff.licenseNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{staff.yearsOfExperience}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{staff.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                      {getStatusIcon(staff.status)}
                      <span className="ml-1">{staff.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => {
                        setSelectedStaff(staff)
                        setShowModal(true)
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
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

  const renderPatientOverview = () => (
    <div className="space-y-6">
      {/* Patient Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.patients.total}</p>
            </div>
            <Heart className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Stable</p>
              <p className="text-2xl font-bold text-green-700">{stats.patients.stable}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.patients.warning}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Critical</p>
              <p className="text-2xl font-bold text-red-700">{stats.patients.critical}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Patient Directory</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Room & Device</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Vital Signs</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Diagnosis</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Admission</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.age}y {patient.gender} • MRN: {patient.medicalRecordNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{patient.room}</div>
                      <div className="text-sm text-gray-500">{patient.deviceId || 'No device'}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div>HR: {patient.vitals.heartRate} bpm</div>
                      <div>SpO2: {patient.vitals.oxygenSaturation}%</div>
                      <div>Temp: {patient.vitals.temperature}°F</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700">{patient.diagnosis}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {patient.admissionDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {getStatusIcon(patient.status)}
                      <span className="ml-1">{patient.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient)
                        setShowModal(true)
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
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

  const renderRegistrationRequests = () => (
    <div className="space-y-6">
      {/* Request Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.requests.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.requests.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.requests.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{stats.requests.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending_approval">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-medium">{filteredRequests.length}</span> of <span className="font-medium">{requests.length}</span> requests
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.firstName} {request.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{request.role}</div>
                      <div className="text-sm text-gray-500">{request.specialization}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm">{request.licenseNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{request.yearsOfExperience}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
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
                          setShowModal(true)
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {request.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
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
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registration requests</h3>
            <p className="text-gray-600">
              {searchTerm ? `No requests match "${searchTerm}"` : 'No registration requests found'}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Comprehensive system management and oversight</p>
        </div>
        <button
          onClick={exportData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export All Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setSearchTerm('')
                  setSelectedRequest(null)
                  setSelectedPatient(null)
                  setSelectedStaff(null)
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'requests' && renderRegistrationRequests()}
          {activeTab === 'staff' && renderStaffManagement()}
          {activeTab === 'patients' && renderPatientOverview()}
        </div>
      </div>

      {/* Detail Modals */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Registration Request Details</h2>
                  <p className="text-blue-100">
                    {selectedRequest.firstName} {selectedRequest.lastName} - {selectedRequest.role}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedRequest.firstName} {selectedRequest.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedRequest.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedRequest.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-green-600" />
                    Professional Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium capitalize">{selectedRequest.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License:</span>
                      <span className="font-medium font-mono">{selectedRequest.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium">{selectedRequest.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{selectedRequest.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{selectedRequest.yearsOfExperience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employer:</span>
                      <span className="font-medium">{selectedRequest.currentEmployer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Medical License</span>
                    </div>
                    {selectedRequest.licenseDocument ? (
                      <p className="text-sm text-green-600">✓ Document uploaded</p>
                    ) : (
                      <p className="text-sm text-red-600">✗ No document</p>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Certifications</span>
                    </div>
                    {selectedRequest.certificationDocument ? (
                      <p className="text-sm text-green-600">✓ Document uploaded</p>
                    ) : (
                      <p className="text-sm text-gray-500">Optional - Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-2 capitalize">{selectedRequest.status.replace('_', ' ')}</span>
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {new Date(selectedRequest.submittedAt).toLocaleString()}
                  </p>
                </div>

                {selectedRequest.status === 'pending_approval' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Detail Modal */}
      {showModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Staff Member Details</h2>
                  <p className="text-green-100">{selectedStaff.name} - {selectedStaff.role}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedStaff.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedStaff.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{selectedStaff.department}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">License:</span>
                      <span className="font-medium font-mono">{selectedStaff.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium">{selectedStaff.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{selectedStaff.yearsOfExperience}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStaff.status)}`}>
                      {getStatusIcon(selectedStaff.status)}
                      <span className="ml-1">{selectedStaff.status}</span>
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium">{new Date(selectedStaff.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium">
                      {selectedStaff.lastLogin ? new Date(selectedStaff.lastLogin).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Patient Details</h2>
                  <p className="text-purple-100">{selectedPatient.name} - {selectedPatient.room}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedPatient.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">{selectedPatient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MRN:</span>
                      <span className="font-medium font-mono">{selectedPatient.medicalRecordNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{selectedPatient.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Device:</span>
                      <span className="font-medium">{selectedPatient.deviceId || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Vital Signs</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heart Rate:</span>
                      <span className="font-medium">{selectedPatient.vitals.heartRate} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Pressure:</span>
                      <span className="font-medium">{selectedPatient.vitals.bloodPressure.systolic}/{selectedPatient.vitals.bloodPressure.diastolic} mmHg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SpO2:</span>
                      <span className="font-medium">{selectedPatient.vitals.oxygenSaturation}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">{selectedPatient.vitals.temperature}°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Respiratory Rate:</span>
                      <span className="font-medium">{selectedPatient.vitals.respiratoryRate}/min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Primary Diagnosis</p>
                  <p className="font-medium">{selectedPatient.diagnosis}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Current Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                      {getStatusIcon(selectedPatient.status)}
                      <span className="ml-1">{selectedPatient.status}</span>
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Admission Date</p>
                    <p className="font-medium">{selectedPatient.admissionDate.toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{selectedPatient.lastUpdated.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel