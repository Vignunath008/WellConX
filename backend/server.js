import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Database setup (Supabase for production, SQLite for development)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

let supabase
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  console.log('⚠️  Supabase credentials not found. Using in-memory storage for development.')
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, 'uploads/'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'), false)
    }
  }
})

// In-memory storage for development (replace with database in production)
let users = []
let patients = []
let visits = []
let prescriptions = []
let labResults = []
let radiologyReports = []
let soapNotes = []
let telemedicineSessions = []
let medicationReconciliations = []
let clinicalPathways = []
let aiInsights = []

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    
    next()
  }
}

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'doctor' } = req.body

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    users.push(user)

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    user.lastLogin = new Date().toISOString()

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Patient Management API
app.get('/api/patients', authenticateToken, (req, res) => {
  try {
    const { search, filter, page = 1, limit = 20 } = req.query
    
    let filteredPatients = [...patients]
    
    // Search functionality
    if (search) {
      filteredPatients = filteredPatients.filter(patient =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(search.toLowerCase()) ||
        patient.department.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Filter functionality
    if (filter && filter !== 'all') {
      filteredPatients = filteredPatients.filter(patient =>
        patient.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex)
    
    res.json({
      patients: paginatedPatients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPatients.length / limit),
        totalPatients: filteredPatients.length,
        hasNext: endIndex < filteredPatients.length,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get patients error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/patients', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const {
      name, age, gender, phone, email, department, doctor,
      address, emergencyContact, insurance, allergies = [],
      chronicConditions = [], preferredLanguage = 'English'
    } = req.body

    const newPatient = {
      id: uuidv4(),
      mrn: `MRN-${Math.floor(Math.random() * 1000000)}`,
      name,
      age: parseInt(age),
      gender,
      phone,
      email,
      department,
      doctor,
      address,
      emergencyContact,
      insurance,
      allergies,
      chronicConditions,
      preferredLanguage,
      tags: ['New'],
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active',
      currentMedications: [],
      riskScore: Math.random() * 10,
      lastAIAnalysis: new Date().toISOString(),
      telemedicineEligible: true,
      healthGoals: [],
      socialDeterminants: {
        education: 'Unknown',
        employment: 'Unknown',
        housing: 'Unknown',
        transportation: 'Unknown',
        foodSecurity: 'Unknown'
      },
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    patients.push(newPatient)

    res.status(201).json({
      message: 'Patient created successfully',
      patient: newPatient
    })
  } catch (error) {
    console.error('Create patient error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/patients/:id', authenticateToken, (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id)
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }
    
    // Get related data
    const patientVisits = visits.filter(v => v.patientId === req.params.id)
    const patientPrescriptions = prescriptions.filter(p => p.patientId === req.params.id)
    const patientLabResults = labResults.filter(l => l.patientId === req.params.id)
    const patientRadiology = radiologyReports.filter(r => r.patientId === req.params.id)
    const patientNotes = soapNotes.filter(n => n.patientId === req.params.id)
    const patientTelemedicine = telemedicineSessions.filter(t => t.patientId === req.params.id)
    const patientReconciliations = medicationReconciliations.filter(r => r.patientId === req.params.id)
    const patientPathways = clinicalPathways.filter(p => p.patientId === req.params.id)
    const patientAIInsights = aiInsights.find(a => a.patientId === req.params.id)

    res.json({
      patient,
      visits: patientVisits,
      prescriptions: patientPrescriptions,
      labResults: patientLabResults,
      radiology: patientRadiology,
      notes: patientNotes,
      telemedicine: patientTelemedicine,
      reconciliations: patientReconciliations,
      pathways: patientPathways,
      aiInsights: patientAIInsights
    })
  } catch (error) {
    console.error('Get patient error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/api/patients/:id', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === req.params.id)
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' })
    }

    const updatedPatient = {
      ...patients[patientIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id
    }

    patients[patientIndex] = updatedPatient

    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    })
  } catch (error) {
    console.error('Update patient error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Visit Management API
app.post('/api/visits', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const {
      patientId, type, chiefComplaint, date, time, department,
      vitals, soap, attachments = []
    } = req.body

    const newVisit = {
      id: uuidv4(),
      patientId,
      date,
      time,
      department,
      doctor: req.user.name,
      type,
      status: 'Scheduled',
      chiefComplaint,
      vitals: vitals || {},
      soap: soap || {},
      attachments,
      aiRecommendations: [],
      telemedicineUsed: false,
      clinicalPathway: null,
      qualityMetrics: {
        documentationComplete: false,
        medicationsReconciled: false,
        followUpScheduled: false,
        patientSatisfaction: null
      },
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    visits.push(newVisit)

    // Update patient's last visit
    const patientIndex = patients.findIndex(p => p.id === patientId)
    if (patientIndex !== -1) {
      patients[patientIndex].lastVisit = date
    }

    res.status(201).json({
      message: 'Visit created successfully',
      visit: newVisit
    })
  } catch (error) {
    console.error('Create visit error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Prescription Management API
app.post('/api/prescriptions', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const {
      patientId, medications, instructions, pharmacy
    } = req.body

    const newPrescription = {
      id: uuidv4(),
      patientId,
      date: new Date().toISOString().split('T')[0],
      doctor: req.user.name,
      medications,
      status: 'Active',
      pharmacy,
      instructions,
      aiDrugInteractions: [],
      costAnalysis: {
        totalCost: 0,
        insuranceCoverage: 0,
        patientCost: 0
      },
      adherenceTracking: {
        lastRefill: new Date().toISOString().split('T')[0],
        nextRefill: null,
        adherenceRate: 100
      },
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    prescriptions.push(newPrescription)

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: newPrescription
    })
  } catch (error) {
    console.error('Create prescription error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Lab Results API
app.post('/api/lab-results', authenticateToken, authorizeRole(['doctor', 'admin', 'lab_technician']), (req, res) => {
  try {
    const {
      patientId, type, results, orderedBy, status = 'Completed'
    } = req.body

    const newLabResult = {
      id: uuidv4(),
      patientId,
      date: new Date().toISOString().split('T')[0],
      type,
      orderedBy,
      status,
      results,
      aiInterpretation: '',
      trendAnalysis: {},
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    labResults.push(newLabResult)

    res.status(201).json({
      message: 'Lab result created successfully',
      labResult: newLabResult
    })
  } catch (error) {
    console.error('Create lab result error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// SOAP Notes API
app.post('/api/soap-notes', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const {
      patientId, visitId, subjective, objective, assessment, plan
    } = req.body

    const newNote = {
      id: uuidv4(),
      patientId,
      visitId,
      date: new Date().toISOString().split('T')[0],
      doctor: req.user.name,
      subjective,
      objective,
      assessment,
      plan,
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    soapNotes.push(newNote)

    res.status(201).json({
      message: 'SOAP note created successfully',
      note: newNote
    })
  } catch (error) {
    console.error('Create SOAP note error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Telemedicine API
app.post('/api/telemedicine-sessions', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const {
      patientId, type, notes, platform = 'WellConX Telemedicine'
    } = req.body

    const newSession = {
      id: uuidv4(),
      patientId,
      date: new Date().toISOString().split('T')[0],
      duration: '0 minutes',
      provider: req.user.name,
      type,
      status: 'Scheduled',
      platform,
      quality: 'HD',
      notes,
      recording: null,
      satisfaction: null,
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    telemedicineSessions.push(newSession)

    res.status(201).json({
      message: 'Telemedicine session created successfully',
      session: newSession
    })
  } catch (error) {
    console.error('Create telemedicine session error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Medication Reconciliation API
app.post('/api/medication-reconciliation', authenticateToken, authorizeRole(['doctor', 'pharmacist', 'admin']), (req, res) => {
  try {
    const {
      patientId, discrepancies, interventions, costSavings = 0
    } = req.body

    const newReconciliation = {
      id: uuidv4(),
      patientId,
      date: new Date().toISOString().split('T')[0],
      pharmacist: req.user.name,
      status: 'Completed',
      discrepancies: discrepancies || [],
      interventions: interventions || [],
      costSavings,
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    medicationReconciliations.push(newReconciliation)

    res.status(201).json({
      message: 'Medication reconciliation completed successfully',
      reconciliation: newReconciliation
    })
  } catch (error) {
    console.error('Create medication reconciliation error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Clinical Pathways API
app.post('/api/clinical-pathways', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
  try {
    const {
      patientId, name, steps, outcomes
    } = req.body

    const newPathway = {
      id: uuidv4(),
      name,
      patientId,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      steps: steps || [],
      outcomes: outcomes || {},
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }

    clinicalPathways.push(newPathway)

    res.status(201).json({
      message: 'Clinical pathway created successfully',
      pathway: newPathway
    })
  } catch (error) {
    console.error('Create clinical pathway error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Analytics API
app.get('/api/analytics', authenticateToken, (req, res) => {
  try {
    const { department, dateRange = '30' } = req.query

    // Calculate analytics based on data
    const analytics = {
      departmentMetrics: {
        cardiology: {
          patientCount: patients.filter(p => p.department === 'Cardiology').length,
          avgWaitTime: '15 minutes',
          satisfactionScore: 4.6,
          readmissionRate: 8.2,
          revenue: 1250000
        },
        pulmonology: {
          patientCount: patients.filter(p => p.department === 'Pulmonology').length,
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

    res.json(analytics)
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// File upload API
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    })
  } catch (error) {
    console.error('File upload error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Export data API
app.get('/api/export/:type/:id', authenticateToken, (req, res) => {
  try {
    const { type, id } = req.params

    let data
    let filename

    switch (type) {
      case 'patient':
        data = patients.find(p => p.id === id)
        filename = `patient_${data?.mrn}.json`
        break
      case 'visit':
        data = visits.find(v => v.id === id)
        filename = `visit_${id}.json`
        break
      case 'prescription':
        data = prescriptions.find(p => p.id === id)
        filename = `prescription_${id}.json`
        break
      default:
        return res.status(400).json({ error: 'Invalid export type' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Data not found' })
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.json(data)
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join-patient-room', (patientId) => {
    socket.join(`patient-${patientId}`)
    console.log(`Client ${socket.id} joined patient room: ${patientId}`)
  })

  socket.on('leave-patient-room', (patientId) => {
    socket.leave(`patient-${patientId}`)
    console.log(`Client ${socket.id} left patient room: ${patientId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Broadcast updates to connected clients
const broadcastUpdate = (event, data, patientId = null) => {
  if (patientId) {
    io.to(`patient-${patientId}`).emit(event, data)
  } else {
    io.emit(event, data)
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 EHR Backend Server running on http://localhost:${PORT}`)
  console.log(`📧 API endpoints available at http://localhost:${PORT}/api`)
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`)
})

export { broadcastUpdate } 