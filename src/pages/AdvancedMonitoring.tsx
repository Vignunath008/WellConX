import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Download, 
  Maximize2, 
  Minimize2,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Share2,
  Brain,
  Cpu,
  Database,
  Network,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Droplets
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParameterConfig {
  id: string
  name: string
  unit: string
  color: string
  normalRange: { min: number; max: number }
  criticalRange: { min: number; max: number }
  precision: number
  icon: React.ComponentType<any>
}

const AdvancedMonitoring: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { patients, waveforms } = useData()
  const [selectedParameter, setSelectedParameter] = useState('heartRate')
  const [timeScale, setTimeScale] = useState('10s')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [waveformData, setWaveformData] = useState<any>({})
  const [parameterData, setParameterData] = useState<any>({})
  const [selectedTab, setSelectedTab] = useState('overview')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const patient = patients.find(p => p.id === patientId)

  const parameters: ParameterConfig[] = [
    {
      id: 'heartRate',
      name: 'Heart Rate',
      unit: 'bpm',
      color: '#ef4444',
      normalRange: { min: 60, max: 100 },
      criticalRange: { min: 50, max: 120 },
      precision: 0,
      icon: Heart
    },
    {
      id: 'systolic',
      name: 'Systolic BP',
      unit: 'mmHg',
      color: '#8b5cf6',
      normalRange: { min: 90, max: 140 },
      criticalRange: { min: 70, max: 180 },
      precision: 0,
      icon: Activity
    },
    {
      id: 'diastolic',
      name: 'Diastolic BP',
      unit: 'mmHg',
      color: '#ec4899',
      normalRange: { min: 60, max: 90 },
      criticalRange: { min: 40, max: 110 },
      precision: 0,
      icon: Activity
    },
    {
      id: 'oxygenSaturation',
      name: 'SpO2',
      unit: '%',
      color: '#3b82f6',
      normalRange: { min: 95, max: 100 },
      criticalRange: { min: 90, max: 100 },
      precision: 1,
      icon: Wind
    },
    {
      id: 'temperature',
      name: 'Temperature',
      unit: '°F',
      color: '#f59e0b',
      normalRange: { min: 97.0, max: 99.5 },
      criticalRange: { min: 95.0, max: 101.0 },
      precision: 1,
      icon: Thermometer
    },
    {
      id: 'respiratoryRate',
      name: 'Respiratory Rate',
      unit: '/min',
      color: '#10b981',
      normalRange: { min: 12, max: 20 },
      criticalRange: { min: 8, max: 30 },
      precision: 0,
      icon: Wind
    }
  ]

  const selectedParam = parameters.find(p => p.id === selectedParameter) || parameters[0]
  const currentData = parameterData[selectedParameter] || []
  const currentValue = currentData.length > 0 ? currentData[currentData.length - 1]?.value || 0 : 0

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'parameters', label: 'Parameters', icon: Target },
    { id: 'waveforms', label: 'Waveforms', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ]

  useEffect(() => {
    if (!patient) return

    // Generate high-precision real-time data
    const generatePreciseData = () => {
      const now = new Date()
      const dataPoints = timeScale === '10s' ? 100 : timeScale === '30s' ? 300 : timeScale === '1m' ? 600 : 3000
      const interval = timeScale === '10s' ? 100 : timeScale === '30s' ? 100 : timeScale === '1m' ? 100 : 100

      const newParameterData: any = {}
      
      parameters.forEach(param => {
        const baseValue = param.id === 'systolic' ? patient.vitals.bloodPressure.systolic :
                         param.id === 'diastolic' ? patient.vitals.bloodPressure.diastolic :
                         patient.vitals[param.id as keyof typeof patient.vitals] as number

        const data = []
        
        for (let i = dataPoints; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * interval)
          
          let value = baseValue
          
          if (param.id === 'heartRate') {
            const respiratoryPhase = (i * interval / 1000) * (patient.vitals.respiratoryRate / 60) * 2 * Math.PI
            const hrv = 1 + 0.05 * Math.sin(respiratoryPhase)
            const randomVariation = 1 + (Math.random() - 0.5) * 0.02
            value = baseValue * hrv * randomVariation
          } else if (param.id === 'oxygenSaturation') {
            const respiratoryPhase = (i * interval / 1000) * (patient.vitals.respiratoryRate / 60) * 2 * Math.PI
            const respVariation = 0.5 * Math.sin(respiratoryPhase)
            const randomVariation = (Math.random() - 0.5) * 0.3
            value = baseValue + respVariation + randomVariation
          } else if (param.id === 'temperature') {
            const drift = 0.1 * Math.sin((i * interval / 1000) / 300)
            const randomVariation = (Math.random() - 0.5) * 0.05
            value = baseValue + drift + randomVariation
          } else if (param.id === 'systolic' || param.id === 'diastolic') {
            const cardiacPhase = (i * interval / 1000) * (patient.vitals.heartRate / 60) * 2 * Math.PI
            const cardiacVariation = param.id === 'systolic' ? 2 * Math.sin(cardiacPhase) : 1 * Math.sin(cardiacPhase)
            const randomVariation = (Math.random() - 0.5) * 1
            value = baseValue + cardiacVariation + randomVariation
          } else if (param.id === 'respiratoryRate') {
            const variation = (Math.random() - 0.5) * 0.5
            value = baseValue + variation
          }

          value = Math.round(value * Math.pow(10, param.precision)) / Math.pow(10, param.precision)
          
          data.push({
            timestamp,
            value,
            isNormal: value >= param.normalRange.min && value <= param.normalRange.max,
            isCritical: value < param.criticalRange.min || value > param.criticalRange.max
          })
        }
        
        newParameterData[param.id] = data
      })

      setParameterData(newParameterData)
    }

    // Generate enhanced waveform data
    const generateEnhancedWaveforms = () => {
      if (!waveforms[patient.id]) return

      const enhancedWaveforms = {
        ecg: waveforms[patient.id].ecg.map((value: number, index: number) => ({
          time: index * 4,
          value: value,
          amplitude: Math.abs(value),
          rPeak: value > 0.8
        })),
        pleth: waveforms[patient.id].pleth.map((value: number, index: number) => ({
          time: index * 4,
          value: value,
          amplitude: Math.abs(value),
          pulse: value > 0.5
        })),
        respiration: waveforms[patient.id].respiration.map((value: number, index: number) => ({
          time: index * 4,
          value: value,
          amplitude: Math.abs(value),
          inspiration: value > 0.3
        }))
      }

      setWaveformData(enhancedWaveforms)
    }

    generatePreciseData()
    generateEnhancedWaveforms()

    const interval = setInterval(() => {
      generatePreciseData()
      generateEnhancedWaveforms()
    }, 100)

    return () => clearInterval(interval)
  }, [patient, timeScale])

  const getParameterStatus = (value: number, param: ParameterConfig) => {
    if (value < param.criticalRange.min || value > param.criticalRange.max) return 'critical'
    if (value < param.normalRange.min || value > param.normalRange.max) return 'warning'
    return 'normal'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const exportData = () => {
    if (!patient) return

    const exportData = {
      patient: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender
      },
      parameters: parameterData,
      waveforms: waveformData,
      exportDate: new Date().toISOString(),
      timeScale
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${patient.name.replace(/\s+/g, '_')}_advanced_monitoring_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                <h1 className="text-2xl font-bold text-gray-900">Advanced Monitoring</h1>
                <p className="text-gray-600">{patient.name} • Precision Health Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Monitoring Active</span>
              </div>
              <select
                value={timeScale}
                onChange={(e) => setTimeScale(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10s">10 seconds</option>
                <option value="30s">30 seconds</option>
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
              </select>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
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
        {/* AI Status Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Engine</h3>
                <p className="text-gray-600">Active & Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Accuracy</h3>
                <p className="text-gray-600">94.2%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                <p className="text-gray-600">0.8s</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Predictions</h3>
                <p className="text-gray-600">2,706</p>
              </div>
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
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      selectedTab === tab.id
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
                key={selectedTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {selectedTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Current Parameter */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900">Current Parameter</h3>
                        <selectedParam.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">{selectedParam.name}</span>
                          <span className="font-semibold text-blue-900">{currentValue.toFixed(selectedParam.precision)} {selectedParam.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getParameterStatus(currentValue, selectedParam))}`}>
                            {getParameterStatus(currentValue, selectedParam).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Normal Range</span>
                          <span className="font-semibold text-blue-900">{selectedParam.normalRange.min}-{selectedParam.normalRange.max} {selectedParam.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* System Performance */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900">System Performance</h3>
                        <Cpu className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-green-900">CPU Usage</span>
                          <span className="text-green-700 ml-2">• 23%</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-green-900">Memory</span>
                          <span className="text-green-700 ml-2">• 1.2GB</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-green-900">Network</span>
                          <span className="text-green-700 ml-2">• 45Mbps</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Alerts */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-yellow-900">Active Alerts</h3>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-yellow-900">Heart Rate</span>
                          <span className="text-yellow-700 ml-2">• Elevated</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-yellow-900">Blood Pressure</span>
                          <span className="text-yellow-700 ml-2">• Normal</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-yellow-900">SpO2</span>
                          <span className="text-yellow-700 ml-2">• Normal</span>
                        </div>
                      </div>
                    </div>

                    {/* Data Quality */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900">Data Quality</h3>
                        <Database className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-purple-900">Signal Quality</span>
                          <span className="text-purple-700 ml-2">• Excellent</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-purple-900">Noise Level</span>
                          <span className="text-purple-700 ml-2">• Low</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-purple-900">Artifact Count</span>
                          <span className="text-purple-700 ml-2">• 2</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-indigo-900">AI Insights</h3>
                        <Brain className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">Trend Analysis</span>
                          <span className="text-indigo-700 ml-2">• Stable</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">Prediction</span>
                          <span className="text-indigo-700 ml-2">• Normal range</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">Risk Level</span>
                          <span className="text-indigo-700 ml-2">• Low</span>
                        </div>
                      </div>
                    </div>

                    {/* Device Status */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-rose-900">Device Status</h3>
                        <Monitor className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">ECG Monitor</span>
                          <span className="text-rose-700 ml-2">• Connected</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">SpO2 Sensor</span>
                          <span className="text-rose-700 ml-2">• Connected</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">BP Cuff</span>
                          <span className="text-rose-700 ml-2">• Standby</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'parameters' && (
                  <div className="space-y-4">
                    {parameters.map((param, index) => {
                      const currentVal = parameterData[param.id]?.[parameterData[param.id]?.length - 1]?.value || 0
                      const status = getParameterStatus(currentVal, param)
                      const Icon = param.icon
                      
                      return (
                        <motion.div
                          key={param.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => toggleExpanded(`param-${param.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{param.name}</h4>
                                <p className="text-sm text-gray-600">Real-time monitoring</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{currentVal.toFixed(param.precision)}</div>
                                <div className="text-sm text-gray-600">{param.unit}</div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                                {status.toUpperCase()}
                              </span>
                              {expandedItems.includes(`param-${param.id}`) ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedItems.includes(`param-${param.id}`) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                              >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{param.normalRange.min}</div>
                                    <div className="text-sm text-gray-600">Normal Min</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{param.normalRange.max}</div>
                                    <div className="text-sm text-gray-600">Normal Max</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-red-600">{param.criticalRange.min}</div>
                                    <div className="text-sm text-gray-600">Critical Min</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-red-600">{param.criticalRange.max}</div>
                                    <div className="text-sm text-gray-600">Critical Max</div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {selectedTab === 'waveforms' && (
                  <div className="space-y-6">
                    {/* ECG Waveform */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">ECG Lead II</h3>
                        <div className="text-sm text-gray-600">{patient.vitals.heartRate} bpm</div>
                      </div>
                      <div className="h-64 bg-black rounded-lg relative overflow-hidden">
                        <svg className="w-full h-full">
                          <defs>
                            <pattern id="ecg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00ff0020" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#ecg-grid)" />
                          
                          {waveformData.ecg && (
                            <polyline
                              fill="none"
                              stroke="#00ff00"
                              strokeWidth="2"
                              points={waveformData.ecg.slice(-200).map((point: any, index: number) => 
                                `${(index / 200) * 100}%,${50 + point.value * 30}%`
                              ).join(' ')}
                            />
                          )}
                        </svg>
                        <div className="absolute top-0 right-0 w-1 h-full bg-white opacity-80 animate-pulse" />
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        R-R Interval: {(60000 / patient.vitals.heartRate).toFixed(0)}ms
                      </div>
                    </div>

                    {/* Plethysmography */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Plethysmography</h3>
                        <div className="text-sm text-gray-600">{patient.vitals.oxygenSaturation}%</div>
                      </div>
                      <div className="h-64 bg-black rounded-lg relative overflow-hidden">
                        <svg className="w-full h-full">
                          <rect width="100%" height="100%" fill="url(#ecg-grid)" />
                          
                          {waveformData.pleth && (
                            <polyline
                              fill="none"
                              stroke="#00ffff"
                              strokeWidth="2"
                              points={waveformData.pleth.slice(-200).map((point: any, index: number) => 
                                `${(index / 200) * 100}%,${70 + point.value * 20}%`
                              ).join(' ')}
                            />
                          )}
                        </svg>
                        <div className="absolute top-0 right-0 w-1 h-full bg-cyan-400 opacity-80 animate-pulse" />
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Perfusion Index: {(Math.random() * 5 + 1).toFixed(1)}%
                      </div>
                    </div>

                    {/* Respiration */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Respiration</h3>
                        <div className="text-sm text-gray-600">{patient.vitals.respiratoryRate}/min</div>
                      </div>
                      <div className="h-64 bg-black rounded-lg relative overflow-hidden">
                        <svg className="w-full h-full">
                          <rect width="100%" height="100%" fill="url(#ecg-grid)" />
                          
                          {waveformData.respiration && (
                            <polyline
                              fill="none"
                              stroke="#ffff00"
                              strokeWidth="2"
                              points={waveformData.respiration.slice(-200).map((point: any, index: number) => 
                                `${(index / 200) * 100}%,${50 + point.value * 25}%`
                              ).join(' ')}
                            />
                          )}
                        </svg>
                        <div className="absolute top-0 right-0 w-1 h-full bg-yellow-400 opacity-80 animate-pulse" />
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        I:E Ratio: 1:{(4000 / patient.vitals.respiratoryRate / 1000).toFixed(1)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Statistical Analysis */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistical Analysis - {selectedParam.name}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {currentData.length > 0 && (() => {
                          const values = currentData.map((d: any) => d.value)
                          const min = Math.min(...values)
                          const max = Math.max(...values)
                          const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length
                          const variance = values.reduce((a: number, b: number) => a + Math.pow(b - avg, 2), 0) / values.length
                          const stdDev = Math.sqrt(variance)
                          const cv = (stdDev / avg) * 100
                          
                          return [
                            { label: 'Current', value: currentValue.toFixed(selectedParam.precision), unit: selectedParam.unit },
                            { label: 'Average', value: avg.toFixed(selectedParam.precision), unit: selectedParam.unit },
                            { label: 'Minimum', value: min.toFixed(selectedParam.precision), unit: selectedParam.unit },
                            { label: 'Maximum', value: max.toFixed(selectedParam.precision), unit: selectedParam.unit },
                            { label: 'Std Dev', value: stdDev.toFixed(selectedParam.precision + 1), unit: selectedParam.unit },
                            { label: 'CV', value: cv.toFixed(1), unit: '%' }
                          ].map((stat, index) => (
                            <div key={index} className="p-3 rounded-lg bg-gray-50">
                              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                              <div className="text-xs text-gray-600">{stat.unit}</div>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'alerts' && (
                  <div className="space-y-4">
                    {/* Mock alerts */}
                    {[
                      { id: 1, type: 'Heart Rate Elevated', severity: 'moderate', timestamp: '2024-01-15 14:30:00', resolved: false },
                      { id: 2, type: 'Blood Pressure Normal', severity: 'normal', timestamp: '2024-01-15 14:25:00', resolved: true },
                      { id: 3, type: 'SpO2 Stable', severity: 'normal', timestamp: '2024-01-15 14:20:00', resolved: true },
                    ].map((alert, index) => (
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
                              <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                              <p className="text-sm text-gray-600">{alert.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              alert.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {alert.resolved ? 'Resolved' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedMonitoring