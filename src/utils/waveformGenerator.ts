/**
 * AI-Driven Vital Waveform Generation System
 * Generates realistic medical waveforms from vital sign readings
 * Based on physiological models and signal processing techniques
 */

export interface VitalReadings {
  heartRate: number
  systolic: number
  diastolic: number
  oxygenSaturation: number
  temperature: number
  respiratoryRate: number
  etCO2?: number
}

export interface WaveformConfig {
  sampleRate: number // Hz (e.g., 250 for ECG, 100 for others)
  duration: number // seconds
  noiseLevel: number // 0-1
  pathologyFactor: number // 0-1 (0 = normal, 1 = severe pathology)
}

export interface GeneratedWaveform {
  data: number[]
  timestamps: number[]
  features: WaveformFeatures
  quality: number // 0-1
}

export interface WaveformFeatures {
  peaks: number[]
  intervals: number[]
  amplitude: number
  frequency: number
  morphology: string
}

/**
 * Advanced ECG Waveform Generator
 * Uses mathematical models to simulate realistic ECG patterns
 */
export class ECGGenerator {
  private config: WaveformConfig
  private vitals: VitalReadings

  constructor(vitals: VitalReadings, config: WaveformConfig) {
    this.vitals = vitals
    this.config = config
  }

  generate(): GeneratedWaveform {
    const { heartRate } = this.vitals
    const { sampleRate, duration, noiseLevel, pathologyFactor } = this.config
    
    const totalSamples = Math.floor(sampleRate * duration)
    const data: number[] = []
    const timestamps: number[] = []
    const peaks: number[] = []
    
    // Calculate heart period in samples
    const heartPeriodSamples = Math.floor((60 / heartRate) * sampleRate)
    
    // Heart Rate Variability (HRV) - realistic variation
    const hrvVariation = 0.05 + (pathologyFactor * 0.1) // 5-15% variation
    
    for (let i = 0; i < totalSamples; i++) {
      const time = i / sampleRate
      timestamps.push(time)
      
      // Apply HRV
      const hrv = 1 + (Math.sin(time * 0.1) * hrvVariation * (Math.random() - 0.5))
      const adjustedPeriod = heartPeriodSamples * hrv
      
      // Position within cardiac cycle (0-1)
      const cyclePosition = (i % adjustedPeriod) / adjustedPeriod
      
      let ecgValue = this.generateECGMorphology(cyclePosition, pathologyFactor)
      
      // Add respiratory modulation (baseline wander)
      const respPhase = (time * this.vitals.respiratoryRate * 2 * Math.PI) / 60
      ecgValue += 0.02 * Math.sin(respPhase)
      
      // Add realistic noise
      ecgValue += (Math.random() - 0.5) * noiseLevel * 0.05
      
      // Detect R peaks
      if (cyclePosition > 0.15 && cyclePosition < 0.25 && ecgValue > 0.8) {
        peaks.push(i)
      }
      
      data.push(ecgValue)
    }
    
    // Calculate intervals (R-R intervals)
    const intervals = peaks.slice(1).map((peak, i) => 
      (peak - peaks[i]) / sampleRate * 1000 // Convert to milliseconds
    )
    
    return {
      data,
      timestamps,
      features: {
        peaks,
        intervals,
        amplitude: Math.max(...data) - Math.min(...data),
        frequency: heartRate / 60,
        morphology: this.classifyMorphology(pathologyFactor)
      },
      quality: this.calculateSignalQuality(data, noiseLevel)
    }
  }

