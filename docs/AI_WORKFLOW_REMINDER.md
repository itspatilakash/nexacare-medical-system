# AI Assistant Workflow Reminder

## 🚨 **CRITICAL: Always Read Documentation First**

### **📋 Required Reading Order (Every Session)**
1. **PROJECT_LOG.md** - Complete project history and current status
2. **DAILY_WORKFLOW.md** - Daily development guide and Git workflow
3. **QUICK_REFERENCE.md** - Essential information and demo credentials
4. **CHANGELOG.md** - Recent changes and fixes
5. **DAILY_STARTUP.md** - Quick startup guide

### **🔍 Project Structure Analysis (NEW)**
**ALWAYS analyze project structure when user asks to:**
- "Analyze the project"
- "See the docs"
- "Check the current status"
- "Understand what needs to be done"

**Use these tools to analyze:**
1. `list_dir` - Check directory structure
2. `codebase_search` - Search for specific functionality
3. `grep` - Find specific patterns in code
4. `read_file` - Read key files for context

### **📊 Project Structure Analysis Checklist**
- [ ] Check `client/src/pages/dashboards/` - Dashboard pages status
- [ ] Check `server/routes/` - API endpoints status
- [ ] Check `server/services/` - Service functions status
- [ ] Check `client/src/components/` - UI components status
- [ ] Check `shared/schema.ts` - Database schema
- [ ] Check `docs/` - Documentation completeness

### **🎯 Daily Startup Protocol**
1. **User says**: "Read the project documentation files first"
2. **AI reads**: All 5 documentation files in order
3. **AI provides**: 
   - Current project status
   - Recent accomplishments
   - Next priorities
   - Demo credentials
   - Any blockers or issues
4. **AI analyzes**: Project structure and existing files
5. **Then**: Start working on next features
6. **End of session**: Update all documentation files

### **📝 Documentation Update Protocol**
**At the end of each session, update:**
- [ ] `PROJECT_LOG.md` - Add today's accomplishments
- [ ] `CHANGELOG.md` - Add recent changes
- [ ] `QUICK_REFERENCE.md` - Update current status
- [ ] `DAILY_WORKFLOW.md` - Update if needed
- [ ] `DAILY_STARTUP.md` - Update if needed

### **🔧 Technical Analysis Tools**
**Use these tools to understand the project:**
- `codebase_search` - Find functionality across the codebase
- `grep` - Search for specific patterns
- `read_file` - Read key files for context
- `list_dir` - Check directory structure
- `run_terminal_cmd` - Test functionality

### **📊 Current Project Status (Updated Daily)**
- **Overall Progress**: 60% Complete
- **Authentication**: 100% Complete
- **API Integration**: 100% Complete
- **Dashboard Functionality**: 80% Complete
- **Appointment Booking**: 100% Complete
- **Prescription System**: 20% Complete
- **Lab Report Management**: 20% Complete

### **🎯 Next Session Priorities**
1. Complete prescription system with full CRUD operations
2. Complete lab report management system
3. Add real-time notifications with WebSocket
4. Enhance UI components and user experience
5. Add advanced search and filtering functionality

### **🔑 Demo Credentials (Always Available)**
- **Doctor**: `9876543210` / `password123` / Dr. John Smith
- **Patient**: `9876543211` / `password123` / Jane Doe
- **Hospital Admin**: `9876543212` / `password123` / Hospital Admin

### **📱 Test URLs**
- Main App: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Test Page: `http://localhost:3000/test`

### **🚀 Development Commands**
```bash
# Start development
npm run dev

# Start backend only
npm run dev:server

# Start frontend only
npm run dev:client
```

### **🌿 Git Workflow (CRITICAL)**
```bash
# ALWAYS create new branch when starting work
git checkout main && git pull origin main
git checkout -b feature/[feature-name]

# Regular commits
git add . && git commit -m "Add: [description]"

# Push to branch
git push origin feature/[feature-name]
```

### **⚠️ Important Reminders**
- **NEVER work directly on main branch**
- **ALWAYS read documentation first**
- **ALWAYS analyze project structure**
- **ALWAYS update documentation at end of session**
- **ALWAYS test functionality before committing**
- **ALWAYS use descriptive commit messages**

### **📞 Communication Protocol**
- **Start**: Read all documentation files
- **Analyze**: Project structure and current status
- **Plan**: Next steps and priorities
- **Execute**: Work on features systematically
- **Test**: Verify functionality works
- **Document**: Update all documentation files
- **Commit**: Use proper Git workflow

---

**Last Updated**: September 26, 2024
**Next Review**: September 27, 2024
**Current Focus**: Complete prescription system and lab report management