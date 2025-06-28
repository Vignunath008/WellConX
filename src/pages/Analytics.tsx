import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Filter } from 'lucide-react'

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d')

  // Sample analytics data
  const deviceUsageData = [
    { name: 'MP70', patients: 12, hours: 280 },
    { name: 'MP60', patients: 8, hours: 192 },
    { name: 'MP50', patients: 5, hours: 120 },
  ]

  const alertsData = [
    { name: 'Critical', value: 3, color: '#ef4444' },
    { name: 'Warning', value: 12, color: '#f59e0b' },
    { name: 'Normal', value: 85, color: '#10b981' },
  ]

  const vitalTrendsData = [
    { time: '00:00', heartRate: 72, spo2: 98, temp: 98.6 },
    { time: '04:00', heartRate: 68, spo2: 97, temp: 98.4 },
    { time: '08:00', heartRate: 75, spo2: 98, temp: 98.8 },
    { time: '12:00', heartRate: 78, spo2: 96, temp: 99.1 },
    { time: '16:00', heartRate: 82, spo2: 97, temp: 98.9 },
    { time: '20:00', heartRate: 76, spo2: 98, temp: 98.7 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center space-x-3">
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
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-medical-600">98.5%</div>
            <div className="text-sm text-gray-600 mt-1">System Uptime</div>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">15</div>
            <div className="text-sm text-gray-600 mt-1">Avg Patients/Day</div>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">2.3min</div>
            <div className="text-sm text-gray-600 mt-1">Avg Response Time</div>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-600 mt-1">Active Alerts</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Usage */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#0ea5e9" name="Patients" />
              <Bar dataKey="hours" fill="#06b6d4" name="Hours" />
            </BarChart>
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
      </div>

      {/* Vital Signs Trends */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Average Vital Signs Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={vitalTrendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="heartRate" fill="#ef4444" name="Heart Rate (bpm)" />
            <Bar dataKey="spo2" fill="#3b82f6" name="SpO2 (%)" />
            <Bar dataKey="temp" fill="#f59e0b" name="Temperature (°F)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { time: '10:30 AM', event: 'Critical alert resolved for Patient John Smith', type: 'success' },
            { time: '10:15 AM', event: 'Device PHI-003 went offline', type: 'error' },
            { time: '09:45 AM', event: 'New patient Maria Garcia admitted to ICU-102', type: 'info' },
            { time: '09:30 AM', event: 'Warning: High heart rate detected for Patient John Smith', type: 'warning' },
            { time: '09:00 AM', event: 'Daily system backup completed successfully', type: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 py-2">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'error' ? 'bg-red-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.event}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics