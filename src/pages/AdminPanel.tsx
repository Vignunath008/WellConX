import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
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
  User
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
  const [requests, setRequests] = useState<RegistrationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    // Load registration requests from localStorage
    const storedRequests = JSON.parse(localStorage.getItem('wellconx_registration_requests') || '[]')
    setRequests(storedRequests)
  }, [])

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

  const handleApprove = (requestId: string) => {
    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as const, approvedAt: new Date().toISOString() }
        : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('wellconx_registration_requests', JSON.stringify(updatedRequests))
    
    // In a real app, this would also create the user account and send approval email
    const request = requests.find(r => r.id === requestId)
    if (request) {
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
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending_approval').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  const exportRequests = () => {
    const exportData = {
      requests: filteredRequests,
      exportDate: new Date().toISOString(),
      stats
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registration-requests-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registration Requests</h1>
          <p className="text-gray-600 mt-1">Review and approve new user registrations</p>
        </div>
        <button
          onClick={exportRequests}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
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

      {/* Detail Modal */}
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
    </div>
  )
}

export default AdminPanel