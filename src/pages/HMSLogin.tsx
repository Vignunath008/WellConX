import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  Building2,
  Stethoscope,
  Users,
  Bed,
  Clipboard
} from 'lucide-react';

const DEMO_EMAIL = 'hms-demo@wellconx.com';
const DEMO_PASSWORD = 'hmsdemo';

const ModuleSidebar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate('/')}
        className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 mb-6 flex items-center justify-center"
        title="Main Platform"
      >
        <Building2 className="w-5 h-5 text-gray-700" />
      </motion.button>
      
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/ehr/login')}
          className="w-12 h-12 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center"
          title="EHR Module"
        >
          <Stethoscope className="w-5 h-5 text-blue-600" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/hms/login')}
          className="w-12 h-12 rounded-xl bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center"
          title="HMS Module"
        >
          <Building2 className="w-5 h-5 text-emerald-600" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/iomt/login')}
          className="w-12 h-12 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center"
          title="IoMT Module"
        >
          <Clipboard className="w-5 h-5 text-indigo-600" />
        </motion.button>
      </div>
    </div>
  );
};

const HMSLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create demo account on component mount if it doesn't exist
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('hms_users') || '[]');
    const demoUser = users.find((u: any) => u.email === DEMO_EMAIL);
    
    if (!demoUser) {
      users.push({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        name: 'HMS Demo User',
        role: 'Administrator',
        department: 'Hospital Management'
      });
      localStorage.setItem('hms_users', JSON.stringify(users));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('hms_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      localStorage.setItem('hms_token', 'hms-' + Math.random());
      localStorage.setItem('hms_user', JSON.stringify(user));
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/hms/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex">
      <ModuleSidebar />
      <div className="flex-1 pl-20">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full flex flex-col-reverse lg:flex-row">
            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/2 p-8 lg:p-12"
            >
              <div className="flex items-center mb-8">
                <Building2 className="h-8 w-8 text-emerald-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">HMS Login</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 rounded-lg bg-red-50 text-red-600"
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 rounded-lg bg-green-50 text-green-600"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all
                    ${loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}
                  `}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-600">
                  <p>Demo Account</p>
                  <p className="font-medium">{DEMO_EMAIL} / {DEMO_PASSWORD}</p>
                </div>
              </form>
            </motion.div>

            {/* Info Side */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-600 p-8 lg:p-12 text-white"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6">HMS Platform Features</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white/10 rounded-lg p-3">
                        <Bed className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">Hospital Management</h4>
                        <p className="text-white/80">Streamlined hospital operations and workflow</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white/10 rounded-lg p-3">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">Staff Management</h4>
                        <p className="text-white/80">Efficient staff scheduling and coordination</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white/10 rounded-lg p-3">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">Resource Analytics</h4>
                        <p className="text-white/80">Track and optimize hospital resources</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 lg:mt-0">
                  <div className="flex items-center space-x-2 text-white/90">
                    <Stethoscope className="h-5 w-5" />
                    <span>Automated Scheduling System</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HMSLogin;