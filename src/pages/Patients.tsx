import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import AddPatientModal from '../components/modals/AddPatientModal'
import { User, Plus, Search, Download, Eye, Clock, Heart, Wind, Thermometer, Activity, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Patients: React.FC = () => {
  const navigate = useNavigate()
  const { patients, devices, addPatient } = useData()
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'stable' | 'warning' | 'critical'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'room' | 'status' | 'lastUpdated'>('name')

  // Get available devices (not assigned to patients)
  const availableDevices = devices.filter(device => !device.patientId || device.status === 'offline').map(device => ({
    id: device.id,
    name: device.name,
    location: device.location
  }))

  // Filter and sort patients
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = searchTerm === '' || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'room':
          return a.room.localeCompare(b.room)
        case 'status':
          const statusOrder = { critical: 3, warning: 2, stable: 1 }
          return statusOrder[b.status] - statusOrder[a.status]
        case 'lastUpdated':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime()
        default:
          return 0
      }
    })

  const handleAddPatient = (patientData: any) => {
    const newPatient = addPatient(patientData)
    
    // Show success message
    alert(`Patient Added Successfully!\n\nName: ${newPatient.name}\nRoom: ${newPatient.room}\nMRN: ${newPatient.medicalRecordNumber}\nStatus: ${newPatient.status.toUpperCase()}\n\nThe patient has been added to the monitoring system and will appear in the dashboard.`)
  }

  const handleViewHistory = (patientId: string) => {
    navigate(`/patients/${patientId}/history`)
  }

  const handleViewDetails = (patientId: string) => {
    navigate(`/patients/${patientId}`)
  }

  const exportPatientData = () => {
    const exportData = {
      patients: filteredPatients,
      exportDate: new Date().toISOString(),
      totalPatients: filteredPatients.length,
      filters: { searchTerm, statusFilter, sortBy }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patients-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusStats = () => {
    return {
      total: patients.length,
      stable: patients.filter(p => p.status === 'stable').length,
      warning: patients.filter(p => p.status === 'warning').length,
      critical: patients.filter(p => p.status === 'critical').length
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-4 px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage all patients</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={exportPatientData}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          className="bg-white rounded-lg p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-lg p-4 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-green-600">Stable</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.stable}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">✓</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-yellow-50 rounded-lg p-4 border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-yellow-600">Warning</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.warning}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">!</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-red-50 rounded-lg p-4 border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-red-600">Critical</p>
              <p className="text-xl sm:text-2xl font-bold text-red-700">{stats.critical}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">⚠</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters - Mobile Optimized */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="room">Sort by Room</option>
              <option value="status">Sort by Status</option>
              <option value="lastUpdated">Sort by Updated</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-medium">{filteredPatients.length}</span> of <span className="font-medium">{patients.length}</span> patients
        </div>
      </div>

      {/* Patient List - Mobile Optimized Cards */}
      <div className="space-y-3">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 w-full overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Patient Header - Mobile Optimized */}
            <div className="space-y-3 mb-4">
              {/* Top Row - Name and Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{patient.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-2">
                        <span>{patient.age} years old</span>
                        <span>•</span>
                        <span className="capitalize">{patient.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                  patient.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {patient.status.toUpperCase()}
                </div>
              </div>

              {/* Patient Info Grid - Mobile Optimized */}
              <div className="grid grid-cols-1 gap-2 text-sm bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Room:</span>
                  <span className="text-gray-900">{patient.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">MRN:</span>
                  <span className="text-gray-900 text-xs">{patient.medicalRecordNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Device:</span>
                  <span className="text-gray-900 text-xs truncate max-w-32">{patient.deviceId || 'Not assigned'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Admitted:</span>
                  <span className="text-gray-900 text-xs">{patient.admissionDate.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm">
                  <span className="font-medium text-blue-800">Diagnosis: </span>
                  <span className="text-blue-700">{patient.diagnosis}</span>
                </div>
              </div>

              {/* Live Status Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-ring" />
                  <span className="text-xs font-medium text-gray-500">Live Monitoring Active</span>
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {patient.lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Vital Signs - Mobile Optimized Grid */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Current Vital Signs</h4>
              
              {/* Mobile-First Vital Signs Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Heart Rate */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-4 w-4 text-red-600 heartbeat" />
                    <span className="text-xs font-medium text-red-700">Heart Rate</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold text-red-700">{Math.round(patient.vitals.heartRate)}</span>
                    <span className="text-xs text-red-600">bpm</span>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Blood Pressure</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-purple-700">
                      {Math.round(patient.vitals.bloodPressure.systolic)}/{Math.round(patient.vitals.bloodPressure.diastolic)}
                    </span>
                    <span className="text-xs text-purple-600">mmHg</span>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">SpO2</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold text-blue-700">{Math.round(patient.vitals.oxygenSaturation)}</span>
                    <span className="text-xs text-blue-600">%</span>
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">Temperature</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold text-orange-700">{patient.vitals.temperature.toFixed(1)}</span>
                    <span className="text-xs text-orange-600">°F</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 border-t border-gray-200">
              <button 
                onClick={() => handleViewHistory(patient.id)}
                className="btn-secondary text-sm flex items-center justify-center space-x-2 py-2.5 flex-1"
              >
                <Clock className="h-4 w-4" />
                <span>View History</span>
              </button>
              <button 
                onClick={() => {
                  const exportData = {
                    patient,
                    vitals: patient.vitals,
                    exportDate: new Date().toISOString()
                  }
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${patient.name.replace(/\s+/g, '_')}_data.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="btn-secondary text-sm flex items-center justify-center space-x-2 py-2.5 flex-1"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => handleViewDetails(patient.id)}
                className="btn-primary text-sm flex items-center justify-center space-x-2 py-2.5 flex-1"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8">
          <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {searchTerm ? `No patients match "${searchTerm}"` : 'No patients match the selected filters'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            Add First Patient
          </button>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPatient={handleAddPatient}
        availableDevices={availableDevices}
      />
    </div>
  )
}

export default Patients