import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import DeviceMonitor from '../components/device/DeviceMonitor'
import { Monitor, Plus, Search, Wifi, WifiOff, Settings, RefreshCw, Download, X, Activity, Heart, Wind, Thermometer, CheckCircle, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const Devices: React.FC = () => {
  const { devices, patients } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all')
  const [brandFilter, setBrandFilter] = useState<'all' | 'Philips' | 'GE' | 'Mindray'>('all')
  const [, setShowAddDevice] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)

  const filteredDevices = devices.filter(device => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === '' || 
                         device.name.toLowerCase().includes(searchLower) ||
                         device.id.toLowerCase().includes(searchLower) ||
                         device.location.toLowerCase().includes(searchLower) ||
                         device.model.toLowerCase().includes(searchLower) ||
                         device.brand.toLowerCase().includes(searchLower) ||
                         device.serialNumber.toLowerCase().includes(searchLower)
    
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter
    const matchesBrand = brandFilter === 'all' || device.brand === brandFilter
    
    return matchesSearch && matchesStatus && matchesBrand
  })

  const deviceStats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length
  }

  const handleConfigure = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId)
    if (device) {
      setSelectedDevice(device)
      setShowConfigModal(true)
    }
  }

  const handleViewData = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId)
    if (device) {
      setSelectedDevice(device)
      setShowDataModal(true)
    }
  }

  const handleAddDevice = () => {
    setShowAddDevice(true)
    alert('Add Device Wizard\n\n1. Select device type\n2. Configure network settings\n3. Set up HL7 parameters\n4. Test connection\n5. Assign to patient')
  }

  const handleRefresh = () => {
    alert('Refreshing device status...\n\n✓ Checking network connectivity\n✓ Updating device heartbeats\n✓ Verifying HL7 connections\n✓ Syncing patient assignments')
  }

  const handleExport = () => {
    const exportData = {
      devices: filteredDevices,
      stats: deviceStats,
      timestamp: new Date().toISOString(),
      filters: { searchTerm, statusFilter, brandFilter }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devices-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    alert('Device data exported successfully!')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setBrandFilter('all')
  }

  // Get patient assigned to device
  const getAssignedPatient = (deviceId: string) => {
    return patients.find(p => p.deviceId === deviceId)
  }

  // Generate mock real-time data for device
  const generateMockData = (device: any) => {
    const assignedPatient = getAssignedPatient(device.id)
    
    if (!assignedPatient) {
      return {
        status: 'No patient assigned',
        vitals: null,
        messages: []
      }
    }

    // Generate realistic HL7 messages
    const messages = [
      {
        timestamp: new Date(),
        type: 'ORU^R01',
        content: `MSH|^~\\&|${device.id}|HOSPITAL|WELLCONX|WELLCONX|${new Date().toISOString().replace(/[-:]/g, '').slice(0, 14)}||ORU^R01|MSG001|P|2.5\rPID|1||${assignedPatient.id}^^^HOSPITAL^MR||${assignedPatient.name.replace(' ', '^')}^||${assignedPatient.age}|${assignedPatient.gender.toUpperCase()}\rOBR|1||ORDER001|VITALS^VITAL SIGNS^LOCAL|||${new Date().toISOString().replace(/[-:]/g, '').slice(0, 14)}\rOBX|1|NM|HR^HEART RATE^LOCAL|1|${assignedPatient.vitals.heartRate}|BPM|60-100|N|||F\rOBX|2|NM|NBP^BLOOD PRESSURE^LOCAL|1|${assignedPatient.vitals.bloodPressure.systolic}/${assignedPatient.vitals.bloodPressure.diastolic}|MMHG|<140/90|N|||F\rOBX|3|NM|SPO2^OXYGEN SATURATION^LOCAL|1|${assignedPatient.vitals.oxygenSaturation}|%|>95|N|||F\rOBX|4|NM|TEMP^TEMPERATURE^LOCAL|1|${assignedPatient.vitals.temperature}|F|97-99|N|||F\rOBX|5|NM|RR^RESPIRATORY RATE^LOCAL|1|${assignedPatient.vitals.respiratoryRate}|/MIN|12-20|N|||F`
      },
      {
        timestamp: new Date(Date.now() - 30000),
        type: 'ADT^A08',
        content: `MSH|^~\\&|${device.id}|HOSPITAL|WELLCONX|WELLCONX|${new Date(Date.now() - 30000).toISOString().replace(/[-:]/g, '').slice(0, 14)}||ADT^A08|MSG002|P|2.5\rEVN||${new Date(Date.now() - 30000).toISOString().replace(/[-:]/g, '').slice(0, 14)}\rPID|1||${assignedPatient.id}^^^HOSPITAL^MR||${assignedPatient.name.replace(' ', '^')}^||${assignedPatient.age}|${assignedPatient.gender.toUpperCase()}\rPV1|1|I|${assignedPatient.room}^${assignedPatient.room}^1|||||||||||||||${assignedPatient.id}`
      }
    ]

    return {
      status: 'Active monitoring',
      vitals: assignedPatient.vitals,
      messages,
      patient: assignedPatient
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Device Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage medical devices</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-3">
          <button 
            onClick={handleRefresh}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 text-sm flex-1 sm:flex-none"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button 
            onClick={handleExport}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 text-sm flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={handleAddDevice}
            className="bg-medical-600 hover:bg-medical-700 text-white px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 text-sm flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4" />
            <span>Add Device</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          className="bg-white rounded-lg p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{deviceStats.total}</p>
            </div>
            <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-lg p-4 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-green-600">Online</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{deviceStats.online}</p>
            </div>
            <Wifi className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-red-50 rounded-lg p-4 border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-red-600">Offline</p>
              <p className="text-xl sm:text-2xl font-bold text-red-700">{deviceStats.offline}</p>
            </div>
            <WifiOff className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-yellow-50 rounded-lg p-4 border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-yellow-600">Maintenance</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-700">{deviceStats.maintenance}</p>
            </div>
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
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
              placeholder="Search devices..."
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
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
            
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value as any)}
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="all">All Brands</option>
              <option value="Philips">Philips</option>
              <option value="GE">GE</option>
              <option value="Mindray">Mindray</option>
            </select>
          </div>
        </div>
        
        {/* Filter Results Summary */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-medium">{filteredDevices.length}</span> of <span className="font-medium">{devices.length}</span> devices
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
          {brandFilter !== 'all' && ` from "${brandFilter}"`}
        </div>
        
        {(searchTerm || statusFilter !== 'all' || brandFilter !== 'all') && (
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Device Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <DeviceMonitor
              device={device}
              onConfigure={handleConfigure}
              onViewData={handleViewData}
            />
          </motion.div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-8">
          <Monitor className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No devices found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {searchTerm ? `No devices match "${searchTerm}"` : 'Try adjusting your filter criteria'}
          </p>
          <button
            onClick={clearFilters}
            className="text-medical-600 hover:text-medical-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* HL7 Connection Status */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">HL7 Connection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">TCP Listener</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Port 2575 - Active</p>
            <p className="text-xs text-green-500 mt-1">Last message: 2s ago</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">Message Parser</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">ORU^R01 - Ready</p>
            <p className="text-xs text-blue-500 mt-1">Processed: 1,247 messages</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-700">Data Stream</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">Real-time - Active</p>
            <p className="text-xs text-purple-500 mt-1">Throughput: 15 msg/min</p>
          </div>
        </div>
      </div>

      {/* Device Configuration Modal */}
      {showConfigModal && selectedDevice && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowConfigModal(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Device Configuration</h2>
                      <p className="text-blue-100">{selectedDevice.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Device Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
                        <input
                          type="text"
                          value={selectedDevice.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <input
                          type="text"
                          value={selectedDevice.model}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                        <input
                          type="text"
                          value={selectedDevice.serialNumber}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={selectedDevice.location}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Network Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Configuration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3">Current Settings</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">IP Address:</span>
                            <span className="font-mono text-blue-900">{selectedDevice.ipAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Status:</span>
                            <span className={`font-medium ${
                              selectedDevice.status === 'online' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {selectedDevice.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Last Heartbeat:</span>
                            <span className="text-blue-900">{selectedDevice.lastHeartbeat.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-3">HL7 Settings</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700">Protocol:</span>
                            <span className="text-green-900">HL7 v2.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Port:</span>
                            <span className="text-green-900">2575</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Message Type:</span>
                            <span className="text-green-900">ORU^R01</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Assignment */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Assignment</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedDevice.patientId ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Currently Assigned</p>
                            <p className="text-sm text-gray-600">Patient ID: {selectedDevice.patientId}</p>
                          </div>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">
                            Unassign
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 mb-3">No patient currently assigned</p>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Assign Patient
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Firmware Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Firmware & Diagnostics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-3">Firmware</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-700">Version:</span>
                            <span className="text-purple-900">{selectedDevice.firmwareVersion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Status:</span>
                            <span className="text-green-600">Up to date</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-900 mb-3">Diagnostics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-orange-700">Connection Test:</span>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-orange-700">Data Stream:</span>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-orange-700">HL7 Parser:</span>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Configuration saved successfully!')
                    setShowConfigModal(false)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Data Modal */}
      {showDataModal && selectedDevice && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowDataModal(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Real-Time Device Data</h2>
                      <p className="text-green-100">{selectedDevice.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDataModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                {(() => {
                  const mockData = generateMockData(selectedDevice)
                  
                  return (
                    <div className="space-y-6">
                      {/* Device Status */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Status</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-green-900">Online</h4>
                            <p className="text-sm text-green-700">Device Connected</p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-blue-900">Data Stream</h4>
                            <p className="text-sm text-blue-700">{mockData.status}</p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                            <Monitor className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-purple-900">HL7 Messages</h4>
                            <p className="text-sm text-purple-700">{mockData.messages.length} received</p>
                          </div>
                        </div>
                      </div>

                      {/* Current Patient & Vitals */}
                      {mockData.patient && mockData.vitals && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Patient Data</h3>
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{mockData.patient.name}</h4>
                                <p className="text-sm text-gray-600">{mockData.patient.room} • {mockData.patient.age}y {mockData.patient.gender}</p>
                              </div>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                          </div>
                          
                          {/* Live Vitals */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Heart className="h-4 w-4 text-red-600" />
                                <span className="text-xs font-medium text-red-700">Heart Rate</span>
                              </div>
                              <div className="text-xl font-bold text-red-700">{Math.round(mockData.vitals.heartRate)}</div>
                              <div className="text-xs text-red-600">bpm</div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Wind className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">SpO2</span>
                              </div>
                              <div className="text-xl font-bold text-blue-700">{Math.round(mockData.vitals.oxygenSaturation)}</div>
                              <div className="text-xs text-blue-600">%</div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Thermometer className="h-4 w-4 text-orange-600" />
                                <span className="text-xs font-medium text-orange-700">Temperature</span>
                              </div>
                              <div className="text-xl font-bold text-orange-700">{mockData.vitals.temperature.toFixed(1)}</div>
                              <div className="text-xs text-orange-600">°F</div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Activity className="h-4 w-4 text-purple-600" />
                                <span className="text-xs font-medium text-purple-700">Blood Pressure</span>
                              </div>
                              <div className="text-lg font-bold text-purple-700">
                                {Math.round(mockData.vitals.bloodPressure.systolic)}/{Math.round(mockData.vitals.bloodPressure.diastolic)}
                              </div>
                              <div className="text-xs text-purple-600">mmHg</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* HL7 Messages */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent HL7 Messages</h3>
                        <div className="space-y-3">
                          {mockData.messages.map((message: any, index: number) => (
                            <div key={index} className="bg-gray-900 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-400 font-mono text-sm">{message.type}</span>
                                <span className="text-gray-400 text-xs">{message.timestamp.toLocaleTimeString()}</span>
                              </div>
                              <pre className="text-green-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                                {message.content}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Data Statistics */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Statistics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">Messages Today</h4>
                            <div className="text-2xl font-bold text-blue-700">1,247</div>
                            <div className="text-sm text-blue-600">+15% from yesterday</div>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-2">Data Quality</h4>
                            <div className="text-2xl font-bold text-green-700">98.5%</div>
                            <div className="text-sm text-green-600">Excellent signal</div>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2">Uptime</h4>
                            <div className="text-2xl font-bold text-purple-700">99.9%</div>
                            <div className="text-sm text-purple-600">Last 30 days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDataModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const exportData = {
                      device: selectedDevice,
                      data: generateMockData(selectedDevice),
                      timestamp: new Date().toISOString()
                    }
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${selectedDevice.id}_data_${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                    alert('Device data exported successfully!')
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HL7 Connection Status */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">HL7 Connection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">TCP Listener</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Port 2575 - Active</p>
            <p className="text-xs text-green-500 mt-1">Last message: 2s ago</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">Message Parser</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">ORU^R01 - Ready</p>
            <p className="text-xs text-blue-500 mt-1">Processed: 1,247 messages</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-700">Data Stream</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">Real-time - Active</p>
            <p className="text-xs text-purple-500 mt-1">Throughput: 15 msg/min</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Devices