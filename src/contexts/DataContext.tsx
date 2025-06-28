import React, { createContext, useContext, useState, useEffect } from 'react'
import { VitalSigns, Patient, Device, Alert, HL7Message } from '../types/medical'

interface DataContextType {
  patients: Patient[]
  devices: Device[]
  alerts: Alert[]
  isConnected: boolean
  waveforms: {
    [patientId: string]: {
      ecg: number[]
      pleth: number[]
      respiration: number[]
    }
  }
  updatePatientVitals: (patientId: string, vitals: VitalSigns) => void
  acknowledgeAlert: (alertId: string) => void
  dismissAlert: (alertId: string) => void
  processHL7Message: (message: HL7Message) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isConnected] = useState(true)
  const [waveforms, setWaveforms] = useState<{
    [patientId: string]: {
      ecg: number[]
      pleth: number[]
      respiration: number[]
    }
  }>({})

  // Initialize demo data
  useEffect(() => {
    const demoDevices: Device[] = [
      {
        id: 'PHI-MP70-001',
        name: 'Philips IntelliVue MP70',
        model: 'MP70',
        brand: 'Philips',
        status: 'online',
        location: 'ICU Room 101',
        lastHeartbeat: new Date(),
        patientId: 'PAT-001',
        ipAddress: '192.168.1.101',
        serialNumber: 'MP70-2024-001',
        firmwareVersion: '5.2.1'
      },
      {
        id: 'GE-DASH-002',
        name: 'GE DASH 5000',
        model: 'DASH 5000',
        brand: 'GE',
        status: 'online',
        location: 'ICU Room 102',
        lastHeartbeat: new Date(),
        patientId: 'PAT-002',
        ipAddress: '192.168.1.102',
        serialNumber: 'GE-2024-002',
        firmwareVersion: '3.1.4'
      },
      {
        id: 'MIN-BM3-003',
        name: 'Mindray BeneView T1',
        model: 'BeneView T1',
        brand: 'Mindray',
        status: 'maintenance',
        location: 'ICU Room 103',
        lastHeartbeat: new Date(Date.now() - 300000),
        ipAddress: '192.168.1.103',
        serialNumber: 'MIN-2024-003',
        firmwareVersion: '2.8.2'
      }
    ]

    const demoPatients: Patient[] = [
      {
        id: 'PAT-001',
        name: 'John Smith',
        age: 65,
        gender: 'male',
        room: 'ICU-101',
        deviceId: 'PHI-MP70-001',
        status: 'stable',
        medicalRecordNumber: 'MRN-001234',
        admissionDate: new Date(Date.now() - 86400000 * 3),
        diagnosis: 'Acute Myocardial Infarction',
        vitals: {
          heartRate: 72,
          bloodPressure: { systolic: 120, diastolic: 80 },
          oxygenSaturation: 98,
          temperature: 98.6,
          respiratoryRate: 16,
          timestamp: new Date()
        },
        lastUpdated: new Date()
      },
      {
        id: 'PAT-002',
        name: 'Maria Garcia',
        age: 45,
        gender: 'female',
        room: 'ICU-102',
        deviceId: 'GE-DASH-002',
        status: 'warning',
        medicalRecordNumber: 'MRN-005678',
        admissionDate: new Date(Date.now() - 86400000 * 1),
        diagnosis: 'Pneumonia with Respiratory Distress',
        vitals: {
          heartRate: 95,
          bloodPressure: { systolic: 140, diastolic: 90 },
          oxygenSaturation: 94,
          temperature: 99.2,
          respiratoryRate: 20,
          timestamp: new Date()
        },
        lastUpdated: new Date()
      }
    ]

    setDevices(demoDevices)
    setPatients(demoPatients)

    // Initialize waveforms
    const initialWaveforms: any = {}
    demoPatients.forEach(patient => {
      initialWaveforms[patient.id] = {
        ecg: generateECGWaveform(200),
        pleth: generatePlethWaveform(200),
        respiration: generateRespirationWaveform(200)
      }
    })
    setWaveforms(initialWaveforms)
  }, [])

  // Generate realistic ECG waveform
  const generateECGWaveform = (length: number) => {
    const waveform = []
    for (let i = 0; i < length; i++) {
      const t = i / 50 // Time scaling
      let value = 0
      
      // P wave
      if (t % 1 < 0.1) {
        value += 0.2 * Math.sin(Math.PI * (t % 1) / 0.1)
      }
      // QRS complex
      else if (t % 1 > 0.15 && t % 1 < 0.25) {
        const qrsT = (t % 1 - 0.15) / 0.1
        if (qrsT < 0.3) value -= 0.3 * Math.sin(Math.PI * qrsT / 0.3)
        else if (qrsT < 0.7) value += 1.5 * Math.sin(Math.PI * (qrsT - 0.3) / 0.4)
        else value -= 0.5 * Math.sin(Math.PI * (qrsT - 0.7) / 0.3)
      }
      // T wave
      else if (t % 1 > 0.4 && t % 1 < 0.6) {
        value += 0.3 * Math.sin(Math.PI * (t % 1 - 0.4) / 0.2)
      }
      
      // Add some noise
      value += (Math.random() - 0.5) * 0.05
      waveform.push(value)
    }
    return waveform
  }

  // Generate plethysmography waveform
  const generatePlethWaveform = (length: number) => {
    const waveform = []
    for (let i = 0; i < length; i++) {
      const t = i / 60 // Slower than ECG
      const value = Math.sin(2 * Math.PI * t) * 0.8 + (Math.random() - 0.5) * 0.1
      waveform.push(value)
    }
    return waveform
  }

  // Generate respiration waveform
  const generateRespirationWaveform = (length: number) => {
    const waveform = []
    for (let i = 0; i < length; i++) {
      const t = i / 20 // Much slower breathing rate
      const value = Math.sin(2 * Math.PI * t) * 0.6 + (Math.random() - 0.5) * 0.05
      waveform.push(value)
    }
    return waveform
  }

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          const newVitals = {
            ...patient.vitals,
            heartRate: Math.round(Math.max(50, Math.min(150, patient.vitals.heartRate + (Math.random() - 0.5) * 6))),
            oxygenSaturation: Math.round(Math.max(85, Math.min(100, patient.vitals.oxygenSaturation + (Math.random() - 0.5) * 3))),
            temperature: Math.round((Math.max(95, Math.min(104, patient.vitals.temperature + (Math.random() - 0.5) * 0.4)) * 10)) / 10,
            respiratoryRate: Math.round(Math.max(8, Math.min(35, patient.vitals.respiratoryRate + (Math.random() - 0.5) * 3))),
            bloodPressure: {
              systolic: Math.round(Math.max(80, Math.min(200, patient.vitals.bloodPressure.systolic + (Math.random() - 0.5) * 8))),
              diastolic: Math.round(Math.max(40, Math.min(120, patient.vitals.bloodPressure.diastolic + (Math.random() - 0.5) * 6)))
            },
            timestamp: new Date()
          }

          // Check for alerts
          checkVitalAlerts(patient.id, newVitals)

          // Determine status
          let status: 'stable' | 'warning' | 'critical' = 'stable'
          if (newVitals.heartRate < 50 || newVitals.heartRate > 120 || 
              newVitals.oxygenSaturation < 90 || newVitals.temperature > 101) {
            status = 'critical'
          } else if (newVitals.heartRate < 60 || newVitals.heartRate > 100 || 
                     newVitals.oxygenSaturation < 95 || newVitals.temperature > 99.5) {
            status = 'warning'
          }

          return {
            ...patient,
            vitals: newVitals,
            status,
            lastUpdated: new Date()
          }
        })
      )

      // Update waveforms in real-time
      setWaveforms(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(patientId => {
          // Shift arrays and add new data points
          updated[patientId] = {
            ecg: [...updated[patientId].ecg.slice(1), ...generateECGWaveform(5)].slice(-200),
            pleth: [...updated[patientId].pleth.slice(1), ...generatePlethWaveform(5)].slice(-200),
            respiration: [...updated[patientId].respiration.slice(1), ...generateRespirationWaveform(5)].slice(-200)
          }
        })
        return updated
      })
    }, 100) // Update every 100ms for smooth waveforms

    return () => clearInterval(interval)
  }, [patients])

  const checkVitalAlerts = (patientId: string, vitals: VitalSigns) => {
    const newAlerts: Alert[] = []

    // Heart Rate alerts
    if (vitals.heartRate < 50) {
      newAlerts.push({
        id: `alert-${Date.now()}-hr-low`,
        patientId,
        type: 'critical',
        message: 'Bradycardia detected - Heart rate critically low',
        timestamp: new Date(),
        acknowledged: false,
        vitalType: 'Heart Rate',
        value: vitals.heartRate,
        threshold: 50
      })
    } else if (vitals.heartRate > 120) {
      newAlerts.push({
        id: `alert-${Date.now()}-hr-high`,
        patientId,
        type: 'critical',
        message: 'Tachycardia detected - Heart rate critically high',
        timestamp: new Date(),
        acknowledged: false,
        vitalType: 'Heart Rate',
        value: vitals.heartRate,
        threshold: 120
      })
    }

    // SpO2 alerts
    if (vitals.oxygenSaturation < 90) {
      newAlerts.push({
        id: `alert-${Date.now()}-spo2`,
        patientId,
        type: 'critical',
        message: 'Severe hypoxemia - Oxygen saturation critically low',
        timestamp: new Date(),
        acknowledged: false,
        vitalType: 'SpO2',
        value: vitals.oxygenSaturation,
        threshold: 90
      })
    }

    // Temperature alerts
    if (vitals.temperature > 101) {
      newAlerts.push({
        id: `alert-${Date.now()}-temp`,
        patientId,
        type: 'critical',
        message: 'High fever detected - Temperature critically elevated',
        timestamp: new Date(),
        acknowledged: false,
        vitalType: 'Temperature',
        value: vitals.temperature,
        threshold: 101
      })
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts])
    }
  }

  const updatePatientVitals = (patientId: string, vitals: VitalSigns) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, vitals, lastUpdated: new Date() }
          : patient
      )
    )
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    )
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const processHL7Message = (message: HL7Message) => {
    // Process incoming HL7 message and update patient vitals
    if (message.vitals) {
      const patient = patients.find(p => p.id === message.patientId)
      if (patient) {
        const updatedVitals = { ...patient.vitals, ...message.vitals, timestamp: message.timestamp }
        updatePatientVitals(message.patientId, updatedVitals)
      }
    }
  }

  return (
    <DataContext.Provider value={{
      patients,
      devices,
      alerts,
      isConnected,
      waveforms,
      updatePatientVitals,
      acknowledgeAlert,
      dismissAlert,
      processHL7Message
    }}>
      {children}
    </DataContext.Provider>
  )
}