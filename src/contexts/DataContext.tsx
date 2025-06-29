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

    // Initialize waveforms based on initial vitals
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

  // Generate realistic ECG waveform based on actual heart rate
  const generateECGWaveform = (length: number, heartRate: number) => {
    const waveform = []
    const sampleRate = 250 // 250 Hz sampling rate
    const samplesPerBeat = Math.round((60 / heartRate) * sampleRate)
    const totalBeats = Math.ceil(length / samplesPerBeat)
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const beatStart = beat * samplesPerBeat
      
      // Add heart rate variability (realistic variation)
      const hrv = 1 + (Math.random() - 0.5) * 0.08 // ±4% variation
      const adjustedSamplesPerBeat = Math.round(samplesPerBeat * hrv)
      
      for (let i = 0; i < adjustedSamplesPerBeat && (beatStart + i) < length; i++) {
        const t = i / adjustedSamplesPerBeat // Normalized time within beat (0-1)
        let value = 0
        
        // Baseline with slight drift and breathing artifact
        const breathingPhase = (beatStart + i) / (sampleRate * 4) // 4-second breathing cycle
        value += 0.02 * Math.sin(2 * Math.PI * breathingPhase) + (Math.random() - 0.5) * 0.01
        
        // P wave (atrial depolarization) - 0.08-0.12 of cycle
        if (t >= 0.08 && t <= 0.12) {
          const pT = (t - 0.08) / 0.04
          value += 0.12 * Math.sin(Math.PI * pT)
        }
        
        // QRS complex (ventricular depolarization) - 0.16-0.26 of cycle
        else if (t >= 0.16 && t <= 0.26) {
          const qrsT = (t - 0.16) / 0.1
          if (qrsT < 0.2) {
            // Q wave (small negative deflection)
            value -= 0.15 * Math.sin(Math.PI * qrsT / 0.2)
          } else if (qrsT < 0.6) {
            // R wave (large positive deflection)
            const rT = (qrsT - 0.2) / 0.4
            value += 1.0 * Math.sin(Math.PI * rT)
          } else {
            // S wave (negative deflection)
            const sT = (qrsT - 0.6) / 0.4
            value -= 0.3 * Math.sin(Math.PI * sT)
          }
        }
        
        // T wave (ventricular repolarization) - 0.35-0.55 of cycle
        else if (t >= 0.35 && t <= 0.55) {
          const tT = (t - 0.35) / 0.2
          value += 0.2 * Math.sin(Math.PI * tT)
        }
        
        // Adjust amplitude based on heart rate (higher HR = slightly lower amplitude)
        const hrAmplitudeAdjustment = Math.max(0.7, 1 - (heartRate - 60) / 200)
        value *= hrAmplitudeAdjustment
        
        waveform.push(value)
      }
    }
    
    return waveform.slice(0, length)
  }

  // Generate plethysmography waveform based on heart rate and SpO2
  const generatePlethWaveform = (length: number, heartRate: number, spo2: number) => {
    const waveform = []
    const sampleRate = 250
    const samplesPerBeat = Math.round((60 / heartRate) * sampleRate)
    const totalBeats = Math.ceil(length / samplesPerBeat)
    
    // SpO2 directly affects pulse amplitude (lower SpO2 = weaker pulse)
    const spo2AmplitudeMultiplier = Math.max(0.3, (spo2 - 85) / 15) // Scale from 85-100% SpO2
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const beatStart = beat * samplesPerBeat
      
      // Heart rate variability
      const hrv = 1 + (Math.random() - 0.5) * 0.05
      const adjustedSamplesPerBeat = Math.round(samplesPerBeat * hrv)
      
      for (let i = 0; i < adjustedSamplesPerBeat && (beatStart + i) < length; i++) {
        const t = i / adjustedSamplesPerBeat
        let value = 0
        
        // Main pulse wave morphology
        if (t < 0.25) {
          // Systolic upstroke (sharp rise)
          value = Math.pow(Math.sin(Math.PI * t / 0.25 * 0.5), 2) * spo2AmplitudeMultiplier
        } else if (t < 0.4) {
          // Peak and early diastole
          const peakT = (t - 0.25) / 0.15
          value = (1 - 0.2 * peakT) * spo2AmplitudeMultiplier
        } else if (t < 0.55) {
          // Dicrotic notch (aortic valve closure)
          const notchT = (t - 0.4) / 0.15
          value = (0.8 - 0.1 * Math.sin(Math.PI * notchT)) * spo2AmplitudeMultiplier
        } else {
          // Diastolic decay
          const decayT = (t - 0.55) / 0.45
          value = 0.7 * Math.exp(-decayT * 3) * spo2AmplitudeMultiplier
        }
        
        // Add respiratory variation (more pronounced with lower SpO2)
        const respPhase = (beatStart + i) / (sampleRate * 4)
        const respVariation = 0.05 + (1 - spo2 / 100) * 0.1 // More variation with lower SpO2
        value *= (1 + respVariation * Math.sin(2 * Math.PI * respPhase))
        
        // Add realistic noise
        value += (Math.random() - 0.5) * 0.02 * spo2AmplitudeMultiplier
        
        waveform.push(value)
      }
    }
    
    return waveform.slice(0, length)
  }

  // Generate respiration waveform based on actual respiratory rate
  const generateRespirationWaveform = (length: number, respiratoryRate: number) => {
    const waveform = []
    const sampleRate = 250
    const samplesPerBreath = Math.round((60 / respiratoryRate) * sampleRate)
    const totalBreaths = Math.ceil(length / samplesPerBreath)
    
    for (let breath = 0; breath < totalBreaths; breath++) {
      const breathStart = breath * samplesPerBreath
      
      // Add slight respiratory rate variability
      const rrv = 1 + (Math.random() - 0.5) * 0.1 // ±5% variation
      const adjustedSamplesPerBreath = Math.round(samplesPerBreath * rrv)
      
      for (let i = 0; i < adjustedSamplesPerBreath && (breathStart + i) < length; i++) {
        const t = i / adjustedSamplesPerBreath
        let value = 0
        
        // Inspiration phase (0-0.4 of cycle) - active process
        if (t < 0.4) {
          const inspT = t / 0.4
          // Gradual rise with slight acceleration at the end
          value = 0.8 * (inspT + 0.2 * Math.sin(Math.PI * inspT))
        } 
        // Expiration phase (0.4-1.0 of cycle) - passive process
        else {
          const expT = (t - 0.4) / 0.6
          // Exponential decay with slight plateau
          if (expT < 0.3) {
            value = 0.8 * (1 - 0.3 * expT)
          } else {
            value = 0.8 * 0.91 * Math.exp(-(expT - 0.3) * 4)
          }
        }
        
        // Add cardiac artifact (heart beats visible on respiration trace)
        const cardiacPhase = (breathStart + i) / (sampleRate * 60 / heartRate)
        value += 0.015 * Math.sin(2 * Math.PI * cardiacPhase)
        
        // Add slight irregularity based on respiratory rate
        const irregularity = Math.max(0.02, respiratoryRate / 1000) // Higher RR = more irregular
        value += (Math.random() - 0.5) * irregularity
        
        waveform.push(value)
      }
    }
    
    return waveform.slice(0, length)
  }

  // Simulate realistic vital signs updates (every 8-12 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          // More realistic vital sign changes based on patient condition
          let hrChange = (Math.random() - 0.5) * 2
          let spo2Change = (Math.random() - 0.5) * 1
          let tempChange = (Math.random() - 0.5) * 0.1
          let rrChange = (Math.random() - 0.5) * 1
          let bpSysChange = (Math.random() - 0.5) * 3
          let bpDiaChange = (Math.random() - 0.5) * 2

          // Adjust changes based on patient status
          if (patient.status === 'critical') {
            hrChange *= 2 // More variability in critical patients
            spo2Change *= 1.5
            rrChange *= 1.5
          } else if (patient.status === 'warning') {
            hrChange *= 1.3
            spo2Change *= 1.2
          }

          const newVitals = {
            ...patient.vitals,
            heartRate: Math.round(Math.max(40, Math.min(180, patient.vitals.heartRate + hrChange))),
            oxygenSaturation: Math.round(Math.max(80, Math.min(100, patient.vitals.oxygenSaturation + spo2Change))),
            temperature: Math.round((Math.max(94, Math.min(106, patient.vitals.temperature + tempChange)) * 10)) / 10,
            respiratoryRate: Math.round(Math.max(6, Math.min(40, patient.vitals.respiratoryRate + rrChange))),
            bloodPressure: {
              systolic: Math.round(Math.max(70, Math.min(220, patient.vitals.bloodPressure.systolic + bpSysChange))),
              diastolic: Math.round(Math.max(30, Math.min(130, patient.vitals.bloodPressure.diastolic + bpDiaChange)))
            },
            timestamp: new Date()
          }

          // Check for alerts
          checkVitalAlerts(patient.id, newVitals)

          // Determine status based on vital signs
          let status: 'stable' | 'warning' | 'critical' = 'stable'
          if (newVitals.heartRate < 50 || newVitals.heartRate > 120 || 
              newVitals.oxygenSaturation < 90 || newVitals.temperature > 101 ||
              newVitals.respiratoryRate < 8 || newVitals.respiratoryRate > 30) {
            status = 'critical'
          } else if (newVitals.heartRate < 60 || newVitals.heartRate > 100 || 
                     newVitals.oxygenSaturation < 95 || newVitals.temperature > 99.5 ||
                     newVitals.respiratoryRate < 12 || newVitals.respiratoryRate > 25) {
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
    }, 10000) // Update every 10 seconds (realistic for ICU monitoring)

    return () => clearInterval(interval)
  }, [])

  // Update waveforms in real-time based on current vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveforms(prev => {
        const updated = { ...prev }
        
        patients.forEach(patient => {
          if (updated[patient.id]) {
            // Generate new waveform segments based on CURRENT vitals
            const newECGPoints = generateECGWaveform(5, patient.vitals.heartRate)
            const newPlethPoints = generatePlethWaveform(5, patient.vitals.heartRate, patient.vitals.oxygenSaturation)
            const newRespPoints = generateRespirationWaveform(5, patient.vitals.respiratoryRate)
            
            // Shift old data and add new points
            updated[patient.id] = {
              ecg: [...updated[patient.id].ecg.slice(5), ...newECGPoints],
              pleth: [...updated[patient.id].pleth.slice(5), ...newPlethPoints],
              respiration: [...updated[patient.id].respiration.slice(5), ...newRespPoints]
            }
          }
        })
        
        return updated
      })
    }, 100) // Update waveforms every 100ms for smooth real-time display

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