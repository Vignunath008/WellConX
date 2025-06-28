import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { motion } from 'framer-motion'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface VitalDataPoint {
  timestamp: Date
  heartRate: number
  oxygenSaturation: number
  temperature: number
  respiratoryRate: number
  systolic: number
  diastolic: number
}

interface MultiVitalChartProps {
  data: VitalDataPoint[]
  selectedVitals: string[]
  height?: number
}

const MultiVitalChart: React.FC<MultiVitalChartProps> = ({
  data,
  selectedVitals,
  height = 400
}) => {
  const vitalConfigs = {
    heartRate: { color: '#ef4444', label: 'Heart Rate (bpm)', yAxisID: 'y' },
    oxygenSaturation: { color: '#3b82f6', label: 'SpO2 (%)', yAxisID: 'y1' },
    temperature: { color: '#f59e0b', label: 'Temperature (°F)', yAxisID: 'y2' },
    respiratoryRate: { color: '#10b981', label: 'Resp Rate (/min)', yAxisID: 'y' },
    systolic: { color: '#8b5cf6', label: 'Systolic (mmHg)', yAxisID: 'y3' },
    diastolic: { color: '#ec4899', label: 'Diastolic (mmHg)', yAxisID: 'y3' }
  }

  const datasets = selectedVitals.map(vital => {
    const config = vitalConfigs[vital as keyof typeof vitalConfigs]
    return {
      label: config.label,
      data: data.map(d => ({
        x: d.timestamp,
        y: d[vital as keyof VitalDataPoint] as number
      })),
      borderColor: config.color,
      backgroundColor: `${config.color}20`,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 6,
      yAxisID: config.yAxisID
    }
  })

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].label)
            return date.toLocaleString()
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        type: 'linear' as const,
        display: selectedVitals.includes('heartRate') || selectedVitals.includes('respiratoryRate'),
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'HR/RR'
        }
      },
      y1: {
        type: 'linear' as const,
        display: selectedVitals.includes('oxygenSaturation'),
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'SpO2 (%)'
        },
        min: 85,
        max: 100
      },
      y2: {
        type: 'linear' as const,
        display: selectedVitals.includes('temperature'),
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Temp (°F)'
        },
        min: 95,
        max: 105
      },
      y3: {
        type: 'linear' as const,
        display: selectedVitals.includes('systolic') || selectedVitals.includes('diastolic'),
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'BP (mmHg)'
        },
        min: 40,
        max: 200
      }
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Multi-Vital Trends</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Line data={{ datasets }} options={options} />
      </div>
    </motion.div>
  )
}

export default MultiVitalChart