import { io, Socket } from 'socket.io-client'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'doctor' | 'admin' | 'nurse' | 'pharmacist' | 'lab_technician'
  createdAt: string
  lastLogin: string
}

export interface Patient {
  id: string
  mrn: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  department: string
  doctor: string
  address: string
  emergencyContact: string
  insurance: string
  allergies: string[]
  chronicConditions: string[]
  preferredLanguage: string
  tags: string[]
  lastVisit: string
  status: 'Active' | 'Inactive' | 'Discharged'
  currentMedications: Medication[]
  riskScore: number
  lastAIAnalysis: string
  telemedicineEligible: boolean
  healthGoals: string[]
  socialDeterminants: SocialDeterminants
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
}

export interface SocialDeterminants {
  education: string
  employment: string
  housing: string
  transportation: string
  foodSecurity: string
}

export interface Visit {
  id: string
  patientId: string
  date: string
  time: string
  department: string
  doctor: string
  type: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  chiefComplaint: string
  vitals: VitalSigns
  soap: SOAPNote
  attachments: string[]
  aiRecommendations: string[]
  telemedicineUsed: boolean
  clinicalPathway: string | null
  qualityMetrics: QualityMetrics
  createdAt: string
  createdBy: string
}

export interface VitalSigns {
  bp?: string
  pulse?: string
  temp?: string
  weight?: string
  height?: string
  oxygen?: string
}

export interface SOAPNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface QualityMetrics {
  documentationComplete: boolean
  medicationsReconciled: boolean
  followUpScheduled: boolean
  patientSatisfaction: number | null
}

export interface Prescription {
  id: string
  patientId: string
  date: string
  doctor: string
  medications: PrescriptionMedication[]
  status: 'Active' | 'Discontinued' | 'Completed'
  pharmacy: string
  instructions: string
  aiDrugInteractions: string[]
  costAnalysis: CostAnalysis
  adherenceTracking: AdherenceTracking
  createdAt: string
  createdBy: string
}

export interface PrescriptionMedication {
  name: string
  strength: string
  quantity: string
  frequency: string
  duration: string
}

export interface CostAnalysis {
  totalCost: number
  insuranceCoverage: number
  patientCost: number
}

export interface AdherenceTracking {
  lastRefill: string
  nextRefill: string | null
  adherenceRate: number
}

export interface LabResult {
  id: string
  patientId: string
  date: string
  type: string
  orderedBy: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
  results: LabTestResult[]
  aiInterpretation: string
  trendAnalysis: Record<string, string>
  createdAt: string
  createdBy: string
}

export interface LabTestResult {
  test: string
  value: string
  unit: string
  range: string
  flag?: 'High' | 'Low' | 'Normal'
}

export interface TelemedicineSession {
  id: string
  patientId: string
  date: string
  duration: string
  provider: string
  type: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  platform: string
  quality: string
  notes: string
  recording: string | null
  satisfaction: number | null
  createdAt: string
  createdBy: string
}

export interface MedicationReconciliation {
  id: string
  patientId: string
  date: string
  pharmacist: string
  status: 'Pending' | 'In Progress' | 'Completed'
  discrepancies: Discrepancy[]
  interventions: string[]
  costSavings: number
  createdAt: string
  createdBy: string
}

export interface Discrepancy {
  type: string
  medication: string
  oldDosage: string
  newDosage: string
  reason: string
}

export interface ClinicalPathway {
  id: string
  name: string
  patientId: string
  startDate: string
  status: 'Active' | 'Completed' | 'Discontinued'
  steps: PathwayStep[]
  outcomes: Record<string, any>
  createdAt: string
  createdBy: string
}

export interface PathwayStep {
  step: number
  description: string
  completed: boolean
  date?: string
  dueDate?: string
}

export interface AIInsights {
  patientId: string
  riskAssessment: RiskAssessment
  predictiveAnalytics: string[]
  clinicalRecommendations: string[]
  patientEngagement: PatientEngagement
}

export interface RiskAssessment {
  overallRisk: 'Low' | 'Moderate' | 'High'
  cardiacRisk: 'Low' | 'Moderate' | 'High'
  diabetesRisk: 'Low' | 'Moderate' | 'High'
  kidneyRisk: 'Low' | 'Moderate' | 'High'
}

export interface PatientEngagement {
  preferredCommunication: string
  engagementScore: number
  nextBestAction: string
}

export interface Analytics {
  departmentMetrics: Record<string, DepartmentMetrics>
  qualityMetrics: QualityMetricsData
}

export interface DepartmentMetrics {
  patientCount: number
  avgWaitTime: string
  satisfactionScore: number
  readmissionRate: number
  revenue: number
}

export interface QualityMetricsData {
  documentationCompleteness: number
  medicationReconciliationRate: number
  followUpCompliance: number
  patientSatisfaction: number
  clinicalOutcomes: ClinicalOutcomes
}

export interface ClinicalOutcomes {
  hba1cControl: number
  bpControl: number
  medicationAdherence: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalPatients: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  pagination?: PaginationInfo
}

// API Service Class
class ApiService {
  private token: string | null = null
  private socket: Socket | null = null

