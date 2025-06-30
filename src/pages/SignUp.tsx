import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Activity, Eye, EyeOff, Upload, CheckCircle, AlertCircle } from 'lucide-react'

const SignUp: React.FC = () => {
  const { user, registerUser } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    
    // Professional Information
    role: 'doctor' as 'doctor' | 'nurse',
    licenseNumber: '',
    specialization: '',
    department: '',
    yearsOfExperience: '',
    currentEmployer: '',
    
    // Account Information
    password: '',
    confirmPassword: '',
    
    // Documents
    licenseDocument: null as File | null,
    certificationDocument: null as File | null,
    
    // Agreement
    termsAccepted: false,
    privacyAccepted: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      // Personal Information validation
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (stepNumber === 2) {
      // Professional Information validation
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required'
      if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required'
      if (!formData.department.trim()) newErrors.department = 'Department is required'
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required'
      if (!formData.currentEmployer.trim()) newErrors.currentEmployer = 'Current employer is required'
    }

    if (stepNumber === 3) {
      // Account Information validation
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }

    if (stepNumber === 4) {
      // Documents validation
      if (!formData.licenseDocument) newErrors.licenseDocument = 'Medical license document is required'
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions'
      if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileUpload = (field: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, [field]: 'File size must be less than 5MB' }))
      return
    }
    handleInputChange(field, file)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)

    try {
      // Submit registration request
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        role: formData.role,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        department: formData.department,
        yearsOfExperience: formData.yearsOfExperience,
        currentEmployer: formData.currentEmployer
      }

      const success = await registerUser(registrationData)

      if (success) {
        setSubmitted(true)
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const specializations = {
    doctor: [
      'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Surgery', 'Emergency Medicine',
      'Internal Medicine', 'Radiology', 'Anesthesiology', 'Psychiatry', 'Dermatology', 'Orthopedics'
    ],
    nurse: [
      'Critical Care', 'Emergency', 'Pediatric', 'Surgical', 'Cardiac', 'Oncology',
      'Mental Health', 'Geriatric', 'Neonatal', 'Operating Room', 'ICU', 'Recovery'
    ]
  }

  const departments = [
    'Emergency Department', 'Intensive Care Unit', 'Cardiology', 'Neurology', 'Surgery',
    'Pediatrics', 'Oncology', 'Radiology', 'Laboratory', 'Pharmacy', 'Administration'
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your registration request has been submitted successfully. An administrator will review your application and contact you within 2-3 business days.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong><br />
              • Admin review of your credentials<br />
              • Background verification<br />
              • Account activation email<br />
              • Welcome orientation
            </p>
          </div>
          <Link
            to="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors inline-block"
          >
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Please provide your basic personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="your.email@hospital.com"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Information</h3>
        <p className="text-gray-600">Tell us about your medical background and experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value as 'doctor' | 'nurse')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your medical license number"
          />
          {errors.licenseNumber && <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
          <select
            value={formData.specialization}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.specialization ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select your specialization</option>
            {specializations[formData.role].map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          {errors.specialization && <p className="text-red-600 text-sm mt-1">{errors.specialization}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.department ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
          <select
            value={formData.yearsOfExperience}
            onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select experience</option>
            <option value="0-1">0-1 years</option>
            <option value="2-5">2-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-15">11-15 years</option>
            <option value="16-20">16-20 years</option>
            <option value="20+">20+ years</option>
          </select>
          {errors.yearsOfExperience && <p className="text-red-600 text-sm mt-1">{errors.yearsOfExperience}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Employer *</label>
          <input
            type="text"
            value={formData.currentEmployer}
            onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.currentEmployer ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Hospital or healthcare facility name"
          />
          {errors.currentEmployer && <p className="text-red-600 text-sm mt-1">{errors.currentEmployer}</p>}
        </div>
      </div>
    </div>
  )

  const renderAccountInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
        <p className="text-gray-600">Create your WellConX account credentials</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Verification</h3>
        <p className="text-gray-600">Upload required documents for verification</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Document *</label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
            errors.licenseDocument ? 'border-red-300' : 'border-gray-300'
          }`}>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload your medical license</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('licenseDocument', e.target.files?.[0] || null)}
              className="hidden"
              id="license-upload"
            />
            <label
              htmlFor="license-upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
            >
              Choose File
            </label>
            {formData.licenseDocument && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.licenseDocument.name}</p>
            )}
          </div>
          {errors.licenseDocument && <p className="text-red-600 text-sm mt-1">{errors.licenseDocument}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certification Document (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload additional certifications</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('certificationDocument', e.target.files?.[0] || null)}
              className="hidden"
              id="cert-upload"
            />
            <label
              htmlFor="cert-upload"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
            >
              Choose File
            </label>
            {formData.certificationDocument && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.certificationDocument.name}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.termsAccepted}
              onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> *
            </label>
          </div>
          {errors.termsAccepted && <p className="text-red-600 text-sm">{errors.termsAccepted}</p>}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy"
              checked={formData.privacyAccepted}
              onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="privacy" className="text-sm text-gray-700">
              I accept the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
            </label>
          </div>
          {errors.privacyAccepted && <p className="text-red-600 text-sm">{errors.privacyAccepted}</p>}
        </div>
      </div>
    </div>
  )

  const steps = [
    { number: 1, title: 'Personal Info', component: renderPersonalInfo },
    { number: 2, title: 'Professional', component: renderProfessionalInfo },
    { number: 3, title: 'Account', component: renderAccountInfo },
    { number: 4, title: 'Documents', component: renderDocuments }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join WellConX</h1>
          <p className="text-gray-600">Create your professional medical monitoring account</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step > stepItem.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepItem.number}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step >= stepItem.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {stepItem.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {steps[step - 1].component()}

          {errors.submit && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Registration</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp