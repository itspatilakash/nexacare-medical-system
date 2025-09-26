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
- Main App: http://localhost:3000
- Frontend Dev: http://localhost:5173
- Backend API: http://localhost:3000/api

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

## 🎯 **Current Status (60% Complete)**
- ✅ Authentication with local OTP
- ✅ Login/Register with OTP verification
- ✅ Consistent UI design system
- ✅ Mobile-responsive layouts
- ✅ Error handling and user feedback
- ✅ Demo user accounts ready
- ✅ React app loading properly
- ✅ Complete API endpoints (100%)
- ✅ Complete service functions (90%)
- ✅ Frontend dashboard pages (80%)
- ✅ Authentication persistence (100%)
- ✅ Appointment booking system (100%)
- ✅ Real-time data integration (100%)

## 🔑 **Demo Credentials**
- **Doctor**: `9876543210` / `password123` / Dr. John Smith
- **Patient**: `9876543211` / `password123` / Jane Doe
- **Hospital Admin**: `9876543212` / `password123` / Hospital Admin

## 🔥 **Next Priority Tasks**
1. Complete prescription system with full CRUD operations
2. Complete lab report management system
3. Add real-time notifications with WebSocket
4. Enhance UI components and user experience
5. Add advanced search and filtering functionality

## 📱 **Test URLs**
- Main App: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Test Page: `http://localhost:3000/test`

## 🧪 **Demo Setup & Features**

### **What Works in This Demo**
- ✅ **User Registration** with OTP verification
- ✅ **Login** with both password and OTP
- ✅ **Mock Database** (in-memory storage)
- ✅ **Local SMS Service** (displays OTP in console and UI)
- ✅ **Authentication** with JWT tokens
- ✅ **Role-based Access Control**
- ✅ **Modern UI** with Tailwind CSS

### **Demo Flow**
1. **Registration**: Fill form → Send OTP → Verify OTP → Create password → Complete
2. **Login**: Use password or OTP method → OTP appears in toast/console
3. **Dashboard**: Role-based redirect to appropriate dashboard

### **OTP Display**
- **Console**: Check terminal for OTP codes
- **UI**: Toast notifications show OTP codes
- **Format**: 6-digit numbers (e.g., `123456`)

### **Local Services**
- **SMS**: Logs to console (no external SMS service)
- **Email**: Logs to console (no external email service)
- **File Storage**: Simulated locally

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
