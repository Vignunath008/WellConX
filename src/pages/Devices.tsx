import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import DeviceMonitor from '../components/device/DeviceMonitor'
import { Monitor, Plus, Filter, Search, Wifi, WifiOff, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const Devices: React.FC = () => {
  const { devices } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all')
  const [brandFilter, setBrandFilter] = useState<'all' | 'Philips' | 'GE' | 'Mindray'>('all')

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter
    const matchesBrand = brandFilter === 'all' || device.brand === brandFilter
    
    return matchesSearch && matchesStatus && matchesBrand
  })

  const deviceStats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length
  }

  const handleConfigure = (deviceId: string) => {
    console.log('Configure device:', deviceId)
    // Implement device configuration logic
  }

  const handleViewData = (deviceId: string) => {
    console.log('View device data:', deviceId)
    // Implement device data viewing logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage medical devices across the facility</p>
        </div>
        <button className="bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Devices</p>
              <p className="text-2xl font-bold text-gray-900">{deviceStats.total}</p>
            </div>
            <Monitor className="h-8 w-8 text-gray-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-xl p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Online</p>
              <p className="text-2xl font-bold text-green-700">{deviceStats.online}</p>
            </div>
            <Wifi className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-red-50 rounded-xl p-6 border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Offline</p>
              <p className="text-2xl font-bold text-red-700">{deviceStats.offline}</p>
            </div>
            <WifiOff className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-700">{deviceStats.maintenance}</p>
            </div>
            <Settings className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
            
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
            >
              <option value="all">All Brands</option>
              <option value="Philips">Philips</option>
              <option value="GE">GE</option>
              <option value="Mindray">Mindray</option>
            </select>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <DeviceMonitor
              device={device}
              onConfigure={handleConfigure}
              onViewData={handleViewData}
            />
          </motion.div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* HL7 Connection Status */}
      <motion.div
        className="bg-white rounded-xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HL7 Connection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">TCP Listener</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Port 2575 - Active</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">Message Parser</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">ORU^R01 - Ready</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-700">Data Stream</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">Real-time - Active</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Devices