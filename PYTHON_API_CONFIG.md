# Python API Configuration Guide

## How Frontend Finds Python Backend

The frontend uses environment variables to locate the Python backend server. Here's how it works:

## 🔧 **Environment Variable Configuration**

### **1. Default Setup (Development)**
```bash
# In .env.local
NEXT_PUBLIC_PYTHON_API_URL="http://localhost:8000"
```

### **2. Frontend Code Usage**
```javascript
// In components/slide-creation-form.tsx and slide-results.tsx
const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
const response = await fetch(`${pythonApiUrl}/generate_slide_with_template`, {
  // ... request details
})
```

## 🚀 **Different Deployment Scenarios**

### **Scenario 1: Local Development**
```bash
# Frontend: http://localhost:3001
# Python API: http://localhost:8000

NEXT_PUBLIC_PYTHON_API_URL="http://localhost:8000"
```

### **Scenario 2: Different Ports**
```bash
# If Python API runs on port 8080
NEXT_PUBLIC_PYTHON_API_URL="http://localhost:8080"
```

### **Scenario 3: Different Host**
```bash
# If Python API runs on different machine
NEXT_PUBLIC_PYTHON_API_URL="http://192.168.1.100:8000"
```

### **Scenario 4: Production Deployment**
```bash
# Production with domain names
NEXT_PUBLIC_PYTHON_API_URL="https://api.yoursite.com"
```

### **Scenario 5: Docker/Container Setup**
```bash
# If using Docker networking
NEXT_PUBLIC_PYTHON_API_URL="http://python-api:8000"
```

## 📋 **Step-by-Step Setup**

### **1. Start Python Backend**
```bash
cd mistix
python slide_api.py
# Server starts on http://localhost:8000
```

### **2. Configure Frontend**
```bash
# In mistix/.env.local
NEXT_PUBLIC_PYTHON_API_URL="http://localhost:8000"
```

### **3. Start Frontend**
```bash
cd mistix
npm run dev
# Frontend starts on http://localhost:3001
```

## 🔄 **Fallback Mechanism**

The frontend includes intelligent fallback logic:

1. **Primary**: Try Python API first (if available)
2. **Fallback**: Use Node.js API if Python API fails
3. **Error Handling**: Clear error messages if both fail

```javascript
// Simplified flow
try {
  // Try Python API
  const response = await fetch(`${pythonApiUrl}/generate_slide_with_template`)
  // ... handle PPTX file response
} catch (error) {
  // Fall back to Node.js API
  const fallbackResponse = await fetch('/api/presentations/generate-with-template')
  // ... handle JSON response
}
```

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. "Failed to create presentation"**
- **Check**: Is Python API running? (`python slide_api.py`)
- **Check**: Is the URL correct in `.env.local`?
- **Check**: Are there CORS issues?

#### **2. "Connection refused"**
- **Check**: Python API port (default 8000)
- **Check**: Firewall/network settings
- **Check**: Environment variable spelling

#### **3. "Template not found"**
- **Check**: Template files in `public/templates/`
- **Check**: File names match exactly (e.g., `modern-minimal.pptx`)

### **Debug Steps**

1. **Verify Python API is running**:
   ```bash
   curl http://localhost:8000/template_structure
   ```

2. **Check environment variables**:
   ```bash
   echo $NEXT_PUBLIC_PYTHON_API_URL
   ```

3. **Test API connectivity**:
   ```bash
   curl -X POST http://localhost:8000/generate_slide_with_template \
     -H "Content-Type: application/json" \
     -d '{"title":"test","outlines":[],"templateId":"modern-minimal","language":"english"}'
   ```

## 📁 **File Structure**

```
mistix/
├── .env.local                     # Environment configuration
├── slide_api.py                   # Python FastAPI backend
├── components/
│   ├── slide-creation-form.tsx    # Uses NEXT_PUBLIC_PYTHON_API_URL
│   └── slide-results.tsx          # Uses NEXT_PUBLIC_PYTHON_API_URL
└── public/templates/               # PPTX template files
    ├── modern-minimal.pptx
    ├── corporate-blue.pptx
    └── ...
```

## 🔐 **Security Notes**

- **NEXT_PUBLIC_** prefix makes variable accessible to browser
- Use HTTPS in production: `https://your-api-domain.com`
- Consider API authentication for production use
- Validate CORS settings for cross-origin requests

## 🌐 **Production Deployment**

### **Option 1: Same Domain**
```bash
# Deploy both on same domain
Frontend: https://yoursite.com
Python API: https://yoursite.com/api/v1

NEXT_PUBLIC_PYTHON_API_URL="https://yoursite.com/api/v1"
```

### **Option 2: Subdomain**
```bash
# Use subdomain for API
Frontend: https://app.yoursite.com
Python API: https://api.yoursite.com

NEXT_PUBLIC_PYTHON_API_URL="https://api.yoursite.com"
```

### **Option 3: Separate Services**
```bash
# Completely separate deployments
Frontend: https://frontend-service.com
Python API: https://backend-service.com

NEXT_PUBLIC_PYTHON_API_URL="https://backend-service.com"
