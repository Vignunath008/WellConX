import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import LogoutConfirmationModal from './LogoutConfirmationModal'
import { Bell, Search, X, User, Menu, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onMobileMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { alerts, patients, acknowledgeAlert, dismissAlert } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length

  const searchPatients = (query: string) => {
    if (!query.trim()) return []
    
    const searchLower = query.toLowerCase()
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower) ||
      patient.room.toLowerCase().includes(searchLower) ||
      patient.medicalRecordNumber.toLowerCase().includes(searchLower)
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.trim()) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const results = searchPatients(searchTerm)
      if (results.length > 0) {
        selectPatient(results[0])
      }
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setShowSearchResults(false)
  }

  const searchResults = searchPatients(searchTerm)

  const selectPatient = (patient: any) => {
    setShowSearchResults(false)
    setSearchTerm('')
    navigate(`/patients/${patient.id}`)
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

  const handleLogout = () => {
    setShowUserMenu(false)
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  const handleSettingsClick = () => {
    setShowUserMenu(false)
    navigate('/settings')
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-top">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <button
                onClick={onMobileMenuClick}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo/Title */}
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  <span className="hidden sm:inline">WellConX Dashboard</span>
                  <span className="sm:hidden">WellConX</span>
                </h1>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Search */}
              <div className="relative hidden lg:block">
                <div className="flex items-center">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={handleSearch}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-10 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                </div>

                {/* Desktop Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      {searchResults.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => selectPatient(patient)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{patient.name}</h4>
                              <p className="text-sm text-gray-500">
                                Room {patient.room} • {patient.age}y {patient.gender}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                              patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {patient.status}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Search Button */}
              <button 
                onClick={() => setShowSearchResults(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={handleAlertClick}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadAlerts > 9 ? '9+' : unreadAlerts}
                    </span>
                  )}
                </button>

                {/* Alert Dropdown */}
                <AnimatePresence>
                  {showAlerts && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          <button
                            onClick={() => setShowAlerts(false)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {unreadAlerts > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            {unreadAlerts} unread notification{unreadAlerts !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {alerts.length > 0 ? (
                          <div className="p-2">
                            {alerts.slice(0, 8).map((alert) => (
                              <div
                                key={alert.id}
                                className={`p-3 rounded-lg mb-2 border transition-colors ${
                                  alert.acknowledged 
                                    ? 'bg-gray-25 border-gray-200 opacity-60' 
                                    : alert.type === 'critical' 
                                      ? 'bg-red-25 border-red-200' 
                                      : alert.type === 'warning'
                                        ? 'bg-yellow-25 border-yellow-200'
                                        : 'bg-blue-25 border-blue-200'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex items-center gap-2 mb-1">
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
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{alert.vitalType}: {alert.value}</span>
                                      <span>•</span>
                                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {!alert.acknowledged && (
                                      <button
                                        onClick={() => handleAcknowledgeAlert(alert.id)}
                                        className="text-green-600 hover:bg-green-100 rounded p-1 text-xs"
                                        title="Acknowledge"
                                      >
                                        ✓
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDismissAlert(alert.id)}
                                      className="text-gray-400 hover:bg-gray-100 rounded p-1 text-xs"
                                      title="Dismiss"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-32">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize truncate max-w-32">
                      {user?.role}
                    </p>
                  </div>
                  
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
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
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={handleSettingsClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Settings
                        </button>
                        
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              navigate('/admin')
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Admin Panel
                          </button>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
        </div>
      </header>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {showSearchResults && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50 z-50 lg:hidden"
              onClick={() => setShowSearchResults(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-4 left-4 right-4 bg-white rounded-xl shadow-xl z-50 lg:hidden max-h-[85vh] overflow-hidden safe-top"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={handleSearch}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
                {searchResults.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {searchResults.map((patient) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                              <User className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 truncate">{patient.name}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Room {patient.room} • {patient.age}y {patient.gender}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{patient.diagnosis}</p>
                            </div>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                            patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No patients found</h4>
                    <p className="text-gray-500">Try searching by name, room, or MRN</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handlers */}
      {showAlerts && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowAlerts(false)}
        />
      )}

      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </>
  )
}

export default Header