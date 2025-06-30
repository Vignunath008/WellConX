import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
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
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: '+2 from yesterday'
    },
    {
      title: 'Online Devices',
      value: `${onlineDevices}/${devices.length}`,
      icon: Monitor,
      color: 'text-health-600',
      bgColor: 'bg-health-50',
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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Patient Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">Real-time monitoring overview</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-medical font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
          <button 
            onClick={handleViewAllPatients}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2.5 rounded-medical font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>View All</span>
          </button>
        </div>
      </div>

      {/* Stats Overview - Mobile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-medical p-4 sm:p-5 border border-gray-200 shadow-soft`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 sm:p-2.5 rounded-medical bg-white shadow-soft ${stat.color}`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-text-secondary line-clamp-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Monitoring Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">Patient Monitoring</h2>
            <p className="text-sm text-text-secondary">Real-time vital signs and status</p>
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="bg-white rounded-medical border border-gray-200 p-6 sm:p-8 text-center shadow-soft">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-text-primary mb-2">No Patients Currently Monitored</h3>
            <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">Add your first patient to start real-time monitoring</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-medical font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add First Patient</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-medical border border-gray-200 p-4 hover:shadow-medical transition-all duration-300 w-full overflow-hidden">
                {/* Patient Header - Mobile Optimized */}
                <div className="space-y-3 mb-4">
                  {/* Top Row - Name and Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className="bg-primary-50 p-2 rounded-medical flex-shrink-0">
                        <Activity className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-text-primary truncate">{patient.name}</h3>
                        <div className="text-sm text-text-secondary mt-1">
                          <div className="flex items-center space-x-2">
                            <span>{patient.age} years old</span>
                            <span>•</span>
                            <span className="capitalize">{patient.gender}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 border ${
                      patient.status === 'critical' ? 'bg-red-50 text-red-800 border-red-200' :
                      patient.status === 'warning' ? 'bg-alert-50 text-alert-800 border-alert-200' :
                      'bg-health-50 text-health-800 border-health-200'
                    }`}>
                      {patient.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Patient Info Grid - Mobile Optimized */}
                  <div className="grid grid-cols-1 gap-2 text-sm bg-gray-50 rounded-medical p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-secondary">Room:</span>
                      <span className="text-text-primary">{patient.room}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-secondary">MRN:</span>
                      <span className="text-text-primary text-xs">{patient.medicalRecordNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-secondary">Device:</span>
                      <span className="text-text-primary text-xs truncate max-w-32">{patient.deviceId || 'Not assigned'}</span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="bg-primary-50 rounded-medical p-3">
                    <div className="text-sm">
                      <span className="font-medium text-primary-800">Diagnosis: </span>
                      <span className="text-primary-700">{patient.diagnosis}</span>
                    </div>
                  </div>

                  {/* Live Status Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-health-500 rounded-full pulse-ring" />
                      <span className="text-xs font-medium text-text-secondary">Live Monitoring Active</span>
                    </div>
                    <div className="text-xs text-text-secondary">
                      Updated: {patient.lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {/* Vital Signs - Mobile Optimized */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Current Vital Signs</h4>
                  
                  {/* Mobile-First Vital Signs Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Heart Rate */}
                    <div className="vital-heart-rate rounded-medical p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="h-4 w-4 text-red-600 heartbeat" />
                        <span className="text-xs font-medium text-red-700">Heart Rate</span>
                      </div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-red-700">{Math.round(patient.vitals.heartRate)}</span>
                        <span className="text-xs text-red-600">bpm</span>
                      </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="vital-blood-pressure rounded-medical p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Blood Pressure</span>
                      </div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-bold text-purple-700">
                          {Math.round(patient.vitals.bloodPressure.systolic)}/{Math.round(patient.vitals.bloodPressure.diastolic)}
                        </span>
                        <span className="text-xs text-purple-600">mmHg</span>
                      </div>
                    </div>

                    {/* SpO2 */}
                    <div className="vital-oxygen rounded-medical p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wind className="h-4 w-4 text-primary-600" />
                        <span className="text-xs font-medium text-primary-700">SpO2</span>
                      </div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-primary-700">{Math.round(patient.vitals.oxygenSaturation)}</span>
                        <span className="text-xs text-primary-600">%</span>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="vital-temperature rounded-medical p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Thermometer className="h-4 w-4 text-alert-600" />
                        <span className="text-xs font-medium text-alert-700">Temperature</span>
                      </div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold text-alert-700">{patient.vitals.temperature.toFixed(1)}</span>
                        <span className="text-xs text-alert-600">°F</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Live Waveforms - Mobile Responsive */}
                {waveforms[patient.id] && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">
                      Live Waveforms
                    </h4>
                    
                    {/* Mobile: Stack vertically */}
                    <div className="space-y-3">
                      <LiveWaveform
                        title={`ECG (${patient.vitals.heartRate} bpm)`}
                        data={waveforms[patient.id].ecg}
                        color="#00ff00"
                        height={80}
                        speed={1.5}
                        amplitude={1.2}
                        unit="mV"
                      />
                      <LiveWaveform
                        title={`SpO2 (${patient.vitals.oxygenSaturation}%)`}
                        data={waveforms[patient.id].pleth}
                        color="#00ffff"
                        height={80}
                        speed={1.5}
                        amplitude={2.0}
                        unit="SpO2"
                      />
                      <LiveWaveform
                        title={`Resp (${patient.vitals.respiratoryRate}/min)`}
                        data={waveforms[patient.id].respiration}
                        color="#ffff00"
                        height={80}
                        speed={1.0}
                        amplitude={1.5}
                        unit="Resp"
                      />
                    </div>
                  </div>
                )}
                
                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 border-t border-gray-200">
                  <button 
                    onClick={() => handleViewHistory(patient.id)}
                    className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2.5 rounded-medical font-medium transition-colors flex items-center justify-center space-x-2 text-sm flex-1"
                  >
                    <Clock className="h-4 w-4" />
                    <span>View History</span>
                  </button>
                  <button 
                    onClick={() => handleViewDetails(patient.id)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-medical font-medium transition-colors flex items-center justify-center space-x-2 text-sm flex-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Section - Mobile Responsive */}
      {patients.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">Vital Trends</h2>
          
          {/* Mobile: Stack charts, Desktop: Grid */}
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 sm:gap-4 lg:gap-6">
            <RealTimeChart
              title="Heart Rate Trend"
              data={chartData.map(d => ({ timestamp: d.timestamp, value: d.heartRate }))}
              color="#ef4444"
              unit=" bpm"
              yAxisMin={40}
              yAxisMax={140}
              height={200}
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
              height={200}
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
              height={200}
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