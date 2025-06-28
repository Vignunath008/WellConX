# WellConX - Real-Time Medical Device Monitoring Platform

A comprehensive B2B healthcare portal for real-time monitoring of medical devices, featuring HL7 data integration, patient management, and advanced analytics.

## Features

### 🏥 Core Functionality
- **Real-time Patient Monitoring**: Live vital signs tracking with automatic updates
- **Device Management**: Monitor and manage medical devices (Philips MP70, MP60, MP50, GE, Mindray)
- **HL7 Integration**: Ready for HL7 data parsing and processing
- **Multi-user Support**: Role-based access for doctors, nurses, and administrators

### 📊 Dashboard & Analytics
- **Live Dashboard**: Real-time overview of all patients and devices
- **Advanced Charts**: Interactive vital signs trends and analytics
- **Alert System**: Critical, warning, and normal status indicators
- **Historical Data**: Patient history and device performance tracking

### 🔐 Security & Compliance
- **Role-based Authentication**: Secure login with user roles
- **HIPAA-Ready Architecture**: Built with healthcare compliance in mind
- **Audit Logging**: Track all user actions and system events
- **Data Encryption**: Secure data transmission and storage

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data streaming with WebSocket support
- **Intuitive Interface**: Clean, medical-grade user interface
- **Accessibility**: WCAG compliant design

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom medical theme

## Getting Started

### Demo Accounts
Use these credentials to explore the application:

- **Doctor**: `doctor@wellconx.com` / `demo123`
- **Nurse**: `nurse@wellconx.com` / `demo123`
- **Admin**: `admin@wellconx.com` / `demo123`

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:3000

## HL7 Integration Guide

### Supported Connectivity Options
- **Serial Connection (RS-232)**: Direct device connection
- **LAN/Ethernet**: Network-based data streaming
- **WLAN**: Wireless connectivity support

### Implementation Steps

1. **HL7 Parser Setup**
   ```javascript
   // Example HL7 message parsing
   const parseHL7Message = (message) => {
     const segments = message.split('\r');
     const msh = segments.find(s => s.startsWith('MSH'));
     const obx = segments.filter(s => s.startsWith('OBX'));
     // Parse vital signs from OBX segments
   };
   ```

2. **Real-time Data Streaming**
   ```javascript
   // WebSocket connection for real-time updates
   const socket = io('ws://localhost:3001');
   socket.on('vitals-update', (data) => {
     updatePatientVitals(data.patientId, data.vitals);
   });
   ```

3. **Device Connection**
   - Configure device IP addresses and ports
   - Set up HL7 message listeners
   - Implement error handling and reconnection logic

## Architecture Overview

### Frontend Components
- **Dashboard**: Real-time overview and key metrics
- **Patients**: Individual patient monitoring and management
- **Devices**: Device status and configuration
- **Analytics**: Historical data and reporting
- **Settings**: User preferences and system configuration

### Data Flow
1. Medical devices send HL7 messages via TCP/IP or serial
2. Backend service parses HL7 and extracts vital signs
3. Data is stored in database with timestamps
4. Frontend receives real-time updates via WebSocket
5. UI displays live data with charts and alerts

### Security Considerations
- All API endpoints require authentication
- Role-based access control (RBAC)
- Data encryption in transit and at rest
- Audit logging for compliance
- Session management and timeout

## Deployment

### Production Checklist
- [ ] Configure HL7 device connections
- [ ] Set up database with proper indexes
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and alerting
- [ ] Implement backup and disaster recovery
- [ ] Configure user authentication (LDAP/SSO)
- [ ] Set up audit logging
- [ ] Performance testing and optimization

### Environment Variables
```env
VITE_API_URL=https://api.wellconx.com
VITE_WS_URL=wss://ws.wellconx.com
VITE_HL7_ENDPOINT=tcp://devices.wellconx.com:2575
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions about HL7 integration:
- Email: support@wellconx.com
- Documentation: https://docs.wellconx.com
- Issues: GitHub Issues page

---

**Note**: This is a demonstration application. For production use in healthcare environments, ensure compliance with all relevant regulations (HIPAA, FDA, etc.) and conduct thorough security audits.