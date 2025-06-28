import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

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

interface RealTimeChartProps {
  title: string
  data: Array<{ timestamp: Date; value: number }>
  color: string
  unit: string
  yAxisMin?: number
  yAxisMax?: number
  height?: number
  thresholds?: {
    warning?: { min?: number; max?: number }
    critical?: { min?: number; max?: number }
  }
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  title,
  data,
  color,
  unit,
  yAxisMin,
  yAxisMax,
  height = 300,
  thresholds
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null)

  const chartData: ChartData<'line'> = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: title,
        data: data.map(d => d.value),
        borderColor: color,
        backgroundColor: `${color}10`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }

  // Add threshold lines if provided
  if (thresholds) {
    if (thresholds.warning?.max) {
      chartData.datasets.push({
        label: 'Warning High',
        data: data.map(() => thresholds.warning!.max!),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [8, 4],
        pointRadius: 0,
        fill: false,
      })
    }
    if (thresholds.critical?.max) {
      chartData.datasets.push({
        label: 'Critical High',
        data: data.map(() => thresholds.critical!.max!),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      })
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 0) {
              return `${title}: ${context.parsed.y}${unit}`
            }
            return context.dataset.label || ''
          },
          title: (context) => {
            const date = new Date(context[0].label)
            return date.toLocaleTimeString()
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 6
        }
      },
      y: {
        min: yAxisMin,
        max: yAxisMax,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          callback: (value) => `${value}${unit}`
        }
      }
    }
  }

  useEffect(() => {
    const chart = chartRef.current
    if (chart) {
      chart.update('none')
    }
  }, [data])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">Real-time monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full pulse-ring"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-600 font-medium">Live</span>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  )
}

export default RealTimeChart