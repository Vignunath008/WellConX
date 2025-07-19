import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import RealTimeChart from '../components/charts/RealTimeChart'
import LiveWaveform from '../components/charts/LiveWaveform'
import AddPatientModal from '../components/modals/AddPatientModal'
import { Users, Monitor, AlertTriangle, Clock, Plus, Eye, Heart, Wind, Thermometer, Activity, TrendingUp, Building2, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { patients, devices, alerts, waveforms, addPatient } = useData()
  const [chartData, setChartData] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Generate historical chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = []
      const now = new Date()
      
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
    const interval = setInterval(generateChartData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const activePatients = patients.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length

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
    navigate('/iomt/patients')
  }

  const handleViewHistory = (patientId: string) => {
    navigate(`/iomt/patients/${patientId}/history`)
  }

  const handleViewDetails = (patientId: string) => {
    navigate(`/iomt/patients/${patientId}`)
  }

  const statCards = [
    {
      title: 'Active Patients',
      value: activePatients,
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: '+2 from yesterday',
      trend: 'up'
    },
    {
      title: 'Online Devices',
      value: `${onlineDevices}/${devices.length}`,
      icon: Monitor,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: 'All systems operational',
      trend: 'stable'
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      icon: AlertTriangle,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      change: criticalAlerts > 0 ? 'Requires attention' : 'All clear',
      trend: criticalAlerts > 0 ? 'up' : 'stable'
    },
    {
      title: 'Avg Response Time',
      value: '2.3min',
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      change: '15% faster than last week',
      trend: 'down'
    }
  ]

  return (
    <div className="container-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-text-md text-gray-600 mt-1">Real-time monitoring overview</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary btn-lg"
          >
            <Plus className="h-5 w-5" />
            Add Patient
          </button>
          <button 
            onClick={handleViewAllPatients}
            className="btn-secondary btn-lg"
          >
            <Activity className="h-5 w-5" />
            View All
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card p-6 ${stat.bgColor}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className={`h-4 w-4 ${
                  stat.trend === 'up' ? 'text-success-500' : 
                  stat.trend === 'down' ? 'text-error-500' : 'text-gray-400'
                }`} />
              </div>
            </div>
            <div>
              <p className="text-text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-display-sm font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-text-sm text-gray-500">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Patient Monitoring Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-display-xs font-bold text-gray-900">Patient Monitoring</h2>
            <p className="text-text-md text-gray-600">Real-time vital signs and status</p>
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-text-xl font-semibold text-gray-900 mb-2">No Patients Currently Monitored</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Add your first patient to start real-time monitoring and track vital signs</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary btn-xl"
            >
              <Plus className="h-5 w-5" />
              Add First Patient
            </button>
            <button 
              onClick={() => navigate('/hms')}
              className="btn-secondary btn-lg"
            >
              <Building2 className="h-5 w-5" />
              HMS
            </button>
            <button 
              onClick={() => navigate('/ehr')}
              className="btn-secondary btn-lg"
            >
              <FileText className="h-5 w-5" />
              EHR
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <Activity className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-text-xl font-bold text-gray-900">{patient.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-text-sm text-gray-600">
                        <span>{patient.age} years old</span>
                        <span>•</span>
                        <span className="capitalize">{patient.gender}</span>
                        <span>•</span>
                        <span>Room {patient.room}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`status-indicator ${
                    patient.status === 'critical' ? 'status-critical' :
                    patient.status === 'warning' ? 'status-warning' :
                    'status-stable'
                  }`}>
                    <span className="status-dot status-online" />
                    {patient.status}
                  </span>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-sm text-gray-600 mb-1">Medical Record</div>
                    <div className="font-medium text-gray-900">{patient.medicalRecordNumber}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-sm text-gray-600 mb-1">Device</div>
                    <div className="font-medium text-gray-900">{patient.deviceId || 'Not assigned'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-sm text-gray-600 mb-1">Last Updated</div>
                    <div className="font-medium text-gray-900">{patient.lastUpdated.toLocaleTimeString()}</div>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-primary-25 rounded-lg p-4 mb-6">
                  <div className="text-text-sm font-medium text-primary-800 mb-1">Diagnosis</div>
                  <div className="text-primary-700">{patient.diagnosis}</div>
                </div>
                
                {/* Vital Signs */}
                <div className="mb-6">
                  <h4 className="text-text-lg font-semibold text-gray-900 mb-4">Current Vital Signs</h4>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="vital-card vital-normal">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-5 w-5 text-error-600 animate-heartbeat" />
                        <span className="text-text-sm font-medium text-gray-700">Heart Rate</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-display-sm font-bold text-gray-900">{Math.round(patient.vitals.heartRate)}</span>
                        <span className="text-text-sm text-gray-600">bpm</span>
                      </div>
                    </div>

                    <div className="vital-card vital-normal">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-5 w-5 text-warning-600" />
                        <span className="text-text-sm font-medium text-gray-700">Blood Pressure</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-text-lg font-bold text-gray-900">
                          {Math.round(patient.vitals.bloodPressure.systolic)}/{Math.round(patient.vitals.bloodPressure.diastolic)}
                        </span>
                        <span className="text-text-sm text-gray-600">mmHg</span>
                      </div>
                    </div>

                    <div className="vital-card vital-normal">
                      <div className="flex items-center gap-2 mb-3">
                        <Wind className="h-5 w-5 text-primary-600" />
                        <span className="text-text-sm font-medium text-gray-700">SpO2</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-display-sm font-bold text-gray-900">{Math.round(patient.vitals.oxygenSaturation)}</span>
                        <span className="text-text-sm text-gray-600">%</span>
                      </div>
                    </div>

                    <div className="vital-card vital-normal">
                      <div className="flex items-center gap-2 mb-3">
                        <Thermometer className="h-5 w-5 text-warning-600" />
                        <span className="text-text-sm font-medium text-gray-700">Temperature</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-display-sm font-bold text-gray-900">{patient.vitals.temperature.toFixed(1)}</span>
                        <span className="text-text-sm text-gray-600">°F</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Live Waveforms */}
                {waveforms[patient.id] && (
                  <div className="mb-6">
                    <h4 className="text-text-lg font-semibold text-gray-900 mb-4">Live Waveforms</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <LiveWaveform
                        title={`ECG (${patient.vitals.heartRate} bpm)`}
                        data={waveforms[patient.id].ecg}
                        color="#00ff00"
                        height={120}
                        speed={1.5}
                        amplitude={1.2}
                        unit="mV"
                      />
                      <LiveWaveform
                        title={`SpO2 (${patient.vitals.oxygenSaturation}%)`}
                        data={waveforms[patient.id].pleth}
                        color="#00ffff"
                        height={120}
                        speed={1.5}
                        amplitude={2.0}
                        unit="SpO2"
                      />
                      <LiveWaveform
                        title={`Resp (${patient.vitals.respiratoryRate}/min)`}
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
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => handleViewHistory(patient.id)}
                    className="btn-secondary btn-md flex-1"
                  >
                    <Clock className="h-4 w-4" />
                    View History
                  </button>
                  <button 
                    onClick={() => handleViewDetails(patient.id)}
                    className="btn-primary btn-md flex-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Section */}
      {patients.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-display-xs font-bold text-gray-900">Vital Trends</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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