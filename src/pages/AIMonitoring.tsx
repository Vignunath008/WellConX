import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { 
  ArrowLeft, 
  Brain, 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Share2, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Target, 
  Lightbulb, 
  Shield, 
  Cpu, 
  Database,
  Network,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Heart,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AIMonitoring: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { patients } = useData()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [aiStatus, setAiStatus] = useState('active')
  const [predictionMode, setPredictionMode] = useState('realtime')
  const [confidence, setConfidence] = useState(85)

  const patient = patients.find(p => p.id === patientId)

  // Mock AI monitoring data
  const aiData = {
    predictions: [
      { 
        id: 1, 
        type: 'Heart Rate Anomaly', 
        probability: 92, 
        confidence: 87, 
        timestamp: '2024-01-15 14:30:00',
        status: 'detected',
        severity: 'moderate',
        description: 'AI detected irregular heart rate pattern suggesting potential arrhythmia'
      },
      { 
        id: 2, 
        type: 'Blood Pressure Trend', 
        probability: 78, 
        confidence: 82, 
        timestamp: '2024-01-15 13:45:00',
        status: 'predicted',
        severity: 'mild',
        description: 'Predicted blood pressure increase within next 2 hours based on current trends'
      },
      { 
        id: 3, 
        type: 'Oxygen Saturation Alert', 
        probability: 95, 
        confidence: 91, 
        timestamp: '2024-01-15 12:15:00',
        status: 'resolved',
        severity: 'high',
        description: 'AI predicted oxygen saturation drop, intervention prevented critical event'
      }
    ],
    insights: [
      {
        id: 1,
        category: 'Vital Trends',
        insight: 'Heart rate variability has decreased by 15% over the past week',
        impact: 'moderate',
        recommendation: 'Consider stress management interventions',
        timestamp: '2024-01-15 10:00:00'
      },
      {
        id: 2,
        category: 'Medication Response',
        insight: 'Blood pressure medication effectiveness has improved by 23%',
        impact: 'positive',
        recommendation: 'Continue current medication regimen',
        timestamp: '2024-01-15 09:30:00'
      },
      {
        id: 3,
        category: 'Risk Assessment',
        insight: 'Patient shows 12% increased risk of cardiovascular events',
        impact: 'high',
        recommendation: 'Schedule cardiology consultation within 48 hours',
        timestamp: '2024-01-15 08:45:00'
      }
    ],
    models: [
      {
        id: 1,
        name: 'Vital Signs Predictor',
        accuracy: 94.2,
        status: 'active',
        lastUpdated: '2024-01-15 12:00:00',
        predictions: 1247,
        performance: 'excellent'
      },
      {
        id: 2,
        name: 'Anomaly Detection',
        accuracy: 89.7,
        status: 'active',
        lastUpdated: '2024-01-15 11:30:00',
        predictions: 892,
        performance: 'good'
      },
      {
        id: 3,
        name: 'Risk Assessment',
        accuracy: 91.5,
        status: 'training',
        lastUpdated: '2024-01-15 10:15:00',
        predictions: 567,
        performance: 'good'
      }
    ],
    performance: {
      totalPredictions: 2706,
      accuracy: 91.8,
      falsePositives: 2.3,
      falseNegatives: 1.1,
      responseTime: 0.8,
      uptime: 99.7
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'predictions', label: 'Predictions', icon: Brain },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'models', label: 'AI Models', icon: Cpu },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
  ]

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'detected': return 'text-blue-600 bg-blue-50'
      case 'predicted': return 'text-yellow-600 bg-yellow-50'
      case 'resolved': return 'text-purple-600 bg-purple-50'
      case 'training': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-yellow-600 bg-yellow-50'
      case 'moderate': return 'text-orange-600 bg-orange-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'fair': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h2>
            <p className="text-gray-600 mb-6">The requested patient could not be found.</p>
            <button
              onClick={() => navigate('/iomt/patients')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Patients
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/iomt/patients')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Monitoring</h1>
                <p className="text-gray-600">{patient.name} • Intelligent Health Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${aiStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">AI {aiStatus}</span>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* AI Status Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Engine</h3>
                <p className="text-gray-600">Active & Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Accuracy</h3>
                <p className="text-gray-600">{aiData.performance.accuracy}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                <p className="text-gray-600">{aiData.performance.responseTime}s</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Predictions</h3>
                <p className="text-gray-600">{aiData.performance.totalPredictions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={predictionMode}
                onChange={(e) => setPredictionMode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="realtime">Real-time Monitoring</option>
                <option value="batch">Batch Analysis</option>
                <option value="scheduled">Scheduled Predictions</option>
              </select>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Confidence Threshold:</span>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm font-medium text-gray-900">{confidence}%</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Start AI</span>
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {selectedTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Recent Predictions */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900">Recent Predictions</h3>
                        <Brain className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        {aiData.predictions.slice(0, 3).map((pred, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-blue-900">{pred.type}</span>
                            <span className="text-blue-700 ml-2">• {pred.probability}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900">AI Insights</h3>
                        <Lightbulb className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        {aiData.insights.slice(0, 3).map((insight, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-green-900">{insight.category}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getImpactColor(insight.impact)}`}>
                              {insight.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Model Performance */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900">Model Performance</h3>
                        <Cpu className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        {aiData.models.slice(0, 3).map((model, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-purple-900">{model.name}</span>
                            <span className="text-purple-700 ml-2">• {model.accuracy}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-orange-900">System Health</h3>
                        <Shield className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">Uptime</span>
                          <span className="font-semibold text-orange-900">{aiData.performance.uptime}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">False Positives</span>
                          <span className="font-semibold text-orange-900">{aiData.performance.falsePositives}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">False Negatives</span>
                          <span className="font-semibold text-orange-900">{aiData.performance.falseNegatives}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Data Sources */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-indigo-900">Data Sources</h3>
                        <Database className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">Vital Monitors</span>
                          <span className="text-indigo-700 ml-2">• 4 devices active</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">EHR Integration</span>
                          <span className="text-indigo-700 ml-2">• Connected</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-indigo-900">Lab Results</span>
                          <span className="text-indigo-700 ml-2">• 12 tests available</span>
                        </div>
                      </div>
                    </div>

                    {/* Network Status */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-rose-900">Network Status</h3>
                        <Network className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">IoT Devices</span>
                          <span className="text-rose-700 ml-2">• 8 connected</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">Data Latency</span>
                          <span className="text-rose-700 ml-2">• 45ms average</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">Bandwidth</span>
                          <span className="text-rose-700 ml-2">• 95% utilization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'predictions' && (
                  <div className="space-y-4">
                    {aiData.predictions.map((prediction, index) => (
                      <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toggleExpanded(`prediction-${prediction.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Brain className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{prediction.type}</h4>
                              <p className="text-sm text-gray-600">{prediction.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Probability</div>
                              <div className="font-semibold text-gray-900">{prediction.probability}%</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prediction.status)}`}>
                              {prediction.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(prediction.severity)}`}>
                              {prediction.severity}
                            </span>
                            {expandedItems.includes(`prediction-${prediction.id}`) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedItems.includes(`prediction-${prediction.id}`) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <div className="bg-white rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-2">AI Analysis</h5>
                                <p className="text-gray-700 mb-4">{prediction.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{prediction.confidence}%</div>
                                    <div className="text-sm text-gray-600">Confidence</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{prediction.probability}%</div>
                                    <div className="text-sm text-gray-600">Probability</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">0.8s</div>
                                    <div className="text-sm text-gray-600">Response Time</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">3</div>
                                    <div className="text-sm text-gray-600">Data Points</div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'insights' && (
                  <div className="space-y-4">
                    {aiData.insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Lightbulb className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{insight.category}</h4>
                              <p className="text-sm text-gray-600">{insight.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(insight.impact)}`}>
                              {insight.impact}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-gray-700 mb-3">{insight.insight}</p>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h5 className="font-medium text-blue-900 mb-1">AI Recommendation</h5>
                            <p className="text-blue-700">{insight.recommendation}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'models' && (
                  <div className="space-y-4">
                    {aiData.models.map((model, index) => (
                      <motion.div
                        key={model.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <Cpu className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{model.name}</h4>
                              <p className="text-sm text-gray-600">Last updated: {model.lastUpdated}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Accuracy</div>
                              <div className="font-semibold text-gray-900">{model.accuracy}%</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(model.status)}`}>
                              {model.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(model.performance)}`}>
                              {model.performance}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{model.predictions}</div>
                            <div className="text-sm text-gray-600">Predictions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">0.6s</div>
                            <div className="text-sm text-gray-600">Avg Response</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">99.2%</div>
                            <div className="text-sm text-gray-600">Uptime</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'performance' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance Metrics */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Overall Accuracy</span>
                          <span className="font-semibold text-gray-900">{aiData.performance.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${aiData.performance.accuracy}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Response Time</span>
                          <span className="font-semibold text-gray-900">{aiData.performance.responseTime}s</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${100 - (aiData.performance.responseTime * 10)}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">System Uptime</span>
                          <span className="font-semibold text-gray-900">{aiData.performance.uptime}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${aiData.performance.uptime}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Error Rates */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Analysis</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">False Positives</span>
                          <span className="font-semibold text-gray-900">{aiData.performance.falsePositives}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${aiData.performance.falsePositives * 2}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">False Negatives</span>
                          <span className="font-semibold text-gray-900">{aiData.performance.falseNegatives}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: `${aiData.performance.falseNegatives * 2}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Predictions</span>
                          <span className="font-semibold text-gray-900">{aiData.performance.totalPredictions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIMonitoring