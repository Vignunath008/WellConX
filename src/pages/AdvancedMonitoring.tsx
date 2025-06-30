import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { ArrowLeft, Activity, Heart, Wind, Thermometer, Download, Maximize2, Minimize2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

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
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, waveforms } = useData()
  const [selectedParameter, setSelectedParameter] = useState('heartRate')
  const [timeScale, setTimeScale] = useState('10s') // 10s, 30s, 1m, 5m
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [waveformData, setWaveformData] = useState<any>({})
  const [parameterData, setParameterData] = useState<any>({})

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

  useEffect(() => {
    if (!patient) return

    // Generate high-precision real-time data
    const generatePreciseData = () => {
      const now = new Date()
      const dataPoints = timeScale === '10s' ? 100 : timeScale === '30s' ? 300 : timeScale === '1m' ? 600 : 3000
      const interval = timeScale === '10s' ? 100 : timeScale === '30s' ? 100 : timeScale === '1m' ? 100 : 100 // milliseconds

      const newParameterData: any = {}
      
      parameters.forEach(param => {
        const baseValue = param.id === 'systolic' ? patient.vitals.bloodPressure.systolic :
                         param.id === 'diastolic' ? patient.vitals.bloodPressure.diastolic :
                         patient.vitals[param.id as keyof typeof patient.vitals] as number

        const data = []
        
        for (let i = dataPoints; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * interval)
          
          // Generate realistic variations with physiological patterns
          let value = baseValue
          
          if (param.id === 'heartRate') {
            // Heart rate variability with respiratory sinus arrhythmia
            const respiratoryPhase = (i * interval / 1000) * (patient.vitals.respiratoryRate / 60) * 2 * Math.PI
            const hrv = 1 + 0.05 * Math.sin(respiratoryPhase) // 5% variation due to breathing
            const randomVariation = 1 + (Math.random() - 0.5) * 0.02 // 2% random variation
            value = baseValue * hrv * randomVariation
          } else if (param.id === 'oxygenSaturation') {
            // SpO2 with slight respiratory variation
            const respiratoryPhase = (i * interval / 1000) * (patient.vitals.respiratoryRate / 60) * 2 * Math.PI
            const respVariation = 0.5 * Math.sin(respiratoryPhase)
            const randomVariation = (Math.random() - 0.5) * 0.3
            value = baseValue + respVariation + randomVariation
          } else if (param.id === 'temperature') {
            // Temperature with very slow drift
            const drift = 0.1 * Math.sin((i * interval / 1000) / 300) // 5-minute cycle
            const randomVariation = (Math.random() - 0.5) * 0.05
            value = baseValue + drift + randomVariation
          } else if (param.id === 'systolic' || param.id === 'diastolic') {
            // Blood pressure with cardiac cycle variation
            const cardiacPhase = (i * interval / 1000) * (patient.vitals.heartRate / 60) * 2 * Math.PI
            const cardiacVariation = param.id === 'systolic' ? 2 * Math.sin(cardiacPhase) : 1 * Math.sin(cardiacPhase)
            const randomVariation = (Math.random() - 0.5) * 1
            value = baseValue + cardiacVariation + randomVariation
          } else if (param.id === 'respiratoryRate') {
            // Respiratory rate with natural variation
            const variation = (Math.random() - 0.5) * 0.5
            value = baseValue + variation
          }

          // Apply precision
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
          time: index * 4, // 4ms per sample (250 Hz)
          value: value,
          amplitude: Math.abs(value),
          rPeak: value > 0.8 // Detect R peaks
        })),
        pleth: waveforms[patient.id].pleth.map((value: number, index: number) => ({
          time: index * 4,
          value: value,
          amplitude: Math.abs(value),
          pulse: value > 0.5 // Detect pulse peaks
        })),
        respiration: waveforms[patient.id].respiration.map((value: number, index: number) => ({
          time: index * 4,
          value: value,
          amplitude: Math.abs(value),
          inspiration: value > 0.3 // Detect inspiration phases
        }))
      }

      setWaveformData(enhancedWaveforms)
    }

    generatePreciseData()
    generateEnhancedWaveforms()

    // Update data every 100ms for real-time precision
    const interval = setInterval(() => {
      generatePreciseData()
      generateEnhancedWaveforms()
    }, 100)

    return () => clearInterval(interval)
  }, [patient, timeScale, parameters])

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Patient Not Found</h2>
          <button
            onClick={() => navigate('/patients')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical"
          >
            Back to Patients
          </button>
        </div>
      </div>
    )
  }

  const selectedParam = parameters.find(p => p.id === selectedParameter)!
  const currentData = parameterData[selectedParameter] || []
  const currentValue = currentData.length > 0 ? currentData[currentData.length - 1]?.value : 0

  const getParameterStatus = (value: number, param: ParameterConfig) => {
    if (value < param.criticalRange.min || value > param.criticalRange.max) return 'critical'
    if (value < param.normalRange.min || value > param.normalRange.max) return 'warning'
    return 'normal'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-alert-600 bg-alert-50 border-alert-200'
      default: return 'text-health-600 bg-health-50 border-health-200'
    }
  }

  const exportData = () => {
    const exportData = {
      patient: patient.name,
      timestamp: new Date().toISOString(),
      timeScale,
      parameters: parameterData,
      waveforms: waveformData,
      currentValues: parameters.map(p => ({
        parameter: p.name,
        value: parameterData[p.id]?.[parameterData[p.id]?.length - 1]?.value || 0,
        unit: p.unit,
        status: getParameterStatus(parameterData[p.id]?.[parameterData[p.id]?.length - 1]?.value || 0, p)
      }))
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${patient.name.replace(/\s+/g, '_')}_advanced_monitoring_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background-card bg-opacity-90 text-text-primary p-3 rounded-medical border border-border-light shadow-soft text-sm">
          <p className="font-medium">{new Date(label).toLocaleTimeString()}</p>
          <p className="text-primary-600">
            {selectedParam.name}: {payload[0].value.toFixed(selectedParam.precision)} {selectedParam.unit}
          </p>
          <p className={`text-xs ${data.isCritical ? 'text-red-600' : data.isNormal ? 'text-health-600' : 'text-alert-600'}`}>
            Status: {data.isCritical ? 'Critical' : data.isNormal ? 'Normal' : 'Warning'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background-primary' : ''} space-y-6`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isFullscreen ? 'text-text-primary p-6' : ''}`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/patients/${patient.id}`)}
            className={`p-2 rounded-medical transition-colors ${isFullscreen ? 'hover:bg-background-hover text-text-primary' : 'hover:bg-background-hover'}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
              Advanced Monitoring - {patient.name}
            </h1>
            <p className={`${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
              Real-time parameter analysis with precision monitoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeScale}
            onChange={(e) => setTimeScale(e.target.value)}
            className={`px-3 py-2 border rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isFullscreen ? 'bg-background-card text-text-primary border-border-light' : 'border-border-light'
            }`}
          >
            <option value="10s">10 seconds</option>
            <option value="30s">30 seconds</option>
            <option value="1m">1 minute</option>
            <option value="5m">5 minutes</option>
          </select>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-medical transition-colors ${
              isFullscreen ? 'hover:bg-background-hover text-text-primary' : 'hover:bg-background-hover'
            }`}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          
          <button
            onClick={exportData}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 ${isFullscreen ? 'px-6' : ''}`}>
        {/* Parameter Selection */}
        <div className={`${isFullscreen ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
          <div className={`rounded-card p-6 border shadow-soft ${isFullscreen ? 'bg-background-card border-border-light' : 'bg-background-card border-border-light'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
              Parameters
            </h2>
            
            <div className="space-y-3">
              {parameters.map((param) => {
                const currentVal = parameterData[param.id]?.[parameterData[param.id]?.length - 1]?.value || 0
                const status = getParameterStatus(currentVal, param)
                const Icon = param.icon
                
                return (
                  <button
                    key={param.id}
                    onClick={() => setSelectedParameter(param.id)}
                    className={`w-full p-4 rounded-medical border-2 transition-all text-left ${
                      selectedParameter === param.id
                        ? isFullscreen 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-primary-500 bg-primary-50'
                        : isFullscreen
                          ? 'border-border-light hover:border-border-medium bg-background-card'
                          : 'border-border-light hover:border-border-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`} style={{ color: param.color }} />
                        <span className={`text-sm font-medium ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                          {param.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-xl font-bold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                        {currentVal.toFixed(param.precision)}
                      </span>
                      <span className={`text-sm ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                        {param.unit}
                      </span>
                    </div>
                    
                    <div className={`text-xs mt-1 ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                      Normal: {param.normalRange.min}-{param.normalRange.max} {param.unit}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className={`${isFullscreen ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className={`rounded-card p-6 border shadow-soft ${isFullscreen ? 'bg-background-card border-border-light' : 'bg-background-card border-border-light'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <selectedParam.icon className="h-6 w-6" style={{ color: selectedParam.color }} />
                <div>
                  <h2 className={`text-lg font-semibold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                    {selectedParam.name} - Precision Monitoring
                  </h2>
                  <p className={`text-sm ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    Real-time data with {selectedParam.precision === 0 ? 'integer' : `${selectedParam.precision} decimal`} precision
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-3xl font-bold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`} style={{ color: selectedParam.color }}>
                  {currentValue.toFixed(selectedParam.precision)}
                </div>
                <div className={`text-sm ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  {selectedParam.unit}
                </div>
              </div>
            </div>
            
            <div style={{ height: isFullscreen ? '500px' : '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isFullscreen ? '#E1E5E9' : '#E1E5E9'} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    stroke={isFullscreen ? '#607D8B' : '#607D8B'}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']}
                    stroke={isFullscreen ? '#607D8B' : '#607D8B'}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Normal range */}
                  <ReferenceLine 
                    y={selectedParam.normalRange.min} 
                    stroke="#43A047" 
                    strokeDasharray="5 5" 
                    label="Normal Min"
                  />
                  <ReferenceLine 
                    y={selectedParam.normalRange.max} 
                    stroke="#43A047" 
                    strokeDasharray="5 5" 
                    label="Normal Max"
                  />
                  
                  {/* Critical range */}
                  <ReferenceLine 
                    y={selectedParam.criticalRange.min} 
                    stroke="#ef4444" 
                    strokeDasharray="2 2" 
                    label="Critical Min"
                  />
                  <ReferenceLine 
                    y={selectedParam.criticalRange.max} 
                    stroke="#ef4444" 
                    strokeDasharray="2 2" 
                    label="Critical Max"
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={selectedParam.color}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, stroke: selectedParam.color, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Waveforms */}
      {waveformData.ecg && (
        <div className={`${isFullscreen ? 'px-6' : ''}`}>
          <div className={`rounded-card p-6 border shadow-soft ${isFullscreen ? 'bg-background-card border-border-light' : 'bg-background-card border-border-light'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
              Enhanced Waveform Analysis
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ECG Waveform */}
              <div className={`p-4 rounded-medical ${isFullscreen ? 'bg-background-hover' : 'bg-background-hover'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                    ECG Lead II
                  </h3>
                  <div className={`text-sm ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    {patient.vitals.heartRate} bpm
                  </div>
                </div>
                
                <div className="h-32 bg-black rounded-medical relative overflow-hidden">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="ecg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00ff0020" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#ecg-grid)" />
                    
                    <polyline
                      fill="none"
                      stroke="#00ff00"
                      strokeWidth="2"
                      points={waveformData.ecg.slice(-100).map((point: any, index: number) => 
                        `${(index / 100) * 100}%,${50 + point.value * 30}%`
                      ).join(' ')}
                    />
                  </svg>
                  
                  {/* Sweep line */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-white opacity-80 animate-pulse" />
                </div>
                
                <div className={`mt-2 text-xs ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  R-R Interval: {(60000 / patient.vitals.heartRate).toFixed(0)}ms
                </div>
              </div>

              {/* Plethysmography */}
              <div className={`p-4 rounded-medical ${isFullscreen ? 'bg-background-hover' : 'bg-background-hover'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                    Plethysmography
                  </h3>
                  <div className={`text-sm ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    {patient.vitals.oxygenSaturation}%
                  </div>
                </div>
                
                <div className="h-32 bg-black rounded-medical relative overflow-hidden">
                  <svg className="w-full h-full">
                    <rect width="100%" height="100%" fill="url(#ecg-grid)" />
                    
                    <polyline
                      fill="none"
                      stroke="#00ffff"
                      strokeWidth="2"
                      points={waveformData.pleth.slice(-100).map((point: any, index: number) => 
                        `${(index / 100) * 100}%,${70 + point.value * 20}%`
                      ).join(' ')}
                    />
                  </svg>
                  
                  <div className="absolute top-0 right-0 w-1 h-full bg-cyan-400 opacity-80 animate-pulse" />
                </div>
                
                <div className={`mt-2 text-xs ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  Perfusion Index: {(Math.random() * 5 + 1).toFixed(1)}%
                </div>
              </div>

              {/* Respiration */}
              <div className={`p-4 rounded-medical ${isFullscreen ? 'bg-background-hover' : 'bg-background-hover'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                    Respiration
                  </h3>
                  <div className={`text-sm ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    {patient.vitals.respiratoryRate}/min
                  </div>
                </div>
                
                <div className="h-32 bg-black rounded-medical relative overflow-hidden">
                  <svg className="w-full h-full">
                    <rect width="100%" height="100%" fill="url(#ecg-grid)" />
                    
                    <polyline
                      fill="none"
                      stroke="#ffff00"
                      strokeWidth="2"
                      points={waveformData.respiration.slice(-100).map((point: any, index: number) => 
                        `${(index / 100) * 100}%,${50 + point.value * 25}%`
                      ).join(' ')}
                    />
                  </svg>
                  
                  <div className="absolute top-0 right-0 w-1 h-full bg-yellow-400 opacity-80 animate-pulse" />
                </div>
                
                <div className={`mt-2 text-xs ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  I:E Ratio: 1:{(4000 / patient.vitals.respiratoryRate / 1000).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parameter Statistics */}
      <div className={`${isFullscreen ? 'px-6 pb-6' : ''}`}>
        <div className={`rounded-card p-6 border shadow-soft ${isFullscreen ? 'bg-background-card border-border-light' : 'bg-background-card border-border-light'}`}>
          <h2 className={`text-lg font-semibold mb-6 ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
            Statistical Analysis - {selectedParam.name}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {currentData.length > 0 && (() => {
              const values = currentData.map((d: any) => d.value)
              const min = Math.min(...values)
              const max = Math.max(...values)
              const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length
              const variance = values.reduce((a: number, b: number) => a + Math.pow(b - avg, 2), 0) / values.length
              const stdDev = Math.sqrt(variance)
              const cv = (stdDev / avg) * 100 // Coefficient of variation
              
              return [
                { label: 'Current', value: currentValue.toFixed(selectedParam.precision), unit: selectedParam.unit },
                { label: 'Average', value: avg.toFixed(selectedParam.precision), unit: selectedParam.unit },
                { label: 'Minimum', value: min.toFixed(selectedParam.precision), unit: selectedParam.unit },
                { label: 'Maximum', value: max.toFixed(selectedParam.precision), unit: selectedParam.unit },
                { label: 'Std Dev', value: stdDev.toFixed(selectedParam.precision + 1), unit: selectedParam.unit },
                { label: 'CV', value: cv.toFixed(1), unit: '%' }
              ].map((stat, index) => (
                <div key={index} className={`p-3 rounded-medical ${isFullscreen ? 'bg-background-hover' : 'bg-background-hover'}`}>
                  <div className={`text-xs ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'} mb-1`}>
                    {stat.label}
                  </div>
                  <div className={`text-lg font-bold ${isFullscreen ? 'text-text-primary' : 'text-text-primary'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${isFullscreen ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    {stat.unit}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedMonitoring