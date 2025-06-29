import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  BarChart3, 
  Settings,
  Activity
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Devices', href: '/devices', icon: Monitor },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white w-72 border-r border-gray-100">
      <div className="flex items-center px-8 py-6 border-b border-gray-100">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-bold text-gray-900">WellConX</h1>
          <p className="text-sm text-gray-500">Patient Monitoring</p>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
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
      
      {/* Compact System Status */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-ring" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">System Online</p>
              <p className="text-xs text-gray-500 truncate">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar