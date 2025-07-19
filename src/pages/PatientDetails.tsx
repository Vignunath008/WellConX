import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { VitalMonitorGrid } from '../components/monitors/VitalMonitor'
import LiveWaveform from '../components/charts/LiveWaveform'
import RealTimeChart from '../components/charts/RealTimeChart'
import { 
  ArrowLeft, 
  User, 
  Monitor, 
  Edit, 
  Save, 
  X, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Zap, 
  Brain, 
  Heart, 
  Wind, 
  Thermometer, 
  TrendingUp, 
  FileText, 
  Calendar, 
  MapPin,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PatientDetails: React.FC = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, devices, waveforms, alerts } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [expandedSections, setExpandedSections] = useState<string[]>([])

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h2>
            <p className="text-gray-600 mb-6">The requested patient could not be found.</p>
            <button
              onClick={() => navigate('/iomt/patients')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Patients
            </button>
          </div>
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
      case 'critical': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'vitals', label: 'Vital Signs', icon: Heart },
    { id: 'waveforms', label: 'Waveforms', icon: Monitor },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ]

  const statCards = [
    {
      title: 'Heart Rate',
      value: Math.round(patient.vitals.heartRate),
      unit: 'bpm',
      icon: Heart,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      status: patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60 ? 'warning' : 'normal'
    },
    {
      title: 'Blood Pressure',
      value: `${Math.round(patient.vitals.bloodPressure.systolic)}/${Math.round(patient.vitals.bloodPressure.diastolic)}`,
      unit: 'mmHg',
      icon: Activity,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      status: 'normal'
    },
    {
      title: 'SpO2',
      value: Math.round(patient.vitals.oxygenSaturation),
      unit: '%',
      icon: Wind,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      status: patient.vitals.oxygenSaturation < 95 ? 'warning' : 'normal'
    },
    {
      title: 'Temperature',
      value: patient.vitals.temperature.toFixed(1),
      unit: '°F',
      icon: Thermometer,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      status: patient.vitals.temperature > 99.5 || patient.vitals.temperature < 97 ? 'warning' : 'normal'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/iomt/patients')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
                <p className="text-gray-600">{patient.name} • ID: {patient.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
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
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Room</p>
                <p className="font-semibold text-gray-900">{patient.room}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">MRN</p>
                <p className="font-semibold text-gray-900">{patient.medicalRecordNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Device</p>
                <p className="font-semibold text-gray-900">{patient.deviceId || 'Not assigned'}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Diagnosis */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="text-sm font-medium text-blue-800 mb-1">Diagnosis</div>
            <div className="text-blue-700">{patient.diagnosis}</div>
          </div>

          {/* Device Information */}
          {assignedDevice && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-green-800">Device Status</div>
                <div className={`w-3 h-3 rounded-full ${
                  assignedDevice.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <span className="font-medium">Model:</span> {assignedDevice.model}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {assignedDevice.location}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Data</option>
                <option value="vitals">Vital Signs</option>
                <option value="waveforms">Waveforms</option>
                <option value="alerts">Alerts</option>
                <option value="trends">Trends</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Advanced Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Current Vitals */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900">Current Vitals</h3>
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Heart Rate</span>
                          <span className="font-semibold text-blue-900">{Math.round(patient.vitals.heartRate)} BPM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Blood Pressure</span>
                          <span className="font-semibold text-blue-900">
                            {Math.round(patient.vitals.bloodPressure.systolic)}/{Math.round(patient.vitals.bloodPressure.diastolic)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">SpO2</span>
                          <span className="font-semibold text-blue-900">{Math.round(patient.vitals.oxygenSaturation)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Temperature</span>
                          <span className="font-semibold text-blue-900">{patient.vitals.temperature.toFixed(1)}°F</span>
                        </div>
                      </div>
                    </div>

                    {/* Device Status */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900">Device Status</h3>
                        <Monitor className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Status</span>
                          <span className="font-semibold text-green-900">
                            {assignedDevice ? (assignedDevice.status === 'online' ? 'Online' : 'Offline') : 'Not Assigned'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Model</span>
                          <span className="font-semibold text-green-900">{assignedDevice?.model || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Location</span>
                          <span className="font-semibold text-green-900">{assignedDevice?.location || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Last Update</span>
                          <span className="font-semibold text-green-900">{patient.lastUpdated.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-yellow-900">Recent Alerts</h3>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="space-y-2">
                        {recentAlerts.length > 0 ? (
                          recentAlerts.slice(0, 3).map((alert, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-yellow-900">{alert.message}</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.type}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-yellow-700">No recent alerts</div>
                        )}
                      </div>
                    </div>

                    {/* Health Trends */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900">Health Trends</h3>
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-purple-900">Heart Rate</span>
                          <span className="text-purple-700 ml-2">• Stable</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-purple-900">Blood Pressure</span>
                          <span className="text-purple-700 ml-2">• Normal range</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-purple-900">SpO2</span>
                          <span className="text-purple-700 ml-2">• Optimal</span>
                        </div>
                      </div>
                    </div>

                    {/* Waveform Status */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-indigo-900">Waveform Status</h3>
                        <Monitor className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">ECG</span>
                          <span className="text-indigo-700 ml-2">• Active</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">SpO2</span>
                          <span className="text-indigo-700 ml-2">• Active</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">Respiration</span>
                          <span className="text-indigo-700 ml-2">• Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-rose-900">Quick Actions</h3>
                        <Activity className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="space-y-2">
                        <button className="w-full text-left text-sm">
                          <span className="font-medium text-rose-900">View History</span>
                          <span className="text-rose-700 ml-2">• Full timeline</span>
                        </button>
                        <button className="w-full text-left text-sm">
                          <span className="font-medium text-rose-900">Advanced Monitoring</span>
                          <span className="text-rose-700 ml-2">• AI analysis</span>
                        </button>
                        <button className="w-full text-left text-sm">
                          <span className="font-medium text-rose-900">Export Data</span>
                          <span className="text-rose-700 ml-2">• PDF report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'vitals' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-600 font-medium">Live Data</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Last updated: {patient.lastUpdated.toLocaleTimeString()}
                        </span>
                      </div>
                      <VitalMonitorGrid vitals={patient.vitals} />
                    </div>
                  </div>
                )}

                {activeTab === 'waveforms' && (
                  <div className="space-y-6">
                    {waveforms[patient.id] ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <LiveWaveform
                          title={`ECG (${patient.vitals.heartRate} bpm)`}
                          data={waveforms[patient.id].ecg}
                          color="#00ff00"
                          height={200}
                          speed={1.5}
                          amplitude={1.2}
                          unit="mV"
                        />
                        <LiveWaveform
                          title={`SpO2 (${patient.vitals.oxygenSaturation}%)`}
                          data={waveforms[patient.id].pleth}
                          color="#00ffff"
                          height={200}
                          speed={1.5}
                          amplitude={2.0}
                          unit="SpO2"
                        />
                        <LiveWaveform
                          title={`Resp (${patient.vitals.respiratoryRate}/min)`}
                          data={waveforms[patient.id].respiration}
                          color="#ffff00"
                          height={200}
                          speed={1.0}
                          amplitude={1.5}
                          unit="Resp"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Waveform Data</h3>
                        <p className="text-gray-600">Waveform data is not available for this patient.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'trends' && (
                  <div className="space-y-6">
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

                {activeTab === 'alerts' && (
                  <div className="space-y-4">
                    {patientAlerts.length > 0 ? (
                      patientAlerts.map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{alert.message}</h4>
                                <p className="text-sm text-gray-600">Alerted on {alert.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.type}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                alert.acknowledged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {alert.acknowledged ? 'Acknowledged' : 'Active'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts</h3>
                        <p className="text-gray-600">This patient has no alerts.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate(`/iomt/patients/${patient.id}/history`)}
            className="btn-secondary btn-lg flex-1"
          >
            <Clock className="h-5 w-5" />
            View History
          </button>
          
          <button
            onClick={() => navigate(`/iomt/patients/${patient.id}/advanced`)}
            className="btn-primary btn-lg flex-1"
          >
            <Zap className="h-5 w-5" />
            Advanced Monitoring
          </button>

          <button
            onClick={() => navigate(`/iomt/patients/${patient.id}/ai`)}
            className="btn-success btn-lg flex-1"
          >
            <Brain className="h-5 w-5" />
            AI Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientDetails