# WellConX Device Connection Guide

## Overview

This guide provides detailed instructions for connecting medical devices to the WellConX platform using HL7 protocol integration. WellConX supports real-time monitoring of vital signs from various medical devices including Philips IntelliVue series, GE Healthcare monitors, and Mindray devices.

## Supported Devices

### Philips IntelliVue Series
- **MP70**: Advanced patient monitor with comprehensive vital signs
- **MP60**: Mid-range monitor for general ward use
- **MP50**: Compact monitor for transport and basic monitoring
- **MP30**: Entry-level monitor

### GE Healthcare
- **DASH 5000**: High-acuity patient monitor
- **DASH 4000**: Mid-acuity monitoring
- **B650**: Transport monitor
- **B450**: Basic monitoring

### Mindray
- **BeneView T1**: Transport monitor
- **BeneView T5**: Mid-range monitor
- **BeneView T8**: Advanced ICU monitor

## Connection Methods

### 1. Network Connection (Recommended)

#### TCP/IP over LAN/WLAN
Most modern medical devices support network connectivity for real-time data streaming.

**Network Configuration:**
```
# Device Network Settings
IP Address: 192.168.1.100-199 (Device range)
Subnet Mask: 255.255.255.0
Gateway: 192.168.1.1
DNS: 8.8.8.8

# WellConX Server Settings
Server IP: 192.168.1.50
HL7 Port: 2575 (MLLP)
Backup Port: 2576
```

**Device Configuration Steps:**

1. **Access Device Network Settings**
   - Navigate to device configuration menu
   - Select "Network" or "Connectivity"
   - Enable TCP/IP communication

2. **Configure HL7 Settings**
   ```
   Protocol: HL7 v2.5
   Message Type: ORU^R01 (Observation Result)
   Transport: MLLP (Minimal Lower Layer Protocol)
   Destination IP: 192.168.1.50
   Port: 2575
   ```

3. **Enable Data Streaming**
   - Set transmission interval (recommended: 1-5 seconds)
   - Select vital signs to transmit
   - Enable automatic transmission

### 2. Serial Connection (RS-232)

For older devices or when network connectivity is not available.

**Hardware Requirements:**
- RS-232 to USB converter
- Serial cable (DB-9 or DB-25)
- Null modem adapter (if required)

**Serial Configuration:**
```
Baud Rate: 9600 (or 19200)
Data Bits: 8
Parity: None
Stop Bits: 1
Flow Control: None
```

**Connection Steps:**
1. Connect device serial port to server via USB converter
2. Configure device for serial HL7 output
3. Set up WellConX serial listener service

## HL7 Message Configuration

### Standard HL7 ORU^R01 Message Structure

```
MSH|^~\&|DEVICE_ID|HOSPITAL|WELLCONX|WELLCONX|20241201120000||ORU^R01|MSG001|P|2.5
PID|1||PAT001^^^HOSPITAL^MR||SMITH^JOHN^||19580315|M|||123 MAIN ST^^CITY^ST^12345
OBR|1||ORDER001|VITALS^VITAL SIGNS^LOCAL|||20241201120000
OBX|1|NM|HR^HEART RATE^LOCAL|1|72|BPM|60-100|N|||F
OBX|2|NM|NBP^BLOOD PRESSURE^LOCAL|1|120/80|MMHG|<140/90|N|||F
OBX|3|NM|SPO2^OXYGEN SATURATION^LOCAL|1|98|%|>95|N|||F
OBX|4|NM|TEMP^TEMPERATURE^LOCAL|1|98.6|F|97-99|N|||F
OBX|5|NM|RR^RESPIRATORY RATE^LOCAL|1|16|/MIN|12-20|N|||F
```

### Device-Specific HL7 Configurations

#### Philips IntelliVue
```javascript
// Philips-specific OBX identifiers
const philipsVitalCodes = {
  'MDC_ECG_HEART_RATE': 'Heart Rate',
  'MDC_PRESS_BLD_NONINV_SYS': 'Systolic BP',
  'MDC_PRESS_BLD_NONINV_DIA': 'Diastolic BP',
  'MDC_PULS_OXIM_SAT_O2': 'SpO2',
  'MDC_TEMP_BODY': 'Temperature',
  'MDC_RESP_RATE': 'Respiratory Rate'
}
```

