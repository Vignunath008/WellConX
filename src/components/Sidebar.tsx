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
    <div className="medical-sidebar w-72 flex flex-col h-full">
      <div className="flex items-center px-8 py-6 border-b border-border-light">
        <div className="medical-gradient-primary p-2 rounded-card shadow-medical">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-bold text-text-primary">WellConX</h1>
          <p className="text-sm text-text-secondary">Patient Monitoring</p>
        </div>
      </div>
      
      <nav className="mt-8 px-4 flex-1">
        <div className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `medical-nav-item ${
                  isActive
                    ? 'medical-nav-item-active'
                    : 'medical-nav-item-inactive'
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
      <div className="p-4 border-t border-border-light">
        <div className="medical-gradient-primary rounded-medical p-4">
          <div className="flex items-center space-x-3">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-blue-100 truncate capitalize">
                {user?.role} • {user?.department}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-blue-100 hover:text-white transition-colors rounded-medical hover:bg-white hover:bg-opacity-10"
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