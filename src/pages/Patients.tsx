import React from 'react'
import { useData } from '../contexts/DataContext'
import { VitalSignsDisplay } from '../components/VitalCard'
import { User, MapPin, Monitor } from 'lucide-react'

const Patients: React.FC = () => {
  const { patients } = useData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <button className="btn-primary">
          Add New Patient
        </button>
      </div>

      <div className="grid gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-medical-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-medical-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{patient.age} years old • {patient.gender}</span>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {patient.room}
                    </div>
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-1" />
                      {patient.deviceId}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                  patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {patient.status.toUpperCase()}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="status-indicator status-online"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>
            </div>

            <VitalSignsDisplay vitals={patient.vitals} />

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {patient.lastUpdated.toLocaleString()}
              </div>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">
                  View History
                </button>
                <button className="btn-secondary text-sm">
                  Export Data
                </button>
                <button className="btn-primary text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Patients