  private generateECGMorphology(t: number, pathology: number): number {
    let value = 0
    
    // P wave (0.08-0.12 of cycle)
    if (t >= 0.08 && t <= 0.12) {
      const pT = (t - 0.08) / 0.04
      value += 0.15 * Math.sin(Math.PI * pT) * (1 - pathology * 0.3)
    }
    
    // QRS complex (0.16-0.26 of cycle)
    else if (t >= 0.16 && t <= 0.26) {
      const qrsT = (t - 0.16) / 0.1
      
      if (qrsT < 0.2) {
        // Q wave
        value -= 0.2 * Math.sin(Math.PI * qrsT / 0.2) * (1 + pathology * 0.5)
      } else if (qrsT < 0.6) {
        // R wave - main deflection
        const rT = (qrsT - 0.2) / 0.4
        const rAmplitude = 1.2 * (1 - pathology * 0.4) // Reduced amplitude in pathology
        value += rAmplitude * Math.sin(Math.PI * rT)
      } else {
        // S wave
        const sT = (qrsT - 0.6) / 0.4
        value -= 0.4 * Math.sin(Math.PI * sT) * (1 + pathology * 0.3)
      }
    }
    
    // T wave (0.35-0.55 of cycle)
    else if (t >= 0.35 && t <= 0.55) {
      const tT = (t - 0.35) / 0.2
      const tAmplitude = 0.25 * (1 - pathology * 0.6) // T wave changes in pathology
      value += tAmplitude * Math.sin(Math.PI * tT)
    }
    
    // Add pathological changes
    if (pathology > 0.3) {
      // ST segment elevation/depression
      if (t >= 0.26 && t <= 0.35) {
        value += (pathology - 0.3) * 0.3 * (Math.random() > 0.5 ? 1 : -1)
      }
      
      // Arrhythmia simulation
      if (Math.random() < pathology * 0.1) {
        value += (Math.random() - 0.5) * 0.5
      }
    }
    
    return value
  }

  private classifyMorphology(pathology: number): string {
    if (pathology < 0.2) return 'Normal Sinus Rhythm'
    if (pathology < 0.4) return 'Mild Abnormalities'
    if (pathology < 0.6) return 'Moderate Abnormalities'
    if (pathology < 0.8) return 'Severe Abnormalities'
    return 'Critical Abnormalities'
  }

  private calculateSignalQuality(data: number[], noiseLevel: number): number {
    // Simple SNR-based quality metric
    const signal = data.filter(x => Math.abs(x) > 0.1)
    const noise = data.filter(x => Math.abs(x) <= 0.1)
    const snr = signal.length / (noise.length + 1)
    return Math.min(1, snr * (1 - noiseLevel))
  }
}

/**
 * Plethysmography (SpO2) Waveform Generator
 * Simulates pulse oximetry waveforms based on heart rate and SpO2
 */
export class PlethysmographyGenerator {
  private config: WaveformConfig
  private vitals: VitalReadings

  constructor(vitals: VitalReadings, config: WaveformConfig) {
    this.vitals = vitals
    this.config = config
  }

  generate(): GeneratedWaveform {
    const { heartRate, oxygenSaturation } = this.vitals
    const { sampleRate, duration, noiseLevel, pathologyFactor } = this.config
    
    const totalSamples = Math.floor(sampleRate * duration)
    const data: number[] = []
    const timestamps: number[] = []
    const peaks: number[] = []
    
    // SpO2 affects pulse amplitude
    const spo2Factor = Math.max(0.3, (oxygenSaturation - 85) / 15)
    const heartPeriodSamples = Math.floor((60 / heartRate) * sampleRate)
    
    for (let i = 0; i < totalSamples; i++) {
      const time = i / sampleRate
      timestamps.push(time)
      
      // HRV for pleth
      const hrv = 1 + (Math.sin(time * 0.15) * 0.03 * (Math.random() - 0.5))
      const adjustedPeriod = heartPeriodSamples * hrv
      
      const cyclePosition = (i % adjustedPeriod) / adjustedPeriod
      
      let plethValue = this.generatePlethMorphology(cyclePosition, spo2Factor, pathologyFactor)
      
      // Respiratory variation (more pronounced with lower SpO2)
      const respPhase = (time * this.vitals.respiratoryRate * 2 * Math.PI) / 60
      const respVariation = 0.05 + (1 - spo2Factor) * 0.1
      plethValue *= (1 + respVariation * Math.sin(respPhase))
      
      // Add noise
      plethValue += (Math.random() - 0.5) * noiseLevel * 0.02 * spo2Factor
      
      // Detect pulse peaks
      if (cyclePosition > 0.1 && cyclePosition < 0.3 && plethValue > 0.7 * spo2Factor) {
        peaks.push(i)
      }
      
      data.push(plethValue)
    }
    
    const intervals = peaks.slice(1).map((peak, i) => 
      (peak - peaks[i]) / sampleRate * 1000
    )
    
    return {
      data,
      timestamps,
      features: {
        peaks,
        intervals,
        amplitude: Math.max(...data) - Math.min(...data),
        frequency: heartRate / 60,
        morphology: this.classifyPlethMorphology(spo2Factor, pathologyFactor)
      },
      quality: this.calculatePerfusionIndex(data, spo2Factor)
    }
  }

