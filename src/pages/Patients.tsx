import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { VitalSignsDisplay } from '../components/VitalCard'
import AddPatientModal from '../components/modals/AddPatientModal'
import { User, MapPin, Monitor, Plus, Search, Filter, Download, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const Patients: React.FC = () => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all patients in the facility</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportPatientData}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <User className="h-8 w-8 text-gray-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-xl p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Stable</p>
              <p className="text-2xl font-bold text-green-700">{stats.stable}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.warning}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-red-50 rounded-xl p-6 border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Critical</p>
              <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚠</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, room, MRN, diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <option value="stable">Stable</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="room">Sort by Room</option>
              <option value="status">Sort by Status</option>
              <option value="lastUpdated">Sort by Last Updated</option>
            </select>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-medium">{filteredPatients.length}</span> of <span className="font-medium">{patients.length}</span> patients
        </div>
      </div>

      {/* Patient List */}
      <div className="grid gap-6">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-medical-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-medical-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{patient.age} years old • {patient.gender}</span>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {patient.room}
                    </div>
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-1" />
                      {patient.deviceId || 'No device assigned'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Admitted: {patient.admissionDate.toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">MRN:</span> {patient.medicalRecordNumber} • 
                    <span className="font-medium"> Diagnosis:</span> {patient.diagnosis}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                  patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {patient.status.toUpperCase()}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="status-indicator status-online"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>
            </div>

            <VitalSignsDisplay vitals={patient.vitals} />

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {patient.lastUpdated.toLocaleString()}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => alert(`Viewing history for ${patient.name}\n\nShowing:\n- Vital signs trends\n- Alert history\n- Medical notes\n- Device data logs`)}
                  className="btn-secondary text-sm"
                >
                  View History
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
                  className="btn-secondary text-sm"
                >
                  Export Data
                </button>
                <button 
                  onClick={() => alert(`Opening detailed view for ${patient.name}\n\nFeatures:\n- Real-time waveforms\n- Detailed vital signs\n- Alert management\n- Medical history\n- Device controls`)}
                  className="btn-primary text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? `No patients match "${searchTerm}"` : 'No patients match the selected filters'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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