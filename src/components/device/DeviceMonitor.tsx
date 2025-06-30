import React from 'react'
import { motion } from 'framer-motion'
import { Monitor, WifiOff, Settings, AlertTriangle, CheckCircle } from 'lucide-react'
import { Device } from '../../types/medical'

interface DeviceMonitorProps {
  device: Device
  onConfigure?: (deviceId: string) => void
  onViewData?: (deviceId: string) => void
}

const DeviceMonitor: React.FC<DeviceMonitorProps> = ({ device, onConfigure, onViewData }) => {
  const getStatusIcon = () => {
    switch (device.status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'offline':
        return <WifiOff className="h-5 w-5 text-red-600" />
      case 'maintenance':
        return <Settings className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColors = () => {
    switch (device.status) {
      case 'online':
        return 'border-green-200 bg-green-50'
      case 'offline':
        return 'border-red-200 bg-red-50'
      case 'maintenance':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getBrandLogo = () => {
    switch (device.brand) {
      case 'Philips':
        return '🏥'
      case 'GE':
        return '⚡'
      case 'Mindray':
        return '🔬'
      default:
        return '📱'
    }
  }

  const handleConfigureClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onConfigure) {
      onConfigure(device.id)
    }
  }

  const handleViewDataClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onViewData) {
      onViewData(device.id)
    }
  }

  return (
    <motion.div 
      className={`rounded-lg border-2 p-4 ${getStatusColors()} transition-all duration-300 hover:shadow-lg`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
            <Monitor className="h-5 w-5 text-medical-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{device.name}</h3>
            <p className="text-sm text-gray-600 truncate">{device.model}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-2xl">{getBrandLogo()}</span>
          {getStatusIcon()}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600 text-xs">Device ID:</span>
            <p className="font-medium truncate">{device.id}</p>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Location:</span>
            <p className="font-medium truncate">{device.location}</p>
          </div>
          <div>
            <span className="text-gray-600 text-xs">IP Address:</span>
            <p className="font-medium font-mono text-xs truncate">{device.ipAddress}</p>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Serial:</span>
            <p className="font-medium font-mono text-xs truncate">{device.serialNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Last seen: {device.lastHeartbeat.toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-1">
            {device.status === 'online' && (
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <span className={`text-xs font-medium ${
              device.status === 'online' ? 'text-green-700' :
              device.status === 'offline' ? 'text-red-700' :
              'text-yellow-700'
            }`}>
              {device.status.toUpperCase()}
            </span>
          </div>
        </div>

        {device.patientId && (
          <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Assigned Patient:</span>
              <span className="text-sm font-medium">{device.patientId}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <button 
          onClick={handleConfigureClick}
          className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Configure
        </button>
        <button 
          onClick={handleViewDataClick}
          className="flex-1 bg-medical-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-medical-700 transition-colors"
        >
          View Data
        </button>
      </div>
    </motion.div>
  )
}

export default DeviceMonitor