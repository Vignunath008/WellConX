import React, { useState } from 'react'
import { 
  User, 
  FileText, 
  Pill, 
  TestTube, 
  Image, 
  Mic,
  Download,
  Upload,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Plus,
  Heart,
  Stethoscope,
  Clipboard
} from 'lucide-react'
import { motion } from 'framer-motion'

const EHR: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [isRecording, setIsRecording] = useState(false)

  // Mock EHR data
  const [ehrData] = useState({
    patients: [
      {
        id: 'PAT-001',
        name: 'Rahul Verma',
        age: 65,
        gender: 'Male',
        mrn: 'MRN-001234',
        tags: ['VIP', 'Chronic'],
        lastVisit: '2024-01-15',
        status: 'Active',
        department: 'Cardiology',
        doctor: 'Dr. Rajesh Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.verma@email.com',
        address: '123 Main Street, Mumbai, Maharashtra',
        emergencyContact: 'Priya Verma - +91 98765 43211',
        insurance: 'Star Health Insurance',
        allergies: ['Penicillin', 'Shellfish'],
        chronicConditions: ['Hypertension', 'Diabetes Type 2'],
        currentMedications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedBy: 'Dr. Rajesh Sharma' },
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedBy: 'Dr. Rajesh Sharma' }
        ]
      },
      {
        id: 'PAT-002',
        name: 'Ananya Singh',
        age: 45,
        gender: 'Female',
        mrn: 'MRN-005678',
        tags: ['Follow-up'],
        lastVisit: '2024-01-14',
        status: 'Active',
        department: 'Pulmonology',
        doctor: 'Dr. Priya Patel',
        phone: '+91 98765 43220',
        email: 'ananya.singh@email.com',
        address: '456 Park Avenue, Delhi',
        emergencyContact: 'Vikram Singh - +91 98765 43221',
        insurance: 'HDFC ERGO Health',
        allergies: ['Dust', 'Pollen'],
        chronicConditions: ['Asthma'],
        currentMedications: [
          { name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As needed', prescribedBy: 'Dr. Priya Patel' }
        ]
      }
    ],
    visits: [
      {
        id: 'VISIT-001',
        patientId: 'PAT-001',
        date: '2024-01-15',
        time: '10:30 AM',
        department: 'Cardiology',
        doctor: 'Dr. Rajesh Sharma',
        type: 'Follow-up',
        status: 'Completed',
        chiefComplaint: 'Chest pain and shortness of breath',
        vitals: {
          bp: '140/90',
          pulse: '78',
          temp: '98.6°F',
          weight: '75kg',
          height: '170cm'
        },
        soap: {
          subjective: 'Patient reports intermittent chest pain over the past week, especially during physical activity.',
          objective: 'BP elevated at 140/90, heart rate regular at 78 bpm. No acute distress observed.',
          assessment: 'Hypertension, possible angina. ECG shows mild ST changes.',
          plan: 'Increase Lisinopril to 20mg daily. Schedule stress test. Follow-up in 2 weeks.'
        },
        attachments: ['ECG_20240115.pdf', 'Lab_Results_20240115.pdf']
      }
    ],
    prescriptions: [
      {
        id: 'RX-001',
        patientId: 'PAT-001',
        date: '2024-01-15',
        doctor: 'Dr. Rajesh Sharma',
        medications: [
          { name: 'Lisinopril', strength: '20mg', quantity: '30 tablets', frequency: 'Once daily', duration: '30 days' },
          { name: 'Aspirin', strength: '75mg', quantity: '30 tablets', frequency: 'Once daily', duration: '30 days' }
        ],
        status: 'Active',
        pharmacy: 'Apollo Pharmacy',
        instructions: 'Take with food. Monitor blood pressure daily.'
      }
    ],
    labResults: [
      {
        id: 'LAB-001',
        patientId: 'PAT-001',
        date: '2024-01-15',
        type: 'Blood Chemistry',
        orderedBy: 'Dr. Rajesh Sharma',
        status: 'Completed',
        results: [
          { test: 'Glucose (Fasting)', value: '126', unit: 'mg/dL', range: '70-100', flag: 'High' },
          { test: 'HbA1c', value: '7.2', unit: '%', range: '<7.0', flag: 'High' },
          { test: 'Total Cholesterol', value: '220', unit: 'mg/dL', range: '<200', flag: 'High' },
          { test: 'HDL Cholesterol', value: '35', unit: 'mg/dL', range: '>40', flag: 'Low' }
        ]
      }
    ],
    radiology: [
      {
        id: 'RAD-001',
        patientId: 'PAT-001',
        date: '2024-01-15',
        type: 'Chest X-Ray',
        orderedBy: 'Dr. Rajesh Sharma',
        status: 'Completed',
        findings: 'Mild cardiomegaly. No acute pulmonary findings.',
        radiologist: 'Dr. Meera Joshi',
        images: ['chest_xray_001.jpg']
      }
    ]
  })

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vip': return 'bg-purple-100 text-purple-800'
      case 'chronic': return 'bg-orange-100 text-orange-800'
      case 'follow-up': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const PatientCard = ({ patient }: any) => (
    <motion.div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        selectedPatient === patient.id 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={() => setSelectedPatient(patient.id)}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600">{patient.age}y • {patient.gender} • {patient.mrn}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {patient.tags.map((tag: string) => (
            <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Department:</span>
          <p className="font-medium">{patient.department}</p>
        </div>
        <div>
          <span className="text-gray-500">Doctor:</span>
          <p className="font-medium">{patient.doctor}</p>
        </div>
        <div>
          <span className="text-gray-500">Last Visit:</span>
          <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {patient.status}
          </span>
        </div>
      </div>
    </motion.div>
  )

  const PatientDetails = ({ patient }: any) => {
    const visits = ehrData.visits.filter(v => v.patientId === patient.id)
    const prescriptions = ehrData.prescriptions.filter(p => p.patientId === patient.id)
    const labResults = ehrData.labResults.filter(l => l.patientId === patient.id)

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Patient Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {patient.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{patient.age} years • {patient.gender}</span>
                  <span>MRN: {patient.mrn}</span>
                  <span>{patient.department}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {patient.tags.map((tag: string) => (
                    <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Edit className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: User },
              { id: 'visits', name: 'Visit History', icon: Calendar },
              { id: 'prescriptions', name: 'Prescriptions', icon: Pill },
              { id: 'labs', name: 'Lab Results', icon: TestTube },
              { id: 'radiology', name: 'Radiology', icon: Image },
              { id: 'notes', name: 'SOAP Notes', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Phone:</span> {patient.phone}</div>
                    <div><span className="text-gray-600">Email:</span> {patient.email}</div>
                    <div><span className="text-gray-600">Address:</span> {patient.address}</div>
                    <div><span className="text-gray-600">Emergency Contact:</span> {patient.emergencyContact}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Insurance:</span> {patient.insurance}</div>
                    <div><span className="text-gray-600">Primary Doctor:</span> {patient.doctor}</div>
                    <div><span className="text-gray-600">Department:</span> {patient.department}</div>
                    <div><span className="text-gray-600">Last Visit:</span> {new Date(patient.lastVisit).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Allergies & Chronic Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy: string) => (
                      <span key={allergy} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Chronic Conditions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.chronicConditions.map((condition: string) => (
                      <span key={condition} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Pill className="h-4 w-4 mr-2" />
                  Current Medications
                </h3>
                <div className="space-y-3">
                  {patient.currentMedications.map((med: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{med.name}</h4>
                        <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Prescribed by</p>
                        <p className="text-sm font-medium text-gray-900">{med.prescribedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Visit History</h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Visit</span>
                </button>
              </div>
              
              {visits.map((visit: any) => (
                <motion.div
                  key={visit.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{visit.type} Visit</h4>
                      <p className="text-sm text-gray-600">{visit.date} at {visit.time} • {visit.department}</p>
                      <p className="text-sm text-gray-600">Dr. {visit.doctor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      visit.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Chief Complaint</h5>
                      <p className="text-sm text-gray-700">{visit.chiefComplaint}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Vital Signs</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>BP: {visit.vitals.bp}</div>
                        <div>Pulse: {visit.vitals.pulse}</div>
                        <div>Temp: {visit.vitals.temp}</div>
                        <div>Weight: {visit.vitals.weight}</div>
                      </div>
                    </div>
                  </div>
                  
                  {visit.attachments && visit.attachments.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Attachments</h5>
                      <div className="flex flex-wrap gap-2">
                        {visit.attachments.map((attachment: string) => (
                          <span key={attachment} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {attachment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Prescription</span>
                </button>
              </div>
              
              {prescriptions.map((prescription: any) => (
                <motion.div
                  key={prescription.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Prescription #{prescription.id}</h4>
                      <p className="text-sm text-gray-600">{prescription.date} • Dr. {prescription.doctor}</p>
                      <p className="text-sm text-gray-600">Pharmacy: {prescription.pharmacy}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prescription.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {prescription.medications.map((med: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{med.name} {med.strength}</h5>
                          <p className="text-sm text-gray-600">{med.frequency} for {med.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Qty: {med.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {prescription.instructions && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1">Instructions</h5>
                      <p className="text-sm text-blue-800">{prescription.instructions}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Laboratory Results</h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Order Lab</span>
                </button>
              </div>
              
              {labResults.map((lab: any) => (
                <motion.div
                  key={lab.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{lab.type}</h4>
                      <p className="text-sm text-gray-600">{lab.date} • Ordered by Dr. {lab.orderedBy}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lab.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2">Test</th>
                          <th className="text-left py-2">Result</th>
                          <th className="text-left py-2">Unit</th>
                          <th className="text-left py-2">Reference Range</th>
                          <th className="text-left py-2">Flag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lab.results.map((result: any, index: number) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-2 font-medium">{result.test}</td>
                            <td className="py-2">{result.value}</td>
                            <td className="py-2">{result.unit}</td>
                            <td className="py-2">{result.range}</td>
                            <td className="py-2">
                              {result.flag && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  result.flag === 'High' ? 'bg-red-100 text-red-800' :
                                  result.flag === 'Low' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {result.flag}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">SOAP Notes</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    <span>{isRecording ? 'Stop Recording' : 'Voice to Text'}</span>
                  </button>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Note</span>
                  </button>
                </div>
              </div>
              
              {visits.map((visit: any) => (
                visit.soap && (
                  <motion.div
                    key={visit.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">SOAP Note - {visit.date}</h4>
                        <p className="text-sm text-gray-600">Dr. {visit.doctor} • {visit.department}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-900">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Subjective
                          </h5>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">{visit.soap.subjective}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Objective
                          </h5>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">{visit.soap.objective}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Clipboard className="h-4 w-4 mr-2" />
                            Assessment
                          </h5>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">{visit.soap.assessment}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Plan
                          </h5>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">{visit.soap.plan}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const filteredPatients = ehrData.patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterTag === 'all' || 
      patient.tags.some(tag => tag.toLowerCase() === filterTag.toLowerCase())
    
    return matchesSearch && matchesFilter
  })

  const selectedPatientData = selectedPatient 
    ? ehrData.patients.find(p => p.id === selectedPatient)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Electronic Health Records</h1>
            <p className="text-gray-600 mt-1">Comprehensive patient medical records management</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Patient</span>
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="all">All Tags</option>
                    <option value="vip">VIP</option>
                    <option value="chronic">Chronic</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatientData ? (
              <PatientDetails patient={selectedPatientData} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Choose a patient from the list to view their electronic health record</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EHR