  private generatePlethMorphology(t: number, spo2Factor: number, pathology: number): number {
    let value = 0
    
    // Systolic upstroke (sharp rise)
    if (t < 0.25) {
      const upstrokeT = t / 0.25
      value = Math.pow(Math.sin(Math.PI * upstrokeT * 0.5), 2) * spo2Factor
    }
    // Peak and early diastole
    else if (t < 0.4) {
      const peakT = (t - 0.25) / 0.15
      value = (1 - 0.2 * peakT) * spo2Factor
    }
    // Dicrotic notch (aortic valve closure)
    else if (t < 0.55) {
      const notchT = (t - 0.4) / 0.15
      const notchDepth = 0.1 * (1 + pathology * 0.5) // More pronounced in pathology
      value = (0.8 - notchDepth * Math.sin(Math.PI * notchT)) * spo2Factor
    }
    // Diastolic decay
    else {
      const decayT = (t - 0.55) / 0.45
      value = 0.7 * Math.exp(-decayT * 3) * spo2Factor
    }
    
    // Pathological changes
    if (pathology > 0.3) {
      // Irregular pulse morphology
      value *= (1 + (Math.random() - 0.5) * pathology * 0.2)
    }
    
    return Math.max(0, value)
  }

  private classifyPlethMorphology(spo2Factor: number, pathology: number): string {
    if (spo2Factor > 0.9 && pathology < 0.2) return 'Strong Pulse'
    if (spo2Factor > 0.7 && pathology < 0.4) return 'Good Pulse'
    if (spo2Factor > 0.5 && pathology < 0.6) return 'Weak Pulse'
    return 'Poor Perfusion'
  }

  private calculatePerfusionIndex(data: number[], spo2Factor: number): number {
    const ac = Math.max(...data) - Math.min(...data)
    const dc = data.reduce((a, b) => a + b, 0) / data.length
    return (ac / dc) * spo2Factor * 100
  }
}

/**
 * Blood Pressure Waveform Generator
 * Generates arterial pressure waveforms for invasive BP monitoring
 */
export class BloodPressureGenerator {
  private config: WaveformConfig
  private vitals: VitalReadings

  constructor(vitals: VitalReadings, config: WaveformConfig) {
    this.vitals = vitals
    this.config = config
  }

