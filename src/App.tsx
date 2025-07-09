import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetails from './pages/PatientDetails'
import PatientHistory from './pages/PatientHistory'
import AdvancedMonitoring from './pages/AdvancedMonitoring'
import AIMonitoring from './pages/AIMonitoring'
import Devices from './pages/Devices'
import DeviceSetup from './pages/DeviceSetup'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import HMS from './pages/HMS'
import EHR from './pages/EHR'
import AdminPanel from './pages/AdminPanel'
import MainPlatform from './pages/MainPlatform'
import IoMTLogin from './pages/IoMTLogin'
import EHRLogin from './pages/EHRLogin'
import HMSLogin from './pages/HMSLogin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Main Platform Route - Now the starting page */}
            <Route path="/" element={<MainPlatform />} />
            
            {/* Module Login Routes */}
            <Route path="/iomt/login" element={<IoMTLogin />} />
            <Route path="/ehr/login" element={<EHRLogin />} />
            <Route path="/hms/login" element={<HMSLogin />} />
            
            {/* IoMT Module Routes - Now protected */}
            <Route path="/iomt" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:patientId" element={<PatientDetails />} />
              <Route path="patients/:patientId/history" element={<PatientHistory />} />
              <Route path="patients/:patientId/advanced" element={<AdvancedMonitoring />} />
              <Route path="patients/:patientId/ai" element={<AIMonitoring />} />
              <Route path="devices" element={<Devices />} />
              <Route path="devices/setup" element={<DeviceSetup />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>

            {/* HMS Module Routes - Now protected */}
            <Route path="/hms" element={
              <ProtectedRoute>
                <HMS />
              </ProtectedRoute>
            } />

            {/* EHR Module Routes - Now protected */}
            <Route path="/ehr" element={
              <ProtectedRoute>
                <EHR />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App