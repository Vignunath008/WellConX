import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Check, Bell, BellOff } from 'lucide-react'
import { Alert } from '../../types/medical'

interface AlertPanelProps {
  alerts: Alert[]
  onAcknowledge: (alertId: string) => void
  onDismiss: (alertId: string) => void
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAcknowledge, onDismiss }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [soundEnabled, setSoundEnabled] = useState(true)

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.type === filter
  ).sort((a, b) => {
    // Sort by type priority (critical first) then by timestamp
    const typePriority = { critical: 3, warning: 2, info: 1 }
    const aPriority = typePriority[a.type]
    const bPriority = typePriority[b.type]
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
            <div className="flex items-center space-x-2">
              {criticalCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  {warningCount} Warning
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'text-blue-600 bg-blue-100' : 'text-gray-400 bg-gray-100'
              }`}
            >
              {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3">
          {['all', 'critical', 'warning', 'info'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === type
                  ? 'bg-medical-100 text-medical-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 border-b border-gray-100 ${getAlertColors(alert.type)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        Patient {alert.patientId}
                      </p>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Vital: {alert.vitalType}</span>
                      <span>Value: {alert.value}</span>
                      <span>Threshold: {alert.threshold}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Acknowledge"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No {filter !== 'all' ? filter : ''} alerts</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AlertPanel