  generate(): GeneratedWaveform {
    const { heartRate, systolic, diastolic } = this.vitals
    const { sampleRate, duration, noiseLevel, pathologyFactor } = this.config
    
    const totalSamples = Math.floor(sampleRate * duration)
    const data: number[] = []
    const timestamps: number[] = []
    const peaks: number[] = []
    
    const heartPeriodSamples = Math.floor((60 / heartRate) * sampleRate)
    const pulseAmplitude = systolic - diastolic
    
    for (let i = 0; i < totalSamples; i++) {
      const time = i / sampleRate
      timestamps.push(time)
      
      const cyclePosition = (i % heartPeriodSamples) / heartPeriodSamples
      
      let bpValue = this.generateBPMorphology(cyclePosition, systolic, diastolic, pathologyFactor)
      
      // Respiratory variation
      const respPhase = (time * this.vitals.respiratoryRate * 2 * Math.PI) / 60
      bpValue += pulseAmplitude * 0.05 * Math.sin(respPhase)
      
      // Add noise
      bpValue += (Math.random() - 0.5) * noiseLevel * 2
      
      // Detect systolic peaks
      if (cyclePosition > 0.1 && cyclePosition < 0.3 && bpValue > systolic * 0.95) {
        peaks.push(i)
      }
      
      data.push(bpValue)
    }
    
    const intervals = peaks.slice(1).map((peak, i) => 
      (peak - peaks[i]) / sampleRate * 1000
    )
    
    return {
      data,
      timestamps,
      features: {
        peaks,
        intervals,
        amplitude: pulseAmplitude,
        frequency: heartRate / 60,
        morphology: this.classifyBPMorphology(systolic, diastolic, pathologyFactor)
      },
      quality: this.calculateBPQuality(data, systolic, diastolic)
    }
  }

  private generateBPMorphology(t: number, systolic: number, diastolic: number, pathology: number): number {
    const amplitude = systolic - diastolic
    let value = diastolic
    
    // Systolic upstroke (rapid rise)
    if (t < 0.15) {
      const upstrokeT = t / 0.15
      const upstrokeShape = Math.pow(upstrokeT, 0.3) // Sharp rise
      value += amplitude * upstrokeShape
    }
    // Systolic peak
    else if (t < 0.25) {
      value = systolic
    }
    // Dicrotic notch and diastolic decay
    else if (t < 0.4) {
      const notchT = (t - 0.25) / 0.15
      const notchDepth = amplitude * 0.15 * (1 + pathology * 0.3)
      value = systolic - notchDepth * Math.sin(Math.PI * notchT)
    }
    // Diastolic runoff
    else {
      const decayT = (t - 0.4) / 0.6
      const decayValue = amplitude * 0.7 * Math.exp(-decayT * 2)
      value = diastolic + decayValue
    }
    
    // Pathological changes
    if (pathology > 0.3) {
      // Irregular pressure variations
      value += (Math.random() - 0.5) * amplitude * pathology * 0.1
    }
    
    return Math.max(0, value)
  }

  private classifyBPMorphology(systolic: number, diastolic: number, pathology: number): string {
    const pp = systolic - diastolic // Pulse pressure
    
    if (pathology < 0.2 && pp >= 40 && pp <= 60) return 'Normal Arterial Pressure'
    if (pathology < 0.4 && pp > 60) return 'Wide Pulse Pressure'
    if (pathology < 0.4 && pp < 40) return 'Narrow Pulse Pressure'
    if (pathology >= 0.4) return 'Abnormal Pressure Waveform'
    return 'Indeterminate'
  }

  private calculateBPQuality(data: number[], systolic: number, diastolic: number): number {
    const measuredMax = Math.max(...data)
    const measuredMin = Math.min(...data)
    
    const systolicAccuracy = 1 - Math.abs(measuredMax - systolic) / systolic
    const diastolicAccuracy = 1 - Math.abs(measuredMin - diastolic) / diastolic
    
    return (systolicAccuracy + diastolicAccuracy) / 2
  }
}

/**
 * Respiratory Waveform Generator
 * Generates respiratory impedance or capnography waveforms
 */
export class RespiratoryGenerator {
  private config: WaveformConfig
  private vitals: VitalReadings

  constructor(vitals: VitalReadings, config: WaveformConfig) {
    this.vitals = vitals
    this.config = config
  }

