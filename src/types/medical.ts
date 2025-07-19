export interface VitalSigns {
  heartRate: number
  bloodPressure: { systolic: number; diastolic: number }
  oxygenSaturation: number
  temperature: number
  respiratoryRate: number
  timestamp: Date
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  room: string
  deviceId?: string
  status: 'stable' | 'critical' | 'warning'
  vitals: VitalSigns
  lastUpdated: Date
  medicalRecordNumber: string
  admissionDate: Date
  diagnosis: string
}

export interface Device {
  id: string
  name: string
  model: string
  brand: 'Philips' | 'GE' | 'Mindray'
  status: 'online' | 'offline' | 'maintenance'
  location: string
  lastHeartbeat: Date
  patientId?: string
  ipAddress: string
  serialNumber: string
  firmwareVersion: string
}

export interface HL7Message {
  messageType: string
  patientId: string
  timestamp: Date
  vitals: Partial<VitalSigns>
  deviceId: string
}

export interface Alert {
  id: string
  patientId: string
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: Date
  acknowledged: boolean
  vitalType: string
  value: number
  threshold: number
}

export interface VitalThresholds {
  heartRate: { min: number; max: number; critical: { min: number; max: number } }
  systolic: { min: number; max: number; critical: { min: number; max: number } }
  diastolic: { min: number; max: number; critical: { min: number; max: number } }
  oxygenSaturation: { min: number; critical: number }
  temperature: { min: number; max: number; critical: { min: number; max: number } }
  respiratoryRate: { min: number; max: number; critical: { min: number; max: number } }
}