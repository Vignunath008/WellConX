import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { VitalMonitorGrid } from '../components/monitors/VitalMonitor'
import RealTimeChart from '../components/charts/RealTimeChart'
import LiveWaveform from '../components/charts/LiveWaveform'
import AddPatientModal from '../components/modals/AddPatientModal'
import { Users, Monitor, AlertTriangle, Activity, Clock, TrendingUp, Plus, Eye } from 'lucide-react'

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
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className={`${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Monitoring */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Patient Monitoring</h2>
            <p className="text-sm text-gray-500">Real-time vital signs and status</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Patient</span>
            </button>
            <button 
              onClick={handleViewAllPatients}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>View All Patients</span>
            </button>
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-8 sm:p-12 text-center">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Currently Monitored</h3>
            <p className="text-gray-600 mb-6">Add your first patient to start real-time monitoring</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add First Patient</span>
            </button>
          </div>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{patient.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                      <span>{patient.age}y {patient.gender}</span>
                      <span>•</span>
                      <span className="truncate">{patient.room}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline truncate">{patient.deviceId || 'No device assigned'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{patient.diagnosis}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                    patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                    patient.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {patient.status.toUpperCase()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-ring" />
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">Live</span>
                  </div>
                </div>
              </div>
              
              <VitalMonitorGrid vitals={patient.vitals} />
              
              {/* Live Waveforms - Responsive */}
              {waveforms[patient.id] && (
                <div className="mt-6 sm:mt-8">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                    Live Waveforms - HR: {patient.vitals.heartRate} bpm, SpO2: {patient.vitals.oxygenSaturation}%, RR: {patient.vitals.respiratoryRate}/min
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                    <LiveWaveform
                      title={`ECG Lead II (${patient.vitals.heartRate} bpm)`}
                      data={waveforms[patient.id].ecg}
                      color="#00ff00"
                      height={120}
                      speed={1.5}
                      amplitude={1.2}
                      unit="mV"
                    />
                    <LiveWaveform
                      title={`Plethysmography (${patient.vitals.oxygenSaturation}%)`}
                      data={waveforms[patient.id].pleth}
                      color="#00ffff"
                      height={120}
                      speed={1.5}
                      amplitude={2.0}
                      unit="SpO2"
                    />
                    <LiveWaveform
                      title={`Respiration (${patient.vitals.respiratoryRate}/min)`}
                      data={waveforms[patient.id].respiration}
                      color="#ffff00"
                      height={120}
                      speed={1.0}
                      amplitude={1.5}
                      unit="Resp"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-500">
                  Last updated: {patient.lastUpdated.toLocaleTimeString()}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={() => handleViewHistory(patient.id)}
                    className="btn-secondary text-sm flex items-center justify-center space-x-1"
                  >
                    <Clock className="h-4 w-4" />
                    <span>View History</span>
                  </button>
                  <button 
                    onClick={() => handleViewDetails(patient.id)}
                    className="btn-primary text-sm flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Section - Responsive */}
      {patients.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <RealTimeChart
            title="Heart Rate Trend"
            data={chartData.map(d => ({ timestamp: d.timestamp, value: d.heartRate }))}
            color="#ef4444"
            unit=" bpm"
            yAxisMin={40}
            yAxisMax={140}
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
            thresholds={{
              warning: { min: 97, max: 99.5 },
              critical: { min: 95, max: 101 }
            }}
          />
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