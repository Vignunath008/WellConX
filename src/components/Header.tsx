import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { Bell, Wifi, WifiOff, Search, X, User, MapPin, Monitor, Heart, Thermometer, Wind, Activity, Menu } from 'lucide-react'
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
  const [showUserMenu, setShowUserMenu] = useState(false)
  
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
      case 'critical': return 'text-red-700 bg-red-50 border-red-200'
      case 'warning': return 'text-alert-700 bg-alert-50 border-alert-200'
      default: return 'text-health-700 bg-health-50 border-health-200'
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

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <>
      <header className="medical-header safe-area-inset-top">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuClick}
              className="lg:hidden p-2 rounded-medical hover:bg-background-hover transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5 text-text-secondary" />
            </button>

            {/* Title - Responsive */}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary truncate">
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">WellConX</span>
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary hidden md:block truncate">Real-time patient monitoring</p>
            </div>
            
            {/* Connection Status - Compact on mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {isConnected ? (
                <div className="flex items-center text-health-600 bg-health-50 px-2 py-1 rounded-full border border-health-200">
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium ml-1 hidden sm:inline">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
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
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-9 pr-4 py-2 w-64 xl:w-80 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-background-card"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light hover:text-text-secondary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-border-medium disabled:cursor-not-allowed text-white px-3 py-2 rounded-r-medical transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Search Button */}
            <button 
              onClick={() => setShowSearchResults(true)}
              className="lg:hidden p-2 text-text-light hover:text-text-secondary transition-colors rounded-medical hover:bg-background-hover"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Alert Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={handleAlertClick}
                className="relative p-2 text-text-light hover:text-text-secondary transition-colors rounded-medical hover:bg-background-hover"
              >
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-alert-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium"
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
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background-card rounded-card shadow-medical border border-border-light z-50 max-h-80 sm:max-h-96 overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 border-b border-border-light">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Alerts</h3>
                        <button
                          onClick={() => setShowAlerts(false)}
                          className="p-1 text-text-light hover:text-text-secondary rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {unreadAlerts > 0 && (
                        <p className="text-xs sm:text-sm text-text-secondary mt-1">
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
                              className={`p-3 rounded-medical mb-2 border ${
                                alert.acknowledged 
                                  ? 'bg-background-hover border-border-light opacity-60' 
                                  : alert.type === 'critical' 
                                    ? 'bg-red-50 border-red-200' 
                                    : alert.type === 'warning'
                                      ? 'bg-alert-50 border-alert-200'
                                      : 'bg-primary-50 border-primary-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                                      alert.type === 'warning' ? 'bg-alert-100 text-alert-800' :
                                      'bg-primary-100 text-primary-800'
                                    }`}>
                                      {alert.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-text-secondary truncate">
                                      Patient {alert.patientId}
                                    </span>
                                  </div>
                                  <p className="text-sm text-text-primary mb-1 line-clamp-2">{alert.message}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
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
                                      className="p-1 text-health-600 hover:bg-health-100 rounded text-xs"
                                      title="Acknowledge"
                                    >
                                      ✓
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDismissAlert(alert.id)}
                                    className="p-1 text-text-light hover:bg-background-hover rounded text-xs"
                                    title="Dismiss"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {alerts.length > 8 && (
                            <div className="text-center p-3 border-t border-border-light">
                              <button
                                onClick={() => {
                                  setShowAlerts(false)
                                  navigate('/analytics')
                                }}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                View All {alerts.length} Alerts
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 sm:p-8 text-center">
                          <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-text-light mx-auto mb-2" />
                          <p className="text-text-secondary text-sm">No alerts</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Menu - Mobile Optimized */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 pl-2 border-l border-border-light"
              >
                {/* User Avatar */}
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                
                {/* User Info - Hidden on mobile */}
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-text-primary truncate max-w-24 lg:max-w-32">{user?.name}</p>
                  <p className="text-xs text-text-secondary capitalize truncate max-w-24 lg:max-w-32">
                    {user?.role}
                  </p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-background-card rounded-card shadow-medical border border-border-light z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border-light">
                      <div className="flex items-center space-x-3">
                        {user?.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-text-primary">{user?.name}</p>
                          <p className="text-xs text-text-secondary">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          navigate('/settings')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-hover"
                      >
                        Profile Settings
                      </button>
                      
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            navigate('/admin')
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-hover"
                        >
                          Admin Panel
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          logout()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              className="fixed top-4 left-4 right-4 bg-background-card rounded-card shadow-medical z-50 lg:hidden max-h-[85vh] overflow-hidden safe-area-inset-top"
            >
              {/* Mobile Search Header */}
              <div className="p-4 border-b border-border-light">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-4 py-3 w-full border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 text-base bg-background-card"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="p-2 text-text-light hover:text-text-secondary"
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
                        className="bg-background-hover rounded-card p-4 hover:bg-border-light transition-colors cursor-pointer"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="bg-primary-100 p-2 rounded-medical flex-shrink-0">
                              <User className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-text-primary truncate">{patient.name}</h4>
                              <div className="flex flex-col space-y-1 text-sm text-text-secondary mt-1">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{patient.room}</span>
                                </div>
                                <div className="flex items-center">
                                  <Monitor className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate text-xs">{patient.deviceId || 'No device'}</span>
                                </div>
                              </div>
                              <p className="text-xs text-text-light mt-1 line-clamp-2">{patient.diagnosis}</p>
                            </div>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 border ${getStatusColor(patient.status)}`}>
                            {patient.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Quick Vitals on Mobile */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-light">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-xs">{patient.vitals.heartRate} bpm</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wind className="h-3 w-3 text-primary-500" />
                            <span className="text-xs">{patient.vitals.oxygenSaturation}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3 text-alert-500" />
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
                    <Search className="h-12 w-12 text-text-light mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-text-primary mb-2">No patients found</h4>
                    <p className="text-text-secondary">Try searching by name, room, or MRN</p>
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

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}

export default Header