# WellConX EHR System - Production Deployment Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Pre-deployment Checklist](#pre-deployment-checklist)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Security Configuration](#security-configuration)
6. [Deployment Options](#deployment-options)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Recovery](#backup--recovery)
9. [Performance Optimization](#performance-optimization)
10. [Compliance & Certifications](#compliance--certifications)
11. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB minimum
- **CPU**: 2 cores minimum, 4 cores recommended

### Production Requirements
- **Node.js**: 20.0.0 LTS
- **RAM**: 16GB or higher
- **Storage**: 100GB SSD
- **CPU**: 8 cores or higher
- **Network**: High-speed internet connection
- **SSL Certificate**: Required for HTTPS

## Pre-deployment Checklist

### ✅ Security Checklist
- [ ] Change default JWT secret
- [ ] Configure strong password policies
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up intrusion detection
- [ ] Configure backup encryption
- [ ] Review access controls

### ✅ Database Checklist
- [ ] Set up production database (Supabase/PostgreSQL)
- [ ] Configure database backups
- [ ] Set up database monitoring
- [ ] Configure connection pooling
- [ ] Test database performance

### ✅ Application Checklist
- [ ] Build production application
- [ ] Configure environment variables
- [ ] Set up logging
- [ ] Configure monitoring
- [ ] Test all API endpoints
- [ ] Validate security measures

## Database Setup

### Option 1: Supabase (Recommended)
```bash
# 1. Create Supabase project
# Visit https://supabase.com and create new project

# 2. Get connection details
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 3. Run database migrations
npm run db:migrate

# 4. Seed initial data
npm run db:seed
```

### Option 2: PostgreSQL
```bash
# 1. Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# 2. Create database
sudo -u postgres psql
CREATE DATABASE wellconx_ehr;
CREATE USER wellconx_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE wellconx_ehr TO wellconx_user;
\q

# 3. Configure connection
DATABASE_URL=postgresql://wellconx_user:secure_password@localhost:5432/wellconx_ehr
```

## Environment Configuration

### Production Environment File
Create `.env.production`:
```env
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key

# Database
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email
EMAILJS_PUBLIC_KEY=your-emailjs-public-key
EMAILJS_SERVICE_ID=your-emailjs-service-id
EMAILJS_TEMPLATE_ID=your-emailjs-template-id

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id

# Third-party Services
STRIPE_SECRET_KEY=your-stripe-secret-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

## Security Configuration

### 1. SSL/TLS Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx with SSL
sudo nano /etc/nginx/sites-available/wellconx-ehr
```

### 2. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Frontend
    location / {
        root /var/www/wellconx-ehr/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose ports
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  ehr-app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - ehr-app
    restart: unless-stopped

volumes:
  redis-data:
```

### Option 2: PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'wellconx-ehr',
    script: 'backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_file: '.env.production',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=4096'
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 3: Cloud Deployment

#### AWS Deployment
```bash
# Deploy to AWS EC2
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx

# Deploy using AWS CodeDeploy
aws deploy create-deployment \
  --application-name wellconx-ehr \
  --deployment-group-name production \
  --s3-location bucket=your-bucket,key=deployment.zip
```

#### Google Cloud Deployment
```bash
# Deploy to Google Cloud Run
gcloud run deploy wellconx-ehr \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

## Monitoring & Logging

### 1. Application Monitoring
```javascript
// monitoring.js
import winston from 'winston'
import Sentry from '@sentry/node'

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'wellconx-ehr' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

// Configure Sentry for error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### 2. Health Checks
```javascript
// health.js
app.get('/api/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    version: process.env.npm_package_version
  }
  
  res.json(health)
})
```

### 3. Performance Monitoring
```javascript
// performance.js
import { performance } from 'perf_hooks'

app.use((req, res, next) => {
  const start = performance.now()
  
  res.on('finish', () => {
    const duration = performance.now() - start
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration.toFixed(2)}ms`
    })
  })
  
  next()
})
```

## Backup & Recovery

### 1. Database Backup
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="wellconx_ehr"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 2. File Backup
```bash
# Backup uploads directory
rsync -avz /app/uploads/ /backups/uploads/
tar -czf /backups/uploads_$(date +%Y%m%d).tar.gz /backups/uploads/
aws s3 cp /backups/uploads_$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

### 3. Recovery Procedures
```bash
# Database recovery
psql wellconx_ehr < backup_20240101_120000.sql

# File recovery
tar -xzf uploads_20240101.tar.gz
rsync -avz /backups/uploads/ /app/uploads/
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_patients_department ON patients(department);
CREATE INDEX idx_visits_patient_date ON visits(patient_id, date);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);

-- Configure connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

### 2. Application Optimization
```javascript
// Enable compression
app.use(compression())

// Configure caching
app.use(express.static('public', {
  maxAge: '1y',
  etag: true
}))

// Implement rate limiting
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)
```

### 3. CDN Configuration
```javascript
// Configure CDN for static assets
const cdnUrl = process.env.CDN_URL || 'https://cdn.your-domain.com'

app.use('/static', express.static('public', {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000')
  }
}))
```

## Compliance & Certifications

### 1. HIPAA Compliance
- [ ] Implement audit logging
- [ ] Configure data encryption at rest
- [ ] Set up secure communication (TLS 1.3)
- [ ] Implement access controls
- [ ] Configure backup encryption
- [ ] Set up data retention policies

### 2. GDPR Compliance
- [ ] Implement data portability
- [ ] Configure data deletion procedures
- [ ] Set up consent management
- [ ] Implement data minimization
- [ ] Configure breach notification

### 3. Security Certifications
- [ ] SOC 2 Type II certification
- [ ] ISO 27001 certification
- [ ] HITRUST certification
- [ ] Regular security audits

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connectivity
psql -h localhost -U wellconx_user -d wellconx_ehr

# Check connection pool
SELECT * FROM pg_stat_activity;

# Restart database service
sudo systemctl restart postgresql
```

#### 2. Memory Issues
```bash
# Check memory usage
free -h
top -p $(pgrep node)

# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

#### 3. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in /etc/ssl/certs/your-domain.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew

# Test SSL configuration
curl -I https://your-domain.com
```

#### 4. Performance Issues
```bash
# Monitor application performance
pm2 monit

# Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# Monitor system resources
htop
iotop
```

### Emergency Procedures

#### 1. Application Crash
```bash
# Restart application
pm2 restart wellconx-ehr

# Check logs
pm2 logs wellconx-ehr

# Rollback to previous version
pm2 restart wellconx-ehr --update-env
```

#### 2. Database Issues
```bash
# Check database status
sudo systemctl status postgresql

# Restart database
sudo systemctl restart postgresql

# Restore from backup if needed
psql wellconx_ehr < latest_backup.sql
```

#### 3. Security Breach
```bash
# Immediately block suspicious IPs
sudo ufw deny from suspicious_ip

# Rotate all secrets
# Update JWT secret, database passwords, API keys

# Check audit logs
tail -f /var/log/auth.log

# Notify security team
# Follow incident response procedures
```

## Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly security updates
- [ ] Monthly performance reviews
- [ ] Quarterly backup testing
- [ ] Annual security audits
- [ ] Regular dependency updates

### Contact Information
- **Technical Support**: support@wellconx.com
- **Security Issues**: security@wellconx.com
- **Emergency**: +1-800-WELLCONX

### Documentation
- [API Documentation](https://docs.wellconx.com/api)
- [User Manual](https://docs.wellconx.com/user)
- [Developer Guide](https://docs.wellconx.com/dev)
- [Security Guide](https://docs.wellconx.com/security)

---

**Note**: This guide should be updated regularly to reflect the latest security best practices and deployment procedures. Always test changes in a staging environment before applying to production. 