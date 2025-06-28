import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { Bell, LogOut, Wifi, WifiOff, Search } from 'lucide-react'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { isConnected, alerts } = useData()
  
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length

  return (
    <header className="bg-white border-b border-gray-100">
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
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>
          
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
  )
}

export default Header