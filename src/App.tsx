import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import NetworkStatus from './components/NetworkStatus';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load components
const Landing = React.lazy(() => import('./pages/Landing'));
const MainPlatform = React.lazy(() => import('./pages/MainPlatform'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const IoMTLogin = React.lazy(() => import('./pages/IoMTLogin'));
const EHRLogin = React.lazy(() => import('./pages/EHRLogin'));
const HMSLogin = React.lazy(() => import('./pages/HMSLogin'));
const IoMTSignup = React.lazy(() => import('./pages/IoMTSignup'));
const EHRSignup = React.lazy(() => import('./pages/EHRSignup'));
const HMSSignup = React.lazy(() => import('./pages/HMSSignup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Devices = React.lazy(() => import('./pages/Devices'));
const Patients = React.lazy(() => import('./pages/Patients'));
const PatientDetails = React.lazy(() => import('./pages/PatientDetails'));
const PatientHistory = React.lazy(() => import('./pages/PatientHistory'));
const AIMonitoring = React.lazy(() => import('./pages/AIMonitoring'));
const AdvancedMonitoring = React.lazy(() => import('./pages/AdvancedMonitoring'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const DeviceSetup = React.lazy(() => import('./pages/DeviceSetup'));
const Settings = React.lazy(() => import('./pages/Settings'));
const HMS = React.lazy(() => import('./pages/HMS'));
const EHR = React.lazy(() => import('./pages/EHR'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
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
    </PageTransition>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <div className="app">
              <NetworkStatus />
              <AnimatedRoutes />
            </div>
          </Suspense>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;