import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { VitalMonitorGrid } from '../components/monitors/VitalMonitor'
import RealTimeChart from '../components/charts/RealTimeChart'
import LiveWaveform from '../components/charts/LiveWaveform'
import { Users, Monitor, AlertTriangle, Activity, Clock, TrendingUp } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { patients, devices, alerts, waveforms } = useData()
  const [chartData, setChartData] = useState<any[]>([])

  // Generate historical chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = []
      const now = new Date()
      
      for (let i = 59; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 1000)
        data.push({
          timestamp,
          heartRate: Math.round(70 + Math.sin(i * 0.1) * 10 + Math.random() * 8),
          oxygenSaturation: Math.round(97 + Math.sin(i * 0.15) * 2 + Math.random() * 2),
          temperature: Math.round((98.6 + Math.sin(i * 0.2) * 0.5 + Math.random() * 0.3) * 10) / 10,
        })
      }
      
      setChartData(data)
    }

    generateChartData()
    const interval = setInterval(generateChartData, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const activePatients = patients.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length

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
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={stat.title} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Monitoring */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patient Monitoring</h2>
            <p className="text-sm text-gray-500">Real-time vital signs and status</p>
          </div>
          <button className="btn-secondary">
            <Activity className="h-4 w-4 mr-2" />
            View All Patients
          </button>
        </div>

        {patients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{patient.age}y {patient.gender}</span>
                    <span>•</span>
                    <span>{patient.room}</span>
                    <span>•</span>
                    <span>{patient.deviceId}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{patient.diagnosis}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                  patient.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {patient.status.toUpperCase()}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-ring" />
                  <span className="text-sm text-gray-500 font-medium">Live</span>
                </div>
              </div>
            </div>
            
            <VitalMonitorGrid vitals={patient.vitals} />
            
            {/* Live Waveforms */}
            {waveforms[patient.id] && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Waveforms</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <LiveWaveform
                    title="ECG Lead II"
                    data={waveforms[patient.id].ecg}
                    color="#00ff00"
                    height={120}
                    speed={3}
                    amplitude={1.2}
                    unit="mV"
                  />
                  <LiveWaveform
                    title="Plethysmography"
                    data={waveforms[patient.id].pleth}
                    color="#00ffff"
                    height={120}
                    speed={2}
                    amplitude={1}
                    unit="SpO2"
                  />
                  <LiveWaveform
                    title="Respiration"
                    data={waveforms[patient.id].respiration}
                    color="#ffff00"
                    height={120}
                    speed={1}
                    amplitude={0.8}
                    unit="Resp"
                  />
                </div>
              </div>
            )}
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {patient.lastUpdated.toLocaleTimeString()}
              </div>
              <div className="flex space-x-3">
                <button className="btn-secondary text-sm">View History</button>
                <button className="btn-primary text-sm">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    </div>
  )
}

export default Dashboard