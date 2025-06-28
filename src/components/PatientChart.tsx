import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ChartData {
  timestamp: Date
  heartRate: number
  oxygenSaturation: number
  temperature: number
}

interface PatientChartProps {
  data: ChartData[]
  metric: 'heartRate' | 'oxygenSaturation' | 'temperature'
  title: string
  color: string
  unit: string
}

const PatientChart: React.FC<PatientChartProps> = ({ 
  data, 
  metric, 
  title, 
  color, 
  unit 
}) => {
  const formatXAxis = (tickItem: any) => {
    return format(new Date(tickItem), 'HH:mm')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">
            {format(new Date(label), 'MMM dd, HH:mm:ss')}
          </p>
          <p className="text-sm font-medium" style={{ color }}>
            {`${title}: ${payload[0].value}${unit}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            stroke="#666"
          />
          <YAxis stroke="#666" />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey={metric} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PatientChart