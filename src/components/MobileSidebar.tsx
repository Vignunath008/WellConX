import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoutConfirmationModal from './LogoutConfirmationModal'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  BarChart3, 
  Settings,
  Activity,
  UserCheck,
  X,
  LogOut,
  ArrowLeft
} from 'lucide-react'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/iomt/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/iomt/patients', icon: Users },
    { name: 'Devices', href: '/iomt/devices', icon: Monitor },
    { name: 'Analytics', href: '/iomt/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/iomt/settings', icon: Settings },
  ]

  // Add admin panel for admin users
  if (user?.role === 'admin') {
    navigation.splice(-1, 0, { name: 'Admin Panel', href: '/iomt/admin', icon: UserCheck })
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    onClose()
    logout()
    navigate('/')
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  const handleBackToPlatform = () => {
    onClose()
    navigate('/')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 lg:hidden safe-left safe-top safe-bottom"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">IoMT Module</h1>
                  <p className="text-sm text-gray-500">Medical Device Monitoring</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="btn-ghost btn-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Back to Platform Button */}
            <div className="px-4 py-3 border-b border-gray-200">
              <button
                onClick={handleBackToPlatform}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Platform
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="px-4 py-6">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `nav-item ${
                        isActive
                          ? 'nav-item-active'
                          : 'nav-item-inactive'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </nav>
            
            {/* User Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate capitalize">
                      {user?.role} • {user?.department}
                    </p>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="btn-ghost btn-sm"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </AnimatePresence>
  )
}

export default MobileSidebar