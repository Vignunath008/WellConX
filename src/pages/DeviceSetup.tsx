import React, { useState } from 'react'
import { Monitor, Wifi, Settings, CheckCircle, Play } from 'lucide-react'

const DeviceSetup: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [connectionType, setConnectionType] = useState<'network' | 'serial'>('network')
  const [setupStep, setSetupStep] = useState(1)

  const deviceTypes = [
    {
      id: 'philips-mp70',
      name: 'Philips IntelliVue MP70',
      brand: 'Philips',
      image: '🏥',
      description: 'Advanced patient monitor with comprehensive vital signs'
    },
    {
      id: 'ge-dash5000',
      name: 'GE DASH 5000',
      brand: 'GE',
      image: '⚡',
      description: 'High-acuity patient monitor for critical care'
    },
    {
      id: 'mindray-t8',
      name: 'Mindray BeneView T8',
      brand: 'Mindray',
      image: '🔬',
      description: 'Advanced ICU monitor with multi-parameter support'
    }
  ]

  const networkConfig = {
    deviceIP: '192.168.1.101',
    serverIP: '192.168.1.50',
    port: '2575',
    subnet: '255.255.255.0',
    gateway: '192.168.1.1'
  }

  const setupSteps = [
    { id: 1, title: 'Select Device', description: 'Choose your medical device type' },
    { id: 2, title: 'Connection Type', description: 'Select connection method' },
    { id: 3, title: 'Network Setup', description: 'Configure network settings' },
    { id: 4, title: 'HL7 Configuration', description: 'Set up data transmission' },
    { id: 5, title: 'Test Connection', description: 'Verify device connectivity' }
  ]

  const renderDeviceSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Device</h3>
        <p className="text-gray-600">Choose the medical device you want to connect to WellConX</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deviceTypes.map((device) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedDevice === device.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-4xl mb-3">{device.image}</div>
            <h4 className="font-semibold text-gray-900 mb-1">{device.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{device.brand}</p>
            <p className="text-xs text-gray-500">{device.description}</p>
          </button>
        ))}
      </div>
    </div>
  )

  const renderConnectionType = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Method</h3>
        <p className="text-gray-600">How will your device connect to WellConX?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setConnectionType('network')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
            connectionType === 'network'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Wifi className="h-8 w-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Network (TCP/IP)</h4>
          <p className="text-sm text-gray-600 mb-3">Connect via LAN or WLAN using HL7 over TCP/IP</p>
          <div className="text-xs text-gray-500">
            <div>✅ Real-time data streaming</div>
            <div>✅ Easy setup and configuration</div>
            <div>✅ Supports multiple devices</div>
          </div>
        </button>
        
        <button
          onClick={() => setConnectionType('serial')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
            connectionType === 'serial'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Settings className="h-8 w-8 text-gray-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Serial (RS-232)</h4>
          <p className="text-sm text-gray-600 mb-3">Direct serial connection for older devices</p>
          <div className="text-xs text-gray-500">
            <div>✅ Works with legacy devices</div>
            <div>✅ Direct connection</div>
            <div>⚠️ Requires USB converter</div>
          </div>
        </button>
      </div>
    </div>
  )

  const renderNetworkSetup = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Network Configuration</h3>
        <p className="text-gray-600">Configure network settings for your device</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-4">Device Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">IP Address</label>
              <input
                type="text"
                value={networkConfig.deviceIP}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Subnet Mask</label>
              <input
                type="text"
                value={networkConfig.subnet}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Gateway</label>
              <input
                type="text"
                value={networkConfig.gateway}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white"
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-4">WellConX Server</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Server IP</label>
              <input
                type="text"
                value={networkConfig.serverIP}
                className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">HL7 Port</label>
              <input
                type="text"
                value={networkConfig.port}
                className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white"
                readOnly
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Server Online</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Configuration Steps</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Access your device's network configuration menu</li>
          <li>Set the IP address to <code className="bg-gray-200 px-1 rounded">{networkConfig.deviceIP}</code></li>
          <li>Configure subnet mask and gateway as shown above</li>
          <li>Save network settings and restart network service</li>
        </ol>
      </div>
    </div>
  )

  const renderHL7Configuration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">HL7 Data Configuration</h3>
        <p className="text-gray-600">Set up data transmission parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">HL7 Settings</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Protocol:</span>
                <span className="text-sm font-medium">HL7 v2.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Message Type:</span>
                <span className="text-sm font-medium">ORU^R01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transport:</span>
                <span className="text-sm font-medium">TCP/IP (MLLP)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Destination:</span>
                <span className="text-sm font-medium">{networkConfig.serverIP}:{networkConfig.port}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interval:</span>
                <span className="text-sm font-medium">2 seconds</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Vital Signs Selection</h4>
            <div className="space-y-2">
              {[
                'Heart Rate (ECG)',
                'Blood Pressure (NIBP)',
                'Oxygen Saturation (SpO2)',
                'Temperature',
                'Respiratory Rate'
              ].map((vital, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{vital}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-3">Device Configuration Steps</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800">
          <li>Navigate to HL7 or Data Export settings on your device</li>
          <li>Enable HL7 transmission with the settings shown above</li>
          <li>Select all vital signs for continuous monitoring</li>
          <li>Set transmission mode to "Continuous" or "Automatic"</li>
          <li>Start data transmission</li>
        </ol>
      </div>
    </div>
  )

  const renderTestConnection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Connection</h3>
        <p className="text-gray-600">Verify that your device is connected and transmitting data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-green-900 mb-1">Network Connected</h4>
          <p className="text-sm text-green-700">Device is reachable on network</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
          <Play className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-blue-900 mb-1">HL7 Receiving</h4>
          <p className="text-sm text-blue-700">Data messages being received</p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 text-center">
          <Monitor className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-purple-900 mb-1">Live Monitoring</h4>
          <p className="text-sm text-purple-700">Real-time vitals displayed</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Sample HL7 Message</h4>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
          <div>MSH|^~\&|{selectedDevice}|HOSPITAL|WELLCONX|WELLCONX|20241201120000||ORU^R01|MSG001|P|2.5</div>
          <div>PID|1||PAT001^^^HOSPITAL^MR||SMITH^JOHN^||19580315|M</div>
          <div>OBR|1||ORDER001|VITALS^VITAL SIGNS^LOCAL|||20241201120000</div>
          <div>OBX|1|NM|HR^HEART RATE^LOCAL|1|72|BPM|60-100|N|||F</div>
          <div>OBX|2|NM|NBP^BLOOD PRESSURE^LOCAL|1|120/80|MMHG|&lt;140/90|N|||F</div>
          <div>OBX|3|NM|SPO2^OXYGEN SATURATION^LOCAL|1|98|%|&gt;95|N|||F</div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
          Complete Setup
        </button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (setupStep) {
      case 1: return renderDeviceSelection()
      case 2: return renderConnectionType()
      case 3: return renderNetworkSetup()
      case 4: return renderHL7Configuration()
      case 5: return renderTestConnection()
      default: return renderDeviceSelection()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Device Setup</h1>
        <p className="text-gray-600 mt-1">Connect your medical devices to WellConX platform</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          {setupSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                setupStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {setupStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  setupStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < setupSteps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  setupStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep(Math.max(1, setupStep - 1))}
          disabled={setupStep === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={() => setSetupStep(Math.min(5, setupStep + 1))}
          disabled={setupStep === 5 || (setupStep === 1 && !selectedDevice)}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {setupStep === 5 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default DeviceSetup