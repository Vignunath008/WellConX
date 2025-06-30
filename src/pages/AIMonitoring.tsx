import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import AIWaveformDisplay from '../components/charts/AIWaveformDisplay'
import { AIWaveformFactory, VitalReadings } from '../utils/waveformGenerator'
import { ArrowLeft, Brain, Zap, Download, Settings, Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

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
        overallRisk: calculateOverallRisk(vitals, waveforms),
        cardiacStatus: analyzeCardiacStatus(vitals, waveforms.ecg),
        respiratoryStatus: analyzeRespiratoryStatus(vitals, waveforms.respiration),
        hemodynamicStatus: analyzeHemodynamicStatus(vitals, waveforms.bloodPressure),
        recommendations: generateRecommendations(vitals, pathologyLevel),
        predictiveAlerts: generatePredictiveAlerts(vitals, waveforms),
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <button
            onClick={() => navigate('/patients')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span>AI-Driven Monitoring - {patient.name}</span>
            </h1>
            <p className="text-gray-600">
              Advanced waveform generation and intelligent analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsGenerating(!isGenerating)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isGenerating 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isGenerating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isGenerating ? 'Pause AI' : 'Start AI'}</span>
          </button>
          
          <button
            onClick={exportAIData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export AI Data</span>
          </button>
        </div>
      </div>

      {/* AI Control Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Configuration</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm text-purple-700 font-medium">AI Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pathology Level Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="flex justify-between text-xs text-gray-500">
                <span>Normal (0%)</span>
                <span className="font-medium text-purple-600">
                  {(pathologyLevel * 100).toFixed(0)}%
                </span>
                <span>Severe (100%)</span>
              </div>
            </div>
          </div>

          {/* Waveform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Insights Summary */}
          {aiInsights && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Risk Assessment
              </label>
              <div className="space-y-2">
                <div className={`p-3 rounded-lg border ${
                  aiInsights.overallRisk < 0.3 ? 'bg-green-50 border-green-200' :
                  aiInsights.overallRisk < 0.7 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Risk</span>
                    <span className={`text-sm font-bold ${
                      aiInsights.overallRisk < 0.3 ? 'text-green-700' :
                      aiInsights.overallRisk < 0.7 ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {(aiInsights.overallRisk * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        aiInsights.overallRisk < 0.3 ? 'bg-green-500' :
                        aiInsights.overallRisk < 0.7 ? 'bg-yellow-500' :
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
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
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
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Clinical Insights</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cardiac Analysis */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Cardiac Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rhythm:</span>
                  <span className="font-medium">{aiInsights.cardiacStatus.rhythm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate Variability:</span>
                  <span className="font-medium">{aiInsights.cardiacStatus.variability}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-medium">{(aiInsights.cardiacStatus.risk * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Respiratory Analysis */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Respiratory Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pattern:</span>
                  <span className="font-medium">{aiInsights.respiratoryStatus.pattern}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span className="font-medium">{aiInsights.respiratoryStatus.efficiency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-medium">{(aiInsights.respiratoryStatus.risk * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Hemodynamic Analysis */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Hemodynamic Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Perfusion:</span>
                  <span className="font-medium">{aiInsights.hemodynamicStatus.perfusion}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stability:</span>
                  <span className="font-medium">{aiInsights.hemodynamicStatus.stability}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-medium">{(aiInsights.hemodynamicStatus.risk * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {aiInsights.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Predictive Alerts */}
          {aiInsights.predictiveAlerts.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Predictive Alerts</h3>
              <div className="space-y-2">
                {aiInsights.predictiveAlerts.map((alert: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{alert.message}</span>
                      <span className="text-xs text-gray-500">
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
function calculateOverallRisk(vitals: VitalReadings, waveforms: any): number {
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

function analyzeHemodynamicStatus(vitals: VitalReadings, bpWaveform: any) {
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

function generatePredictiveAlerts(vitals: VitalReadings, waveforms: any): any[] {
  const alerts = []
  
  // Predict potential cardiac events
  if (vitals.heartRate > 110 && waveforms.ecg.quality < 0.8) {
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