import React from 'react'
import { Heart, Thermometer, Wind, Activity } from 'lucide-react'
import { VitalSigns } from '../types/medical'

interface VitalCardProps {
  title: string
  value: string | number
  unit: string
  icon: React.ReactNode
  status: 'normal' | 'warning' | 'critical'
  trend?: 'up' | 'down' | 'stable'
}

const VitalCard: React.FC<VitalCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  status, 
  trend = 'stable' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  return (
    <div className={`vital-card ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <span className="text-xs">{getTrendIcon()}</span>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">{value}</span>
        <span className="ml-1 text-sm opacity-75">{unit}</span>
      </div>
    </div>
  )
}

interface VitalSignsDisplayProps {
  vitals: VitalSigns
}

export const VitalSignsDisplay: React.FC<VitalSignsDisplayProps> = ({ vitals }) => {
  const getHeartRateStatus = (hr: number) => {
    if (hr < 60 || hr > 100) return 'warning'
    if (hr < 50 || hr > 120) return 'critical'
    return 'normal'
  }

  const getSpO2Status = (spo2: number) => {
    if (spo2 < 95) return 'warning'
    if (spo2 < 90) return 'critical'
    return 'normal'
  }

  const getTempStatus = (temp: number) => {
    if (temp < 97 || temp > 99.5) return 'warning'
    if (temp < 95 || temp > 101) return 'critical'
    return 'normal'
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <VitalCard
        title="Heart Rate"
        value={vitals.heartRate}
        unit="bpm"
        icon={<Heart className="h-5 w-5 heartbeat-animation" />}
        status={getHeartRateStatus(vitals.heartRate)}
      />
      
      <VitalCard
        title="Blood Pressure"
        value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
        unit="mmHg"
        icon={<Activity className="h-5 w-5" />}
        status="normal"
      />
      
      <VitalCard
        title="SpO2"
        value={vitals.oxygenSaturation}
        unit="%"
        icon={<Wind className="h-5 w-5" />}
        status={getSpO2Status(vitals.oxygenSaturation)}
      />
      
      <VitalCard
        title="Temperature"
        value={vitals.temperature.toFixed(1)}
        unit="°F"
        icon={<Thermometer className="h-5 w-5" />}
        status={getTempStatus(vitals.temperature)}
      />
    </div>
  )
}

export default VitalCard