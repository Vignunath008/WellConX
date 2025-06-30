import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { VitalMonitorGrid } from '../components/monitors/VitalMonitor'
import RealTimeChart from '../components/charts/RealTimeChart'
import LiveWaveform from '../components/charts/LiveWaveform'
import AddPatientModal from '../components/modals/AddPatientModal'
import { Users, Monitor, AlertTriangle, Activity, Clock, TrendingUp, Plus, Eye, ChevronRight, Heart, Wind, Thermometer } from 'lucide-react'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { patients, devices, alerts, waveforms, addPatient } = useData()
  const [chartData, setChartData] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Generate historical chart data with more realistic intervals
  useEffect(() => {
    const generateChartData = () => {
      const data = []
      const now = new Date()
      
      // Generate data points every 5 minutes for the last 2 hours
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000)
        data.push({
          timestamp,
          heartRate: Math.round(70 + Math.sin(i * 0.2) * 8 + Math.random() * 4),
          oxygenSaturation: Math.round(97 + Math.sin(i * 0.3) * 1.5 + Math.random() * 1),
          temperature: Math.round((98.6 + Math.sin(i * 0.4) * 0.3 + Math.random() * 0.2) * 10) / 10,
        })
      }
      
      setChartData(data)
    }

    generateChartData()
    // Update chart data every 5 minutes
    const interval = setInterval(generateChartData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const activePatients = patients.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length

  // Get available devices for new patient assignment
  const availableDevices = devices.filter(device => !device.patientId || device.status === 'offline').map(device => ({
    id: device.id,
    name: device.name,
    location: device.location
  }))

  const handleAddPatient = (patientData: any) => {
    const newPatient = addPatient(patientData)
    alert(`Patient Added Successfully!\n\nName: ${newPatient.name}\nRoom: ${newPatient.room}\nStatus: ${newPatient.status.toUpperCase()}\n\nThe patient is now being monitored and will appear in real-time on the dashboard.`)
  }

  const handleViewAllPatients = () => {
    navigate('/patients')
  }

  // Navigation handlers for dashboard buttons
  const handleViewHistory = (patientId: string) => {
    navigate(`/patients/${patientId}/history`)
  }

  const handleViewDetails = (patientId: string) => {
    navigate(`/patients/${patientId}`)
  }

  const statCards = [
    {
      title: 'Active Patients',
      value: activePatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 from yesterday'
    },
    {
      title: 'Online Devices',
      value: `${onlineDevices}/${devices.length}`,
      icon: Monitor,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: 'All systems operational'
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: criticalAlerts > 0 ? 'Requires attention' : 'All clear'
    },
    {
      title: 'Avg Response Time',
      value: '2.3min',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '15% faster than last week'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time monitoring overview</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
          <button 
            onClick={handleViewAllPatients}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>View All</span>
          </button>
        </div>
      </div>

      {/* Stats Overview - Mobile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-100`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 sm:p-2.5 rounded-lg bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Monitoring Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Patient Monitoring</h2>
            <p className="text-sm text-gray-500">Real-time vital signs and status</p>
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-6 sm:p-8 text-center">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Patients Currently Monitored</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Add your first patient to start real-time monitoring</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add First Patient</span>
            </button>
          </div>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
              {/* Patient Header - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{patient.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 mt-1 space-y-1 sm:space-y-0">
                      <span>{patient.age}y {patient.gender}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{patient.room}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate text-xs">{patient.deviceId || 'No device assigned'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{patient.diagnosis}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-2">
                  <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                    patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                    patient.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {patient.status.toUpperCase()}
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-ring" />
                    <span className="text-xs font-medium text-gray-500">Live</span>
                  </div>
                </div>
              </div>
              
              {/* Vital Signs - Mobile Optimized Grid */}
              <VitalMonitorGrid vitals={patient.vitals} />
              
              {/* Live Waveforms - Mobile Responsive */}
              {waveforms[patient.id] && (
                <div className="mt-4 sm:mt-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                    Live Waveforms
                  </h4>
                  
                  {/* Mobile: Stack vertically, Desktop: Grid */}
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 sm:gap-4">
                    <LiveWaveform
                      title={`ECG (${patient.vitals.heartRate} bpm)`}
                      data={waveforms[patient.id].ecg}
                      color="#00ff00"
                      height={100}
                      speed={1.5}
                      amplitude={1.2}
                      unit="mV"
                    />
                    <LiveWaveform
                      title={`SpO2 (${patient.vitals.oxygenSaturation}%)`}
                      data={waveforms[patient.id].pleth}
                      color="#00ffff"
                      height={100}
                      speed={1.5}
                      amplitude={2.0}
                      unit="SpO2"
                    />
                    <LiveWaveform
                      title={`Resp (${patient.vitals.respiratoryRate}/min)`}
                      data={waveforms[patient.id].respiration}
                      color="#ffff00"
                      height={100}
                      speed={1.0}
                      amplitude={1.5}
                      unit="Resp"
                    />
                  </div>
                </div>
              )}
              
              {/* Action Buttons - Mobile Optimized */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-500">
                  Last updated: {patient.lastUpdated.toLocaleTimeString()}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={() => handleViewHistory(patient.id)}
                    className="btn-secondary text-sm flex items-center justify-center space-x-2 py-2.5"
                  >
                    <Clock className="h-4 w-4" />
                    <span>View History</span>
                  </button>
                  <button 
                    onClick={() => handleViewDetails(patient.id)}
                    className="btn-primary text-sm flex items-center justify-center space-x-2 py-2.5"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Section - Mobile Responsive */}
      {patients.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Vital Trends</h2>
          
          {/* Mobile: Stack charts, Desktop: Grid */}
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 sm:gap-4 lg:gap-6">
            <RealTimeChart
              title="Heart Rate Trend"
              data={chartData.map(d => ({ timestamp: d.timestamp, value: d.heartRate }))}
              color="#ef4444"
              unit=" bpm"
              yAxisMin={40}
              yAxisMax={140}
              height={250}
              thresholds={{
                warning: { min: 60, max: 100 },
                critical: { min: 50, max: 120 }
              }}
            />
            
            <RealTimeChart
              title="SpO2 Trend"
              data={chartData.map(d => ({ timestamp: d.timestamp, value: d.oxygenSaturation }))}
              color="#3b82f6"
              unit="%"
              yAxisMin={85}
              yAxisMax={100}
              height={250}
              thresholds={{
                warning: { min: 95 },
                critical: { min: 90 }
              }}
            />
            
            <RealTimeChart
              title="Temperature Trend"
              data={chartData.map(d => ({ timestamp: d.timestamp, value: d.temperature }))}
              color="#f59e0b"
              unit="°F"
              yAxisMin={95}
              yAxisMax={104}
              height={250}
              thresholds={{
                warning: { min: 97, max: 99.5 },
                critical: { min: 95, max: 101 }
              }}
            />
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPatient={handleAddPatient}
        availableDevices={availableDevices}
      />
    </div>
  )
}

export default Dashboard