  generate(): GeneratedWaveform {
    const { respiratoryRate, heartRate } = this.vitals
    const { sampleRate, duration, noiseLevel, pathologyFactor } = this.config
    
    const totalSamples = Math.floor(sampleRate * duration)
    const data: number[] = []
    const timestamps: number[] = []
    const peaks: number[] = []
    
    const respPeriodSamples = Math.floor((60 / respiratoryRate) * sampleRate)
    
    for (let i = 0; i < totalSamples; i++) {
      const time = i / sampleRate
      timestamps.push(time)
      
      // Respiratory rate variability
      const rrv = 1 + (Math.sin(time * 0.05) * 0.1 * (Math.random() - 0.5))
      const adjustedPeriod = respPeriodSamples * rrv
      
      const cyclePosition = (i % adjustedPeriod) / adjustedPeriod
      
      let respValue = this.generateRespMorphology(cyclePosition, pathologyFactor)
      
      // Cardiac artifact (heart beats visible on respiration)
      const cardiacPhase = (time * heartRate * 2 * Math.PI) / 60
      respValue += 0.02 * Math.sin(cardiacPhase)
      
      // Add noise
      respValue += (Math.random() - 0.5) * noiseLevel * 0.05
      
      // Detect inspiration peaks
      if (cyclePosition > 0.3 && cyclePosition < 0.5 && respValue > 0.7) {
        peaks.push(i)
      }
      
      data.push(respValue)
    }
    
    const intervals = peaks.slice(1).map((peak, i) => 
      (peak - peaks[i]) / sampleRate * 1000
    )
    
    return {
      data,
      timestamps,
      features: {
        peaks,
        intervals,
        amplitude: Math.max(...data) - Math.min(...data),
        frequency: respiratoryRate / 60,
        morphology: this.classifyRespMorphology(respiratoryRate, pathologyFactor)
      },
      quality: this.calculateRespQuality(data)
    }
  }

  private generateRespMorphology(t: number, pathology: number): number {
    let value = 0
    
    // Inspiration phase (0-0.4 of cycle) - active process
    if (t < 0.4) {
      const inspT = t / 0.4
      // Gradual rise with slight acceleration
      value = 0.8 * (inspT + 0.2 * Math.sin(Math.PI * inspT))
    }
    // Expiration phase (0.4-1.0 of cycle) - passive process
    else {
      const expT = (t - 0.4) / 0.6
      if (expT < 0.3) {
        // Brief plateau
        value = 0.8 * (1 - 0.3 * expT)
      } else {
        // Exponential decay
        value = 0.8 * 0.91 * Math.exp(-(expT - 0.3) * 4)
      }
    }
    
    // Pathological breathing patterns
    if (pathology > 0.3) {
      // Irregular breathing
      value *= (1 + (Math.random() - 0.5) * pathology * 0.3)
      
      // Apnea episodes
      if (Math.random() < pathology * 0.05) {
        value *= 0.1
      }
    }
    
    return Math.max(0, value)
  }

  private classifyRespMorphology(respiratoryRate: number, pathology: number): string {
    if (pathology < 0.2 && respiratoryRate >= 12 && respiratoryRate <= 20) return 'Normal Breathing'
    if (respiratoryRate < 12) return 'Bradypnea'
    if (respiratoryRate > 20) return 'Tachypnea'
    if (pathology >= 0.4) return 'Irregular Breathing Pattern'
    return 'Abnormal Respiration'
  }

  private calculateRespQuality(data: number[]): number {
    // Calculate regularity of breathing
    const peaks = data.map((val, i) => val > 0.7 ? i : -1).filter(i => i !== -1)
    if (peaks.length < 2) return 0.5
    
    const intervals = peaks.slice(1).map((peak, i) => peak - peaks[i])
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length
    const cv = Math.sqrt(variance) / avgInterval
    
    return Math.max(0, 1 - cv) // Lower coefficient of variation = higher quality
  }
}

/**
 * Capnography (EtCO2) Waveform Generator
 * Generates CO2 waveforms for end-tidal CO2 monitoring
 */
