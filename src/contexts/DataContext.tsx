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

    // Initialize with some demo alerts
    const demoAlerts: Alert[] = [
      {
        id: 'alert-001',
        patientId: 'PAT-001',
        type: 'warning',
        message: 'Heart rate slightly elevated',
        timestamp: new Date(Date.now() - 300000),
        acknowledged: false,
        vitalType: 'Heart Rate',
        value: 105,
        threshold: 100
      },
      {
        id: 'alert-002',
        patientId: 'PAT-002',
        type: 'critical',
        message: 'Oxygen saturation below critical threshold',
        timestamp: new Date(Date.now() - 600000),
        acknowledged: false,
        vitalType: 'SpO2',
        value: 88,
        threshold: 90
      },
      {
        id: 'alert-003',
        patientId: 'PAT-001',
        type: 'info',
        message: 'Blood pressure reading completed',
        timestamp: new Date(Date.now() - 900000),
        acknowledged: true,
        vitalType: 'Blood Pressure',
        value: 120,
        threshold: 140
      },
      {
        id: 'alert-004',
        patientId: 'PAT-002',
        type: 'warning',
        message: 'Temperature elevated - monitoring required',
        timestamp: new Date(Date.now() - 1200000),
        acknowledged: false,
        vitalType: 'Temperature',
        value: 99.8,
        threshold: 99.5
      },
      {
        id: 'alert-005',
        patientId: 'PAT-001',
        type: 'critical',
        message: 'Bradycardia detected - immediate attention required',
        timestamp: new Date(Date.now() - 1800000),
        acknowledged: true,
        vitalType: 'Heart Rate',
        value: 45,
        threshold: 50
      }
    ]

    setDevices(demoDevices)
    setPatients(demoPatients)
    setAlerts(demoAlerts)

    // Initialize waveforms
    const initialWaveforms: any = {}
    demoPatients.forEach(patient => {
      initialWaveforms[patient.id] = {
        ecg: generateECGWaveform(300, patient.vitals.heartRate),
        pleth: generatePlethWaveform(300, patient.vitals.heartRate, patient.vitals.oxygenSaturation),
        respiration: generateRespirationWaveform(300, patient.vitals.respiratoryRate)
      }
    })
    setWaveforms(initialWaveforms)
  }, [])

  // Generate realistic ECG waveform based on heart rate
  const generateECGWaveform = (length: number, heartRate: number) => {
    const waveform = []
    const samplesPerBeat = Math.round((60 / heartRate) * 250) // 250 samples per second
    const totalBeats = Math.ceil(length / samplesPerBeat)
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const beatStart = beat * samplesPerBeat
      
      for (let i = 0; i < samplesPerBeat && (beatStart + i) < length; i++) {
        const t = i / samplesPerBeat // Normalized time within beat (0-1)
        let value = 0
        
        // Baseline with slight drift
        value += 0.05 * Math.sin(beat * 0.1) + (Math.random() - 0.5) * 0.02
        
        // P wave (0.08-0.12 of cycle)
        if (t >= 0.08 && t <= 0.12) {
          const pT = (t - 0.08) / 0.04
          value += 0.15 * Math.sin(Math.PI * pT)
        }
        
        // QRS complex (0.16-0.26 of cycle)
        else if (t >= 0.16 && t <= 0.26) {
          const qrsT = (t - 0.16) / 0.1
          if (qrsT < 0.2) {
            // Q wave
            value -= 0.2 * Math.sin(Math.PI * qrsT / 0.2)
          } else if (qrsT < 0.6) {
            // R wave
            value += 1.2 * Math.sin(Math.PI * (qrsT - 0.2) / 0.4)
          } else {
            // S wave
            value -= 0.4 * Math.sin(Math.PI * (qrsT - 0.6) / 0.4)
          }
        }
        
        // T wave (0.35-0.55 of cycle)
        else if (t >= 0.35 && t <= 0.55) {
          const tT = (t - 0.35) / 0.2
          value += 0.25 * Math.sin(Math.PI * tT)
        }
        
        // Add heart rate variability
        const hrv = 1 + (Math.random() - 0.5) * 0.05
        value *= hrv
        
        waveform.push(value)
      }
    }
    
    return waveform.slice(0, length)
  }

  // Generate plethysmography waveform based on heart rate and SpO2
  const generatePlethWaveform = (length: number, heartRate: number, spo2: number) => {
    const waveform = []
    const samplesPerBeat = Math.round((60 / heartRate) * 250)
    const totalBeats = Math.ceil(length / samplesPerBeat)
    
    // SpO2 affects amplitude (lower SpO2 = lower amplitude)
    const amplitudeMultiplier = (spo2 / 100) * 0.8 + 0.2
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const beatStart = beat * samplesPerBeat
      
      for (let i = 0; i < samplesPerBeat && (beatStart + i) < length; i++) {
        const t = i / samplesPerBeat
        
        // Main pulse wave (systolic upstroke and diastolic decay)
        let value = 0
        
        if (t < 0.3) {
          // Systolic upstroke
          value = Math.sin(Math.PI * t / 0.3) * amplitudeMultiplier
        } else if (t < 0.6) {
          // Diastolic decay with dicrotic notch
          const decayT = (t - 0.3) / 0.3
          value = Math.exp(-decayT * 2) * amplitudeMultiplier
          
          // Dicrotic notch around 0.4-0.45
          if (t >= 0.4 && t <= 0.45) {
            value *= 0.85
          }
        } else {
          // Baseline
          value = 0.1 * amplitudeMultiplier
        }
        
        // Add respiratory variation (slower modulation)
        const respPhase = (beat * samplesPerBeat + i) / (250 * 4) // 4 second respiratory cycle
        value *= (1 + 0.1 * Math.sin(2 * Math.PI * respPhase))
        
        // Add noise
        value += (Math.random() - 0.5) * 0.05 * amplitudeMultiplier
        
        waveform.push(value)
      }
    }
    
    return waveform.slice(0, length)
  }

  // Generate respiration waveform based on respiratory rate
  const generateRespirationWaveform = (length: number, respiratoryRate: number) => {
    const waveform = []
    const samplesPerBreath = Math.round((60 / respiratoryRate) * 250)
    const totalBreaths = Math.ceil(length / samplesPerBreath)
    
    for (let breath = 0; breath < totalBreaths; breath++) {
      const breathStart = breath * samplesPerBreath
      
      for (let i = 0; i < samplesPerBreath && (breathStart + i) < length; i++) {
        const t = i / samplesPerBreath
        
        // Inspiration (0-0.4) and expiration (0.4-1.0)
        let value = 0
        
        if (t < 0.4) {
          // Inspiration - gradual rise
          value = 0.8 * Math.sin(Math.PI * t / 0.4 * 0.5)
        } else {
          // Expiration - exponential decay
          const expT = (t - 0.4) / 0.6
          value = 0.8 * Math.exp(-expT * 2)
        }
        
        // Add slight irregularity
        value += (Math.random() - 0.5) * 0.05
        
        // Add cardiac artifact (heart beats visible on respiration)
        const cardiacPhase = (breath * samplesPerBreath + i) / (250 * 60 / 75) // Assuming 75 bpm
        value += 0.02 * Math.sin(2 * Math.PI * cardiacPhase)
        
        waveform.push(value)
      }
    }
    
    return waveform.slice(0, length)
  }

  // Simulate realistic vital signs updates (every 5-10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          // More realistic vital sign changes (smaller, gradual changes)
          const newVitals = {
            ...patient.vitals,
            heartRate: Math.round(Math.max(50, Math.min(150, patient.vitals.heartRate + (Math.random() - 0.5) * 2))),
            oxygenSaturation: Math.round(Math.max(85, Math.min(100, patient.vitals.oxygenSaturation + (Math.random() - 0.5) * 1))),
            temperature: Math.round((Math.max(95, Math.min(104, patient.vitals.temperature + (Math.random() - 0.5) * 0.1)) * 10)) / 10,
            respiratoryRate: Math.round(Math.max(8, Math.min(35, patient.vitals.respiratoryRate + (Math.random() - 0.5) * 1))),
            bloodPressure: {
              systolic: Math.round(Math.max(80, Math.min(200, patient.vitals.bloodPressure.systolic + (Math.random() - 0.5) * 3))),
              diastolic: Math.round(Math.max(40, Math.min(120, patient.vitals.bloodPressure.diastolic + (Math.random() - 0.5) * 2)))
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
    }, 7000) // Update every 7 seconds (more realistic)

    return () => clearInterval(interval)
  }, [])

  // Update waveforms based on current vitals (every 200ms for smooth display)
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveforms(prev => {
        const updated = { ...prev }
        
        patients.forEach(patient => {
          if (updated[patient.id]) {
            // Generate new data points based on current vitals
            const newECGPoints = generateECGWaveform(10, patient.vitals.heartRate)
            const newPlethPoints = generatePlethWaveform(10, patient.vitals.heartRate, patient.vitals.oxygenSaturation)
            const newRespPoints = generateRespirationWaveform(10, patient.vitals.respiratoryRate)
            
            updated[patient.id] = {
              ecg: [...updated[patient.id].ecg.slice(10), ...newECGPoints],
              pleth: [...updated[patient.id].pleth.slice(10), ...newPlethPoints],
              respiration: [...updated[patient.id].respiration.slice(10), ...newRespPoints]
            }
          }
        })
        
        return updated
      })
    }, 200) // Update waveforms every 200ms

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