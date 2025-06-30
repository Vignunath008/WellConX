import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { ArrowLeft, Calendar, Heart, Thermometer, Wind, Activity, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'

const PatientHistory: React.FC = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, alerts } = useData()
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedVital, setSelectedVital] = useState('all')

  const patient = patients.find(p => p.id === patientId)

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

  // Generate historical data for the patient
  const generateHistoricalData = () => {
    const data = []
    const now = new Date()
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720 // 24h, 7d, 30d
    const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 24 // hourly, 6-hourly, daily

    for (let i = hours; i >= 0; i -= interval) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      
      // Generate realistic variations based on patient status
      const baseHR = patient.vitals.heartRate
      const baseSPO2 = patient.vitals.oxygenSaturation
      const baseTemp = patient.vitals.temperature
      const baseRR = patient.vitals.respiratoryRate
      const baseSys = patient.vitals.bloodPressure.systolic
      const baseDia = patient.vitals.bloodPressure.diastolic

      // Add some realistic variation
      const variation = patient.status === 'critical' ? 0.15 : patient.status === 'warning' ? 0.1 : 0.05
      
      data.push({
        timestamp,
        heartRate: Math.round(baseHR + (Math.random() - 0.5) * baseHR * variation),
        oxygenSaturation: Math.round(baseSPO2 + (Math.random() - 0.5) * baseSPO2 * (variation * 0.5)),
        temperature: Math.round((baseTemp + (Math.random() - 0.5) * baseTemp * (variation * 0.02)) * 10) / 10,
        respiratoryRate: Math.round(baseRR + (Math.random() - 0.5) * baseRR * variation),
        systolic: Math.round(baseSys + (Math.random() - 0.5) * baseSys * variation),
        diastolic: Math.round(baseDia + (Math.random() - 0.5) * baseDia * variation)
      })
    }

    return data.reverse()
  }

  const historicalData = generateHistoricalData()
  const patientAlerts = alerts.filter(a => a.patientId === patient.id)

  const exportData = () => {
    const exportData = {
      patient,
      historicalData,
      alerts: patientAlerts,
      exportDate: new Date().toISOString(),
      timeRange
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${patient.name.replace(/\s+/g, '_')}_history_${timeRange}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatXAxis = (tickItem: any) => {
    const date = new Date(tickItem)
    if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (timeRange === '7d') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getVitalColor = (vital: string) => {
    switch (vital) {
      case 'heartRate': return '#ef4444'
      case 'oxygenSaturation': return '#3b82f6'
      case 'temperature': return '#f59e0b'
      case 'respiratoryRate': return '#10b981'
      case 'systolic': return '#8b5cf6'
      case 'diastolic': return '#ec4899'
      default: return '#6b7280'
    }
  }

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0
    const recent = data.slice(-6).reduce((a, b) => a + b, 0) / 6
    const previous = data.slice(-12, -6).reduce((a, b) => a + b, 0) / 6
    return ((recent - previous) / previous) * 100
  }

  const hrTrend = calculateTrend(historicalData.map(d => d.heartRate))
  const spo2Trend = calculateTrend(historicalData.map(d => d.oxygenSaturation))
  const tempTrend = calculateTrend(historicalData.map(d => d.temperature))

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
            <h1 className="text-2xl font-bold text-gray-900">{patient.name} - Medical History</h1>
            <p className="text-gray-600">
              {patient.age}y {patient.gender} • {patient.room} • MRN: {patient.medicalRecordNumber}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <button
            onClick={exportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Patient Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              patient.status === 'critical' ? 'bg-red-100 text-red-800' :
              patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {patient.status.toUpperCase()}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Diagnosis</h3>
            <p className="text-gray-900">{patient.diagnosis}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Admission Date</h3>
            <p className="text-gray-900">{patient.admissionDate.toLocaleDateString()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Device</h3>
            <p className="text-gray-900">{patient.deviceId || 'Not assigned'}</p>
          </div>
        </div>
      </div>

      {/* Vital Signs Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">Heart Rate</h3>
            </div>
            <div className="flex items-center space-x-1">
              {hrTrend > 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-blue-500" />}
              <span className={`text-sm ${hrTrend > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {Math.abs(hrTrend).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{patient.vitals.heartRate} bpm</div>
          <div className="text-sm text-gray-500">Current reading</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">SpO2</h3>
            </div>
            <div className="flex items-center space-x-1">
              {spo2Trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
              <span className={`text-sm ${spo2Trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(spo2Trend).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{patient.vitals.oxygenSaturation}%</div>
          <div className="text-sm text-gray-500">Current reading</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Temperature</h3>
            </div>
            <div className="flex items-center space-x-1">
              {tempTrend > 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-blue-500" />}
              <span className={`text-sm ${tempTrend > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {Math.abs(tempTrend).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{patient.vitals.temperature}°F</div>
          <div className="text-sm text-gray-500">Current reading</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vital Signs History</h3>
            <select
              value={selectedVital}
              onChange={(e) => setSelectedVital(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Vitals</option>
              <option value="heartRate">Heart Rate</option>
              <option value="oxygenSaturation">SpO2</option>
              <option value="temperature">Temperature</option>
              <option value="respiratoryRate">Respiratory Rate</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value, name) => [value, name]}
              />
              
              {(selectedVital === 'all' || selectedVital === 'heartRate') && (
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke={getVitalColor('heartRate')} 
                  strokeWidth={2}
                  name="Heart Rate (bpm)"
                />
              )}
              
              {(selectedVital === 'all' || selectedVital === 'oxygenSaturation') && (
                <Line 
                  type="monotone" 
                  dataKey="oxygenSaturation" 
                  stroke={getVitalColor('oxygenSaturation')} 
                  strokeWidth={2}
                  name="SpO2 (%)"
                />
              )}
              
              {(selectedVital === 'all' || selectedVital === 'temperature') && (
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke={getVitalColor('temperature')} 
                  strokeWidth={2}
                  name="Temperature (°F)"
                />
              )}
              
              {(selectedVital === 'all' || selectedVital === 'respiratoryRate') && (
                <Line 
                  type="monotone" 
                  dataKey="respiratoryRate" 
                  stroke={getVitalColor('respiratoryRate')} 
                  strokeWidth={2}
                  name="Respiratory Rate (/min)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Pressure Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Blood Pressure History</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value, name) => [value, name]}
              />
              
              <Area 
                type="monotone" 
                dataKey="systolic" 
                stackId="1"
                stroke={getVitalColor('systolic')} 
                fill={getVitalColor('systolic')}
                fillOpacity={0.6}
                name="Systolic (mmHg)"
              />
              
              <Area 
                type="monotone" 
                dataKey="diastolic" 
                stackId="2"
                stroke={getVitalColor('diastolic')} 
                fill={getVitalColor('diastolic')}
                fillOpacity={0.6}
                name="Diastolic (mmHg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert History */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Alert History</h3>
        
        {patientAlerts.length > 0 ? (
          <div className="space-y-3">
            {patientAlerts.map((alert) => (
              <div
                key={alert.id}
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
                        {alert.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-1">{alert.message}</p>
                    <div className="text-sm text-gray-600">
                      {alert.vitalType}: {alert.value} (Threshold: {alert.threshold})
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {alert.acknowledged ? (
                      <span className="text-green-600 text-sm">✓ Acknowledged</span>
                    ) : (
                      <span className="text-red-600 text-sm">⚠ Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No alerts recorded</h4>
            <p className="text-gray-600">This patient has no alert history for the selected time period.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientHistory