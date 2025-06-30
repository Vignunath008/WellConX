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
          bg: 'bg-alert-50',
          border: 'border-alert-200',
          text: 'text-alert-700',
          accent: 'text-alert-600',
          dot: 'bg-alert-500'
        }
      default: 
        return {
          bg: 'bg-health-50',
          border: 'border-health-200',
          text: 'text-health-700',
          accent: 'text-health-600',
          dot: 'bg-health-500'
        }
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-primary-500" />
      default: return <Minus className="h-3 w-3 text-text-light" />
    }
  }

  const colors = getStatusColors()

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-medical p-2.5 sm:p-3 transition-all duration-300 hover:shadow-soft`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 min-w-0 flex-1">
          <div className={`p-1 rounded ${colors.bg} ${colors.accent} flex-shrink-0`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-xs ${colors.text} truncate`}>{title}</h3>
            <div className="flex items-center space-x-1 mt-0.5">
              <div className={`w-1 h-1 rounded-full ${colors.dot} ${status === 'critical' ? 'pulse-ring' : ''}`} />
              <span className="text-xs text-text-secondary font-medium">Live</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1">
        <span className={`text-lg sm:text-xl font-bold ${colors.text} leading-none`}>{value}</span>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      <VitalMonitor
        title="Heart Rate"
        value={Math.round(vitals.heartRate)}
        unit="bpm"
        icon={<Heart className="h-3 w-3 heartbeat" />}
        status={getHeartRateStatus(vitals.heartRate)}
      />
      
      <VitalMonitor
        title="Blood Pressure"
        value={`${Math.round(vitals.bloodPressure.systolic)}/${Math.round(vitals.bloodPressure.diastolic)}`}
        unit="mmHg"
        icon={<Activity className="h-3 w-3" />}
        status={getBPStatus(vitals.bloodPressure.systolic, vitals.bloodPressure.diastolic)}
      />
      
      <VitalMonitor
        title="SpO2"
        value={Math.round(vitals.oxygenSaturation)}
        unit="%"
        icon={<Wind className="h-3 w-3" />}
        status={getSpO2Status(vitals.oxygenSaturation)}
      />
      
      <VitalMonitor
        title="Temperature"
        value={vitals.temperature.toFixed(1)}
        unit="°F"
        icon={<Thermometer className="h-3 w-3" />}
        status={getTempStatus(vitals.temperature)}
      />
      
      <VitalMonitor
        title="Resp Rate"
        value={Math.round(vitals.respiratoryRate)}
        unit="/min"
        icon={<Wind className="h-3 w-3" />}
        status={getRespStatus(vitals.respiratoryRate)}
      />
    </div>
  )
}

export default VitalMonitor