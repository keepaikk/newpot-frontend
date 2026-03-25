# Newpot Africa - Production Deployment Guide

## 🚀 Backend API Deployment (Dokploy)

### Dokploy Configuration for Backend API

Create a **NEW** Dokploy application for the backend API with these settings:

```
Application Name: newpot-api
Repository: https://github.com/plunoo/rider.git
Build Type: Nixpacks (NOT Docker!)
Build Path: newpot/api
Port: 5000
Domain: api.newpot.rpnmore.com (or api.rpnmore.com)

Environment Variables:
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here_change_this
GEMINI_API_KEY=your_actual_gemini_api_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://newpot.rpnmore.com
PRODUCTION_URL=https://newpot.rpnmore.com
```

### 📁 Directory Structure for Deployment

Your git repository structure:
```
/newpot/
├── frontend files (React app - already deployed)
├── api/                    ← Backend deployment target
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── test-mvp-api.js
└── README.md
```

### 🔧 Deployment Steps

1. **Create New Dokploy Application**:
   - Name: `newpot-api` 
   - Repository: Your existing GitHub repo
   - **Build Path**: `newpot/api` (crucial!)
   - **Build Type**: Nixpacks (auto-detects Node.js)

2. **Configure Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=newpot_production_secret_make_this_long_and_random_xyz123
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Set Domain**:
   - Primary: `api.newpot.rpnmore.com`
   - Or subdomain of your existing domain

4. **Deploy**:
   - Dokploy will auto-detect Node.js from package.json
   - Run `npm install` and `npm run build`
   - Start with `npm start`

### ⚡ Expected Build Process

```bash
# Dokploy will automatically run:
cd newpot/api
npm install
npm run build    # Compiles TypeScript to dist/
npm start        # Runs: node dist/index.js
```

### 🌐 API Endpoints (Production)

Once deployed, your API will be available at:

```
Health Check: https://api.newpot.rpnmore.com/health
Demo Status:  https://api.newpot.rpnmore.com/api/demo/status
Markets:      https://api.newpot.rpnmore.com/api/markets
Auth:         https://api.newpot.rpnmore.com/api/auth/login
Betting:      https://api.newpot.rpnmore.com/api/bets
Wallet:       https://api.newpot.rpnmore.com/api/wallet/balance
```

### 🔄 Frontend Integration

After backend deployment, update your frontend to use the production API:

In your frontend code, update API base URL:
```javascript
// Before (local development)
const API_BASE = 'http://localhost:5000';

// After (production)
const API_BASE = 'https://api.newpot.rpnmore.com';
```

### 🛡️ Security Configuration

Production environment includes:
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configured for your domain
- ✅ Helmet security headers
- ✅ JWT token authentication
- ✅ Input validation on all endpoints
- ✅ Error handling middleware

### 📊 Monitoring & Testing

Test your deployed API:
```bash
# Health check
curl https://api.newpot.rpnmore.com/health

# Demo statistics
curl https://api.newpot.rpnmore.com/api/demo/status

# Markets data
curl https://api.newpot.rpnmore.com/api/markets
```

### 🎯 Post-Deployment Checklist

- [ ] Backend API responding at production domain
- [ ] Health check endpoint returns "healthy"
- [ ] Demo status shows platform statistics
- [ ] Markets endpoint returns 3 African markets
- [ ] CORS allows requests from frontend domain
- [ ] Authentication endpoints working
- [ ] Security headers present in responses

### 🚨 Troubleshooting

**Common Issues:**
1. **Build fails**: Check Build Path is `newpot/api`
2. **404 errors**: Ensure using Nixpacks, not Docker
3. **CORS errors**: Verify FRONTEND_URL environment variable
4. **Port issues**: Backend uses port 5000, not 80

**Deployment Logs to Check:**
- Build process completed successfully
- TypeScript compilation successful
- npm start command executed
- Server listening on port 5000

## 🎉 Success Criteria

✅ **Backend Deployed**: API accessible at production domain  
✅ **Frontend Updated**: Uses production API endpoints  
✅ **Full Integration**: Complete betting flow works end-to-end  
✅ **Demo Ready**: All features functional for presentations  

---

**Next**: Once backend is deployed, update frontend API configuration and test the complete application!