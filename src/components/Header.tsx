import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { Bell, LogOut, Wifi, WifiOff, Search, X, User, MapPin, Monitor, Heart, Thermometer, Wind, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AlertPanel from './alerts/AlertPanel'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isConnected, alerts, patients, acknowledgeAlert, dismissAlert } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length

  // Search functionality
  const searchPatients = (query: string) => {
    if (!query.trim()) return []
    
    const searchLower = query.toLowerCase()
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower) ||
      patient.room.toLowerCase().includes(searchLower) ||
      patient.medicalRecordNumber.toLowerCase().includes(searchLower) ||
      patient.diagnosis.toLowerCase().includes(searchLower) ||
      patient.deviceId?.toLowerCase().includes(searchLower)
    )
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowSearchResults(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setShowSearchResults(false)
  }

  const searchResults = searchPatients(searchTerm)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const selectPatient = (patient: any) => {
    alert(`Selected Patient: ${patient.name}\n\nDetails:\n- Room: ${patient.room}\n- Status: ${patient.status}\n- Device: ${patient.deviceId}\n- Heart Rate: ${patient.vitals.heartRate} bpm\n- SpO2: ${patient.vitals.oxygenSaturation}%\n- Temperature: ${patient.vitals.temperature}°F\n\nRedirecting to patient details...`)
    setShowSearchResults(false)
    setSearchTerm('')
    // Navigate to patients page with this patient highlighted
    navigate('/patients')
  }

  const handleAlertClick = () => {
    setShowAlerts(!showAlerts)
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlert(alertId)
  }

  const handleDismissAlert = (alertId: string) => {
    dismissAlert(alertId)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100 relative z-40">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500">Real-time patient monitoring</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  <WifiOff className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Disconnected</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Search Bar */}
            <div className="relative">
              <div className="flex items-center">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients by name, room, MRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-r-xl transition-colors flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
            
            {/* Alert Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={handleAlertClick}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {unreadAlerts > 99 ? '99+' : unreadAlerts}
                  </motion.span>
                )}
              </button>

              {/* Alert Dropdown */}
              <AnimatePresence>
                {showAlerts && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
                        <button
                          onClick={() => setShowAlerts(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {unreadAlerts > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {unreadAlerts} unread alert{unreadAlerts !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? (
                        <div className="p-2">
                          {alerts.slice(0, 10).map((alert) => (
                            <div
                              key={alert.id}
                              className={`p-3 rounded-lg mb-2 border ${
                                alert.acknowledged 
                                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                                  : alert.type === 'critical' 
                                    ? 'bg-red-50 border-red-200' 
                                    : alert.type === 'warning'
                                      ? 'bg-yellow-50 border-yellow-200'
                                      : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {alert.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Patient {alert.patientId}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span>{alert.vitalType}: {alert.value}</span>
                                    <span>Threshold: {alert.threshold}</span>
                                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-1 ml-2">
                                  {!alert.acknowledged && (
                                    <button
                                      onClick={() => handleAcknowledgeAlert(alert.id)}
                                      className="p-1 text-green-600 hover:bg-green-100 rounded text-xs"
                                      title="Acknowledge"
                                    >
                                      ✓
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDismissAlert(alert.id)}
                                    className="p-1 text-gray-400 hover:bg-gray-100 rounded text-xs"
                                    title="Dismiss"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {alerts.length > 10 && (
                            <div className="text-center p-3 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  setShowAlerts(false)
                                  navigate('/analytics') // Navigate to analytics page for full alert management
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View All {alerts.length} Alerts
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">No alerts</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role} • {user?.department}</p>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Overlay */}
      <AnimatePresence>
        {showSearchResults && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowSearchResults(false)}
            />
            
            {/* Search Results Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 max-w-6xl mx-auto"
              style={{ 
                maxHeight: 'calc(100vh - 2rem)',
                top: '2rem'
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                    <p className="text-sm text-gray-600">
                      {searchResults.length > 0 
                        ? `Found ${searchResults.length} patient${searchResults.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                        : `No patients found matching "${searchTerm}"`
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                {searchResults.length > 0 ? (
                  <div className="p-6 space-y-4">
                    {searchResults.map((patient) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 truncate">{patient.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{patient.room}</span>
                                </div>
                                <div className="flex items-center">
                                  <Monitor className="h-4 w-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{patient.deviceId || 'No device'}</span>
                                </div>
                                <span className="truncate">MRN: {patient.medicalRecordNumber}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1 truncate">{patient.diagnosis}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 flex-shrink-0">
                            {/* Quick Vitals */}
                            <div className="hidden lg:flex items-center space-x-3 text-sm">
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>{patient.vitals.heartRate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Wind className="h-4 w-4 text-blue-500" />
                                <span>{patient.vitals.oxygenSaturation}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Thermometer className="h-4 w-4 text-orange-500" />
                                <span>{patient.vitals.temperature}°F</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Activity className="h-4 w-4 text-purple-500" />
                                <span>{patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}</span>
                              </div>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                              {patient.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No patients found</h4>
                    <p className="text-gray-600 mb-4">
                      No patients match your search criteria "{searchTerm}"
                    </p>
                    <div className="text-sm text-gray-500 max-w-md mx-auto">
                      <p>Try searching by:</p>
                      <ul className="mt-2 space-y-1 text-left">
                        <li>• Patient name (e.g., "John Smith")</li>
                        <li>• Room number (e.g., "ICU-101")</li>
                        <li>• Medical record number (e.g., "MRN-001234")</li>
                        <li>• Device ID (e.g., "PHI-MP70-001")</li>
                        <li>• Diagnosis keywords</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {searchResults.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0 rounded-b-2xl">
                  <p className="text-xs text-gray-500 text-center">
                    Click on a patient to view detailed information and real-time monitoring data
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside to close alerts */}
      {showAlerts && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAlerts(false)}
        />
      )}
    </>
  )
}

export default Header