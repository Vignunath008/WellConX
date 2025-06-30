import React from 'react'
import { Heart, Thermometer, Wind, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { VitalSigns } from '../../types/medical'

interface VitalMonitorProps {
  title: string
  value: string | number
  unit: string
  icon: React.ReactNode
  status: 'normal' | 'warning' | 'critical'
  trend?: 'up' | 'down' | 'stable'
}

const VitalMonitor: React.FC<VitalMonitorProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  status, 
  trend = 'stable'
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'critical': 
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          accent: 'text-red-600',
          dot: 'bg-red-500'
        }
      case 'warning': 
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          accent: 'text-amber-600',
          dot: 'bg-amber-500'
        }
      default: 
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          accent: 'text-emerald-600',
          dot: 'bg-emerald-500'
        }
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
      default: return <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
    }
  }

  const colors = getStatusColors()

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-lg sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${colors.bg} ${colors.accent}`}>
            {icon}
          </div>
          <div>
            <h3 className={`font-semibold text-xs sm:text-sm ${colors.text}`}>{title}</h3>
            <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colors.dot} ${status === 'critical' ? 'pulse-ring' : ''}`} />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="flex items-baseline space-x-1 sm:space-x-2">
        <span className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>{value}</span>
        <span className={`text-xs sm:text-sm ${colors.accent} opacity-75`}>{unit}</span>
      </div>
    </div>
  )
}

interface VitalMonitorGridProps {
  vitals: VitalSigns
}

export const VitalMonitorGrid: React.FC<VitalMonitorGridProps> = ({ vitals }) => {
  const getHeartRateStatus = (hr: number) => {
    if (hr < 50 || hr > 120) return 'critical'
    if (hr < 60 || hr > 100) return 'warning'
    return 'normal'
  }

  const getSpO2Status = (spo2: number) => {
    if (spo2 < 90) return 'critical'
    if (spo2 < 95) return 'warning'
    return 'normal'
  }

  const getTempStatus = (temp: number) => {
    if (temp < 95 || temp > 101) return 'critical'
    if (temp < 97 || temp > 99.5) return 'warning'
    return 'normal'
  }

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic > 180 || diastolic > 110 || systolic < 90) return 'critical'
    if (systolic > 140 || diastolic > 90) return 'warning'
    return 'normal'
  }

  const getRespStatus = (rr: number) => {
    if (rr < 8 || rr > 30) return 'critical'
    if (rr < 12 || rr > 25) return 'warning'
    return 'normal'
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <VitalMonitor
        title="Heart Rate"
        value={Math.round(vitals.heartRate)}
        unit="bpm"
        icon={<Heart className="h-4 w-4 sm:h-5 sm:w-5 heartbeat" />}
        status={getHeartRateStatus(vitals.heartRate)}
      />
      
      <VitalMonitor
        title="Blood Pressure"
        value={`${Math.round(vitals.bloodPressure.systolic)}/${Math.round(vitals.bloodPressure.diastolic)}`}
        unit="mmHg"
        icon={<Activity className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={getBPStatus(vitals.bloodPressure.systolic, vitals.bloodPressure.diastolic)}
      />
      
      <VitalMonitor
        title="SpO2"
        value={Math.round(vitals.oxygenSaturation)}
        unit="%"
        icon={<Wind className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={getSpO2Status(vitals.oxygenSaturation)}
      />
      
      <VitalMonitor
        title="Temperature"
        value={vitals.temperature.toFixed(1)}
        unit="°F"
        icon={<Thermometer className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={getTempStatus(vitals.temperature)}
      />
      
      <VitalMonitor
        title="Resp Rate"
        value={Math.round(vitals.respiratoryRate)}
        unit="/min"
        icon={<Wind className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={getRespStatus(vitals.respiratoryRate)}
      />
    </div>
  )
}

export default VitalMonitor