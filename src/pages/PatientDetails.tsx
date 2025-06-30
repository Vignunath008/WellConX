import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { VitalMonitorGrid } from '../components/monitors/VitalMonitor'
import LiveWaveform from '../components/charts/LiveWaveform'
import RealTimeChart from '../components/charts/RealTimeChart'
import { ArrowLeft, User, MapPin, Monitor, Calendar, FileText, Edit, Save, X, AlertTriangle, Clock, Activity, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PatientDetails: React.FC = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, devices, waveforms, alerts } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  const patient = patients.find(p => p.id === patientId)
  const assignedDevice = devices.find(d => d.id === patient?.deviceId)
  const patientAlerts = alerts.filter(a => a.patientId === patientId)
  const recentAlerts = patientAlerts.slice(0, 5)

  useEffect(() => {
    if (patient) {
      setEditedPatient({ ...patient })
      
      // Generate chart data for the last 2 hours
      const data = []
      const now = new Date()
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000) // 5-minute intervals
        data.push({
          timestamp,
          heartRate: Math.round(patient.vitals.heartRate + (Math.random() - 0.5) * 8),
          oxygenSaturation: Math.round(patient.vitals.oxygenSaturation + (Math.random() - 0.5) * 2),
          temperature: Math.round((patient.vitals.temperature + (Math.random() - 0.5) * 0.3) * 10) / 10,
        })
      }
      
      setChartData(data)
    }
  }, [patient])

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
          <button
            onClick={() => navigate('/patients')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Patients
          </button>
        </div>
      </div>
    )
  }

  const handleSaveEdit = () => {
    // In a real app, this would update the patient in the backend
    alert(`Patient information updated!\n\nChanges saved for ${editedPatient.name}`)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedPatient({ ...patient })
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Patient Details & Real-Time Monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Patient</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(patient.status)}`}>
              {patient.status.toUpperCase()}
            </div>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editedPatient.name}
                  onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={editedPatient.age}
                  onChange={(e) => setEditedPatient({ ...editedPatient, age: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                <input
                  type="text"
                  value={editedPatient.room}
                  onChange={(e) => setEditedPatient({ ...editedPatient, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Record Number</label>
                <input
                  type="text"
                  value={editedPatient.medicalRecordNumber}
                  onChange={(e) => setEditedPatient({ ...editedPatient, medicalRecordNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  value={editedPatient.diagnosis}
                  onChange={(e) => setEditedPatient({ ...editedPatient, diagnosis: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Age & Gender</p>
                    <p className="font-medium text-gray-900">{patient.age} years old, {patient.gender}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium text-gray-900">{patient.room}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Medical Record Number</p>
                    <p className="font-medium text-gray-900">{patient.medicalRecordNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Admission Date</p>
                    <p className="font-medium text-gray-900">{patient.admissionDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Assigned Device</p>
                    <p className="font-medium text-gray-900">{patient.deviceId || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Primary Diagnosis</p>
                    <p className="font-medium text-gray-900">{patient.diagnosis}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Device Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Device Information</h2>
          
          {assignedDevice ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  assignedDevice.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="font-medium text-gray-900">{assignedDevice.name}</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="text-gray-900">{assignedDevice.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-gray-900">{assignedDevice.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="text-gray-900">{assignedDevice.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IP Address:</span>
                  <span className="text-gray-900 font-mono">{assignedDevice.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    assignedDevice.status === 'online' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {assignedDevice.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Heartbeat:</span>
                  <span className="text-gray-900">{assignedDevice.lastHeartbeat.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Device Assigned</h3>
              <p className="text-gray-600 text-sm">This patient is not currently connected to a monitoring device.</p>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Vitals */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Real-Time Vital Signs</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 font-medium">Live</span>
            <span className="text-sm text-gray-500">
              Last updated: {patient.lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <VitalMonitorGrid vitals={patient.vitals} />
      </div>

      {/* Live Waveforms */}
      {waveforms[patient.id] && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Live Waveforms</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vital Trends */}
        <div className="space-y-6">
          <RealTimeChart
            title="Heart Rate Trend"
            data={chartData.map(d => ({ timestamp: d.timestamp, value: d.heartRate }))}
            color="#ef4444"
            unit=" bpm"
            yAxisMin={40}
            yAxisMax={140}
            height={250}
          />
          
          <RealTimeChart
            title="SpO2 Trend"
            data={chartData.map(d => ({ timestamp: d.timestamp, value: d.oxygenSaturation }))}
            color="#3b82f6"
            unit="%"
            yAxisMin={85}
            yAxisMax={100}
            height={250}
          />
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Alerts</h2>
          
          {recentAlerts.length > 0 ? (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-900 text-sm mb-1">{alert.message}</p>
                      <div className="text-xs text-gray-600">
                        {alert.vitalType}: {alert.value} (Threshold: {alert.threshold})
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {alert.acknowledged ? (
                        <span className="text-green-600 text-xs">✓ Ack</span>
                      ) : (
                        <span className="text-red-600 text-xs">⚠ New</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button
                onClick={() => navigate(`/patients/${patient.id}/history`)}
                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
              >
                View All Alerts →
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Alerts</h3>
              <p className="text-gray-600 text-sm">This patient has no recent alerts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate(`/patients/${patient.id}/history`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Clock className="h-5 w-5" />
          <span>View Full History</span>
        </button>
        
        <button
          onClick={() => navigate(`/patients/${patient.id}/advanced`)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Zap className="h-5 w-5" />
          <span>Advanced Monitoring</span>
        </button>
      </div>
    </div>
  )
}

export default PatientDetails