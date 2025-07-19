# Quick Start: Device Connection Setup

## Prerequisites
- Medical device with HL7 v2.x support
- Network connectivity (LAN/WLAN) or Serial connection
- WellConX server running on network

## Step-by-Step Setup

### 1. Network Configuration (5 minutes)

**Device Network Settings:**
```
IP Address: 192.168.1.1XX (where XX = device number)
Subnet Mask: 255.255.255.0
Gateway: 192.168.1.1
DNS: 8.8.8.8
```

**WellConX Server:**
```
Server IP: 192.168.1.50
HL7 Port: 2575
```

### 2. Device HL7 Configuration (3 minutes)

**Standard Settings:**
```
Protocol: HL7 v2.5
Message Type: ORU^R01
Transport: TCP/IP (MLLP)
Destination: 192.168.1.50:2575
Interval: 2-5 seconds
```

### 3. Enable Data Transmission (2 minutes)

**Select Vital Signs:**
- ✅ Heart Rate (ECG)
- ✅ Blood Pressure (NIBP)
- ✅ Oxygen Saturation (SpO2)
- ✅ Temperature
- ✅ Respiratory Rate

**Transmission Mode:** Continuous/Automatic

### 4. Test Connection (1 minute)

1. Start data transmission on device
2. Check WellConX dashboard for incoming data
3. Verify patient assignment
4. Confirm real-time updates

## Device-Specific Quick Setup

### Philips IntelliVue
1. **Main Setup** → **Network Setup**
2. Set IP: `192.168.1.101`
3. **HL7 Export** → Enable
4. Destination: `192.168.1.50:2575`
5. **Start Export**

### GE DASH Series
1. **Setup** → **System Config** → **Network**
2. Set IP: `192.168.1.102`
3. **Data Export** → **HL7**
4. Server: `192.168.1.50:2575`
5. **Enable Export**

### Mindray BeneView
1. **System** → **Network** → **TCP/IP**
2. Set IP: `192.168.1.103`
3. **Data Export** → **HL7**
4. Destination: `192.168.1.50:2575`
5. **Start Transmission**

## Verification Checklist

- [ ] Device shows "Connected" status
- [ ] WellConX displays device as "Online"
- [ ] Real-time vital signs updating
- [ ] Patient correctly assigned
- [ ] Alerts functioning properly

## Common Issues & Solutions

**Device Not Connecting:**
- Check IP configuration
- Verify network cable/WiFi
- Restart device network service

**No Data Received:**
- Confirm HL7 transmission enabled
- Check patient assignment
- Verify vital signs selection

**Intermittent Data:**
- Check network stability
- Verify power management settings
- Monitor for IP conflicts

## Need Help?

📧 **Email:** support@wellconx.com  
📞 **Phone:** 1-800-WELLCONX  
🌐 **Docs:** https://docs.wellconx.com  
💬 **Chat:** Available 24/7 in WellConX dashboard

---

**Total Setup Time: ~10 minutes per device**