export class CapnographyGenerator {
  private config: WaveformConfig
  private vitals: VitalReadings

  constructor(vitals: VitalReadings, config: WaveformConfig) {
    this.vitals = vitals
    this.config = config
  }

  generate(): GeneratedWaveform {
    const { respiratoryRate, etCO2 = 35 } = this.vitals
    const { sampleRate, duration, noiseLevel, pathologyFactor } = this.config
    
    const totalSamples = Math.floor(sampleRate * duration)
    const data: number[] = []
    const timestamps: number[] = []
    const peaks: number[] = []
    
    const respPeriodSamples = Math.floor((60 / respiratoryRate) * sampleRate)
    
    for (let i = 0; i < totalSamples; i++) {
      const time = i / sampleRate
      timestamps.push(time)
      
      const cyclePosition = (i % respPeriodSamples) / respPeriodSamples
      
      let co2Value = this.generateCapnographyMorphology(cyclePosition, etCO2, pathologyFactor)
      
      // Add noise
      co2Value += (Math.random() - 0.5) * noiseLevel * 2
      
      // Detect end-tidal peaks
      if (cyclePosition > 0.25 && cyclePosition < 0.35 && co2Value > etCO2 * 0.9) {
        peaks.push(i)
      }
      
      data.push(Math.max(0, co2Value))
    }
    
    return {
      data,
      timestamps,
      features: {
        peaks,
        intervals: [],
        amplitude: etCO2,
        frequency: respiratoryRate / 60,
        morphology: this.classifyCapnographyMorphology(etCO2, pathologyFactor)
      },
      quality: this.calculateCapnographyQuality(data, etCO2)
    }
  }

  private generateCapnographyMorphology(t: number, etCO2: number, pathology: number): number {
    let value = 0
    
    // Phase I: Inspiratory baseline (0-0.1)
    if (t < 0.1) {
      value = 0
    }
    // Phase II: Expiratory upstroke (0.1-0.2)
    else if (t < 0.2) {
      const upstrokeT = (t - 0.1) / 0.1
      value = etCO2 * Math.pow(upstrokeT, 0.5)
    }
    // Phase III: Alveolar plateau (0.2-0.35)
    else if (t < 0.35) {
      const plateauT = (t - 0.2) / 0.15
      value = etCO2 * (0.95 + 0.05 * plateauT) // Slight rise to end-tidal
    }
    // Phase IV: Inspiratory downstroke (0.35-0.45)
    else if (t < 0.45) {
      const downstrokeT = (t - 0.35) / 0.1
      value = etCO2 * (1 - Math.pow(downstrokeT, 0.3))
    }
    // Phase I: Inspiratory baseline continues (0.45-1.0)
    else {
      value = 0
    }
    
    // Pathological changes
    if (pathology > 0.3) {
      // Abnormal plateau shape
      if (t >= 0.2 && t < 0.35) {
        value *= (1 + (Math.random() - 0.5) * pathology * 0.2)
      }
    }
    
    return value
  }

  private classifyCapnographyMorphology(etCO2: number, pathology: number): string {
    if (pathology < 0.2 && etCO2 >= 30 && etCO2 <= 40) return 'Normal Capnogram'
    if (etCO2 < 30) return 'Hypocapnia'
    if (etCO2 > 40) return 'Hypercapnia'
    if (pathology >= 0.4) return 'Abnormal Capnogram'
    return 'Indeterminate'
  }

  private calculateCapnographyQuality(data: number[], etCO2: number): number {
    const maxValue = Math.max(...data)
    const accuracy = 1 - Math.abs(maxValue - etCO2) / etCO2
    return Math.max(0, accuracy)
  }
}

/**
 * AI-Driven Waveform Factory
 * Main interface for generating all types of medical waveforms
 */
export class AIWaveformFactory {
  static generateECG(vitals: VitalReadings, config: Partial<WaveformConfig> = {}): GeneratedWaveform {
    const defaultConfig: WaveformConfig = {
      sampleRate: 250,
      duration: 10,
      noiseLevel: 0.02,
      pathologyFactor: 0.1
    }
    
    const generator = new ECGGenerator(vitals, { ...defaultConfig, ...config })
    return generator.generate()
  }

  static generatePlethysmography(vitals: VitalReadings, config: Partial<WaveformConfig> = {}): GeneratedWaveform {
    const defaultConfig: WaveformConfig = {
      sampleRate: 100,
      duration: 10,
      noiseLevel: 0.03,
      pathologyFactor: 0.1
    }
    
    const generator = new PlethysmographyGenerator(vitals, { ...defaultConfig, ...config })
    return generator.generate()
  }

  static generateBloodPressure(vitals: VitalReadings, config: Partial<WaveformConfig> = {}): GeneratedWaveform {
    const defaultConfig: WaveformConfig = {
      sampleRate: 125,
      duration: 10,
      noiseLevel: 0.5,
      pathologyFactor: 0.1
    }
    
    const generator = new BloodPressureGenerator(vitals, { ...defaultConfig, ...config })
    return generator.generate()
  }

  static generateRespiration(vitals: VitalReadings, config: Partial<WaveformConfig> = {}): GeneratedWaveform {
    const defaultConfig: WaveformConfig = {
      sampleRate: 50,
      duration: 30,
      noiseLevel: 0.02,
      pathologyFactor: 0.1
    }
    
    const generator = new RespiratoryGenerator(vitals, { ...defaultConfig, ...config })
    return generator.generate()
  }

  static generateCapnography(vitals: VitalReadings, config: Partial<WaveformConfig> = {}): GeneratedWaveform {
    const defaultConfig: WaveformConfig = {
      sampleRate: 50,
      duration: 30,
      noiseLevel: 0.5,
      pathologyFactor: 0.1
    }
    
    const generator = new CapnographyGenerator(vitals, { ...defaultConfig, ...config })
    return generator.generate()
  }

  /**
   * Generate all waveforms for a patient
   */
  static generateAllWaveforms(vitals: VitalReadings, pathologyLevel: number = 0.1): {
    ecg: GeneratedWaveform
    plethysmography: GeneratedWaveform
    bloodPressure: GeneratedWaveform
    respiration: GeneratedWaveform
    capnography: GeneratedWaveform
  } {
    const config = { pathologyFactor: pathologyLevel }
    
    return {
      ecg: this.generateECG(vitals, config),
      plethysmography: this.generatePlethysmography(vitals, config),
      bloodPressure: this.generateBloodPressure(vitals, config),
      respiration: this.generateRespiration(vitals, config),
      capnography: this.generateCapnography(vitals, config)
    }
  }

  /**
   * Real-time waveform streaming simulation
   */
  static createRealtimeStream(vitals: VitalReadings, onUpdate: (waveforms: any) => void): () => void {
    const interval = setInterval(() => {
      // Add slight variations to vitals for realism
      const variedVitals: VitalReadings = {
        heartRate: vitals.heartRate + (Math.random() - 0.5) * 4,
        systolic: vitals.systolic + (Math.random() - 0.5) * 6,
        diastolic: vitals.diastolic + (Math.random() - 0.5) * 4,
        oxygenSaturation: vitals.oxygenSaturation + (Math.random() - 0.5) * 1,
        temperature: vitals.temperature + (Math.random() - 0.5) * 0.2,
        respiratoryRate: vitals.respiratoryRate + (Math.random() - 0.5) * 2,
        etCO2: (vitals.etCO2 || 35) + (Math.random() - 0.5) * 3
      }
      
      const waveforms = this.generateAllWaveforms(variedVitals)
      onUpdate(waveforms)
    }, 100) // Update every 100ms for real-time feel
    
    return () => clearInterval(interval)
  }
}