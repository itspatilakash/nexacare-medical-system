# NexaCare Medical System - Quick Reference

## 🚀 **Start Development**
```bash
# Navigate to project
cd /Users/akashpatil/Desktop/devspace/nexus/nexacare-medical-system

# Create new branch for work
git checkout main
git pull origin main
git checkout -b feature/[feature-name]

# Start development server
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🌿 **Git Workflow (CRITICAL)**
```bash
# ALWAYS create new branch when starting work
git checkout main && git pull origin main
git checkout -b feature/appointment-management

# Regular commits
git add . && git commit -m "Add: appointment booking feature"

# Push to branch
git push origin feature/appointment-management
```

## 📁 **Key Files**
- `PROJECT_LOG.md` - Complete project history & progress
- `DAILY_WORKFLOW.md` - Daily development guide
- `CHANGELOG.md` - Recent changes
- `server/services/` - Backend business logic
- `client/src/pages/` - Frontend pages
- `client/src/components/` - Reusable UI components

## 🎯 **Current Status (25% Complete)**
- ✅ Authentication with local OTP
- ✅ Local SMS/Email services
- ✅ Notification system
- ✅ Basic UI components
- ❌ Complete API endpoints (0%)
- ❌ Complete service functions (0%)
- ❌ Frontend dashboard pages (0%)

## 🔥 **Next Priority Tasks**
1. Complete `server/routes/appointments.routes.ts`
2. Complete `server/services/appointments.service.ts`
3. Create `client/src/pages/dashboards/patient-appointments.tsx`

## 🧪 **Demo Accounts**
- Patient: 9876543212 / password123
- Doctor: 9876543211 / password123
- Hospital: 9876543210 / password123

## 📱 **Local Services**
- OTP: Shows in console + UI toast
- SMS: Logged to console
- Email: Logged to console
- Files: Stored as base64 in database

## 🐛 **Common Commands**
```bash
# Start PostgreSQL
brew services start postgresql

# Check port usage
lsof -i :3000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install
```

## 📊 **Progress Tracking**
- Update `PROJECT_LOG.md` daily
- Use `DAILY_PROGRESS_TEMPLATE.md` for daily logs
- Check `DAILY_WORKFLOW.md` for detailed workflow

## 🎯 **Demo Script (15 minutes)**
1. User registration (3 min)
2. Appointment booking (5 min)
3. Doctor workflow (5 min)
4. Real-time features (2 min)

**Last Updated**: September 23, 2024
