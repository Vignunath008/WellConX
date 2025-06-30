import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { Bell, LogOut, Wifi, WifiOff, Search, X, User, MapPin, Monitor, Heart, Thermometer, Wind, Activity, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onMobileMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
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
      <header className="bg-white border-b border-gray-100 relative z-40 safe-area-inset-top">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            {/* Title - Responsive */}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">WellConX</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden md:block truncate">Real-time patient monitoring</p>
            </div>
            
            {/* Connection Status - Compact on mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {isConnected ? (
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium ml-1 hidden sm:inline">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <WifiOff className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium ml-1 hidden sm:inline">Offline</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Desktop Search Bar */}
            <div className="relative hidden lg:block">
              <div className="flex items-center">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-9 pr-4 py-2 w-64 xl:w-80 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-r-xl transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Search Button */}
            <button 
              onClick={() => setShowSearchResults(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </button>
            
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
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium"
                  >
                    {unreadAlerts > 9 ? '9+' : unreadAlerts}
                  </motion.span>
                )}
              </button>

              {/* Alert Dropdown - Mobile Optimized */}
              <AnimatePresence>
                {showAlerts && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Alerts</h3>
                        <button
                          onClick={() => setShowAlerts(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {unreadAlerts > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {unreadAlerts} unread alert{unreadAlerts !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                      {alerts.length > 0 ? (
                        <div className="p-2">
                          {alerts.slice(0, 8).map((alert) => (
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
                                    <span className="text-xs text-gray-500 truncate">
                                      Patient {alert.patientId}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-900 mb-1 line-clamp-2">{alert.message}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                    <span>{alert.vitalType}: {alert.value}</span>
                                    <span>•</span>
                                    <span>Threshold: {alert.threshold}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">{alert.timestamp.toLocaleTimeString()}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
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
                          
                          {alerts.length > 8 && (
                            <div className="text-center p-3 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  setShowAlerts(false)
                                  navigate('/analytics')
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View All {alerts.length} Alerts
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 sm:p-8 text-center">
                          <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">No alerts</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Menu - Mobile Optimized */}
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              {/* User Info - Hidden on mobile */}
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-24 lg:max-w-32">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize truncate max-w-24 lg:max-w-32">
                  {user?.role}
                </p>
              </div>

              {/* User Avatar - Mobile friendly */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center md:hidden">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Modal - Full Screen */}
      <AnimatePresence>
        {showSearchResults && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setShowSearchResults(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 lg:hidden max-h-[85vh] overflow-hidden safe-area-inset-top"
            >
              {/* Mobile Search Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Search Results */}
              <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
                {searchResults.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {searchResults.map((patient) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 truncate">{patient.name}</h4>
                              <div className="flex flex-col space-y-1 text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{patient.room}</span>
                                </div>
                                <div className="flex items-center">
                                  <Monitor className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate text-xs">{patient.deviceId || 'No device'}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{patient.diagnosis}</p>
                            </div>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(patient.status)}`}>
                            {patient.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Quick Vitals on Mobile */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-xs">{patient.vitals.heartRate} bpm</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wind className="h-3 w-3 text-blue-500" />
                            <span className="text-xs">{patient.vitals.oxygenSaturation}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3 text-orange-500" />
                            <span className="text-xs">{patient.vitals.temperature}°F</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3 text-purple-500" />
                            <span className="text-xs">{patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No patients found</h4>
                    <p className="text-gray-600">Try searching by name, room, or MRN</p>
                  </div>
                )}
              </div>
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