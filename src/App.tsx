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
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import IoMTLogin from './pages/IoMTLogin'
import EHRLogin from './pages/EHRLogin'
import HMSLogin from './pages/HMSLogin'
import EHRSignup from './pages/EHRSignup'
import HMSSignup from './pages/HMSSignup'
import IoMTSignup from './pages/IoMTSignup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Landing page - redirects based on auth status */}
            <Route path="/" element={<Landing />} />
            
            {/* Main Platform Route - requires authentication */}
            <Route path="/platform" element={<MainPlatform />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Module Login Routes */}
            <Route path="/iomt/login" element={<IoMTLogin />} />
            <Route path="/ehr/login" element={<EHRLogin />} />
            <Route path="/hms/login" element={<HMSLogin />} />
            
            {/* Module Signup Routes */}
            <Route path="/iomt/signup" element={<IoMTSignup />} />
            <Route path="/ehr/signup" element={<EHRSignup />} />
            <Route path="/hms/signup" element={<HMSSignup />} />
            
            {/* IoMT Module Routes - Now protected */}
            <Route path="/iomt/*" element={
              <ProtectedRoute requiredModule="iomt">
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="devices" element={<Devices />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:patientId" element={<PatientDetails />} />
              <Route path="patients/:patientId/history" element={<PatientHistory />} />
              <Route path="patients/:patientId/ai" element={<AIMonitoring />} />
              <Route path="patients/:patientId/advanced" element={<AdvancedMonitoring />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="device-setup" element={<DeviceSetup />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* HMS Module Routes - Now protected */}
            <Route path="/hms/*" element={
              <ProtectedRoute requiredModule="hms">
                <HMS />
              </ProtectedRoute>
            } />

            {/* EHR Module Routes - Now protected */}
            <Route path="/ehr/*" element={
              <ProtectedRoute requiredModule="ehr">
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