  constructor() {
    this.token = localStorage.getItem('authToken')
    this.initializeSocket()
  }

  // Authentication
  setToken(token: string) {
    this.token = token
    localStorage.setItem('authToken', token)
    this.initializeSocket()
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('authToken')
    this.disconnectSocket()
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const config: RequestInit = {
        headers: this.getHeaders(),
        ...options,
      }

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication API
  async register(userData: {
    name: string
    email: string
    password: string
    role?: string
  }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.data) {
      this.setToken(response.data.token)
    }
    
    return response.data!
  }

  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.data) {
      this.setToken(response.data.token)
    }
    
    return response.data!
  }

  // Patient Management API
  async getPatients(params?: {
    search?: string
    filter?: string
    page?: number
    limit?: number
  }): Promise<{ patients: Patient[]; pagination: PaginationInfo }> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.filter) queryParams.append('filter', params.filter)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await this.request<{ patients: Patient[]; pagination: PaginationInfo }>(
      `/patients?${queryParams.toString()}`
    )
    return response.data!
  }

  async getPatient(id: string): Promise<{
    patient: Patient
    visits: Visit[]
    prescriptions: Prescription[]
    labResults: LabResult[]
    radiology: any[]
    notes: any[]
    telemedicine: TelemedicineSession[]
    reconciliations: MedicationReconciliation[]
    pathways: ClinicalPathway[]
    aiInsights: AIInsights | null
  }> {
    const response = await this.request<any>(`/patients/${id}`)
    return response.data!
  }

  async createPatient(patientData: Partial<Patient>): Promise<{ patient: Patient }> {
    const response = await this.request<{ patient: Patient }>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    })
    return response.data!
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<{ patient: Patient }> {
    const response = await this.request<{ patient: Patient }>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    })
    return response.data!
  }

  // Visit Management API
  async createVisit(visitData: Partial<Visit>): Promise<{ visit: Visit }> {
    const response = await this.request<{ visit: Visit }>('/visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    })
    return response.data!
  }

  // Prescription Management API
  async createPrescription(prescriptionData: Partial<Prescription>): Promise<{ prescription: Prescription }> {
    const response = await this.request<{ prescription: Prescription }>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    })
    return response.data!
  }

  // Lab Results API
  async createLabResult(labData: Partial<LabResult>): Promise<{ labResult: LabResult }> {
    const response = await this.request<{ labResult: LabResult }>('/lab-results', {
      method: 'POST',
      body: JSON.stringify(labData),
    })
    return response.data!
  }

  // SOAP Notes API
  async createSOAPNote(noteData: Partial<any>): Promise<{ note: any }> {
    const response = await this.request<{ note: any }>('/soap-notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    })
    return response.data!
  }

  // Telemedicine API
  async createTelemedicineSession(sessionData: Partial<TelemedicineSession>): Promise<{ session: TelemedicineSession }> {
    const response = await this.request<{ session: TelemedicineSession }>('/telemedicine-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
    return response.data!
  }

  // Medication Reconciliation API
  async createMedicationReconciliation(reconciliationData: Partial<MedicationReconciliation>): Promise<{ reconciliation: MedicationReconciliation }> {
    const response = await this.request<{ reconciliation: MedicationReconciliation }>('/medication-reconciliation', {
      method: 'POST',
      body: JSON.stringify(reconciliationData),
    })
    return response.data!
  }

  // Clinical Pathways API
  async createClinicalPathway(pathwayData: Partial<ClinicalPathway>): Promise<{ pathway: ClinicalPathway }> {
    const response = await this.request<{ pathway: ClinicalPathway }>('/clinical-pathways', {
      method: 'POST',
      body: JSON.stringify(pathwayData),
    })
    return response.data!
  }

  // Analytics API
  async getAnalytics(params?: { department?: string; dateRange?: string }): Promise<Analytics> {
    const queryParams = new URLSearchParams()
    if (params?.department) queryParams.append('department', params.department)
    if (params?.dateRange) queryParams.append('dateRange', params.dateRange)

    const response = await this.request<Analytics>(`/analytics?${queryParams.toString()}`)
    return response.data!
  }

  // File Upload API
  async uploadFile(file: File): Promise<{ file: any }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  }

  // Export API
  async exportData(type: string, id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/export/${type}/${id}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    return response.blob()
  }

  // Health Check API
  async healthCheck(): Promise<any> {
    const response = await this.request<any>('/health')
    return response.data!
  }

  // WebSocket Management
  private initializeSocket() {
    if (!this.token) return

    this.socket = io(SOCKET_URL, {
      auth: {
        token: this.token,
      },
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  private disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // WebSocket methods
  joinPatientRoom(patientId: string) {
    if (this.socket) {
      this.socket.emit('join-patient-room', patientId)
    }
  }

  leavePatientRoom(patientId: string) {
    if (this.socket) {
      this.socket.emit('leave-patient-room', patientId)
    }
  }

  onPatientUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('patient-updated', callback)
    }
  }

  onVisitCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('visit-created', callback)
    }
  }

  onPrescriptionCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('prescription-created', callback)
    }
  }

  // Utility methods
  downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Error handling
  handleError(error: any): string {
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService 