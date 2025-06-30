import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import AIWaveformDisplay from '../components/charts/AIWaveformDisplay'
import { AIWaveformFactory, VitalReadings } from '../utils/waveformGenerator'
import { ArrowLeft, Brain, Zap, Download, Play, Pause } from 'lucide-react'

const AIMonitoring: React.FC = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients } = useData()
  const [isGenerating, setIsGenerating] = useState(true)
  const [pathologyLevel, setPathologyLevel] = useState(0.1)
  const [selectedWaveforms, setSelectedWaveforms] = useState({
    ecg: true,
    plethysmography: true,
    bloodPressure: false,
    respiration: true,
    capnography: false
  })
  const [aiInsights, setAiInsights] = useState<any>(null)

  const patient = patients.find(p => p.id === patientId)

  useEffect(() => {
    if (!patient) return

    // Generate AI insights based on patient vitals
    const generateInsights = () => {
      const vitals: VitalReadings = {
        heartRate: patient.vitals.heartRate,
        systolic: patient.vitals.bloodPressure.systolic,
        diastolic: patient.vitals.bloodPressure.diastolic,
        oxygenSaturation: patient.vitals.oxygenSaturation,
        temperature: patient.vitals.temperature,
        respiratoryRate: patient.vitals.respiratoryRate,
        etCO2: 35 + (Math.random() - 0.5) * 6
      }

      // Generate all waveforms for analysis
      const waveforms = AIWaveformFactory.generateAllWaveforms(vitals, pathologyLevel)
      
      // AI-driven analysis
      const insights = {
        overallRisk: calculateOverallRisk(vitals),
        cardiacStatus: analyzeCardiacStatus(vitals, waveforms.ecg),
        respiratoryStatus: analyzeRespiratoryStatus(vitals, waveforms.respiration),
        hemodynamicStatus: analyzeHemodynamicStatus(vitals),
        recommendations: generateRecommendations(vitals, pathologyLevel),
        predictiveAlerts: generatePredictiveAlerts(vitals),
        waveformQuality: {
          ecg: waveforms.ecg.quality,
          plethysmography: waveforms.plethysmography.quality,
          bloodPressure: waveforms.bloodPressure.quality,
          respiration: waveforms.respiration.quality,
          capnography: waveforms.capnography.quality
        }
      }

      setAiInsights(insights)
    }

    generateInsights()
    const interval = setInterval(generateInsights, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [patient, pathologyLevel])

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Patient Not Found</h2>
          <button
            onClick={() => navigate('/patients')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical"
          >
            Back to Patients
          </button>
        </div>
      </div>
    )
  }

  const vitals: VitalReadings = {
    heartRate: patient.vitals.heartRate,
    systolic: patient.vitals.bloodPressure.systolic,
    diastolic: patient.vitals.bloodPressure.diastolic,
    oxygenSaturation: patient.vitals.oxygenSaturation,
    temperature: patient.vitals.temperature,
    respiratoryRate: patient.vitals.respiratoryRate,
    etCO2: 35 + (Math.random() - 0.5) * 6
  }

  const exportAIData = () => {
    const exportData = {
      patient: patient.name,
      timestamp: new Date().toISOString(),
      vitals,
      pathologyLevel,
      aiInsights,
      selectedWaveforms
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${patient.name.replace(/\s+/g, '_')}_ai_monitoring_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/patients/${patient.id}`)}
            className="p-2 hover:bg-background-hover rounded-medical transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary-600" />
              <span>AI Analysis - {patient.name}</span>
            </h1>
            <p className="text-text-secondary">
              Intelligent waveform analysis and clinical insights
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsGenerating(!isGenerating)}
            className={`px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2 ${
              isGenerating 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-health-100 text-health-700 border border-health-200'
            }`}
          >
            {isGenerating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isGenerating ? 'Pause AI' : 'Start AI'}</span>
          </button>
          
          <button
            onClick={exportAIData}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-medical font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* AI Control Panel */}
      <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-text-primary">AI Configuration</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm text-primary-700 font-medium">AI Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pathology Level Control */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Pathology Simulation Level
            </label>
            <div className="space-y-2">
              <input
                type="range"
                value={pathologyLevel}
                onChange={(e) => setPathologyLevel(parseFloat(e.target.value))}
                className="w-full"
                min="0"
                max="1"
                step="0.01"
              />
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Normal (0%)</span>
                <span className="font-medium text-primary-600">
                  {(pathologyLevel * 100).toFixed(0)}%
                </span>
                <span>Severe (100%)</span>
              </div>
            </div>
          </div>

          {/* Waveform Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Active Waveforms
            </label>
            <div className="space-y-2">
              {Object.entries(selectedWaveforms).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSelectedWaveforms(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="rounded border-border-medium text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Insights Summary */}
          {aiInsights && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                AI Risk Assessment
              </label>
              <div className="space-y-2">
                <div className={`p-3 rounded-medical border ${
                  aiInsights.overallRisk < 0.3 ? 'bg-health-50 border-health-200' :
                  aiInsights.overallRisk < 0.7 ? 'bg-alert-50 border-alert-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">Overall Risk</span>
                    <span className={`text-sm font-bold ${
                      aiInsights.overallRisk < 0.3 ? 'text-health-700' :
                      aiInsights.overallRisk < 0.7 ? 'text-alert-700' :
                      'text-red-700'
                    }`}>
                      {(aiInsights.overallRisk * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-background-hover rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        aiInsights.overallRisk < 0.3 ? 'bg-health-500' :
                        aiInsights.overallRisk < 0.7 ? 'bg-alert-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${aiInsights.overallRisk * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI-Generated Waveforms */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary-600" />
          <span>AI-Generated Waveforms</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedWaveforms.ecg && (
            <AIWaveformDisplay
              vitals={vitals}
              waveformType="ecg"
              title={`ECG Lead II (${vitals.heartRate} bpm)`}
              color="#00ff00"
              height={200}
              pathologyLevel={pathologyLevel}
            />
          )}

          {selectedWaveforms.plethysmography && (
            <AIWaveformDisplay
              vitals={vitals}
              waveformType="plethysmography"
              title={`Plethysmography (${vitals.oxygenSaturation}%)`}
              color="#00ffff"
              height={200}
              pathologyLevel={pathologyLevel}
            />
          )}

          {selectedWaveforms.bloodPressure && (
            <AIWaveformDisplay
              vitals={vitals}
              waveformType="bloodPressure"
              title={`Arterial Pressure (${vitals.systolic}/${vitals.diastolic})`}
              color="#ff6b6b"
              height={200}
              pathologyLevel={pathologyLevel}
            />
          )}

          {selectedWaveforms.respiration && (
            <AIWaveformDisplay
              vitals={vitals}
              waveformType="respiration"
              title={`Respiration (${vitals.respiratoryRate}/min)`}
              color="#ffff00"
              height={200}
              pathologyLevel={pathologyLevel}
            />
          )}

          {selectedWaveforms.capnography && (
            <AIWaveformDisplay
              vitals={vitals}
              waveformType="capnography"
              title={`Capnography (EtCO2: ${vitals.etCO2?.toFixed(0)} mmHg)`}
              color="#ff9500"
              height={200}
              pathologyLevel={pathologyLevel}
            />
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsights && (
        <div className="bg-background-card rounded-card p-6 border border-border-light shadow-soft">
          <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary-600" />
            <span>AI Clinical Insights</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cardiac Analysis */}
            <div className="bg-red-50 rounded-medical p-4 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Cardiac Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rhythm:</span>
                  <span className="font-medium text-text-primary">{aiInsights.cardiacStatus.rhythm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rate Variability:</span>
                  <span className="font-medium text-text-primary">{aiInsights.cardiacStatus.variability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Risk Score:</span>
                  <span className="font-medium text-text-primary">{(aiInsights.cardiacStatus.risk * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Respiratory Analysis */}
            <div className="bg-primary-50 rounded-medical p-4 border border-primary-200">
              <h3 className="font-semibold text-primary-800 mb-3">Respiratory Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Pattern:</span>
                  <span className="font-medium text-text-primary">{aiInsights.respiratoryStatus.pattern}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Efficiency:</span>
                  <span className="font-medium text-text-primary">{aiInsights.respiratoryStatus.efficiency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Risk Score:</span>
                  <span className="font-medium text-text-primary">{(aiInsights.respiratoryStatus.risk * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Hemodynamic Analysis */}
            <div className="bg-health-50 rounded-medical p-4 border border-health-200">
              <h3 className="font-semibold text-health-800 mb-3">Hemodynamic Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Perfusion:</span>
                  <span className="font-medium text-text-primary">{aiInsights.hemodynamicStatus.perfusion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Stability:</span>
                  <span className="font-medium text-text-primary">{aiInsights.hemodynamicStatus.stability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Risk Score:</span>
                  <span className="font-medium text-text-primary">{(aiInsights.hemodynamicStatus.risk * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h3 className="font-semibold text-text-primary mb-3">AI Recommendations</h3>
            <div className="bg-background-hover rounded-medical p-4">
              <ul className="space-y-2">
                {aiInsights.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-primary-600 font-bold">•</span>
                    <span className="text-text-primary">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Predictive Alerts */}
          {aiInsights.predictiveAlerts.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-text-primary mb-3">Predictive Alerts</h3>
              <div className="space-y-2">
                {aiInsights.predictiveAlerts.map((alert: any, index: number) => (
                  <div key={index} className={`p-3 rounded-medical border ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'medium' ? 'bg-alert-50 border-alert-200' :
                    'bg-primary-50 border-primary-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-primary">{alert.message}</span>
                      <span className="text-xs text-text-secondary">
                        Confidence: {(alert.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper functions for AI analysis
function calculateOverallRisk(vitals: VitalReadings): number {
  let riskScore = 0
  
  // Heart rate risk
  if (vitals.heartRate < 50 || vitals.heartRate > 120) riskScore += 0.3
  else if (vitals.heartRate < 60 || vitals.heartRate > 100) riskScore += 0.1
  
  // Blood pressure risk
  if (vitals.systolic > 180 || vitals.systolic < 90) riskScore += 0.3
  else if (vitals.systolic > 140 || vitals.systolic < 100) riskScore += 0.1
  
  // SpO2 risk
  if (vitals.oxygenSaturation < 90) riskScore += 0.4
  else if (vitals.oxygenSaturation < 95) riskScore += 0.2
  
  // Temperature risk
  if (vitals.temperature > 101 || vitals.temperature < 95) riskScore += 0.2
  else if (vitals.temperature > 99.5 || vitals.temperature < 97) riskScore += 0.1
  
  return Math.min(1, riskScore)
}

function analyzeCardiacStatus(vitals: VitalReadings, ecgWaveform: any) {
  const hr = vitals.heartRate
  let rhythm = 'Normal Sinus Rhythm'
  let variability = 'Normal'
  let risk = 0
  
  if (hr < 50) {
    rhythm = 'Bradycardia'
    risk += 0.3
  } else if (hr > 120) {
    rhythm = 'Tachycardia'
    risk += 0.3
  } else if (hr < 60 || hr > 100) {
    rhythm = 'Sinus Arrhythmia'
    risk += 0.1
  }
  
  // Analyze HRV from intervals
  if (ecgWaveform.features.intervals.length > 1) {
    const intervals = ecgWaveform.features.intervals
    const avgInterval = intervals.reduce((a: number, b: number) => a + b, 0) / intervals.length
    const variance = intervals.reduce((a: number, b: number) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length
    const cv = Math.sqrt(variance) / avgInterval
    
    if (cv > 0.1) {
      variability = 'High Variability'
      risk += 0.2
    } else if (cv < 0.02) {
      variability = 'Low Variability'
      risk += 0.1
    }
  }
  
  return { rhythm, variability, risk: Math.min(1, risk) }
}

function analyzeRespiratoryStatus(vitals: VitalReadings, respWaveform: any) {
  const rr = vitals.respiratoryRate
  let pattern = 'Normal Breathing'
  let efficiency = 'Good'
  let risk = 0
  
  if (rr < 8) {
    pattern = 'Bradypnea'
    risk += 0.4
  } else if (rr > 30) {
    pattern = 'Tachypnea'
    risk += 0.3
  } else if (rr < 12 || rr > 25) {
    pattern = 'Mild Abnormality'
    risk += 0.1
  }
  
  // Analyze breathing efficiency from waveform quality
  if (respWaveform.quality < 0.7) {
    efficiency = 'Poor'
    risk += 0.2
  } else if (respWaveform.quality < 0.8) {
    efficiency = 'Fair'
    risk += 0.1
  }
  
  return { pattern, efficiency, risk: Math.min(1, risk) }
}

function analyzeHemodynamicStatus(vitals: VitalReadings) {
  const { systolic, diastolic } = vitals
  const pp = systolic - diastolic // Pulse pressure
  
  let perfusion = 'Good'
  let stability = 'Stable'
  let risk = 0
  
  if (systolic > 180 || systolic < 90) {
    stability = 'Unstable'
    risk += 0.4
  } else if (systolic > 140 || systolic < 100) {
    stability = 'Borderline'
    risk += 0.2
  }
  
  if (pp > 80 || pp < 30) {
    perfusion = 'Poor'
    risk += 0.3
  } else if (pp > 60 || pp < 40) {
    perfusion = 'Fair'
    risk += 0.1
  }
  
  return { perfusion, stability, risk: Math.min(1, risk) }
}

function generateRecommendations(vitals: VitalReadings, pathologyLevel: number): string[] {
  const recommendations = []
  
  if (vitals.heartRate > 100) {
    recommendations.push('Consider cardiac monitoring and possible rate control')
  }
  
  if (vitals.oxygenSaturation < 95) {
    recommendations.push('Increase oxygen supplementation and monitor respiratory status')
  }
  
  if (vitals.systolic > 140) {
    recommendations.push('Monitor blood pressure closely and consider antihypertensive therapy')
  }
  
  if (pathologyLevel > 0.5) {
    recommendations.push('Increase monitoring frequency due to elevated pathology indicators')
    recommendations.push('Consider specialist consultation for complex case management')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue current monitoring protocol')
    recommendations.push('Maintain standard care procedures')
  }
  
  return recommendations
}

function generatePredictiveAlerts(vitals: VitalReadings): any[] {
  const alerts = []
  
  // Predict potential cardiac events
  if (vitals.heartRate > 110) {
    alerts.push({
      message: 'Potential cardiac arrhythmia developing',
      severity: 'high',
      confidence: 0.75
    })
  }
  
  // Predict respiratory compromise
  if (vitals.oxygenSaturation < 96 && vitals.respiratoryRate > 22) {
    alerts.push({
      message: 'Risk of respiratory decompensation',
      severity: 'medium',
      confidence: 0.68
    })
  }
  
  // Predict hemodynamic instability
  if (vitals.systolic > 160 && (vitals.systolic - vitals.diastolic) > 70) {
    alerts.push({
      message: 'Hemodynamic instability risk increasing',
      severity: 'medium',
      confidence: 0.72
    })
  }
  
  return alerts
}

export default AIMonitoring