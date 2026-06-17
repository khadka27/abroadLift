# AbroadLift Admin Portal

Welcome to the AbroadLift Admin Portal. This section of the application provides administrators with tools to monitor and manage student activity, university applications, and visa assessments.

## Directory Structure

```
admin/
├── dashboard/        # Additional dashboard views (if applicable)
├── login/            # Dedicated login interface for administrators
├── page.tsx          # Main Admin Dashboard (Student Central)
└── README.md         # This documentation file
```

## Features

### 1. Student Central Dashboard (`/admin`)
The main dashboard serves as the central hub for administrative oversight. Features include:
- **Real-time Statistics**: View total students, total applications, and average visa success rates.
- **Search Capabilities**: Filter the student registry by name, email, or username.
- **Detailed Student Profiles**: Click on any student to view their comprehensive academic and immigration profile, including:
  - Nationality and GPA
  - Active and past university applications with their current statuses
  - Visa eligibility history and success probability metrics
- **Visual Status Indicators**: Quick glancable progress bars and badges for visa success rates and application status.

### 2. Administrator Login (`/admin/login`)
A dedicated secure authentication portal designed specifically for staff and administrators. 

### 3. Access Control & Security
The admin portal is strictly protected by role-based access control (RBAC):
- Requires an active session via NextAuth.
- Validates the user role (`session?.user?.role === "ADMIN"`).
- Unauthenticated users are redirected to `/admin/login`.
- Non-admin authenticated users are securely redirected back to the main user portal.

## Data Integration
The dashboard consumes data from secure internal API endpoints:
- `GET /api/admin/students`: Fetches the comprehensive list of students, including their nested profiles, applications, and visa checks.

## Tech Stack
- **Framework**: Next.js (App Router)
- **UI Components**: Radix UI primitives & Lucide React icons
- **Styling**: Tailwind CSS with custom glassmorphism and modern UI elements
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
