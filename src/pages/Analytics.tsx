import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { Download, Filter, Calendar, TrendingUp, TrendingDown, Users, Heart, AlertTriangle, Clock } from 'lucide-react'

const Analytics: React.FC = () => {
  const { patients, devices, alerts } = useData()
  const [dateRange, setDateRange] = useState('7d')
  const [selectedPatient, setSelectedPatient] = useState<string>('all')

  // Generate comprehensive analytics data
  const generatePatientAnalytics = () => {
    const analytics = patients.map(patient => {
      // Generate historical data for the patient
      const history = []
      const now = new Date()
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000) // Hourly data
        history.push({
          timestamp,
          heartRate: Math.round(patient.vitals.heartRate + (Math.random() - 0.5) * 10),
          oxygenSaturation: Math.round(patient.vitals.oxygenSaturation + (Math.random() - 0.5) * 3),
          temperature: Math.round((patient.vitals.temperature + (Math.random() - 0.5) * 0.5) * 10) / 10,
          systolic: Math.round(patient.vitals.bloodPressure.systolic + (Math.random() - 0.5) * 15),
          diastolic: Math.round(patient.vitals.bloodPressure.diastolic + (Math.random() - 0.5) * 10),
          respiratoryRate: Math.round(patient.vitals.respiratoryRate + (Math.random() - 0.5) * 4)
        })
      }

      // Calculate trends
      const calculateTrend = (data: number[]) => {
        if (data.length < 2) return 0
        const recent = data.slice(-6).reduce((a, b) => a + b, 0) / 6
        const previous = data.slice(-12, -6).reduce((a, b) => a + b, 0) / 6
        return ((recent - previous) / previous) * 100
      }

      const hrTrend = calculateTrend(history.map(h => h.heartRate))
      const spo2Trend = calculateTrend(history.map(h => h.oxygenSaturation))
      const tempTrend = calculateTrend(history.map(h => h.temperature))

      // Calculate stability score (lower variance = higher stability)
      const calculateStability = (data: number[]) => {
        const mean = data.reduce((a, b) => a + b, 0) / data.length
        const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length
        return Math.max(0, 100 - variance)
      }

      const stabilityScore = Math.round(
        (calculateStability(history.map(h => h.heartRate)) +
         calculateStability(history.map(h => h.oxygenSaturation)) +
         calculateStability(history.map(h => h.temperature))) / 3
      )

      // Count alerts for this patient
      const patientAlerts = alerts.filter(a => a.patientId === patient.id)
      const criticalAlerts = patientAlerts.filter(a => a.type === 'critical').length
      const warningAlerts = patientAlerts.filter(a => a.type === 'warning').length

      return {
        ...patient,
        history,
        trends: {
          heartRate: hrTrend,
          oxygenSaturation: spo2Trend,
          temperature: tempTrend
        },
        stabilityScore,
        alertCounts: {
          critical: criticalAlerts,
          warning: warningAlerts,
          total: patientAlerts.length
        },
        riskLevel: criticalAlerts > 2 ? 'high' : warningAlerts > 3 ? 'medium' : 'low'
      }
    })

    return analytics
  }

  const patientAnalytics = generatePatientAnalytics()
  const selectedPatientData = selectedPatient === 'all' 
    ? patientAnalytics 
    : patientAnalytics.filter(p => p.id === selectedPatient)

  // Device usage analytics
  const deviceUsageData = [
    { name: 'Philips MP70', patients: 12, hours: 280, efficiency: 95 },
    { name: 'GE DASH 5000', patients: 8, hours: 192, efficiency: 92 },
    { name: 'Mindray T1', patients: 5, hours: 120, efficiency: 88 },
  ]

  // Alert distribution
  const alertsData = [
    { name: 'Critical', value: alerts.filter(a => a.type === 'critical').length, color: '#ef4444' },
    { name: 'Warning', value: alerts.filter(a => a.type === 'warning').length, color: '#f59e0b' },
    { name: 'Info', value: alerts.filter(a => a.type === 'info').length, color: '#3b82f6' },
  ]

  // Vital signs distribution
  const vitalDistribution = patientAnalytics.map(p => ({
    patient: p.name,
    heartRate: p.vitals.heartRate,
    spo2: p.vitals.oxygenSaturation,
    temperature: p.vitals.temperature,
    stabilityScore: p.stabilityScore,
    riskLevel: p.riskLevel
  }))

  // Time-based analytics
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const alertsInHour = alerts.filter(a => a.timestamp.getHours() === hour).length
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      alerts: alertsInHour,
      avgHeartRate: Math.round(70 + Math.sin(hour * 0.3) * 10),
      avgSpO2: Math.round(97 + Math.sin(hour * 0.2) * 2)
    }
  })

  const exportData = () => {
    const data = {
      patients: patientAnalytics,
      devices: deviceUsageData,
      alerts: alertsData,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wellconx-analytics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 2) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend < -2) return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <div className="h-4 w-4" />
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-medical-500 focus:border-medical-500"
          >
            <option value="all">All Patients</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-medical-500 focus:border-medical-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button onClick={exportData} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-medical-600">
                {Math.round(patientAnalytics.reduce((acc, p) => acc + p.stabilityScore, 0) / patientAnalytics.length)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg Stability Score</div>
            </div>
            <Heart className="h-8 w-8 text-medical-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{patients.length}</div>
              <div className="text-sm text-gray-600 mt-1">Active Patients</div>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {alerts.filter(a => !a.acknowledged).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending Alerts</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">2.3min</div>
              <div className="text-sm text-gray-600 mt-1">Avg Response Time</div>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Patient Risk Assessment */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Risk Assessment</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stability Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">HR Trend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">SpO2 Trend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Alerts (24h)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {patientAnalytics.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.room}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            patient.stabilityScore > 80 ? 'bg-green-500' :
                            patient.stabilityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${patient.stabilityScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{patient.stabilityScore}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getTrendIcon(patient.trends.heartRate)}
                      <span className="ml-1 text-sm">{patient.trends.heartRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getTrendIcon(patient.trends.oxygenSaturation)}
                      <span className="ml-1 text-sm">{patient.trends.oxygenSaturation.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-1">
                      {patient.alertCounts.critical > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {patient.alertCounts.critical}C
                        </span>
                      )}
                      {patient.alertCounts.warning > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          {patient.alertCounts.warning}W
                        </span>
                      )}
                      {patient.alertCounts.total === 0 && (
                        <span className="text-green-600 text-xs">None</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                      patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vital Signs Trends */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Vital Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="avgHeartRate" stroke="#ef4444" name="Avg HR" />
              <Line yAxisId="right" type="monotone" dataKey="avgSpO2" stroke="#3b82f6" name="Avg SpO2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Distribution */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertsData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {alertsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Device Efficiency */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#0ea5e9" name="Efficiency %" />
              <Bar dataKey="patients" fill="#06b6d4" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Stability Distribution */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Stability Scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vitalDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="patient" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="stabilityScore" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Patient History */}
      {selectedPatient !== 'all' && selectedPatientData.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed History - {selectedPatientData[0].name}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={selectedPatientData[0].history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate" />
              <Line yAxisId="right" type="monotone" dataKey="oxygenSaturation" stroke="#3b82f6" name="SpO2" />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#f59e0b" name="Temperature" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Analytics