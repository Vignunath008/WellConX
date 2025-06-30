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
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
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
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App