#### GE Healthcare
```javascript
// GE-specific OBX identifiers
const geVitalCodes = {
  'HR': 'Heart Rate',
  'SYS': 'Systolic BP',
  'DIA': 'Diastolic BP',
  'SPO2': 'SpO2',
  'TEMP': 'Temperature',
  'RR': 'Respiratory Rate'
}
```

#### Mindray
```javascript
// Mindray-specific OBX identifiers
const mindrayVitalCodes = {
  'ECG_HR': 'Heart Rate',
  'NIBP_SYS': 'Systolic BP',
  'NIBP_DIA': 'Diastolic BP',
  'SPO2_SAT': 'SpO2',
  'TEMP1': 'Temperature',
  'RESP': 'Respiratory Rate'
}
```

## WellConX Server Setup

### 1. Install Dependencies

```bash
npm install node-hl7-server @ehr/hl7-v2 serialport socket.io
```

### 2. HL7 Listener Service

Create `services/hl7-listener.js`:

```javascript
const HL7Server = require('node-hl7-server')
const { parseHL7 } = require('@ehr/hl7-v2')
const io = require('socket.io-client')

class HL7Listener {
  constructor() {
    this.server = new HL7Server()
    this.socket = io('http://localhost:3001')
  }

  start() {
    this.server.start(2575)
    console.log('HL7 Listener started on port 2575')

    this.server.on('message', (message) => {
      this.processHL7Message(message)
    })
  }

  processHL7Message(rawMessage) {
    try {
      const parsed = parseHL7(rawMessage)
      const vitals = this.extractVitals(parsed)
      
      // Send to WellConX platform
      this.socket.emit('vitals-update', vitals)
      
    } catch (error) {
      console.error('HL7 parsing error:', error)
    }
  }

  extractVitals(hl7Message) {
    const pid = hl7Message.segments.find(s => s.name === 'PID')
    const obxSegments = hl7Message.segments.filter(s => s.name === 'OBX')
    
    const patientId = pid?.fields[3]?.value
    const vitals = {}
    
    obxSegments.forEach(obx => {
      const vitalType = obx.fields[3]?.value
      const value = parseFloat(obx.fields[5]?.value)
      const unit = obx.fields[6]?.value
      
      // Map to standard vital signs
      switch (vitalType) {
        case 'HR':
        case 'MDC_ECG_HEART_RATE':
          vitals.heartRate = value
          break
        case 'SPO2':
        case 'MDC_PULS_OXIM_SAT_O2':
          vitals.oxygenSaturation = value
          break
        case 'TEMP':
        case 'MDC_TEMP_BODY':
          vitals.temperature = value
          break
        // Add more mappings...
      }
    })
    
    return {
      patientId,
      vitals,
      timestamp: new Date(),
      deviceId: hl7Message.segments[0]?.fields[3]?.value
    }
  }
}

module.exports = HL7Listener
```

### 3. Serial Port Listener

Create `services/serial-listener.js`:

```javascript
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

class SerialListener {
  constructor(portPath = '/dev/ttyUSB0') {
    this.port = new SerialPort(portPath, {
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1
    })
    
    this.parser = this.port.pipe(new Readline({ delimiter: '\r' }))
  }

  start() {
    this.parser.on('data', (data) => {
      if (data.startsWith('\x0B') && data.endsWith('\x1C\x0D')) {
        // MLLP wrapped HL7 message
        const hl7Message = data.slice(1, -2)
        this.processHL7Message(hl7Message)
      }
    })
  }
}
```

## Device-Specific Setup Instructions

### Philips IntelliVue MP70

1. **Access Configuration Menu**
   - Press "Main Setup" → "Network Setup"
   - Enable "HL7 Export"

2. **Network Configuration**
   ```
   IP Address: 192.168.1.101
   Subnet: 255.255.255.0
   Gateway: 192.168.1.1
   ```

3. **HL7 Settings**
   ```
   Destination IP: 192.168.1.50
   Port: 2575
   Message Type: ORU^R01
   Interval: 2 seconds
   ```

4. **Data Selection**
   - Enable: ECG, NBP, SpO2, Temperature, Respiration
   - Set transmission mode to "Continuous"

### GE DASH 5000

1. **System Configuration**
   - Navigate to "Setup" → "System Config" → "Network"
   - Enable "Data Export"

2. **HL7 Configuration**
   ```
   Protocol: HL7 v2.5
   Transport: TCP/IP
   Server IP: 192.168.1.50
   Port: 2575
   ```

