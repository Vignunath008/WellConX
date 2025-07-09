import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  BarChart3, 
  Settings,
  Activity,
  UserCheck,
  LogOut,
  ArrowLeft
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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

  const handleBackToPlatform = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full w-72 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="bg-purple-600 p-2 rounded-xl">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">IoMT Module</h1>
          <p className="text-sm text-gray-500">Medical Device Monitoring</p>
        </div>
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
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
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

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
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
                <span className="text-white font-semibold">
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
              onClick={logout}
              className="btn-ghost btn-sm"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar