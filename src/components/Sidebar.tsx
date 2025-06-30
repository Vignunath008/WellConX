import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  BarChart3, 
  Settings,
  Activity,
  UserCheck,
  LogOut
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Devices', href: '/devices', icon: Monitor },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  // Add admin panel for admin users
  if (user?.role === 'admin') {
    navigation.splice(-1, 0, { name: 'Admin Panel', href: '/admin', icon: UserCheck })
  }

  return (
    <div className="bg-white w-72 border-r border-gray-100 flex flex-col h-full">
      <div className="flex items-center px-8 py-6 border-b border-gray-100">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-bold text-gray-900">WellConX</h1>
          <p className="text-sm text-gray-500">Patient Monitoring</p>
        </div>
      </div>
      
      <nav className="mt-8 px-4 flex-1">
        <div className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
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