3. **Parameter Selection**
   - Select vital signs for export
   - Set update rate to 1-5 seconds

### Mindray BeneView T8

1. **Network Setup**
   - Go to "System" → "Network" → "TCP/IP"
   - Configure network parameters

2. **Data Export**
   ```
   Protocol: HL7
   Format: ORU^R01
   Destination: 192.168.1.50:2575
   ```

## Testing and Validation

### 1. HL7 Message Simulator

Create `tools/hl7-simulator.js`:

```javascript
const net = require('net')

class HL7Simulator {
  constructor(serverIP = '192.168.1.50', port = 2575) {
    this.serverIP = serverIP
    this.port = port
  }

  sendTestMessage() {
    const hl7Message = this.generateTestMessage()
    const mllpMessage = `\x0B${hl7Message}\x1C\x0D`
    
    const client = net.createConnection(this.port, this.serverIP)
    client.write(mllpMessage)
    client.end()
  }

  generateTestMessage() {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14)
    
    return [
      `MSH|^~\\&|SIMULATOR|TEST|WELLCONX|WELLCONX|${timestamp}||ORU^R01|SIM001|P|2.5`,
      'PID|1||TEST001^^^TEST^MR||DOE^JOHN^||19800101|M',
      `OBR|1||ORD001|VITALS^VITAL SIGNS^LOCAL|||${timestamp}`,
      'OBX|1|NM|HR^HEART RATE^LOCAL|1|75|BPM|60-100|N|||F',
      'OBX|2|NM|SYS^SYSTOLIC BP^LOCAL|1|120|MMHG|<140|N|||F',
      'OBX|3|NM|DIA^DIASTOLIC BP^LOCAL|1|80|MMHG|<90|N|||F',
      'OBX|4|NM|SPO2^OXYGEN SAT^LOCAL|1|98|%|>95|N|||F',
      'OBX|5|NM|TEMP^TEMPERATURE^LOCAL|1|98.6|F|97-99|N|||F',
      'OBX|6|NM|RR^RESP RATE^LOCAL|1|16|/MIN|12-20|N|||F'
    ].join('\r')
  }
}

// Usage
const simulator = new HL7Simulator()
setInterval(() => {
  simulator.sendTestMessage()
}, 5000) // Send test message every 5 seconds
```

### 2. Connection Verification

```bash
# Test network connectivity
ping 192.168.1.101  # Device IP

# Test port connectivity
telnet 192.168.1.50 2575  # WellConX server

# Monitor HL7 traffic
tcpdump -i eth0 port 2575
```

## Troubleshooting

### Common Issues

1. **Device Not Connecting**
   - Check network configuration
   - Verify firewall settings
   - Ensure HL7 service is enabled on device

2. **No Data Received**
   - Verify HL7 message format
   - Check device transmission settings
   - Validate patient assignment

3. **Intermittent Connection**
   - Check network stability
   - Verify device power management
   - Monitor for IP conflicts

### Debug Tools

```javascript
// HL7 Message Logger
const fs = require('fs')

function logHL7Message(message) {
  const timestamp = new Date().toISOString()
  const logEntry = `${timestamp}: ${message}\n`
  fs.appendFileSync('hl7-messages.log', logEntry)
}
```

## Security Considerations

### Network Security
- Use VLANs to isolate medical device traffic
- Implement firewall rules for port 2575
- Enable encryption for sensitive data

### Authentication
- Configure device authentication if supported
- Use secure protocols (TLS) when available
- Implement access logging

### Compliance
- Ensure HIPAA compliance for data transmission
- Implement audit logging
- Regular security assessments

## Maintenance

### Regular Tasks
1. **Monitor Connection Status**
   - Check device heartbeats
   - Verify data transmission rates
   - Monitor error logs

2. **Update Management**
   - Keep device firmware updated
   - Update HL7 parsing libraries
   - Test after updates

3. **Performance Monitoring**
   - Monitor network latency
   - Check data processing times
   - Optimize message parsing

## Support and Documentation

### Vendor Resources
- **Philips**: IntelliVue Information Center documentation
- **GE Healthcare**: DASH series technical manuals
- **Mindray**: BeneView integration guides

### WellConX Support
- Email: support@wellconx.com
- Documentation: https://docs.wellconx.com
- Technical Support: 24/7 available

---

For additional assistance with device integration, contact the WellConX technical support team.