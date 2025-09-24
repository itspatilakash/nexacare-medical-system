# Medical Care Platform

## Overview
This is a comprehensive healthcare management platform built with Express.js, React, TypeScript, and PostgreSQL. The application serves multiple healthcare stakeholders including hospitals, doctors, patients, labs, and receptionists through role-based authentication and specialized dashboards.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with custom configuration for development and production
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical theme colors
- **State Management**: TanStack Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: JWT-based with role-based access control
- **Password Security**: bcrypt for hashing
- **Development**: Hot reloading with tsx

### Database Design
- **Primary Database**: PostgreSQL (Neon serverless)
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migration Tool**: Drizzle Kit
- **Key Tables**:
  - `users` - Central authentication table for all roles
  - `hospitals` - Hospital information and profiles
  - `doctors` - Doctor profiles linked to hospitals
  - `patients` - Patient records and medical information
  - `labs` - Laboratory information
  - `receptionists` - Reception staff profiles
  - `appointments` - Appointment scheduling and management
  - `prescriptions` - Medical prescriptions
  - `lab_reports` - Laboratory test results
  - `otp_verifications` - SMS-based verification system

## Key Components

### Authentication System
- **Registration Flow**: Mobile number → OTP verification → Account creation
- **Login System**: Mobile number + password authentication
- **Role-Based Access**: Hospital, Doctor, Patient, Lab, Receptionist roles
- **Security**: JWT tokens with 24-hour expiration
- **Authorization Middleware**: Route protection based on user roles

### Dashboard System
- **Role-Specific Dashboards**: Each user type has a tailored interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Data**: Query-based data fetching with caching
- **Navigation**: Role-based sidebar navigation with active state management

### UI Component System
- **Design System**: shadcn/ui with custom medical theme
- **Accessibility**: ARIA-compliant components from Radix UI
- **Consistency**: Centralized component library with variant support
- **Theming**: CSS custom properties with light/dark mode support

## Data Flow

### Authentication Flow
1. User registers with mobile number and role
2. OTP sent via SMS (stubbed for development)
3. User verifies OTP and sets password
4. JWT token issued upon successful verification
5. Token stored in localStorage for session persistence
6. Protected routes validate token and user role

### Application Data Flow
1. Client makes authenticated API requests with Bearer token
2. Server validates JWT and extracts user information
3. Role-based middleware ensures proper authorization
4. Database queries executed through Drizzle ORM
5. Response data formatted and sent to client
6. TanStack Query manages caching and synchronization

### Database Interaction
1. Shared schema definitions ensure type safety across stack
2. Drizzle ORM provides type-safe database operations
3. Connection pooling through Neon serverless PostgreSQL
4. Migration management through Drizzle Kit

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/\***: Accessible UI primitives
- **wouter**: Lightweight React router
- **zod**: Runtime type validation
- **jwt**: Token-based authentication
- **bcrypt**: Password hashing

### Development Tools
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for development
- **tailwindcss**: Utility-first CSS framework
- **postcss**: CSS processing
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Hot Reload**: Enabled through Vite and tsx
- **Port**: 5000 (configured in .replit)
- **Database**: Environment-based connection string

### Production Build
- **Frontend Build**: `vite build` → static files in `dist/public`
- **Backend Build**: `esbuild` → bundled server in `dist/index.js`
- **Deployment Target**: Replit autoscale
- **Environment Variables**: DATABASE_URL, JWT_SECRET

### Database Management
- **Schema Push**: `npm run db:push` applies schema changes
- **Migrations**: Stored in `./migrations` directory
- **Connection**: WebSocket-based for Replit compatibility

## Changelog
- June 26, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.