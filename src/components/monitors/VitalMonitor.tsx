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
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-blue-500" />
      default: return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  const colors = getStatusColors()

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className={`p-1 sm:p-1.5 rounded-lg ${colors.bg} ${colors.accent} flex-shrink-0`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-xs sm:text-sm ${colors.text} truncate`}>{title}</h3>
            <div className="flex items-center space-x-1 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${status === 'critical' ? 'pulse-ring' : ''}`} />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1">
        <span className={`text-xl sm:text-2xl font-bold ${colors.text} leading-none`}>{value}</span>
        <span className={`text-xs ${colors.accent} opacity-75`}>{unit}</span>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      <VitalMonitor
        title="Heart Rate"
        value={Math.round(vitals.heartRate)}
        unit="bpm"
        icon={<Heart className="h-3 w-3 sm:h-4 sm:w-4 heartbeat" />}
        status={getHeartRateStatus(vitals.heartRate)}
      />
      
      <VitalMonitor
        title="Blood Pressure"
        value={`${Math.round(vitals.bloodPressure.systolic)}/${Math.round(vitals.bloodPressure.diastolic)}`}
        unit="mmHg"
        icon={<Activity className="h-3 w-3 sm:h-4 sm:w-4" />}
        status={getBPStatus(vitals.bloodPressure.systolic, vitals.bloodPressure.diastolic)}
      />
      
      <VitalMonitor
        title="SpO2"
        value={Math.round(vitals.oxygenSaturation)}
        unit="%"
        icon={<Wind className="h-3 w-3 sm:h-4 sm:w-4" />}
        status={getSpO2Status(vitals.oxygenSaturation)}
      />
      
      <VitalMonitor
        title="Temperature"
        value={vitals.temperature.toFixed(1)}
        unit="°F"
        icon={<Thermometer className="h-3 w-3 sm:h-4 sm:w-4" />}
        status={getTempStatus(vitals.temperature)}
      />
      
      <VitalMonitor
        title="Resp Rate"
        value={Math.round(vitals.respiratoryRate)}
        unit="/min"
        icon={<Wind className="h-3 w-3 sm:h-4 sm:w-4" />}
        status={getRespStatus(vitals.respiratoryRate)}
      />
    </div>
  )
}

export default VitalMonitor