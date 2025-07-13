import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoutConfirmationModal from '../components/LogoutConfirmationModal'
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
  Clipboard,
  Calendar,
  Shield,
  Brain,
  Video,
  MessageCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Activity,
  Clock,
  Bell,
  Smartphone,
  Wifi,
  Database,
  Lock,
  Globe,
  Users,
  FileCheck,
  AlertTriangle,
  Star,
  BookOpen,
  Target,
  Route,
  PieChart,
  LineChart,
  MapPin,
  Phone,
  Mail,
  Camera,
  Headphones,
  Monitor,
  Tablet,
  Printer,
  Share2,
  Copy,
  Archive,
  Trash2,
  Settings,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Minus,
  RotateCcw,
  Save,
  Send,
  Paperclip,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Tag,
  AtSign,
  DollarSign,
  Percent
} from 'lucide-react'
import { motion } from 'framer-motion'

const EHR: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [isRecording, setIsRecording] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // New enhanced features state
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [telemedicineSession, setTelemedicineSession] = useState<any>(null)
  const [medicationReconciliation, setMedicationReconciliation] = useState<any>(null)
  const [clinicalPathways, setClinicalPathways] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showTelemedicine, setShowTelemedicine] = useState(false)
  const [showMedicationReconciliation, setShowMedicationReconciliation] = useState(false)
  const [showClinicalPathways, setShowClinicalPathways] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Modal states for all buttons
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showEditPatientModal, setShowEditPatientModal] = useState(false)
  const [showRemovePatientModal, setShowRemovePatientModal] = useState(false)
  const [showNewVisitModal, setShowNewVisitModal] = useState(false)
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false)
  const [showOrderLabModal, setShowOrderLabModal] = useState(false)
  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false)
  const [showReconciliationModal, setShowReconciliationModal] = useState(false)
  const [showPathwayModal, setShowPathwayModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showEditNoteModal, setShowEditNoteModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  // Form states
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    department: 'Cardiology',
    doctor: 'Dr. Rajesh Sharma'
  })

  const [newVisitForm, setNewVisitForm] = useState({
    type: 'Follow-up',
    chiefComplaint: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM'
  })

  const [newPrescriptionForm, setNewPrescriptionForm] = useState({
    medications: [{ name: '', strength: '', quantity: '', frequency: '', duration: '' }],
    instructions: '',
    pharmacy: 'Apollo Pharmacy'
  })

  const [newNoteForm, setNewNoteForm] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  })

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success'
  })

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000)
  }

  const handleBackToPlatform = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/', { replace: true })
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  // Button handlers
  const handleNewPatient = () => {
    setShowNewPatientModal(true)
  }

  const handleImport = () => {
    setShowImportModal(true)
  }

  const handleEditPatient = () => {
    if (selectedPatient) {
      setShowEditPatientModal(true)
    }
  }

  const handleRemovePatient = () => {
    if (selectedPatient) {
      setShowRemovePatientModal(true)
    }
  }

  const handleDownloadPatient = () => {
    if (selectedPatient) {
      const patientData = ehrData.patients.find(p => p.id === selectedPatient)
      if (patientData) {
        const dataStr = JSON.stringify(patientData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `patient_${patientData.mrn}.json`
        link.click()
        URL.revokeObjectURL(url)
        showNotification('Patient data downloaded successfully')
      }
    }
  }

  const handleNewVisit = () => {
    if (selectedPatient) {
      setShowNewVisitModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleNewPrescription = () => {
    if (selectedPatient) {
      setShowNewPrescriptionModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleOrderLab = () => {
    if (selectedPatient) {
      setShowOrderLabModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleNewNote = () => {
    if (selectedPatient) {
      setShowNewNoteModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleStartTelemedicine = () => {
    if (selectedPatient) {
      setShowTelemedicineModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleNewReconciliation = () => {
    if (selectedPatient) {
      setShowReconciliationModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleNewPathway = () => {
    if (selectedPatient) {
      setShowPathwayModal(true)
    } else {
      showNotification('Please select a patient first', 'error')
    }
  }

  const handleExportReport = () => {
    const analyticsData = {
      department: selectedPatient ? ehrData.patients.find(p => p.id === selectedPatient)?.department : 'All',
      dateRange: 'Last 30 Days',
      metrics: ehrData.analytics
    }
    
    const csvContent = `Department,Patient Count,Avg Wait Time,Satisfaction Score,Readmission Rate\n${analyticsData.department},156,15 minutes,4.6,8.2%`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    showNotification('Analytics report exported successfully')
  }

  const handleEditNote = () => {
    setShowEditNoteModal(true)
  }

  const handleDownloadNote = () => {
    const noteContent = `SOAP Note - ${new Date().toLocaleDateString()}\n\nSubjective: Patient reports...\nObjective: BP 140/90, HR 78...\nAssessment: Hypertension...\nPlan: Continue medications...`
    const blob = new Blob([noteContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `soap_note_${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
    showNotification('SOAP note downloaded successfully')
  }

  const handleFilter = () => {
    setShowFilterModal(true)
  }

  // Form submission handlers
  const handleSubmitNewPatient = () => {
    // Validate required fields
    if (!newPatientForm.name || !newPatientForm.age || !newPatientForm.phone) {
      showNotification('Please fill in all required fields (Name, Age, Phone)', 'error')
      return
    }

    const newPatient = {
      id: `PAT-${Date.now()}`,
      mrn: `MRN-${Math.floor(Math.random() * 1000000)}`,
      ...newPatientForm,
      age: parseInt(newPatientForm.age),
      tags: ['New'],
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active',
      address: 'Address to be updated',
      emergencyContact: 'Emergency contact to be updated',
      insurance: 'Insurance to be updated',
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      riskScore: Math.random() * 10,
      lastAIAnalysis: new Date().toISOString(),
      telemedicineEligible: true,
      preferredLanguage: 'English',
      healthGoals: [],
      socialDeterminants: {
        education: 'Unknown',
        employment: 'Unknown',
        housing: 'Unknown',
        transportation: 'Unknown',
        foodSecurity: 'Unknown'
      }
    }
    
    // Add the new patient to the list
    setEhrData(prevData => ({
      ...prevData,
      patients: [...prevData.patients, newPatient]
    }))
    
    showNotification('New patient added successfully')
    setShowNewPatientModal(false)
    setNewPatientForm({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      department: 'Cardiology',
      doctor: 'Dr. Rajesh Sharma'
    })
  }

  const handleSubmitNewVisit = () => {
    showNotification('New visit scheduled successfully')
    setShowNewVisitModal(false)
    setNewVisitForm({
      type: 'Follow-up',
      chiefComplaint: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM'
    })
  }

  const handleSubmitNewPrescription = () => {
    showNotification('New prescription created successfully')
    setShowNewPrescriptionModal(false)
    setNewPrescriptionForm({
      medications: [{ name: '', strength: '', quantity: '', frequency: '', duration: '' }],
      instructions: '',
      pharmacy: 'Apollo Pharmacy'
    })
  }

  const handleSubmitNewNote = () => {
    showNotification('New SOAP note created successfully')
    setShowNewNoteModal(false)
    setNewNoteForm({
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    })
  }

  const handleImportSubmit = () => {
    showNotification('Data imported successfully')
    setShowImportModal(false)
  }

  const handleTelemedicineStart = () => {
    showNotification('Telemedicine session started')
    setShowTelemedicineModal(false)
  }

  const handleReconciliationSubmit = () => {
    showNotification('Medication reconciliation completed')
    setShowReconciliationModal(false)
  }

  const handlePathwaySubmit = () => {
    showNotification('New clinical pathway created')
    setShowPathwayModal(false)
  }

  const handleRemovePatientConfirm = () => {
    if (selectedPatient) {
      // Remove the patient from the list
      setEhrData(prevData => ({
        ...prevData,
        patients: prevData.patients.filter(p => p.id !== selectedPatient)
      }))
      
      // Clear the selected patient
      setSelectedPatient(null)
      
      showNotification('Patient removed successfully')
      setShowRemovePatientModal(false)
    }
  }

  const handleRemovePatientCancel = () => {
    setShowRemovePatientModal(false)
  }

  // Mock EHR data with state management
  const [ehrData, setEhrData] = useState({
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
        ],
        // Enhanced patient data
        riskScore: 8.5,
        lastAIAnalysis: '2024-01-15T10:30:00Z',
        telemedicineEligible: true,
        preferredLanguage: 'Hindi',
        healthGoals: ['Blood pressure control', 'Weight management'],
        socialDeterminants: {
          education: 'High School',
          employment: 'Retired',
          housing: 'Own',
          transportation: 'Family support',
          foodSecurity: 'Secure'
        }
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
        ],
        // Enhanced patient data
        riskScore: 4.2,
        lastAIAnalysis: '2024-01-14T14:15:00Z',
        telemedicineEligible: true,
        preferredLanguage: 'English',
        healthGoals: ['Asthma control', 'Exercise tolerance'],
        socialDeterminants: {
          education: 'Graduate',
          employment: 'Software Engineer',
          housing: 'Rent',
          transportation: 'Public transport',
          foodSecurity: 'Secure'
        }
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
        attachments: ['ECG_20240115.pdf', 'Lab_Results_20240115.pdf'],
        // Enhanced visit data
        aiRecommendations: [
          'Consider cardiac stress test for chest pain evaluation',
          'Monitor blood pressure more frequently',
          'Review medication adherence'
        ],
        telemedicineUsed: false,
        clinicalPathway: 'Hypertension Management',
        qualityMetrics: {
          documentationComplete: true,
          medicationsReconciled: true,
          followUpScheduled: true,
          patientSatisfaction: 4.5
        }
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
        instructions: 'Take with food. Monitor blood pressure daily.',
        // Enhanced prescription data
        aiDrugInteractions: [],
        costAnalysis: {
          totalCost: 450,
          insuranceCoverage: 80,
          patientCost: 90
        },
        adherenceTracking: {
          lastRefill: '2024-01-15',
          nextRefill: '2024-02-15',
          adherenceRate: 95
        }
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
        ],
        // Enhanced lab data
        aiInterpretation: 'Results suggest poor glycemic control and dyslipidemia. Consider intensifying diabetes management.',
        trendAnalysis: {
          glucose: 'Increasing trend over 6 months',
          hba1c: 'Stable but above target',
          cholesterol: 'Improving with statin therapy'
        }
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
        images: ['chest_xray_001.jpg'],
        // Enhanced radiology data
        aiAnalysis: 'AI detected mild cardiomegaly with 92% confidence. No acute findings.',
        comparisonStudy: 'Compared to previous CXR from 2023-12-01: No significant interval change.'
      }
    ],
    // New enhanced data sections
    aiInsights: {
      'PAT-001': {
        riskAssessment: {
          overallRisk: 'Moderate',
          cardiacRisk: 'High',
          diabetesRisk: 'High',
          kidneyRisk: 'Low'
        },
        predictiveAnalytics: [
          'High risk of cardiovascular event in next 6 months',
          'Likely to need medication adjustment within 30 days',
          'Good candidate for telemedicine follow-up'
        ],
        clinicalRecommendations: [
          'Intensify blood pressure monitoring',
          'Consider adding statin therapy',
          'Schedule cardiac stress test',
          'Refer to diabetes educator'
        ],
        patientEngagement: {
          preferredCommunication: 'SMS',
          engagementScore: 7.5,
          nextBestAction: 'Schedule telemedicine appointment'
        }
      }
    },
    telemedicineSessions: [
      {
        id: 'TELE-001',
        patientId: 'PAT-001',
        date: '2024-01-10',
        duration: '25 minutes',
        provider: 'Dr. Rajesh Sharma',
        type: 'Follow-up',
        status: 'Completed',
        platform: 'WellConX Telemedicine',
        quality: 'HD',
        notes: 'Patient reported improved symptoms. BP well controlled.',
        recording: 'tele_session_001.mp4',
        satisfaction: 4.8
      }
    ],
    medicationReconciliation: [
      {
        id: 'RECON-001',
        patientId: 'PAT-001',
        date: '2024-01-15',
        pharmacist: 'Dr. Anita Kumar',
        status: 'Completed',
        discrepancies: [
          {
            type: 'Dosage Change',
            medication: 'Lisinopril',
            oldDosage: '10mg',
            newDosage: '20mg',
            reason: 'Blood pressure not at target'
          }
        ],
        interventions: [
          'Discontinued duplicate medication',
          'Updated allergy information',
          'Added medication reminder system'
        ],
        costSavings: 120
      }
    ],
    clinicalPathways: [
      {
        id: 'PATH-001',
        name: 'Hypertension Management',
        patientId: 'PAT-001',
        startDate: '2024-01-15',
        status: 'Active',
        steps: [
          { step: 1, description: 'Initial Assessment', completed: true, date: '2024-01-15' },
          { step: 2, description: 'Medication Adjustment', completed: true, date: '2024-01-15' },
          { step: 3, description: 'Lifestyle Counseling', completed: false, dueDate: '2024-01-22' },
          { step: 4, description: 'Follow-up Visit', completed: false, dueDate: '2024-02-15' },
          { step: 5, description: 'Outcome Assessment', completed: false, dueDate: '2024-03-15' }
        ],
        outcomes: {
          targetBP: '<140/90',
          currentBP: '140/90',
          progress: 40
        }
      }
    ],
    analytics: {
      departmentMetrics: {
        cardiology: {
          patientCount: 156,
          avgWaitTime: '15 minutes',
          satisfactionScore: 4.6,
          readmissionRate: 8.2,
          revenue: 1250000
        },
        pulmonology: {
          patientCount: 89,
          avgWaitTime: '12 minutes',
          satisfactionScore: 4.4,
          readmissionRate: 6.8,
          revenue: 890000
        }
      },
      qualityMetrics: {
        documentationCompleteness: 94.5,
        medicationReconciliationRate: 98.2,
        followUpCompliance: 87.3,
        patientSatisfaction: 4.5,
        clinicalOutcomes: {
          hba1cControl: 78.5,
          bpControl: 82.1,
          medicationAdherence: 91.3
        }
      }
    }
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
              <button 
                onClick={handleEditPatient}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit Patient"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button 
                onClick={handleDownloadPatient}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download Patient Data"
              >
                <Download className="h-5 w-5" />
              </button>
              <button 
                onClick={handleRemovePatient}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors"
                title="Remove Patient"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: User },
              { id: 'visits', name: 'Visit History', icon: Calendar },
              { id: 'prescriptions', name: 'Prescriptions', icon: Pill },
              { id: 'labs', name: 'Lab Results', icon: TestTube },
              { id: 'radiology', name: 'Radiology', icon: Image },
              { id: 'notes', name: 'SOAP Notes', icon: FileText },
              { id: 'ai-insights', name: 'AI Insights', icon: Brain },
              { id: 'telemedicine', name: 'Telemedicine', icon: Video },
              { id: 'medication-reconciliation', name: 'Medication Reconciliation', icon: FileCheck },
              { id: 'clinical-pathways', name: 'Clinical Pathways', icon: Route },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
                <button 
                  onClick={handleNewVisit}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
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
                <button 
                  onClick={handleNewPrescription}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
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
                <button 
                  onClick={handleOrderLab}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
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
                  <button 
                    onClick={handleNewNote}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
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
                        <button 
                          onClick={handleEditNote}
                          className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Edit Note"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={handleDownloadNote}
                          className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Download Note"
                        >
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

          {/* AI Insights Tab */}
          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary-600" />
                  AI Clinical Insights
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">AI Active</span>
                </div>
              </div>

              {ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Assessment */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Risk Assessment
                    </h4>
                    <div className="space-y-3">
                      {Object.entries((ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] as any)?.riskAssessment || {}).map(([risk, level]: [string, any]) => (
                        <div key={risk} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800 capitalize">
                            {risk.replace(/([A-Z])/g, ' $1').trim()} Risk
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            level === 'High' ? 'bg-red-100 text-red-800' :
                            level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {String(level)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Predictive Analytics */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Predictive Analytics
                    </h4>
                    <div className="space-y-2">
                      {((ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] as any)?.predictiveAnalytics || []).map((prediction: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-purple-800">{prediction}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Recommendations */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Clinical Recommendations
                    </h4>
                    <div className="space-y-2">
                      {((ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] as any)?.clinicalRecommendations || []).map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-green-800">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patient Engagement */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Patient Engagement
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800">Engagement Score</span>
                        <span className="text-lg font-bold text-orange-900">
                          {(ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] as any)?.patientEngagement?.engagementScore || 0}/10
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800">Preferred Communication</span>
                        <span className="text-sm text-orange-800">
                          {(ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] as any)?.patientEngagement?.preferredCommunication || 'N/A'}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-sm font-medium text-orange-800">Next Best Action:</span>
                        <p className="text-sm text-orange-700 mt-1">
                          {(ehrData.aiInsights[patient.id as keyof typeof ehrData.aiInsights] as any)?.patientEngagement?.nextBestAction || 'No action required'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Telemedicine Tab */}
          {activeTab === 'telemedicine' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Video className="h-5 w-5 mr-2 text-primary-600" />
                  Telemedicine Sessions
                </h3>
                <button 
                  onClick={handleStartTelemedicine}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Start New Session</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Session History */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Session History</h4>
                  <div className="space-y-4">
                    {ehrData.telemedicineSessions
                      .filter(session => session.patientId === patient.id)
                      .map(session => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{session.date}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Provider: {session.provider}</div>
                            <div>Duration: {session.duration}</div>
                            <div>Platform: {session.platform}</div>
                            <div>Quality: {session.quality}</div>
                            <div>Satisfaction: {session.satisfaction}/5</div>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {session.notes}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Telemedicine Eligibility & Setup */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Telemedicine Eligibility
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Eligible for Telemedicine</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.telemedicineEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {patient.telemedicineEligible ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Preferred Language</span>
                        <span className="text-sm text-blue-800">{patient.preferredLanguage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Last AI Analysis</span>
                        <span className="text-sm text-blue-800">
                          {new Date(patient.lastAIAnalysis).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Device Compatibility
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Mobile App</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Web Browser</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Video Quality</span>
                        <span className="text-sm text-green-800">HD Ready</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Internet Speed</span>
                        <span className="text-sm text-green-800">Sufficient</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medication Reconciliation Tab */}
          {activeTab === 'medication-reconciliation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-primary-600" />
                  Medication Reconciliation
                </h3>
                <button 
                  onClick={handleNewReconciliation}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Reconciliation</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Medications */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Current Medications</h4>
                  <div className="space-y-3">
                    {patient.currentMedications.map((med: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{med.name}</span>
                          <span className="text-sm text-gray-600">{med.dosage}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Frequency: {med.frequency}</div>
                          <div>Prescribed by: {med.prescribedBy}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reconciliation History */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Reconciliation History</h4>
                  <div className="space-y-4">
                    {ehrData.medicationReconciliation
                      .filter(recon => recon.patientId === patient.id)
                      .map(recon => (
                        <div key={recon.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-900">{recon.date}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              recon.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {recon.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            Pharmacist: {recon.pharmacist}
                          </div>
                          
                          {recon.discrepancies.length > 0 && (
                            <div className="mb-3">
                              <h5 className="font-medium text-gray-900 mb-2">Discrepancies Found:</h5>
                              <div className="space-y-2">
                                {recon.discrepancies.map((disc: any, index: number) => (
                                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                    <div className="font-medium text-yellow-800">{disc.type}</div>
                                    <div className="text-sm text-yellow-700">
                                      {disc.medication}: {disc.oldDosage} → {disc.newDosage}
                                    </div>
                                    <div className="text-xs text-yellow-600">Reason: {disc.reason}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {recon.interventions.length > 0 && (
                            <div className="mb-3">
                              <h5 className="font-medium text-gray-900 mb-2">Interventions:</h5>
                              <div className="space-y-1">
                                {recon.interventions.map((intervention: string, index: number) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <span className="text-sm text-gray-700">{intervention}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-gray-600">
                            Cost Savings: ₹{recon.costSavings}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Pathways Tab */}
          {activeTab === 'clinical-pathways' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Route className="h-5 w-5 mr-2 text-primary-600" />
                  Clinical Pathways
                </h3>
                <button 
                  onClick={handleNewPathway}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Pathway</span>
                </button>
              </div>

              <div className="space-y-6">
                {ehrData.clinicalPathways
                  .filter(pathway => pathway.patientId === patient.id)
                  .map(pathway => (
                    <div key={pathway.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{pathway.name}</h4>
                          <p className="text-sm text-gray-600">Started: {pathway.startDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pathway.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pathway.status}
                        </span>
                      </div>

                      {/* Pathway Steps */}
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-4">Pathway Steps</h5>
                        <div className="space-y-3">
                          {pathway.steps.map((step: any) => (
                            <div key={step.step} className="flex items-center space-x-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {step.completed ? <Check className="h-4 w-4" /> : step.step}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{step.description}</div>
                                <div className="text-sm text-gray-600">
                                  {step.completed ? `Completed: ${step.date}` : `Due: ${step.dueDate}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outcomes */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 mb-3">Outcomes</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm text-blue-700">Target BP</span>
                            <div className="font-semibold text-blue-900">{pathway.outcomes.targetBP}</div>
                          </div>
                          <div>
                            <span className="text-sm text-blue-700">Current BP</span>
                            <div className="font-semibold text-blue-900">{pathway.outcomes.currentBP}</div>
                          </div>
                          <div>
                            <span className="text-sm text-blue-700">Progress</span>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${pathway.outcomes.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-blue-900">{pathway.outcomes.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
                  Clinical Analytics
                </h3>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                  <button 
                    onClick={handleExportReport}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Metrics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Department Performance</h4>
                  <div className="space-y-4">
                    {Object.entries(ehrData.analytics.departmentMetrics).map(([dept, metrics]: [string, any]) => (
                      <div key={dept} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 capitalize mb-3">{dept}</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Patients</span>
                            <div className="font-semibold text-gray-900">{metrics.patientCount}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Wait Time</span>
                            <div className="font-semibold text-gray-900">{metrics.avgWaitTime}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Satisfaction</span>
                            <div className="font-semibold text-gray-900">{metrics.satisfactionScore}/5</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Readmission</span>
                            <div className="font-semibold text-gray-900">{metrics.readmissionRate}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quality Metrics</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{ehrData.analytics.qualityMetrics.documentationCompleteness}%</div>
                        <div className="text-sm text-green-700">Documentation Complete</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{ehrData.analytics.qualityMetrics.medicationReconciliationRate}%</div>
                        <div className="text-sm text-blue-700">Medication Reconciled</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{ehrData.analytics.qualityMetrics.followUpCompliance}%</div>
                        <div className="text-sm text-purple-700">Follow-up Compliance</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{ehrData.analytics.qualityMetrics.patientSatisfaction}/5</div>
                        <div className="text-sm text-orange-700">Patient Satisfaction</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Clinical Outcomes</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">HbA1c Control</span>
                          <span className="font-semibold text-gray-900">{ehrData.analytics.qualityMetrics.clinicalOutcomes.hba1cControl}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">BP Control</span>
                          <span className="font-semibold text-gray-900">{ehrData.analytics.qualityMetrics.clinicalOutcomes.bpControl}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Medication Adherence</span>
                          <span className="font-semibold text-gray-900">{ehrData.analytics.qualityMetrics.clinicalOutcomes.medicationAdherence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
      {/* Header with Back to Platform */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EHR Module</h1>
                <p className="text-sm text-gray-500">Electronic Health Records</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <button
                    onClick={handleBackToPlatform}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Back to Platform
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Electronic Health Records</h1>
            <p className="text-gray-600 mt-1">Comprehensive patient medical records management</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleNewPatient}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Patient</span>
            </button>
            <button 
              onClick={handleImport}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
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
                  <button 
                    onClick={handleFilter}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Advanced Filter"
                  >
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {notification.type === 'info' && <Info className="h-5 w-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Patient</h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form id="newPatientForm" onSubmit={(e) => {
              e.preventDefault()
              handleSubmitNewPatient()
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPatientForm.name}
                  onChange={(e) => setNewPatientForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPatientForm.age}
                    onChange={(e) => setNewPatientForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Age"
                    min="0"
                    max="150"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={(e) => setNewPatientForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newPatientForm.phone}
                  onChange={(e) => setNewPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newPatientForm.email}
                  onChange={(e) => setNewPatientForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newPatientForm.department}
                    onChange={(e) => setNewPatientForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <select
                    value={newPatientForm.doctor}
                    onChange={(e) => setNewPatientForm(prev => ({ ...prev, doctor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma</option>
                    <option value="Dr. Priya Patel">Dr. Priya Patel</option>
                    <option value="Dr. Amit Kumar">Dr. Amit Kumar</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="newPatientForm"
                disabled={!newPatientForm.name || !newPatientForm.age || !newPatientForm.phone}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Import Data</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                <p className="text-sm text-gray-500">Supports: CSV, JSON, XML</p>
                <button className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  Choose Files
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Visit Modal */}
      {showNewVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule New Visit</h3>
              <button onClick={() => setShowNewVisitModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                <select
                  value={newVisitForm.type}
                  onChange={(e) => setNewVisitForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Initial">Initial</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newVisitForm.date}
                    onChange={(e) => setNewVisitForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newVisitForm.time}
                    onChange={(e) => setNewVisitForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                <textarea
                  value={newVisitForm.chiefComplaint}
                  onChange={(e) => setNewVisitForm(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe the main reason for visit"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewVisitModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewVisit}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Prescription Modal */}
      {showNewPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Prescription</h3>
              <button onClick={() => setShowNewPrescriptionModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                <input
                  type="text"
                  value={newPrescriptionForm.medications[0].name}
                  onChange={(e) => setNewPrescriptionForm(prev => ({
                    ...prev,
                    medications: [{ ...prev.medications[0], name: e.target.value }]
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Medication name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                  <input
                    type="text"
                    value={newPrescriptionForm.medications[0].strength}
                    onChange={(e) => setNewPrescriptionForm(prev => ({
                      ...prev,
                      medications: [{ ...prev.medications[0], strength: e.target.value }]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={newPrescriptionForm.medications[0].quantity}
                    onChange={(e) => setNewPrescriptionForm(prev => ({
                      ...prev,
                      medications: [{ ...prev.medications[0], quantity: e.target.value }]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 30 tablets"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newPrescriptionForm.medications[0].frequency}
                    onChange={(e) => setNewPrescriptionForm(prev => ({
                      ...prev,
                      medications: [{ ...prev.medications[0], frequency: e.target.value }]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Twice daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newPrescriptionForm.medications[0].duration}
                    onChange={(e) => setNewPrescriptionForm(prev => ({
                      ...prev,
                      medications: [{ ...prev.medications[0], duration: e.target.value }]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 30 days"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={newPrescriptionForm.instructions}
                  onChange={(e) => setNewPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Special instructions for the patient"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewPrescriptionModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewPrescription}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Lab Modal */}
      {showOrderLabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Laboratory Tests</h3>
              <button onClick={() => setShowOrderLabModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Blood Chemistry</option>
                  <option>Complete Blood Count</option>
                  <option>Lipid Profile</option>
                  <option>HbA1c</option>
                  <option>Liver Function Tests</option>
                  <option>Kidney Function Tests</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Routine</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Additional notes for the lab"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowOrderLabModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('Lab order placed successfully')
                  setShowOrderLabModal(false)
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Order Tests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New SOAP Note</h3>
              <button onClick={() => setShowNewNoteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjective</label>
                <textarea
                  value={newNoteForm.subjective}
                  onChange={(e) => setNewNoteForm(prev => ({ ...prev, subjective: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Patient's reported symptoms and history"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                <textarea
                  value={newNoteForm.objective}
                  onChange={(e) => setNewNoteForm(prev => ({ ...prev, objective: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Physical examination findings, vital signs, test results"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
                <textarea
                  value={newNoteForm.assessment}
                  onChange={(e) => setNewNoteForm(prev => ({ ...prev, assessment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Diagnosis and clinical impressions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <textarea
                  value={newNoteForm.plan}
                  onChange={(e) => setNewNoteForm(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Treatment plan, medications, follow-up"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewNote}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telemedicine Modal */}
      {showTelemedicineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Start Telemedicine Session</h3>
              <button onClick={() => setShowTelemedicineModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Session Details</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Patient: {selectedPatientData?.name}</div>
                  <div>Provider: {user?.name}</div>
                  <div>Platform: WellConX Telemedicine</div>
                  <div>Quality: HD</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Follow-up</option>
                  <option>Initial Consultation</option>
                  <option>Emergency</option>
                  <option>Routine Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Session notes"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTelemedicineModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTelemedicineStart}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation Modal */}
      {showReconciliationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Medication Reconciliation</h3>
              <button onClick={() => setShowReconciliationModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Current Medications</h4>
                <div className="text-sm text-yellow-800">
                  {selectedPatientData?.currentMedications.map((med: any, index: number) => (
                    <div key={index} className="mb-1">
                      • {med.name} {med.dosage} - {med.frequency}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reconciliation Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Document any discrepancies, changes, or interventions"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReconciliationModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReconciliationSubmit}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Complete Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pathway Modal */}
      {showPathwayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Clinical Pathway</h3>
              <button onClick={() => setShowPathwayModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pathway Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Hypertension Management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pathway Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Disease Management</option>
                  <option>Preventive Care</option>
                  <option>Post-Surgical</option>
                  <option>Chronic Care</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe the clinical pathway"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPathwayModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePathwaySubmit}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Pathway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Any Time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('Filters applied successfully')
                  setShowFilterModal(false)
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Patient</h3>
              <button onClick={() => setShowEditPatientModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
                <div className="text-sm text-blue-800">
                  <div>Name: {selectedPatientData?.name}</div>
                  <div>MRN: {selectedPatientData?.mrn}</div>
                  <div>Department: {selectedPatientData?.department}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedPatientData?.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={selectedPatientData?.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  defaultValue={selectedPatientData?.address}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditPatientModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('Patient information updated successfully')
                  setShowEditPatientModal(false)
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {showEditNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit SOAP Note</h3>
              <button onClick={() => setShowEditNoteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjective</label>
                <textarea
                  defaultValue="Patient reports intermittent chest pain over the past week, especially during physical activity."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                <textarea
                  defaultValue="BP elevated at 140/90, heart rate regular at 78 bpm. No acute distress observed."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
                <textarea
                  defaultValue="Hypertension, possible angina. ECG shows mild ST changes."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <textarea
                  defaultValue="Increase Lisinopril to 20mg daily. Schedule stress test. Follow-up in 2 weeks."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditNoteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('SOAP note updated successfully')
                  setShowEditNoteModal(false)
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Patient Confirmation Modal */}
      {showRemovePatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Remove Patient</h3>
              <button onClick={handleRemovePatientCancel} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Warning</h4>
                </div>
                <p className="text-sm text-red-800">
                  Are you sure you want to remove <strong>{selectedPatientData?.name}</strong> from the system?
                </p>
                <p className="text-sm text-red-700 mt-2">
                  This action cannot be undone. All patient data including visits, prescriptions, and medical records will be permanently deleted.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Patient Details</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Name: {selectedPatientData?.name}</div>
                  <div>MRN: {selectedPatientData?.mrn}</div>
                  <div>Age: {selectedPatientData?.age} years</div>
                  <div>Department: {selectedPatientData?.department}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleRemovePatientCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemovePatientConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove Patient</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EHR