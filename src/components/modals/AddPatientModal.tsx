import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, MapPin, Monitor, Calendar, FileText, Save, AlertCircle } from 'lucide-react'
import { Patient, VitalSigns } from '../../types/medical'

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPatient: (patient: Omit<Patient, 'id' | 'lastUpdated'>) => void
  availableDevices: Array<{ id: string; name: string; location: string }>
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  availableDevices
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    room: '',
    deviceId: '',
    medicalRecordNumber: '',
    diagnosis: '',
    admissionDate: new Date().toISOString().split('T')[0],
    // Initial vital signs
    heartRate: '72',
    systolic: '120',
    diastolic: '80',
    oxygenSaturation: '98',
    temperature: '98.6',
    respiratoryRate: '16'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Patient name is required'
    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 150) {
      newErrors.age = 'Valid age is required (0-150)'
    }
    if (!formData.room.trim()) newErrors.room = 'Room number is required'
    if (!formData.medicalRecordNumber.trim()) {
      newErrors.medicalRecordNumber = 'Medical record number is required'
    }
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required'

    // Vital signs validation
    const hr = parseInt(formData.heartRate)
    if (!hr || hr < 20 || hr > 250) newErrors.heartRate = 'Heart rate must be 20-250 bpm'

    const sys = parseInt(formData.systolic)
    if (!sys || sys < 50 || sys > 300) newErrors.systolic = 'Systolic BP must be 50-300 mmHg'

    const dia = parseInt(formData.diastolic)
    if (!dia || dia < 30 || dia > 200) newErrors.diastolic = 'Diastolic BP must be 30-200 mmHg'

    const spo2 = parseInt(formData.oxygenSaturation)
    if (!spo2 || spo2 < 70 || spo2 > 100) newErrors.oxygenSaturation = 'SpO2 must be 70-100%'

    const temp = parseFloat(formData.temperature)
    if (!temp || temp < 90 || temp > 110) newErrors.temperature = 'Temperature must be 90-110°F'

    const rr = parseInt(formData.respiratoryRate)
    if (!rr || rr < 5 || rr > 60) newErrors.respiratoryRate = 'Respiratory rate must be 5-60/min'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const vitals: VitalSigns = {
        heartRate: parseInt(formData.heartRate),
        bloodPressure: {
          systolic: parseInt(formData.systolic),
          diastolic: parseInt(formData.diastolic)
        },
        oxygenSaturation: parseInt(formData.oxygenSaturation),
        temperature: parseFloat(formData.temperature),
        respiratoryRate: parseInt(formData.respiratoryRate),
        timestamp: new Date()
      }

      // Determine initial status based on vitals
      let status: 'stable' | 'warning' | 'critical' = 'stable'
      if (vitals.heartRate < 50 || vitals.heartRate > 120 || 
          vitals.oxygenSaturation < 90 || vitals.temperature > 101 ||
          vitals.respiratoryRate < 8 || vitals.respiratoryRate > 30) {
        status = 'critical'
      } else if (vitals.heartRate < 60 || vitals.heartRate > 100 || 
                 vitals.oxygenSaturation < 95 || vitals.temperature > 99.5 ||
                 vitals.respiratoryRate < 12 || vitals.respiratoryRate > 25) {
        status = 'warning'
      }

      const newPatient: Omit<Patient, 'id' | 'lastUpdated'> = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        room: formData.room.trim(),
        deviceId: formData.deviceId || undefined,
        status,
        medicalRecordNumber: formData.medicalRecordNumber.trim(),
        admissionDate: new Date(formData.admissionDate),
        diagnosis: formData.diagnosis.trim(),
        vitals
      }

      onAddPatient(newPatient)
      
      // Reset form
      setFormData({
        name: '',
        age: '',
        gender: 'male',
        room: '',
        deviceId: '',
        medicalRecordNumber: '',
        diagnosis: '',
        admissionDate: new Date().toISOString().split('T')[0],
        heartRate: '72',
        systolic: '120',
        diastolic: '80',
        oxygenSaturation: '98',
        temperature: '98.6',
        respiratoryRate: '16'
      })
      
      onClose()
    } catch (error) {
      console.error('Error adding patient:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Add New Patient</h2>
                  <p className="text-blue-100">Enter patient information and initial vital signs</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6 space-y-8">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter patient's full name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.age ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Age in years"
                      min="0"
                      max="150"
                    />
                    {errors.age && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.age}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Record Number *
                    </label>
                    <input
                      type="text"
                      value={formData.medicalRecordNumber}
                      onChange={(e) => handleInputChange('medicalRecordNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.medicalRecordNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., MRN-123456"
                    />
                    {errors.medicalRecordNumber && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.medicalRecordNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admission Date *
                    </label>
                    <input
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Device Assignment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Location & Device Assignment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => handleInputChange('room', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.room ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., ICU-101, Ward-205"
                    />
                    {errors.room && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.room}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Device (Optional)
                    </label>
                    <select
                      value={formData.deviceId}
                      onChange={(e) => handleInputChange('deviceId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a device (optional)</option>
                      {availableDevices.map(device => (
                        <option key={device.id} value={device.id}>
                          {device.name} - {device.location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Medical Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Diagnosis *
                  </label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.diagnosis ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter primary diagnosis and relevant medical conditions"
                  />
                  {errors.diagnosis && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.diagnosis}
                    </p>
                  )}
                </div>
              </div>

              {/* Initial Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-red-600" />
                  Initial Vital Signs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heart Rate (bpm) *
                    </label>
                    <input
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.heartRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="20"
                      max="250"
                    />
                    {errors.heartRate && (
                      <p className="text-red-600 text-sm mt-1">{errors.heartRate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Systolic BP (mmHg) *
                    </label>
                    <input
                      type="number"
                      value={formData.systolic}
                      onChange={(e) => handleInputChange('systolic', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.systolic ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="50"
                      max="300"
                    />
                    {errors.systolic && (
                      <p className="text-red-600 text-sm mt-1">{errors.systolic}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diastolic BP (mmHg) *
                    </label>
                    <input
                      type="number"
                      value={formData.diastolic}
                      onChange={(e) => handleInputChange('diastolic', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.diastolic ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="30"
                      max="200"
                    />
                    {errors.diastolic && (
                      <p className="text-red-600 text-sm mt-1">{errors.diastolic}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SpO2 (%) *
                    </label>
                    <input
                      type="number"
                      value={formData.oxygenSaturation}
                      onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.oxygenSaturation ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="70"
                      max="100"
                    />
                    {errors.oxygenSaturation && (
                      <p className="text-red-600 text-sm mt-1">{errors.oxygenSaturation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°F) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.temperature ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="90"
                      max="110"
                    />
                    {errors.temperature && (
                      <p className="text-red-600 text-sm mt-1">{errors.temperature}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Respiratory Rate (/min) *
                    </label>
                    <input
                      type="number"
                      value={formData.respiratoryRate}
                      onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.respiratoryRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="5"
                      max="60"
                    />
                    {errors.respiratoryRate && (
                      <p className="text-red-600 text-sm mt-1">{errors.respiratoryRate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding Patient...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Add Patient</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddPatientModal