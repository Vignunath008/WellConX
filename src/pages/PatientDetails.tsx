import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { VitalMonitorGrid } from '../components/monitors/VitalMonitor'
import LiveWaveform from '../components/charts/LiveWaveform'
import RealTimeChart from '../components/charts/RealTimeChart'
import { ArrowLeft, User, MapPin, Monitor, Calendar, FileText, Edit, Save, X, AlertTriangle, Clock, Activity, Zap, Brain, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PatientDetails: React.FC = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, devices, waveforms, alerts } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [expandedSections, setExpandedSections] = useState({
    info: true,
    vitals: true,
    waveforms: false,
    charts: false,
    alerts: false
  })

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const SectionHeader = ({ title, isExpanded, onToggle, icon: Icon }: any) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg border-b border-gray-200"
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {isExpanded ? (
        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
      )}
    </button>
  )

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 max-w-full overflow-hidden">
      {/* Mobile-Optimized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{patient.name}</h1>
            <p className="text-xs sm:text-sm text-gray-600 truncate">Patient Details & Real-Time Monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Patient</span>
              <span className="sm:hidden">Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 text-sm"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 text-sm"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Information - Collapsible on Mobile */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Patient Information" 
          isExpanded={expandedSections.info}
          onToggle={() => toggleSection('info')}
          icon={User}
        />
        
        <AnimatePresence>
          {expandedSections.info && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{patient.name}</h3>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <div>{patient.age}y {patient.gender} • {patient.room}</div>
                        <div className="truncate">MRN: {patient.medicalRecordNumber}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border flex-shrink-0 ${getStatusColor(patient.status)}`}>
                    {patient.status.toUpperCase()}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedPatient.name}
                          onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={editedPatient.age}
                          onChange={(e) => setEditedPatient({ ...editedPatient, age: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                        <input
                          type="text"
                          value={editedPatient.room}
                          onChange={(e) => setEditedPatient({ ...editedPatient, room: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Record Number</label>
                        <input
                          type="text"
                          value={editedPatient.medicalRecordNumber}
                          onChange={(e) => setEditedPatient({ ...editedPatient, medicalRecordNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                      <textarea
                        value={editedPatient.diagnosis}
                        onChange={(e) => setEditedPatient({ ...editedPatient, diagnosis: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Admission Date</p>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{patient.admissionDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Location</p>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{patient.room}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Monitor className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Assigned Device</p>
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{patient.deviceId || 'Not assigned'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Gender</p>
                            <p className="font-medium text-gray-900 text-sm sm:text-base capitalize">{patient.gender}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Primary Diagnosis</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{patient.diagnosis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Device Information - Mobile Optimized */}
                {assignedDevice && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Device Information</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 text-sm truncate">{assignedDevice.name}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          assignedDevice.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Model:</span>
                          <span className="text-gray-900 ml-1">{assignedDevice.model}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Brand:</span>
                          <span className="text-gray-900 ml-1">{assignedDevice.brand}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-gray-900 ml-1">{assignedDevice.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-Time Vitals - Collapsible */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Real-Time Vital Signs" 
          isExpanded={expandedSections.vitals}
          onToggle={() => toggleSection('vitals')}
          icon={Activity}
        />
        
        <AnimatePresence>
          {expandedSections.vitals && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Live Data</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Updated: {patient.lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
                
                <VitalMonitorGrid vitals={patient.vitals} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Waveforms - Collapsible */}
      {waveforms[patient.id] && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader 
            title="Live Waveforms" 
            isExpanded={expandedSections.waveforms}
            onToggle={() => toggleSection('waveforms')}
            icon={Monitor}
          />
          
          <AnimatePresence>
            {expandedSections.waveforms && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <LiveWaveform
                      title={`ECG Lead II (${patient.vitals.heartRate} bpm)`}
                      data={waveforms[patient.id].ecg}
                      color="#00ff00"
                      height={100}
                      speed={1.5}
                      amplitude={1.2}
                      unit="mV"
                    />
                    <LiveWaveform
                      title={`Plethysmography (${patient.vitals.oxygenSaturation}%)`}
                      data={waveforms[patient.id].pleth}
                      color="#00ffff"
                      height={100}
                      speed={1.5}
                      amplitude={2.0}
                      unit="SpO2"
                    />
                    <LiveWaveform
                      title={`Respiration (${patient.vitals.respiratoryRate}/min)`}
                      data={waveforms[patient.id].respiration}
                      color="#ffff00"
                      height={100}
                      speed={1.0}
                      amplitude={1.5}
                      unit="Resp"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Charts - Collapsible */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title="Vital Trends" 
          isExpanded={expandedSections.charts}
          onToggle={() => toggleSection('charts')}
          icon={Activity}
        />
        
        <AnimatePresence>
          {expandedSections.charts && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <RealTimeChart
                    title="Heart Rate Trend"
                    data={chartData.map(d => ({ timestamp: d.timestamp, value: d.heartRate }))}
                    color="#ef4444"
                    unit=" bpm"
                    yAxisMin={40}
                    yAxisMax={140}
                    height={200}
                  />
                  
                  <RealTimeChart
                    title="SpO2 Trend"
                    data={chartData.map(d => ({ timestamp: d.timestamp, value: d.oxygenSaturation }))}
                    color="#3b82f6"
                    unit="%"
                    yAxisMin={85}
                    yAxisMax={100}
                    height={200}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Alerts - Collapsible */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader 
          title={`Recent Alerts (${recentAlerts.length})`}
          isExpanded={expandedSections.alerts}
          onToggle={() => toggleSection('alerts')}
          icon={AlertTriangle}
        />
        
        <AnimatePresence>
          {expandedSections.alerts && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 lg:p-6">
                {recentAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border ${
                          alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.type.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {alert.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 mb-1 line-clamp-2">{alert.message}</p>
                            <div className="text-xs text-gray-600">
                              {alert.vitalType}: {alert.value} (Threshold: {alert.threshold})
                            </div>
                          </div>
                          
                          <div className="ml-3 flex-shrink-0">
                            {alert.acknowledged ? (
                              <span className="text-green-600 text-xs">✓ Ack</span>
                            ) : (
                              <span className="text-red-600 text-xs">⚠ New</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">No Recent Alerts</h3>
                    <p className="text-gray-600 text-sm">This patient has no recent alerts.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <button
          onClick={() => navigate(`/patients/${patient.id}/history`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>View Full History</span>
        </button>
        
        <button
          onClick={() => navigate(`/patients/${patient.id}/advanced`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Advanced Monitoring</span>
        </button>

        <button
          onClick={() => navigate(`/patients/${patient.id}/ai`)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>AI Monitoring</span>
        </button>
      </div>
    </div>
  )
}

export default PatientDetails