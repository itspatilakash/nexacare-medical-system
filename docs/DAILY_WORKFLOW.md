# Daily Development Workflow - NexaCare Medical System

## 🚀 **Quick Start Commands**

### **Start Development**
```bash
# Navigate to project directory
cd /Users/akashpatil/Desktop/devspace/nexus/nexacare-medical-system

# Install dependencies (if needed)
npm install
cd client && npm install && cd ..

# Start development server
npm run dev
```

### **Access Application**
- **Main App**: http://localhost:3000
- **Frontend Dev**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:3000/api
- **Database**: Mock in-memory (demo mode)

---

## 📋 **Daily Checklist**

### **Morning Routine**
- [ ] Check `PROJECT_LOG.md` for yesterday's progress
- [ ] Review current TODO list
- [ ] Start development server
- [ ] Test current functionality
- [ ] Plan today's tasks

### **Development Session**
- [ ] Focus on one feature/component at a time
- [ ] Write tests for new functionality
- [ ] Update documentation as you go
- [ ] Test changes in browser
- [ ] Check console for errors

### **Evening Routine**
- [ ] Update `PROJECT_LOG.md` with today's progress
- [ ] Commit changes to current branch
- [ ] Push branch to GitHub
- [ ] Create Pull Request (if feature complete)
- [ ] Test all functionality
- [ ] Plan tomorrow's tasks
- [ ] Update TODO list

---

## 🌿 **Git Branching Workflow**

### **Starting New Work Session**
```bash
# 1. Check current status
git status

# 2. If main branch is clean, create new feature branch
git checkout main
git pull origin main
git checkout -b feature/[feature-name]

# Example:
git checkout -b feature/appointment-management
git checkout -b feature/prescription-system
git checkout -b bugfix/login-issue
```

### **During Development**
```bash
# Regular commits during work
git add .
git commit -m "Add: [brief description of changes]"

# Push to feature branch
git push origin feature/[feature-name]
```

### **End of Work Session**
```bash
# Final commit and push
git add .
git commit -m "Complete: [feature description]"
git push origin feature/[feature-name]

# Create Pull Request on GitHub (optional)
# Or leave branch for review/merge
```

### **Branch Naming Convention**
- `feature/` - New features (e.g., `feature/appointment-booking`)
- `bugfix/` - Bug fixes (e.g., `bugfix/otp-validation`)
- `hotfix/` - Critical fixes (e.g., `hotfix/security-patch`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)

### **Important Reminders**
- ⚠️ **ALWAYS create a new branch** when starting work after a break
- ⚠️ **NEVER work directly on main branch** for new features
- ⚠️ **Always pull latest changes** before starting new work
- ⚠️ **Keep commits small and focused** - one feature per commit
- ⚠️ **Write descriptive commit messages**

---

## 🎯 **Current Priority Tasks**

### **TODAY'S FOCUS** (September 24, 2024)
1. **Complete Appointment API Routes**
   - File: `server/routes/appointments.routes.ts`
   - Implement: GET, POST, PUT, DELETE endpoints
   - Test: All CRUD operations

2. **Complete Appointment Service Functions**
   - File: `server/services/appointments.service.ts`
   - Implement: createAppointment, getAppointments, updateAppointment, deleteAppointment
   - Test: All service functions

3. **Create Patient Appointments Page**
   - File: `client/src/pages/dashboards/patient-appointments.tsx`
   - Features: List, create, edit, cancel appointments
   - Test: Full appointment workflow

---

## 🔧 **Development Patterns**

### **Backend Service Pattern**
```typescript
// Example: appointments.service.ts
export class AppointmentService {
  static async createAppointment(data: CreateAppointmentData) {
    try {
      // 1. Validate input data
      // 2. Check business rules
      // 3. Save to database
      // 4. Send notifications
      // 5. Return result
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }
}
```

### **Frontend Component Pattern**
```typescript
// Example: PatientAppointments.tsx
export default function PatientAppointments() {
  // 1. State management with React hooks
  // 2. API calls with React Query
  // 3. Loading and error states
  // 4. Form handling with React Hook Form
  // 5. Toast notifications for feedback
}
```

### **API Route Pattern**
```typescript
// Example: appointments.routes.ts
router.post('/', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const appointment = await AppointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(400).json({ message: 'Failed to create appointment' });
  }
});
```

---

## 📁 **File Organization**

### **Backend Structure**
```
server/
├── routes/           # API endpoints
├── services/         # Business logic
├── middleware/       # Authentication, validation
├── utils/           # Helper functions
└── types/           # TypeScript definitions
```

### **Frontend Structure**
```
client/src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API calls and business logic
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configuration
└── types/          # TypeScript definitions
```

---

## 🧪 **Testing Strategy**

### **Backend Testing**
```bash
# Run backend tests
npm test

# Test specific service
npm test -- appointments.service.test.ts

# Test specific route
npm test -- appointments.routes.test.ts
```

### **Frontend Testing**
```bash
# Run frontend tests
cd client && npm test

# Test specific component
npm test -- PatientAppointments.test.tsx
```

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] OTP generation and verification
- [ ] Appointment booking flow
- [ ] Prescription creation
- [ ] Lab report upload
- [ ] Notification display
- [ ] Role-based access control

---

## 🐛 **Debugging Guide**

### **Common Issues & Solutions**

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql

# Test connection
psql -d nexacare_demo -c "SELECT 1;"
```

#### **Port Conflicts**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### **Node Modules Issues**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Debug Tools**
- **Backend**: Console logs, database queries
- **Frontend**: Browser DevTools, React DevTools
- **Network**: Check API calls in Network tab
- **Database**: Use pgAdmin or psql for queries

---

## 📊 **Progress Tracking**

### **Daily Progress Template**
```markdown
## Date: [YYYY-MM-DD]

### Completed:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Issues/Blockers:
- Issue 1: Description and solution
- Issue 2: Description and solution

### Tomorrow's Plan:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

### **Weekly Review Template**
```markdown
## Week of [Date Range]

### Achievements:
- Major milestone 1
- Major milestone 2
- Major milestone 3

### Challenges:
- Challenge 1: How it was solved
- Challenge 2: How it was solved

### Next Week Focus:
- Priority 1
- Priority 2
- Priority 3
```

---

## 🎯 **Demo Preparation**

### **Investor Demo Script**
1. **Introduction** (2 minutes)
   - Show project overview
   - Explain the problem we're solving
   - Highlight key features

2. **User Registration** (3 minutes)
   - Register as patient
   - Show OTP generation
   - Complete profile setup

3. **Appointment Booking** (5 minutes)
   - Search for hospitals
   - Select doctor and time slot
   - Book appointment
   - Show confirmation

4. **Doctor Workflow** (5 minutes)
   - Login as doctor
   - View patient list
   - Create prescription
   - Request lab tests

5. **Hospital Management** (5 minutes)
   - Login as hospital admin
   - Manage doctors
   - View analytics
   - Approve requests

6. **Lab Integration** (3 minutes)
   - Upload lab reports
   - Show patient access
   - Demonstrate workflow

7. **Real-time Features** (2 minutes)
   - Show notifications
   - Demonstrate live updates
   - Highlight local services

### **Demo Data Setup**
```bash
# Seed database with demo data
npm run seed

# Demo accounts:
# Patient: 9876543212 / password123
# Doctor: 9876543211 / password123
# Hospital: 9876543210 / password123
```

---

## 📞 **Getting Help**

### **Documentation References**
- `PROJECT_LOG.md` - Complete project history
- `CHANGELOG.md` - Recent changes
- `README.md` - Project setup
- `setup.md` - Development setup

### **Code References**
- Existing working files as templates
- Database schema in `drizzle/schema.ts`
- Type definitions in `shared/schema-types.ts`
- UI components in `client/src/components/ui/`

### **External Resources**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)

---

**Remember**: 
- Focus on one feature at a time
- Test frequently
- Document as you go
- Keep the demo working
- Update this log daily

---

## 🎯 **CURRENT STATUS (Updated: September 25, 2024)**

### ✅ **FULLY WORKING FEATURES**
- ✅ **Authentication System**: Login/Register with OTP verification
- ✅ **UI Design System**: Consistent styling across all pages
- ✅ **Responsive Design**: Mobile-optimized layouts
- ✅ **Error Handling**: Clear user feedback and error messages
- ✅ **Demo User Accounts**: Ready for testing

### 🚀 **TESTING READY**
**Access URLs:**
- Main App: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Test Page: `http://localhost:3000/test`

**Demo Credentials:**
- Doctor: `9876543210` / `password123`
- Patient: `9876543211` / `password123`
- Hospital Admin: `9876543212` / `password123`

### 🔧 **TECHNICAL STATUS**
- ✅ React app loading properly (fixed loading screen bug)
- ✅ OTP functionality working with visible feedback
- ✅ API endpoints responding correctly
- ✅ Consistent design system implemented
- ✅ Mobile-responsive layouts
- ✅ Production-ready code structure

### 📋 **NEXT PRIORITIES**
1. Complete dashboard functionality for all roles
2. Add appointment booking system
3. Implement prescription management
4. Add lab report functionality
5. Enhance notification system

**Last Updated**: September 25, 2024
