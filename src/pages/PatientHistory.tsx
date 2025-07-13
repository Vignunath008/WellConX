import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets,
  TrendingUp,
  AlertTriangle,
  FileText,
  Pill,
  Stethoscope,
  TestTube,
  Camera,
  Brain,
  Zap,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PatientHistory: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { patients } = useData()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('30d')

  const patient = patients.find(p => p.id === patientId)

  // Mock historical data
  const historyData = {
    vitals: [
      { date: '2024-01-15', hr: 72, bp: '120/80', spo2: 98, temp: 36.8, status: 'normal' },
      { date: '2024-01-14', hr: 75, bp: '118/78', spo2: 97, temp: 36.9, status: 'normal' },
      { date: '2024-01-13', hr: 68, bp: '125/82', spo2: 96, temp: 37.1, status: 'normal' },
      { date: '2024-01-12', hr: 82, bp: '135/88', spo2: 94, temp: 37.3, status: 'elevated' },
      { date: '2024-01-11', hr: 78, bp: '128/85', spo2: 95, temp: 37.0, status: 'normal' },
    ],
    medications: [
      { date: '2024-01-15', medication: 'Lisinopril 10mg', dosage: 'Once daily', status: 'Active' },
      { date: '2024-01-10', medication: 'Metformin 500mg', dosage: 'Twice daily', status: 'Active' },
      { date: '2024-01-05', medication: 'Aspirin 81mg', dosage: 'Once daily', status: 'Active' },
    ],
    labResults: [
      { date: '2024-01-15', test: 'CBC', result: 'Normal', status: 'Completed' },
      { date: '2024-01-10', test: 'Lipid Panel', result: 'Elevated LDL', status: 'Completed' },
      { date: '2024-01-05', test: 'HbA1c', result: '6.2%', status: 'Completed' },
    ],
    visits: [
      { date: '2024-01-15', type: 'Follow-up', doctor: 'Dr. Smith', notes: 'Patient doing well, continue current medications' },
      { date: '2024-01-10', type: 'Routine Check', doctor: 'Dr. Johnson', notes: 'Blood pressure slightly elevated, monitor closely' },
      { date: '2024-01-05', type: 'Initial Visit', doctor: 'Dr. Williams', notes: 'New patient, established care plan' },
    ],
    alerts: [
      { date: '2024-01-12', type: 'High Blood Pressure', severity: 'moderate', resolved: true },
      { date: '2024-01-08', type: 'Low Oxygen Saturation', severity: 'mild', resolved: true },
      { date: '2024-01-03', type: 'Irregular Heart Rate', severity: 'moderate', resolved: true },
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'vitals', label: 'Vital Signs', icon: Heart },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'labs', label: 'Lab Results', icon: TestTube },
    { id: 'visits', label: 'Visits', icon: Stethoscope },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
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
      case 'normal': return 'text-green-600 bg-green-50'
      case 'elevated': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      case 'active': return 'text-blue-600 bg-blue-50'
      case 'completed': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-yellow-600 bg-yellow-50'
      case 'moderate': return 'text-orange-600 bg-orange-50'
      case 'severe': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
                <p className="text-gray-600">{patient.name} • ID: {patient.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
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
        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Room</p>
                <p className="font-semibold text-gray-900">{patient.room}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">MRN</p>
                <p className="font-semibold text-gray-900">{patient.medicalRecordNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Last Visit</p>
                <p className="font-semibold text-gray-900">Jan 15, 2024</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="vitals">Vital Signs</option>
                <option value="medications">Medications</option>
                <option value="labs">Lab Results</option>
                <option value="visits">Visits</option>
                <option value="alerts">Alerts</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Advanced Filter</span>
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
                    {/* Recent Vitals */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900">Recent Vitals</h3>
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Heart Rate</span>
                          <span className="font-semibold text-blue-900">72 BPM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Blood Pressure</span>
                          <span className="font-semibold text-blue-900">120/80</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">SpO2</span>
                          <span className="font-semibold text-blue-900">98%</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Medications */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900">Active Medications</h3>
                        <Pill className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        {historyData.medications.slice(0, 3).map((med, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-green-900">{med.medication}</span>
                            <span className="text-green-700 ml-2">• {med.dosage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-yellow-900">Recent Alerts</h3>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="space-y-2">
                        {historyData.alerts.slice(0, 3).map((alert, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-yellow-900">{alert.type}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lab Results */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900">Recent Labs</h3>
                        <TestTube className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        {historyData.labResults.slice(0, 3).map((lab, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-purple-900">{lab.test}</span>
                            <span className="text-purple-700 ml-2">• {lab.result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visit History */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-indigo-900">Recent Visits</h3>
                        <Stethoscope className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="space-y-2">
                        {historyData.visits.slice(0, 3).map((visit, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-indigo-900">{visit.type}</span>
                            <span className="text-indigo-700 ml-2">• {visit.doctor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trends */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-rose-900">Health Trends</h3>
                        <TrendingUp className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">Blood Pressure</span>
                          <span className="text-rose-700 ml-2">• Stable</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">Heart Rate</span>
                          <span className="text-rose-700 ml-2">• Normal range</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-rose-900">Weight</span>
                          <span className="text-rose-700 ml-2">• -2kg this month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'vitals' && (
                  <div className="space-y-4">
                    {historyData.vitals.map((vital, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toggleExpanded(`vital-${index}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Heart className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Vital Signs - {vital.date}</h4>
                              <p className="text-sm text-gray-600">Comprehensive vital measurements</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vital.status)}`}>
                              {vital.status}
                            </span>
                            {expandedItems.includes(`vital-${index}`) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedItems.includes(`vital-${index}`) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">{vital.hr}</div>
                                  <div className="text-sm text-gray-600">Heart Rate (BPM)</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-red-600">{vital.bp}</div>
                                  <div className="text-sm text-gray-600">Blood Pressure</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">{vital.spo2}%</div>
                                  <div className="text-sm text-gray-600">SpO2</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">{vital.temp}°C</div>
                                  <div className="text-sm text-gray-600">Temperature</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'medications' && (
                  <div className="space-y-4">
                    {historyData.medications.map((med, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Pill className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{med.medication}</h4>
                              <p className="text-sm text-gray-600">Prescribed on {med.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{med.dosage}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(med.status)}`}>
                              {med.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'labs' && (
                  <div className="space-y-4">
                    {historyData.labResults.map((lab, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <TestTube className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{lab.test}</h4>
                              <p className="text-sm text-gray-600">Tested on {lab.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{lab.result}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lab.status)}`}>
                              {lab.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'visits' && (
                  <div className="space-y-4">
                    {historyData.visits.map((visit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toggleExpanded(`visit-${index}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{visit.type}</h4>
                              <p className="text-sm text-gray-600">{visit.doctor} • {visit.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {expandedItems.includes(`visit-${index}`) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedItems.includes(`visit-${index}`) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <div className="bg-white rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-2">Visit Notes</h5>
                                <p className="text-gray-700">{visit.notes}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedTab === 'alerts' && (
                  <div className="space-y-4">
                    {historyData.alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                              <p className="text-sm text-gray-600">Alerted on {alert.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              alert.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {alert.resolved ? 'Resolved' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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

export default PatientHistory