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
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import HMS from './pages/HMS'
import EHR from './pages/EHR'
import AdminPanel from './pages/AdminPanel'
import MainPlatform from './pages/MainPlatform'
import IoMTLogin from './pages/IoMTLogin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Main Platform Route */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainPlatform />
              </ProtectedRoute>
            } />
            
            {/* IoMT Module Routes */}
            <Route path="/iomt/login" element={<IoMTLogin />} />
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

            {/* HMS Module Routes */}
            <Route path="/hms" element={
              <ProtectedRoute>
                <HMS />
              </ProtectedRoute>
            } />

            {/* EHR Module Routes */}
            <Route path="/ehr" element={
              <ProtectedRoute>
                <EHR />
              </ProtectedRoute>
            } />

            {/* Legacy Routes for backward compatibility */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App