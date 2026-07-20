# Pinggly - Comprehensive Project Context Document

**Last Updated:** 2026-07-18  
**Project Version:** 0.1.0  
**Language:** TypeScript + JSX  
**RTL Support:** Yes (Arabic-first, RTL direction)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Overview](#business-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [System Architecture](#system-architecture)
6. [Database Documentation](#database-documentation)
7. [Authentication & Authorization](#authentication--authorization)
8. [Features](#features)
9. [Routing](#routing)
10. [Components Catalog](#components-catalog)
11. [Data Flow](#data-flow)
12. [State Management](#state-management)
13. [Design System](#design-system)
14. [Coding Conventions](#coding-conventions)
15. [Dependency Analysis](#dependency-analysis)
16. [Environment Variables](#environment-variables)
17. [Performance Analysis](#performance-analysis)
18. [Security Review](#security-review)
19. [Error Handling](#error-handling)
20. [Current Project Status](#current-project-status)
21. [TODO Analysis](#todo-analysis)
22. [Known Issues](#known-issues)
23. [File Responsibilities](#file-responsibilities)
24. [Development Guide](#development-guide)
25. [AI Context](#ai-context)

---

## Executive Summary

**Pinggly** is an **Arabic-first student resource sharing platform** designed for Computer Science students. The platform enables students to collaborate, share academic resources (lectures, TDs, TPs, exams, summaries), and build an active learning community.

### Problem & Solution

- **Problem:** Computer Science students struggle to find and organize reliable, peer-vetted academic resources in Arabic.
- **Solution:** Pinggly provides a centralized platform where students can upload, discover, and manage resources organized by academic level and course.

### Key Features

✅ User authentication (registration, login, OTP verification)  
✅ Resource uploading (external Google Drive links only)  
✅ Resource browsing and filtering by level/semester/type  
✅ User profile management with academic level preferences  
✅ Admin-approved resource moderation  
✅ Responsive UI with RTL (Arabic) support  

### Target Users

- Computer Science students (L1-L3 Licence, M1-M2 Master)
- Universities in Arabic-speaking countries

---

## Business Overview

### Project Goals

1. Create a **centralized hub** for Computer Science academic resources
2. Foster a **peer-learning community** among Arabic-speaking students
3. Provide **quality-controlled** content through admin moderation
4. Enable **easy resource discovery** through smart categorization

### Core Workflows

#### Student Workflow

```
Register/Login → Complete Profile → Browse Resources → Upload Resources → Track Uploads
```

#### Admin Workflow

```
Review Pending Resources → Approve/Reject → Manage Users → Moderate Content
```

### Main Use Cases

1. **Resource Discovery:** Find lectures, exams, solutions by level and course
2. **Resource Sharing:** Upload personal study materials and notes
3. **Profile Management:** Set academic level and university
4. **Resource Tracking:** Monitor uploaded resources and their approval status
5. **Community Contribution:** Help peers by sharing quality content

### Target Academic Levels

- L1, L2, L3 (Licence/Bachelor's)
- M1, M2 (Master's)

### Resource Types Supported

- `course` - Lectures and course materials
- `td` - Tutorial exercises (Travaux Dirigés)
- `tp` - Practical work (Travaux Pratiques)
- `exam` - Exam papers and past questions
- `summary` - Study summaries and notes
- `solution` - Problem solutions
- `project` - Project assignments
- `other` - Miscellaneous materials

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.2.9 | Full-stack React framework with App Router |
| **Runtime** | Node.js | Latest LTS | Server-side JavaScript execution |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **UI Library** | React | 19.2.4 | Component-based UI framework |
| **Component System** | shadcn/ui | 4.12.0 | Pre-built accessible UI components |
| **Component Primitives** | Radix UI | 1.6.1 | Unstyled, accessible primitives |
| **Styling** | TailwindCSS | 4.x | Utility-first CSS framework |
| **Icons** | Lucide React | 1.23.0 | Modern, clean icon library |
| **Animations** | Motion | 12.42.2 | Production animation library |
| **Utilities** | clsx + tailwind-merge | - | CSS class management |
| **Backend** | Supabase | Latest | PostgreSQL database + Auth |
| **Database** | PostgreSQL | (Supabase) | Relational database |
| **Authentication** | Supabase Auth | Latest | Email/password + session management |
| **SSR Support** | @supabase/ssr | 0.12.0 | Supabase SSR utilities |
| **Email Service** | Resend | 6.17.2 | Email delivery service |
| **Fonts** | Cairo, Geist Mono | Google Fonts | Typography (Arabic + Latin) |
| **Build Tool** | Next.js Build | 16.2.9 | Webpack-based optimization |
| **Linting** | ESLint | 9.x | Code quality |
| **Dev Tools** | TypeScript Compiler | 5.x | Type checking |

### Technology Rationale

- **Next.js 16:** Server Components enable efficient server-side rendering and data fetching; App Router provides modern routing patterns
- **TypeScript:** Catches errors at compile time; improves IDE support and developer experience
- **Supabase:** Combines PostgreSQL database with integrated auth; eliminates need for separate backend
- **shadcn/ui:** Pre-built, accessible components; easily customizable with TailwindCSS
- **TailwindCSS 4:** Modern utility-first CSS with RTL support; efficient file sizes
- **Motion:** Lightweight animation library for smooth transitions and micro-interactions
- **Resend:** Reliable email delivery for verification and notifications

---

## Project Structure

```
pingy/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page (public)
│   ├── layout.tsx               # Root layout (fonts, globals)
│   ├── error.tsx                # Error boundary
│   ├── globals.css              # Global styles
│   ├── auth/                    # Authentication routes
│   │   ├── page.tsx             # Auth index (redirects to login)
│   │   ├── login/page.tsx       # Login form
│   │   ├── register/page.tsx    # Registration form
│   │   ├── complete/page.tsx    # Profile completion form
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   ├── AuthForm.tsx         # Reusable auth form component
│   │   ├── CompleteProfileForm.tsx
│   │   ├── actions.ts           # Server actions (login, register, etc.)
│   │   ├── types.ts             # Auth type definitions
│   │   └── error-handling.ts    # Auth error utilities
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── layout.tsx           # Dashboard shell layout
│   │   ├── page.tsx             # Dashboard homepage
│   │   ├── loading.tsx          # Skeleton/loading UI
│   │   ├── actions.ts           # Dashboard actions (upload, etc.)
│   │   ├── browse/              # Resource browsing
│   │   │   └── page.tsx         # Browse explorer page
│   │   ├── curriculum/          # Course catalog
│   │   │   └── page.tsx
│   │   ├── my-uploads/          # User's uploaded resources
│   │   │   └── page.tsx
│   │   ├── profile/             # User profile management
│   │   │   └── page.tsx
│   │   ├── upload/              # Resource upload
│   │   │   └── page.tsx
│   │   └── resources/           # Resource detail
│   │       └── [id]/page.tsx    # Dynamic resource page
│   ├── api/                     # API routes
│   │   └── send-email/route.ts  # Email service endpoint
│   ├── home/                    # Home/home redirect
│   │   └── page.tsx
│   └── not-found.tsx            # 404 page
├── components/                  # Reusable React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── dashboard-shell.tsx  # Main dashboard layout wrapper
│   │   ├── dashboard-navigation.tsx # Desktop & mobile navigation
│   │   ├── dashboard-cards.tsx  # Card components for stats
│   │   ├── browse-explorer.tsx  # Resource browsing interface
│   │   ├── upload-form.tsx      # Resource upload form
│   │   ├── upload-resource-dialog.tsx # Upload modal dialog
│   │   ├── profile-form.tsx     # Profile editing form
│   │   ├── onboarding-gate.tsx  # Profile completion gate
│   └── ui/                      # UI primitive components (shadcn)
│       ├── button.tsx           # Button component
│       ├── badge.tsx            # Badge component
│       └── [other shadcn components]
├── landing/                     # Landing page components
│   └── landing-page.tsx         # Hero, features, CTA sections
├── lib/                         # Utility libraries
│   ├── dashboard-data.ts        # Data fetching functions
│   ├── dashboard-types.ts       # TypeScript type definitions
│   └── utils.ts                 # Utility functions (cn, etc.)
├── utils/                       # Shared utilities
│   └── supabase/                # Supabase client setup
│       ├── client.ts            # Browser Supabase client
│       ├── server.ts            # Server Supabase client
│       └── proxy.ts             # Proxy utilities
├── public/                      # Static assets
│   ├── images/                  # Image files
│   └── shapes/                  # SVG shapes
├── docs/                        # Documentation
│   ├── nextjs-docs.md
│   ├── react-docs.md
│   ├── shadcn-docs.md
│   └── [other docs]
├── graphify-out/                # Knowledge graph output (auto-generated)
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint rules
├── postcss.config.mjs           # PostCSS/Tailwind config
├── components.json              # shadcn/ui configuration
├── globals.css                  # Global CSS + Tailwind directives
├── README.md                    # Project overview
├── DESIGN_pinggly.md            # Design system specification
├── db.sql                       # Database schema
└── PROJECT_CONTEXT.md           # This file

```

### Folder Responsibilities

- **`app/`** - Next.js App Router pages; each folder = route; `page.tsx` = rendered component
- **`components/`** - Reusable React components; `dashboard/` for dashboard UI, `ui/` for base components
- **`lib/`** - Pure utility functions and type definitions; no side effects
- **`utils/`** - Runtime utilities (Supabase clients, proxies)
- **`public/`** - Static assets served at root
- **`docs/`** - Reference documentation
- **`graphify-out/`** - Auto-generated knowledge graph (ignore for now)

---

## System Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│  (React 19 Components, Server Components, Client Components)    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS 16 SERVER                              │
│  (App Router, Server Components, Server Actions, API Routes)    │
│                                                                  │
│  ├─ Server Components (async)                                   │
│  ├─ Server Actions (form submissions)                          │
│  ├─ API Routes (/api/*)                                        │
│  └─ Middleware (authentication checks)                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                            │
│                                                                  │
│  ├─ PostgreSQL Database                                         │
│  │  ├─ users table                                             │
│  │  ├─ modules table                                           │
│  │  ├─ resources table                                         │
│  │  └─ user_preferences table                                  │
│  │                                                             │
│  ├─ Auth Service (email/password, sessions)                   │
│  ├─ Row-Level Security (RLS) policies                         │
│  └─ Triggers (auto user profile creation)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│                                                                  │
│  ├─ Google Drive (resource storage)                            │
│  ├─ Resend (email delivery)                                    │
│  └─ Vercel (deployment, CDN)                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Communication

#### Layer 1: UI Layer (React Components)

- **Purpose:** Display data and capture user input
- **Types:** Server Components (default), Client Components (with "use client")
- **State Management:** Local state with `useState`, Server state via Server Components
- **Communication:** Server Actions, fetch API

#### Layer 2: Server Layer (Next.js)

- **Server Components:**
  - Fetch data directly from database
  - No JavaScript sent to browser
  - Fetch before rendering
  - Used for: Layout, pages, data-heavy components

- **Server Actions:**
  - Handle form submissions
  - Validate input
  - Update database
  - Return state to client
  - Located in: `app/auth/actions.ts`, `app/home/actions.ts`

- **API Routes:**
  - For non-form requests
  - Located in: `app/api/*`
  - Example: `app/api/send-email/route.ts`

- **Middleware:**
  - Intercept requests
  - Session validation
  - Route protection

#### Layer 3: Database Layer (Supabase/PostgreSQL)

- **Auth:**
  - `auth.users` table (managed by Supabase)
  - Session tokens stored in cookies
  - Trigger creates `public.users` profile on signup

- **Data Tables:**
  - `users` - User profiles
  - `modules` - Course catalog
  - `resources` - Shared resources
  - `user_preferences` - User settings

- **Security:**
  - Row-Level Security (RLS) policies
  - Column-level access control
  - Auth token validation

### Authentication Flow

```
User Registration:
┌──────────────────┐
│ Registration Form│ ──(email, password)──┐
└──────────────────┘                      │
                               ┌──────────▼──────────┐
                               │ Supabase Auth       │
                               │ Create account      │
                               │ Trigger: create     │
                               │ user profile        │
                               └──────────┬──────────┘
                                          │
                               ┌──────────▼──────────┐
                               │ Redirect to         │
                               │ /auth/complete      │
                               │ (complete profile)  │
                               └──────────┬──────────┘
                                          │
                               ┌──────────▼──────────┐
                               │ /home          │
                               │ (main app)          │
                               └─────────────────────┘

User Login:
┌──────────────┐
│ Login Form   │ ──(email, password)──┐
└──────────────┘                      │
                        ┌─────────────▼─────────────┐
                        │ Supabase Auth             │
                        │ Validate credentials      │
                        │ Set session cookie        │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │ Check user_preferences    │
                        │ If incomplete:            │
                        │ → /auth/complete          │
                        │ If complete:              │
                        │ → /home or /home     │
                        └───────────────────────────┘
```

### Component Hierarchy

```
RootLayout
├── Landing Page
│   ├── Navbar
│   ├── Hero Section
│   ├── Features Section
│   └── FAQ Section
│
├── Auth Pages
│   ├── /auth/login → AuthForm
│   ├── /auth/register → AuthForm
│   └── /auth/complete → CompleteProfileForm
│
└── Dashboard (Protected)
    ├── DashboardShell
    │   ├── DashboardNavigation (Desktop)
    │   ├── DashboardNavigation (Mobile)
    │   ├── Main Content Area
    │   │   ├── /home → DashboardCards, ResourceCard
    │   │   ├── /browse → BrowseExplorer
    │   │   ├── /upload → UploadForm
    │   │   ├── /my-uploads → ResourceList
    │   │   ├── /profile → ProfileForm
    │   │   ├── /curriculum → ModuleList
    │   │   └── /resources/[id] → ResourceDetail
    │   └── UploadResourceDialog
```

---

## Database Documentation

### Schema Overview

```
Database: Pingy (PostgreSQL via Supabase)
Tables: 5 main tables
Enums: 5 type enums
Views: None yet
Triggers: 1 (auto-create user profile)
Functions: 1 (handle_new_user)
```

### Complete Table Documentation

#### 1. **users** Table

**Purpose:** Store user profile information

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Column | Type | Null | Key | Default | Description |
|--------|------|------|-----|---------|-------------|
| `id` | UUID | NO | PK, FK | - | Foreign key to Supabase auth.users(id) |
| `full_name` | TEXT | NO | - | - | User's full name |
| `avatar_url` | TEXT | YES | - | NULL | Profile picture URL (optional) |
| `role` | user_role | NO | - | 'student' | User role (student, admin) |
| `created_at` | TIMESTAMPTZ | NO | - | now() | Account creation timestamp |

**Relationships:**
- Foreign Key: `auth.users(id)` - Supabase authentication user
- Cascade Delete: Deletes auth user also deletes profile

**Indexes:**
- PK on `id`
- Implicit FK index on `id`

**Notes:**
- Created automatically by trigger `on_auth_user_created`
- Full name defaults to email prefix if not provided

---

#### 2. **modules** Table

**Purpose:** Store course/module catalog

```sql
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    level academic_level NOT NULL,
    semester semester_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_module UNIQUE(level, semester, name)
);
```

| Column | Type | Null | Key | Default | Description |
|--------|------|------|-----|---------|-------------|
| `id` | UUID | NO | PK | gen_random_uuid() | Unique module ID |
| `name` | VARCHAR(100) | NO | - | - | Module/course name |
| `description` | TEXT | YES | - | NULL | Course description |
| `level` | academic_level | NO | - | - | Academic level (L1-L3, M1-M2) |
| `semester` | semester_type | NO | - | - | Semester (S1, S2) |
| `created_at` | TIMESTAMPTZ | NO | - | now() | Creation timestamp |

**Constraints:**
- UNIQUE constraint on `(level, semester, name)` - prevents duplicate modules

**Indexes:**
- PK on `id`
- `idx_modules_level` on `level`
- `idx_modules_semester` on `semester`

**Notes:**
- Admin-managed (only admins can insert/update)
- No RLS policies for simplicity (admin-only access)

---

#### 3. **resources** Table

**Purpose:** Store uploaded academic resources

```sql
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    resource_type resource_type NOT NULL,
    drive_url TEXT NOT NULL,
    drive_file_id TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status resource_status NOT NULL DEFAULT 'pending',
    views INTEGER NOT NULL DEFAULT 0,
    downloads INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_resource UNIQUE(module_id, resource_type, title)
);
```

| Column | Type | Null | Key | Default | Description |
|--------|------|------|-----|---------|-------------|
| `id` | UUID | NO | PK | gen_random_uuid() | Unique resource ID |
| `title` | VARCHAR(255) | NO | - | - | Resource title |
| `description` | TEXT | YES | - | NULL | Detailed description |
| `module_id` | UUID | NO | FK | - | Reference to modules table |
| `resource_type` | resource_type | NO | - | - | Type (course, td, tp, exam, etc.) |
| `drive_url` | TEXT | NO | - | - | Google Drive public link |
| `drive_file_id` | TEXT | NO | - | - | Extracted Drive file ID |
| `uploaded_by` | UUID | YES | FK | NULL | Author user ID (nullable) |
| `status` | resource_status | NO | - | 'pending' | Approval status |
| `views` | INTEGER | NO | - | 0 | View counter |
| `downloads` | INTEGER | NO | - | 0 | Download counter |
| `created_at` | TIMESTAMPTZ | NO | - | now() | Upload timestamp |

**Constraints:**
- FK on `module_id` CASCADE DELETE
- FK on `uploaded_by` SET NULL on author delete
- UNIQUE on `(module_id, resource_type, title)`

**Indexes:**
- PK on `id`
- `idx_resources_module` on `module_id`
- `idx_resources_type` on `resource_type`
- `idx_resources_status` on `status`
- `idx_resources_uploaded_by` on `uploaded_by`
- `idx_resources_created_at` on `created_at`

**Notes:**
- Default status is 'pending' (awaiting admin approval)
- Drive links are external (no file storage on platform)
- Counters for analytics

---

#### 4. **user_preferences** Table

**Purpose:** Store user-specific settings

```sql
-- NOT YET IMPLEMENTED IN SQL FILE
-- Expected structure:
CREATE TABLE public.user_preferences (
    user_id UUID NOT NULL PRIMARY KEY
        REFERENCES public.users(id) ON DELETE CASCADE,
    university VARCHAR(255),
    academic_level academic_level,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Column | Type | Null | Key | Default | Description |
|--------|------|------|-----|---------|-------------|
| `user_id` | UUID | NO | PK, FK | - | Reference to users table |
| `university` | VARCHAR(255) | YES | - | NULL | University name |
| `academic_level` | academic_level | YES | - | NULL | Selected academic level |
| `created_at` | TIMESTAMPTZ | NO | - | now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | - | now() | Last update timestamp |

**Notes:**
- **MISSING FROM db.sql** - Only referenced in code but not created
- **ACTION ITEM:** Add this table to db.sql
- Used for profile completion flow
- Null academic_level indicates incomplete profile

---

### Enums Definition

#### 1. **user_role**
```sql
CREATE TYPE user_role AS ENUM (
    'student',
    'admin'
);
```
- `student` - Regular user, can upload and browse
- `admin` - Can moderate resources and manage platform

#### 2. **academic_level**
```sql
CREATE TYPE academic_level AS ENUM (
    'L1',  -- 1st year Bachelor's
    'L2',  -- 2nd year Bachelor's
    'L3',  -- 3rd year Bachelor's
    'M1',  -- 1st year Master's
    'M2'   -- 2nd year Master's
);
```

#### 3. **semester_type**
```sql
CREATE TYPE semester_type AS ENUM (
    'S1',  -- First semester
    'S2'   -- Second semester
);
```

#### 4. **resource_type**
```sql
CREATE TYPE resource_type AS ENUM (
    'course',      -- Lectures
    'td',          -- Tutorial exercises
    'tp',          -- Practical work
    'exam',        -- Exam papers
    'summary',     -- Study summaries
    'solution',    -- Problem solutions
    'project',     -- Projects
    'other'        -- Miscellaneous
);
```

#### 5. **resource_status**
```sql
CREATE TYPE resource_status AS ENUM (
    'pending',     -- Awaiting admin review
    'approved',    -- Published to users
    'rejected',    -- Rejected by admin
    'archived'     -- Hidden from browse
);
```

### Database Triggers & Functions

#### Trigger: `on_auth_user_created`

**Purpose:** Auto-create user profile when new auth account is created

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        full_name
    )
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            split_part(NEW.email, '@', 1)
        )
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

**Logic:**
1. When new user signs up, Supabase creates auth entry
2. Trigger fires automatically
3. Creates corresponding `public.users` profile record
4. Sets full_name from auth metadata or email username

### Entity Relationship Diagram

```
                    ┌─────────────────────────┐
                    │     auth.users          │
                    │  (Supabase managed)     │
                    │                         │
                    │ - id (PK)              │
                    │ - email                │
                    │ - created_at           │
                    └────────────┬────────────┘
                                 │
                      (trigger creates)
                                 │
                    ┌────────────▼────────────┐
                    │   public.users          │
                    │                         │
                    │ - id (FK to auth.users)│
                    │ - full_name            │
                    │ - avatar_url           │
                    │ - role                 │
                    │ - created_at           │
                    └────────┬──────┬────────┘
                             │      │
                    (uploads) │      │ (prefers)
                             │      │
        ┌────────────────────┘      └──────────────────────┐
        │                                                   │
        ▼                                                   ▼
    ┌──────────────┐                        ┌──────────────────────┐
    │  resources   │                        │ user_preferences     │
    │              │                        │                      │
    │ - id (PK)   │                        │ - user_id (FK, PK)  │
    │ - title     │◄─ (module_id) ────────►│ - university        │
    │ - module_id │                        │ - academic_level    │
    │ - type      │                        │ - created_at        │
    │ - status    │                        │ - updated_at        │
    │ - uploaded_by(FK)                    └──────────────────────┘
    │ - drive_url │
    │ - created_at│
    └──────────────┘
        ▲
        │ (references)
        │
    ┌──────────────┐
    │  modules     │
    │              │
    │ - id (PK)   │
    │ - name      │
    │ - level     │
    │ - semester  │
    │ - created_at│
    └──────────────┘
```

### SQL Migration Checklist

- ✅ `users` table created
- ✅ `modules` table created
- ✅ `resources` table created
- ✅ All enums created
- ✅ Indexes created
- ✅ Trigger for auto user creation
- ❌ **MISSING:** `user_preferences` table (code expects it but not in db.sql)

---

## Authentication & Authorization

### Authentication Model

**Type:** Email/Password with Session-based Auth  
**Provider:** Supabase Auth  
**Session Storage:** HTTP-only cookies  
**Duration:** Default Supabase session lifetime  

### Login Flow

```
1. User lands on /auth/login
   ↓
2. Enters email and password
   ↓
3. Validates input (email format, password length ≥ 8)
   ↓
4. Server action: login() in app/auth/actions.ts
   ↓
5. Supabase.auth.signInWithPassword(email, password)
   ↓
6. Check if login successful
   ├─ ERROR: Return error message, show in form
   └─ SUCCESS:
      ├─ Get user from auth
      ├─ Query user_preferences
      ├─ If preferences.university && preferences.academic_level:
      │  └─ Redirect to /home
      └─ Else (incomplete profile):
         └─ Redirect to /auth/complete
```

### Registration Flow

```
1. User lands on /auth/register
   ↓
2. Enters full_name, email, password, confirmPassword
   ↓
3. Validates:
   - Full name not empty
   - Email format valid
   - Password: ≥8 chars, contains letters AND numbers
   - Password matches confirmPassword
   ↓
4. Server action: register() 
   ├─ Supabase.auth.signUpWithPassword()
   │  └─ Auto-sends verification OTP to email
   └─ Returns status "otp_sent"
   ↓
5. Client shows OTP verification form
   ↓
6. User enters OTP from email
   ↓
7. Server action: verifyRegistrationOtp()
   ├─ Supabase.auth.verifyOtp(email, code, type:'signup')
   └─ On success: Redirect to /auth/complete
   ↓
8. User completes profile (university, academic_level)
   ↓
9. Server action: completeProfile()
   ├─ Insert into user_preferences
   └─ Redirect to /home
```

### Profile Completion Flow

```
1. After login/registration, if profile incomplete:
   Redirect to /auth/complete
   ↓
2. User selects:
   - University (text input)
   - Academic Level (L1-L3, M1-M2 dropdown)
   ↓
3. Server action: completeProfile()
   ├─ Validate inputs
   ├─ Get current user from Supabase
   ├─ Upsert user_preferences record
   └─ Redirect to /home
   ↓
4. User now has complete profile
```

### Session Management

**Session Storage:**
- HttpOnly cookies (set by Supabase)
- Not accessible via JavaScript
- Automatically sent with requests
- Refreshed by middleware

**Session Validation:**
- Server-side only
- `createClient(cookies)` reads session from cookies
- `supabase.auth.getUser()` validates and returns user
- If invalid/expired, returns null

**Logout Flow:**
```
1. User clicks logout button
   ↓
2. Server action: logout()
   ├─ Supabase.auth.signOut()
   └─ Clear session cookies
   ↓
3. Redirect to /auth/login
```

### Protected Routes

**Route Protection Mechanism:**

All dashboard routes (`/home/*`) use Server Components that call `getDashboardContext()`:

```typescript
export async function getDashboardContext() {
  const supabase = createClient(await cookies());
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    redirect("/auth/login");  // ← Force redirect if not authenticated
  }
  // ... continue processing
}
```

**Protected Routes:**
- `/home/*` - Requires authentication + complete profile
- `/home/upload` - Requires authentication + complete profile
- `/home/browse` - Requires authentication + complete profile
- `/home/my-uploads` - Requires authentication
- `/home/profile` - Requires authentication

**Public Routes:**
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/callback` - OAuth callback

### Role-Based Access Control

**Current Implementation:**
- `student` role - Default for all users, can upload/browse
- `admin` role - Can moderate resources (future implementation)

**Future Enhancement:**
- Add admin dashboard
- Implement resource moderation UI
- Add admin-only routes

**Authorization Model:**
- Check `users.role` column
- In future: Add RLS policies per role
- Currently minimal (mostly for data structure)

### Security Considerations

✅ **Implemented:**
- Email/password hashing (Supabase handled)
- HttpOnly session cookies
- CSRF protection (Next.js automatic)
- Input validation before server actions
- Password strength requirements (≥8 chars, letters + numbers)

⚠️ **Future Enhancements:**
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Two-factor authentication (2FA)
- Email verification for sensitive changes
- Admin audit logging
- IP-based access control

---

## Features

### 1. ✅ User Authentication

**Status:** Complete  

**Components:**
- Login page: `/auth/login`
- Registration page: `/auth/register`
- Profile completion: `/auth/complete`
- Callback: `/auth/callback`

**User Flow:**
1. Register → Email OTP verification
2. Complete profile (university, academic level)
3. Access dashboard

**Main Files:**
- `app/auth/actions.ts` - Auth logic (login, register, etc.)
- `app/auth/AuthForm.tsx` - Reusable auth form
- `app/auth/CompleteProfileForm.tsx` - Profile completion form

**Database Interactions:**
- Create entry in `auth.users` (Supabase)
- Trigger creates entry in `public.users`
- Upsert entry in `user_preferences`

---

### 2. ✅ Dashboard Home

**Status:** Complete  

**Purpose:** Show user overview and recent resources

**Components:**
- Dashboard shell with sidebar
- Stats cards (academic level, module count, etc.)
- Recent resources carousel
- Quick action buttons

**User Flow:**
1. User logs in → Redirected to dashboard
2. Sees personalized greeting with academic level
3. Views recent approved resources
4. Can navigate to browse, upload, or profile

**Main Files:**
- `app/home/page.tsx` - Dashboard home page
- `app/home/layout.tsx` - Dashboard layout wrapper
- `components/home/home-shell.tsx` - Main layout
- `components/home/home-cards.tsx` - Stats/cards
- `components/home/home-navigation.tsx` - Sidebar/mobile nav

**Database Interactions:**
- Query `user_preferences` (user's level)
- Query `modules` (count)
- Query `resources` where `status='approved'` (recent)

---

### 3. ✅ Resource Browsing

**Status:** Complete  

**Purpose:** Discover and filter academic resources

**Components:**
- Browse explorer with filters
- Search by course/type/level
- Resource cards with metadata
- Pagination/infinite scroll

**User Flow:**
1. User navigates to `/home/browse`
2. Sees all approved resources
3. Can filter by level, semester, module
4. Clicks resource to view details
5. External link goes to Google Drive

**Main Files:**
- `app/home/browse/page.tsx` - Browse page
- `components/home/browse-explorer.tsx` - Browse UI

**Database Interactions:**
- Query `resources` where `status='approved'`
- Join with `modules` for course metadata
- Join with `users` for author name

---

### 4. ✅ Resource Upload

**Status:** Complete  

**Purpose:** Share educational materials via Google Drive links

**Components:**
- Upload form with validation
- Module selector dropdown
- Resource type selector
- URL validator for Google Drive

**User Flow:**
1. User clicks "Upload" button
2. Opens modal dialog
3. Selects module, resource type
4. Pastes Google Drive link
5. Adds title and description
6. Submits for review (status='pending')

**Main Files:**
- `app/home/upload/page.tsx` - Upload page
- `app/home/actions.ts` - submitResource() action
- `components/home/upload-form.tsx` - Upload form
- `components/home/upload-resource-dialog.tsx` - Modal

**Database Interactions:**
- Insert into `resources` table
- Status: 'pending' (awaiting admin review)
- Extract Drive file ID from URL
- Check unique constraint (module_id, resource_type, title)

**Validation:**
- Title not empty
- Description not empty
- Valid Google Drive URL
- File ID extracted successfully
- Unique (module, type, title) combination

---

### 5. ✅ My Uploads

**Status:** Complete  

**Purpose:** Track user's uploaded resources

**Components:**
- List of user's resources
- Show status (pending, approved, rejected)
- Filter by status
- Delete/edit options (future)

**User Flow:**
1. User navigates to `/home/my-uploads`
2. Sees all their uploaded resources
3. Views approval status
4. Can track pending resources

**Main Files:**
- `app/home/my-uploads/page.tsx` - My uploads page

**Database Interactions:**
- Query `resources` where `uploaded_by=current_user_id`
- Show status for each

---

### 6. ✅ User Profile Management

**Status:** Complete  

**Purpose:** Manage user settings and preferences

**Components:**
- Profile form with university and academic level
- Edit profile info
- Avatar upload (future)

**User Flow:**
1. User navigates to `/home/profile`
2. Sees current university and academic level
3. Can update preferences
4. Changes saved immediately

**Main Files:**
- `app/home/profile/page.tsx` - Profile page
- `components/home/profile-form.tsx` - Profile form

**Database Interactions:**
- Update `user_preferences` table
- Update `users.full_name` and `users.avatar_url`

---

### 7. ✅ Curriculum / Course Catalog

**Status:** Complete  

**Purpose:** View all available courses organized by level

**Components:**
- Course list by academic level
- Course metadata (semester, description)
- Filter by level

**User Flow:**
1. User navigates to `/home/curriculum`
2. Sees all available modules
3. Organized by academic level
4. Can browse courses

**Main Files:**
- `app/home/curriculum/page.tsx` - Curriculum page

**Database Interactions:**
- Query all `modules`
- Organize by level and semester

---

### 8. ✅ Landing Page

**Status:** Complete  

**Purpose:** Marketing and information for public visitors

**Components:**
- Navbar with navigation
- Hero section
- Features showcase
- FAQ section
- Call-to-action buttons

**Sections:**
- "مرحبا بك في Pingy" - Welcome
- Features (search, share, organize, etc.)
- How it works
- Content preview
- Expansion plans
- FAQ

**Main Files:**
- `app/page.tsx` - Landing page
- `components/landing/landing-page.tsx` - Landing content

---

### 9. ❌ Resource Details/View

**Status:** Partially Implemented  

**Purpose:** Show full resource info with external link

**Components:**
- Resource metadata
- External Google Drive button
- Related resources
- Comments (future)

**Main Files:**
- `app/home/resources/[id]/page.tsx` - Resource detail page

**TODO:**
- Implement full resource detail view
- Add view tracking
- Display related resources

---

### 10. ❌ Admin Moderation

**Status:** Not Implemented  

**Purpose:** Review and approve/reject pending resources

**TODO:**
- Create admin dashboard
- Pending resources queue
- Approve/reject UI
- Reason for rejection
- User notifications

---

## Routing

### Route Map

| Route | Type | Auth Required | Purpose | Component |
|-------|------|---------------|---------|-----------|
| `/` | Page | No | Landing page | `app/page.tsx` |
| `/auth/login` | Page | No | Login form | `app/auth/login/page.tsx` |
| `/auth/register` | Page | No | Registration | `app/auth/register/page.tsx` |
| `/auth/complete` | Page | Yes | Profile completion | `app/auth/complete/page.tsx` |
| `/auth/callback` | API | No | OAuth callback | `app/auth/callback/route.ts` |
| `/auth` | Redirect | - | Redirects to `/auth/login` | `app/auth/page.tsx` |
| `/home` | Redirect | Yes | Redirects to `/home` | `app/home/page.tsx` |
| `/home` | Page | Yes | Dashboard home | `app/home/page.tsx` |
| `/home/browse` | Page | Yes | Browse resources | `app/home/browse/page.tsx` |
| `/home/upload` | Page | Yes | Upload resource | `app/home/upload/page.tsx` |
| `/home/my-uploads` | Page | Yes | User's uploads | `app/home/my-uploads/page.tsx` |
| `/home/profile` | Page | Yes | Edit profile | `app/home/profile/page.tsx` |
| `/home/curriculum` | Page | Yes | Course catalog | `app/home/curriculum/page.tsx` |
| `/home/resources/[id]` | Page | Yes | Resource detail | `app/home/resources/[id]/page.tsx` |
| `/api/send-email` | API | Yes | Email service | `app/api/send-email/route.ts` |
| `*` (404) | Page | - | Not found | `app/not-found.tsx` |

### Route Access Control

**Public Routes** (No Auth Required):
- `/`
- `/auth/login`
- `/auth/register`
- `/auth/callback`

**Protected Routes** (Auth Required):
- `/home/*` (all dashboard routes)
- Checks: `getDashboardContext()` calls `supabase.auth.getUser()`
- Redirects to `/auth/login` if not authenticated

**Profile-Incomplete Routes** (Auth Required + Profile Complete Required):
- `/home/browse`
- `/home/upload`
- `/home/my-uploads`
- `/home/resources/[id]`
- Check: `getDashboardContext()` validates `user_preferences.university && academic_level`
- Shows: `<OnboardingGate />` if incomplete

---

## Components Catalog

### Dashboard Components

#### 1. **DashboardShell**
- **Purpose:** Main layout wrapper for all dashboard pages
- **Location:** `components/home/home-shell.tsx`
- **Props:**
  - `children` - Page content
  - `user` - Current user object
  - `preferences` - User preferences
  - `modules` - Available modules
  - `canUpload` - Whether user can upload
- **Features:**
  - Fixed sidebar (desktop)
  - Mobile drawer navigation
  - User avatar in nav
  - Logout button

#### 2. **DashboardNavigation**
- **Purpose:** Sidebar and mobile menu navigation
- **Location:** `components/home/home-navigation.tsx`
- **Variants:**
  - `DesktopDashboardNavigation` - Sidebar
  - `MobileDashboardNavigation` - Mobile drawer
- **Links:**
  - Home
  - Browse
  - Upload
  - My Uploads
  - Profile
  - Curriculum

#### 3. **DashboardCards**
- **Purpose:** Stat cards and resource cards
- **Location:** `components/home/home-cards.tsx`
- **Exports:**
  - `StatCard` - Display metric with icon
  - `ResourceCard` - Resource preview
  - `EmptyState` - No data state
  - `DashboardCard` - Generic card wrapper

#### 4. **BrowseExplorer**
- **Purpose:** Resource filtering and browsing UI
- **Location:** `components/home/browse-explorer.tsx`
- **Features:**
  - Filter by level, semester, type
  - Search by title
  - Resource grid display
  - Sorting options

#### 5. **UploadForm**
- **Purpose:** Form for uploading resources
- **Location:** `components/home/upload-form.tsx`
- **Props:**
  - `user` - Current user
  - `modules` - Available modules
  - `compact` - Compact layout flag
- **Fields:**
  - Title (text input)
  - Description (textarea)
  - Module (select)
  - Resource Type (select)
  - Google Drive URL (text input with validation)

#### 6. **UploadResourceDialog**
- **Purpose:** Modal dialog wrapping upload form
- **Location:** `components/home/upload-resource-dialog.tsx`
- **Features:**
  - Dialog trigger button
  - Overlay
  - Close button
  - Scrollable content

#### 7. **ProfileForm**
- **Purpose:** Edit user profile and preferences
- **Location:** `components/home/profile-form.tsx`
- **Fields:**
  - Full Name
  - University
  - Academic Level (dropdown)
  - Avatar (future)

#### 8. **OnboardingGate**
- **Purpose:** Show message when profile incomplete
- **Location:** `components/home/onboarding-gate.tsx`
- **Behavior:**
  - Redirects or shows message
  - Links to profile completion

### Landing Page Components

#### 1. **LandingPage**
- **Purpose:** Public landing page content
- **Location:** `components/landing/landing-page.tsx`
- **Sections:**
  - Navbar
  - Hero
  - Features
  - How it works
  - FAQ
  - CTA buttons

### UI Components (shadcn)

#### 1. **Button**
- **Location:** `components/ui/button.tsx`
- **Variants:** default, secondary, destructive, outline, ghost, link
- **Props:** size, disabled, loading, etc.

#### 2. **Badge**
- **Location:** `components/ui/badge.tsx`
- **Purpose:** Tag/label component

#### 3. **Dialog** (Radix UI)
- Used in: UploadResourceDialog
- Features: Modal, overlay, animation

### Component Hierarchy

```
App (RootLayout)
├── Public Pages
│   ├── Landing (app/page.tsx)
│   │   └── LandingPage
│   │       ├── Navbar
│   │       ├── Hero
│   │       ├── Features
│   │       ├── How it Works
│   │       ├── FAQ
│   │       └── CTA Buttons
│   │
│   └── Auth Pages
│       ├── Login (app/auth/login/page.tsx)
│       │   └── AuthForm (mode='login')
│       ├── Register (app/auth/register/page.tsx)
│       │   └── AuthForm (mode='register')
│       │       └── OTP verification
│       └── Complete (app/auth/complete/page.tsx)
│           └── CompleteProfileForm
│
└── Dashboard (Protected)
    ├── DashboardLayout (app/home/layout.tsx)
    │   └── DashboardShell
    │       ├── DesktopDashboardNavigation (sidebar)
    │       ├── MobileDashboardNavigation (drawer)
    │       └── [Page Children]
    │
    ├── Home (app/home/page.tsx)
    │   ├── DashboardCards (stats)
    │   └── ResourceCard (recent)
    │
    ├── Browse (app/home/browse/page.tsx)
    │   └── BrowseExplorer
    │       ├── FilterPanel
    │       └── ResourceGrid
    │
    ├── Upload (app/home/upload/page.tsx)
    │   └── UploadResourceDialog
    │       └── UploadForm
    │
    ├── My Uploads (app/home/my-uploads/page.tsx)
    │   └── ResourceList
    │
    ├── Profile (app/home/profile/page.tsx)
    │   └── ProfileForm
    │
    ├── Curriculum (app/home/curriculum/page.tsx)
    │   └── ModuleList
    │
    └── Resource Detail (app/home/resources/[id]/page.tsx)
        └── ResourceDetail
```

---

## Data Flow

### User Registration Data Flow

```
┌──────────────────────────┐
│ Registration Form Input  │
│ - fullName               │
│ - email                  │
│ - password               │
│ - confirmPassword        │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Client-side Validation   │
│ - Email format           │
│ - Password strength      │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ Server Action: register()            │
│ app/auth/actions.ts                  │
│ - Validate all fields                │
│ - Hash password (Supabase)           │
└───────────┬──────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ Supabase Auth                        │
│ - Create auth.users entry            │
│ - Send OTP to email                  │
│ - Return status: 'otp_sent'          │
└───────────┬──────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ TRIGGER: on_auth_user_created        │
│ - Create public.users profile        │
│ - Set full_name from metadata        │
└──────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ User Verifies OTP                    │
│ - Enter 6-digit code                 │
│ - verifyRegistrationOtp()            │
│ - Supabase validates OTP             │
└───────────┬──────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ Redirect to Profile Completion       │
│ /auth/complete                       │
└──────────────────────────────────────┘
```

### Resource Upload Data Flow

```
┌────────────────────────────────────┐
│ User Fills Upload Form             │
│ - title                            │
│ - description                      │
│ - moduleId                         │
│ - resourceType                     │
│ - driveUrl (Google Drive link)     │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│ Client-side Validation             │
│ - All fields required              │
│ - Valid Google Drive URL format    │
└────────────────┬───────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│ Server Action: submitResource()         │
│ app/home/actions.ts                │
│                                         │
│ 1. Extract Drive file ID from URL      │
│    - Parse URL path                    │
│    - Extract /d/{fileId} or /folders/  │
│ 2. Validate extraction successful      │
│ 3. Get current user from auth          │
│ 4. Check permissions                   │
└────────────────┬──────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────────┐
│ Database: Insert into resources table    │
│ - title, description                    │
│ - module_id (FK)                        │
│ - resource_type                         │
│ - drive_url, drive_file_id              │
│ - uploaded_by (current user)            │
│ - status = 'pending'                    │
│ - views = 0, downloads = 0              │
│                                         │
│ Unique constraint check:               │
│ (module_id, resource_type, title)      │
└────────────────┬──────────────────────┘
                 │
    ┌────────────┴────────────┐
    │ Constraint OK           │ Constraint Violated
    ▼                         ▼
┌────────────────┐    ┌──────────────────┐
│ Success        │    │ Error: Duplicate │
│ Revalidate     │    │ return error msg │
│ Redirect/Toast │    └──────────────────┘
└────────────────┘
```

### Resource Browse Data Flow

```
┌──────────────────────────────────┐
│ User Navigates to /browse        │
└────────────────┬─────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│ Server Component: BrowsePage       │
│ app/home/browse/page.tsx      │
│                                    │
│ 1. getDashboardContext()           │
│    - Validate auth                 │
│    - Check profile complete        │
│ 2. getModules()                    │
│    - Query all modules             │
│    - Order by level, semester      │
│ 3. getApprovedResources()          │
│    - Query resources where         │
│      status = 'approved'           │
│    - Join modules                  │
│    - Join users (author)           │
│    - Order by created_at DESC      │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│ Client: BrowseExplorer Component  │
│ - Render modules list             │
│ - Render resources grid           │
│ - Setup filters (client-side)     │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│ User Interacts:                  │
│ - Select module filter           │
│ - Select type filter             │
│ - Search text                    │
│ - Filter client-side             │
└──────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│ User Clicks Resource Card        │
│ - Opens resource details         │
│ - Offers external Drive link     │
│ - User goes to Drive to access   │
└──────────────────────────────────┘
```

---

## State Management

### Local State (Client Components)

**Component State Usage:**

```tsx
// Example: AuthForm.tsx
const [mode, setMode] = useState<AuthMode>('login');
const [isSubmitting, setIsSubmitting] = useState(false);
const [fieldErrors, setFieldErrors] = useState({});

// Example: BrowseExplorer.tsx
const [selectedLevel, setSelectedLevel] = useState<AcademicLevel | null>(null);
const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
const [searchQuery, setSearchQuery] = useState('');
```

**Patterns:**
- Simple UI state (form visibility, selections)
- Filter state (temporary client-side filtering)
- Loading/submission state

### Server State (Server Components)

**Most data comes from Server Components:**

```tsx
// Example: DashboardPage
export default async function DashboardPage() {
  const { user, preferences, complete } = await getDashboardContext();
  const [modules, resources] = await Promise.all([
    getModules(),
    getApprovedResources()
  ]);
  // Use data directly in JSX, no client state needed
}
```

**Benefits:**
- No JavaScript overhead
- Direct database queries
- Secure (credentials not exposed to client)
- No hydration issues

### Server Actions (Form Submission)

**Pattern: useActionState Hook**

```tsx
const [state, formAction, isPending] = useActionState(
  submitResource,  // Server action
  initialState,    // Initial state
);

<form action={formAction}>
  {/* form fields */}
  {isPending && <Spinner />}
  {state.status === 'error' && <Error msg={state.message} />}
</form>
```

**Server Actions:**
- `app/auth/actions.ts` - login, register, verifyOtp, completeProfile
- `app/home/actions.ts` - submitResource

**Pattern:**
1. User submits form
2. Calls server action with FormData
3. Action validates, updates database
4. Returns new state
5. Client re-renders with new state
6. Optimistic UI updates (future enhancement)

### Data Fetching Strategy

**Approach: Server-first with async components**

```typescript
// lib/home-data.ts
export async function getModules() {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from('modules')
    .select(...)
    .returns<ModuleRow[]>();
  return (data ?? []).map(toModuleSummary);
}

// app/home/page.tsx
const modules = await getModules();  // Fetched on server
```

**Benefits:**
- Direct database access (no round-trip API)
- Secure (credentials not exposed)
- Natural async/await syntax
- Built-in caching with revalidatePath()

**Revalidation:**
```typescript
export async function submitResource(state, formData) {
  // ... insert into db ...
  revalidatePath('/home');           // Revalidate all dashboard
  revalidatePath('/home/my-uploads'); // And my-uploads
  // Server components re-fetch on next navigation
}
```

### Context Providers (Future)

**Currently:** None (not needed with Server Components)

**If needed in future:**
```tsx
// Example: Not implemented yet
<AuthProvider>
  <NotificationProvider>
    {children}
  </NotificationProvider>
</AuthProvider>
```

---

## Design System

### Color Palette

#### Primary Colors
- **Primary Yellow:** `#F8C413` - Main brand color, CTAs, highlights
- **Primary Black:** `#111111` - Text, dark elements, borders
- **Primary White:** `#FFFFFF` - Background, cards, surfaces

#### Neutral Palette
- **Neutral 100:** `#FEEFD0` - Light background, hover states
- **Neutral 200:** `#D8D7D7` - Subtle borders, dividers
- **Neutral 300:** `#6C6C6B` - Secondary text
- **Neutral 400:** `#444443` - Primary text

#### Semantic Colors
- **Success:** `#2E7D32` - Positive actions, confirmations
- **Warning:** `#F57C00` - Alerts, attention needed
- **Error:** `#E53935` - Destructive actions, errors
- **Info:** `#1565C0` - Information, secondary actions

#### Tailwind Mappings
```css
primary: #F8C413
primary-foreground: #111111
secondary: #444443
muted: #F5F5F5
border: #D8D7D7
destructive: #E53935
```

### Typography

**Font Family:** Manrope (Arabic/Latin support)
**Font Loading:** Google Fonts (Cairo for Arabic, Geist Mono for code)

#### Heading Styles

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| h1 | 48px | 800 | 1.2 | Page titles |
| h2 | 36px | 800 | 1.25 | Section titles |
| h3 | 28px | 800 | 1.3 | Subsection titles |
| h4 | 22px | 700 | 1.35 | Card titles |
| h5 | 18px | 700 | 1.4 | Form labels |

#### Body Text Styles

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| body-lg | 18px | 400 | 1.7 | Large body text |
| body-md | 16px | 400 | 1.7 | Default body text |
| body-sm | 14px | 400 | 1.6 | Small text |
| label | 14px | 700 | 1.2 | Form labels |

### Spacing System

**Based on TailwindCSS 4px unit:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Component Patterns

#### Button Variants
- `default` - Primary action (yellow)
- `secondary` - Secondary action (gray)
- `destructive` - Delete/danger
- `outline` - Border only
- `ghost` - Text only
- `link` - Link styling

#### Card Styling
```tsx
// Pattern
<div className="rounded-lg border border-border bg-background p-6 shadow-sm">
  {content}
</div>
```

### Responsive Breakpoints

```css
sm: 640px   - Tablets
md: 768px   - Large tablets
lg: 1024px  - Desktops
xl: 1280px  - Large desktops
```

### Dark Mode

**Current:** Light mode only
**Future:** Add dark mode variants

### RTL (Right-to-Left) Support

**Configured for Arabic:**
- `dir="rtl"` on html element
- TailwindCSS supports RTL
- Flex directions auto-adjust
- Text alignment auto-adjusts
- Margins/padding auto-adjust

**Example:**
```tsx
<html lang="ar" dir="rtl">
  {/* All child elements are RTL */}
</html>
```

### Accessibility

**Implemented:**
- Semantic HTML (`button`, `nav`, `main`, etc.)
- ARIA labels on interactive elements
- Color contrast ratios (WCAG AA)
- Keyboard navigation support
- Focus visible indicators

**Future Enhancements:**
- ARIA live regions for form feedback
- Skip navigation links
- Screen reader optimizations

### Animation/Transitions

**Library:** Motion (Framer Motion alternative)

```tsx
import { motion, type Variants } from 'motion/react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
  Content
</motion.div>
```

**Common Animations:**
- Fade in/out
- Slide up/down
- Scale
- Stagger children

---

## Coding Conventions

### File Naming

**Directories:** kebab-case
```
components/home/
lib/home-data.ts
utils/supabase/
```

**Components:** PascalCase
```
components/home/homeShell.tsx
components/ui/Button.tsx
```

**Utilities/Functions:** camelCase
```
lib/home-data.ts
utils/supabase/client.ts
```

**Server Actions:** camelCase (in .ts files)
```
export async function login()
export async function submitResource()
```

**Types:** PascalCase
```
type AuthFormState = {...}
type DashboardUser = {...}
type UserPreferences = {...}
```

### Component Structure

**Preferred Pattern:**

```tsx
"use client";  // If client component

import type { FC, ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
// ... more imports

type MyComponentProps = {
  readonly title: string;
  readonly children: ReactNode;
  readonly onSubmit?: (data: FormData) => void;
};

export function MyComponent({
  title,
  children,
  onSubmit,
}: MyComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="...">
      {children}
    </div>
  );
}
```

**Patterns:**
- Named exports (not default)
- Props as single interface
- `readonly` properties
- Functional components
- Hooks at top of function

### TypeScript Practices

**Type Definitions:**

```tsx
// Prefer explicit types
type ResourceSummary = {
  readonly id: string;
  readonly title: string;
  readonly status: ResourceStatus;
};

// Avoid `any`
const data: any = {...};  // ❌ BAD
const data: ResourceSummary = {...};  // ✅ GOOD

// Use discriminated unions
type AuthFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; data: User };
```

**Readonly Props:**

```tsx
// ✅ Immutable props
type Props = {
  readonly title: string;
  readonly items: readonly string[];
  readonly onClick: () => void;
};

// Use Record for maps
const labels: Record<ResourceType, string> = {
  course: "محاضرة",
  // ...
};
```

### Server/Client Component Rules

**Server Components (Default):**
```tsx
// No "use client" directive
// Can access databases directly
// Can use secrets

export default async function Page() {
  const data = await db.query(...);
  return <div>{data}</div>;
}
```

**Client Components:**
```tsx
"use client";  // Must start with this

// Cannot access database directly
// Cannot use secrets
// Can use hooks, event listeners, browser APIs

export function Form() {
  const [input, setInput] = useState("");
  return <input onChange={e => setInput(e.target.value)} />;
}
```

**Pattern for mixing:**
```tsx
// Server: Fetch data
async function DataContainer() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// Client: Interactive UI
"use client";
function ClientComponent({ data }: { data: Data }) {
  const [state, setState] = useState(data);
  return <div onClick={() => setState(...)}>...</div>;
}
```

### Error Handling

**Server Actions:**

```tsx
export async function login(
  previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    // Validate
    if (!email) {
      return {
        status: "error",
        message: "Email required",
        fieldErrors: { email: "Required" },
      };
    }

    // Execute
    const result = await db.query(...);

    // Success
    return {
      status: "success",
      message: "Login successful",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Login failed. Try again.",
    };
  }
}
```

**Client Components:**

```tsx
try {
  await formAction(formData);
} catch (error) {
  console.error("Form submission failed:", error);
  setError("An error occurred. Please try again.");
}
```

### Import Organization

**Order:**
1. External packages (React, Next.js, libraries)
2. Absolute imports (@/)
3. Relative imports (./)
4. Types (separate)

```tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/upload";
import type { FileData } from "@/lib/types";
```

### Naming Conventions

**Variables:**
- State: `useState` → `[value, setValue]`
- Handlers: `handleClick`, `handleSubmit`, `onSubmit`
- Booleans: `isOpen`, `isLoading`, `hasError`
- Getters: `getUser()`, `getModules()`, `fetchData()`
- Validators: `validateEmail()`, `isValidPhone()`

**Abbreviations to Avoid:**
- ❌ `mod` → ✅ `module`
- ❌ `rsrc` → ✅ `resource`
- ❌ `usr` → ✅ `user`

### Comments & Documentation

**When to comment:**
- Complex business logic
- Why something is done (not what)
- Algorithm explanations
- Workarounds or hacks

**Pattern:**
```tsx
// Extract Drive file ID from share link
// Format: /d/{fileId} or /folders/{folderId}
const match = url.match(/\/d\/([^/]+)/);

// ✅ GOOD: Explains why
// ❌ BAD: const match = url.match(/\/d\/([^/]+)/);
```

### Formatting

**Use ESLint + Prettier:**
- Configured in: `eslint.config.mjs`
- Auto-format on save (in VS Code)
- Run: `npm run lint`

### Git Commit Messages

**Pattern:**
```
[type]: [description]

feat: Add resource upload form
fix: Fix login validation error
refactor: Simplify browse filter logic
docs: Update database schema
test: Add form validation tests
```

---

## Dependency Analysis

### Production Dependencies

| Package | Version | Purpose | Why Used |
|---------|---------|---------|----------|
| `next` | 16.2.9 | Full-stack React framework | Modern App Router, Server Components, best DX |
| `react` | 19.2.4 | UI library | Latest version, better performance |
| `react-dom` | 19.2.4 | React rendering | DOM rendering, concurrent features |
| `@supabase/supabase-js` | 2.110.2 | Supabase client | Database, auth, realtime |
| `@supabase/ssr` | 0.12.0 | Supabase SSR utilities | Cookie handling in Next.js |
| `tailwindcss` | 4 | CSS framework | Utility-first, RTL support, small bundle |
| `shadcn/ui` | 4.12.0 | UI component system | Pre-built, customizable components |
| `radix-ui` | 1.6.1 | UI primitives | Unstyled, accessible base components |
| `lucide-react` | 1.23.0 | Icon library | 1000+ beautiful, consistent icons |
| `motion` | 12.42.2 | Animation library | Lightweight Framer Motion alternative |
| `clsx` | 2.1.1 | CSS class utility | Conditional class names |
| `tailwind-merge` | 3.6.0 | Tailwind utility merger | Merge conflicting Tailwind classes |
| `resend` | 6.17.2 | Email service | Email delivery (OTP, notifications) |
| `tw-animate-css` | 1.4.0 | Tailwind animations | Extra animation utilities |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.x | Type checking |
| `@types/node` | 20 | Node.js types |
| `@types/react` | 19 | React types |
| `@types/react-dom` | 19 | React DOM types |
| `@tailwindcss/postcss` | 4 | PostCSS integration |
| `eslint` | 9 | Linting |
| `eslint-config-next` | 16.2.9 | Next.js ESLint config |

### Unused Dependencies

**Potentially Unused:**
- `tw-animate-css` - Check if animations are used before keeping

### Bundle Size Analysis

**Estimated Sizes (gzipped):**
- Next.js core: ~200KB
- React: ~40KB
- Supabase: ~100KB
- Tailwind (purged): ~15KB
- Icons (tree-shaken): ~50KB
- Motion: ~20KB
- Others: ~30KB
- **Total:** ~455KB

**Optimizations Done:**
- Tree-shaking enabled
- CSS purging (Tailwind)
- Image optimization (Next.js)
- Code splitting (automatic)

**Future Improvements:**
- Lazy load dashboard components
- Split authentication bundle
- Dynamic imports for heavy components

---

## Environment Variables

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Resend (Email Service)
RESEND_API_KEY=re_your_api_key

# Optional: Deployment
VERCEL_URL=your-domain.com
```

### Environment Variable Usage

| Variable | Used In | Purpose | Required |
|----------|---------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Supabase API endpoint | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client & Server | Supabase public key | ✅ Yes |
| `RESEND_API_KEY` | Server only (API route) | Email service authentication | ✅ Yes |

### Environment Setup

**Development:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
RESEND_API_KEY=...
```

**Production (Vercel):**
- Set in Vercel dashboard
- Automatically injected at build time

### Sensitive Information

⚠️ **Never commit:**
- API keys
- Database passwords
- Email service credentials
- JWT secrets

✅ **Safe to commit:**
- `NEXT_PUBLIC_*` variables (prefixed with NEXT_PUBLIC_)
- Configuration files
- Schema definitions

---

## Performance Analysis

### Current Performance

**Lighthouse Scores (Estimated):**
- Performance: 85/100
- Accessibility: 90/100
- Best Practices: 95/100
- SEO: 90/100

### Rendering Strategy

**Server-first approach:**
- Most pages: Server Components (no JS)
- Forms: Minimal client JavaScript
- Interactivity: Progressive enhancement

**Benefits:**
- Fast initial page load
- SEO friendly
- Secure by default

### Bundle Size Optimization

**Current:**
- JavaScript: ~200KB (main bundle)
- CSS: ~50KB (purged)
- Fonts: ~100KB (cached)

**Techniques Used:**
- Tree-shaking (unused code removal)
- CSS purging (unused styles removal)
- Code splitting (route-based)
- Image optimization

### Database Performance

**Current:**
- Indexes on frequently queried columns
- Join optimization
- Query results cached in Next.js

**Optimizations:**
- Index on `status` for approved resources query
- Index on `module_id` for resource lookup
- Index on `created_at` for sorting

### Network Optimization

**Techniques:**
- Supabase connection pooling
- HTTP/2 (Vercel default)
- Gzip compression
- Browser caching headers

### Suggested Improvements

1. **Image Optimization:**
   ```tsx
   // Use Next.js Image component
   import Image from "next/image";
   <Image src={url} alt="..." width={400} height={300} />
   ```

2. **Lazy Loading:**
   ```tsx
   // Dynamic import for heavy components
   const HeavyComponent = dynamic(() => import("@/components/Heavy"));
   ```

3. **ISR (Incremental Static Regeneration):**
   ```tsx
   export const revalidate = 60;  // Revalidate every 60 seconds
   ```

4. **Database Query Optimization:**
   - Add `select()` to limit columns fetched
   - Avoid N+1 queries
   - Use `.maybeSingle()` for optional results

5. **Caching Strategy:**
   ```tsx
   // Server action caching
   const cached = await fetch(url, { next: { revalidate: 3600 } });
   ```

---

## Security Review

### Authentication Security

✅ **Implemented:**
- Email/password hashing (Supabase)
- HttpOnly session cookies
- Server-side session validation
- CSRF protection (Next.js automatic)

⚠️ **Issues/Improvements Needed:**

1. **No Rate Limiting:**
   - Brute force attacks possible
   - **Solution:** Add rate limiting middleware

   ```typescript
   // TODO: Implement rate limiter
   import { Ratelimit } from "@upstash/ratelimit";
   ```

2. **No Account Lockout:**
   - After 5 failed attempts, lock account temporarily
   - **Solution:** Track failed login attempts in database

3. **No 2FA:**
   - Only email/password
   - **Solution:** Add TOTP or authenticator app support

### Authorization Security

✅ **Implemented:**
- Protected routes redirect to login
- User can only access own resources
- Database-level filtering

⚠️ **Missing:**
- Row-Level Security (RLS) policies in Supabase
- Role-based access control (RBAC)
- Admin-only operations not restricted

### Input Validation

✅ **Implemented:**
- Email format validation
- Password strength (≥8 chars, letters + numbers)
- URL validation (Google Drive link format)
- Unique constraint checks

⚠️ **Improvements:**
```typescript
// Add server-side input sanitization
const sanitized = input.replace(/[<>]/g, '');  // Remove HTML chars

// Use dedicated validation library
import { z } from 'zod';
const schema = z.object({
  email: z.string().email(),
  title: z.string().min(3).max(255),
});
```

### SQL Injection Prevention

✅ **Safe:** Uses Supabase parameterized queries
```typescript
// Safe - parameterized query
supabase.from('resources').select().eq('id', id);

// NOT used - raw SQL concatenation
// await db.query(`SELECT * FROM resources WHERE id = ${id}`);  // ❌ UNSAFE
```

### XSS (Cross-Site Scripting) Protection

✅ **Safe:** React escapes all values by default
```tsx
const title = "<script>alert('xss')</script>";
<div>{title}</div>  // ✅ Rendered as text, not executed

// Unsafe (NOT used in project):
<div dangerouslySetInnerHTML={{ __html: title }} />  // ❌
```

### CSRF Protection

✅ **Implemented:** Next.js automatic CSRF protection on POST requests

### Secret Management

⚠️ **Issues:**
- `RESEND_API_KEY` in environment variables (✅ correct)
- Supabase database password not committed (✅ correct)
- No secret rotation documented

**Best Practices:**
```bash
# Correct
NEXT_PUBLIC_SUPABASE_URL=...  # Public (frontend)
RESEND_API_KEY=...             # Secret (backend only)

# Wrong
PUBLIC_SECRET_KEY=...          # ❌ Not actually secret if public
```

### Data Validation

⚠️ **Issues:**
1. **No schema validation:**
   ```typescript
   // Current (minimal validation)
   if (!email) { /* error */ }

   // Recommended (schema validation)
   const schema = z.object({ email: z.string().email() });
   schema.parse(formData);
   ```

2. **Incomplete validation:**
   - Module ID not validated to exist
   - Resource type not validated against enum

### Row-Level Security (RLS)

❌ **Not Implemented:** Supabase RLS policies missing

**Recommended RLS Policies:**

```sql
-- Users can only read approved resources
CREATE POLICY "Users can read approved resources"
ON resources
FOR SELECT
USING (status = 'approved' OR uploaded_by = auth.uid());

-- Users can only upload resources
CREATE POLICY "Users can create resources"
ON resources
FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Users can only edit own resources
CREATE POLICY "Users can update own resources"
ON resources
FOR UPDATE
USING (auth.uid() = uploaded_by);
```

### API Security

⚠️ **Issues:**
1. **No authentication on API routes:**
   ```typescript
   // app/api/send-email/route.ts - No auth check!
   export async function POST(req: Request) {
     // Anyone can call this
   }
   ```

   **Fix:**
   ```typescript
   import { createClient } from "@/utils/supabase/server";

   export async function POST(req: Request) {
     const supabase = createClient(await cookies());
     const { data: { user } } = await supabase.auth.getUser();
     
     if (!user) {
       return new Response('Unauthorized', { status: 401 });
     }
     // ... proceed
   }
   ```

2. **No rate limiting on API routes**

3. **Hardcoded email destination:**
   ```typescript
   // ❌ Bad: Hardcoded recipient
   to: 'studenthub.ghardaia@gmail.com',
   ```

### Security Recommendations (Priority Order)

**High Priority:**
1. Implement RLS policies in Supabase
2. Add authentication to API routes
3. Add input validation with Zod
4. Implement rate limiting

**Medium Priority:**
5. Add request logging for audit trail
6. Implement account lockout
7. Add CORS configuration
8. Add security headers (Content-Security-Policy, etc.)

**Low Priority:**
9. Add 2FA support
10. Implement secret rotation
11. Add DDoS protection

---

## Error Handling

### Current Error Handling

**Auth Errors:**

```typescript
// app/auth/actions.ts
if (error || !data.user) {
  return errorState("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
}
```

**Form Validation Errors:**

```typescript
const fieldErrors: Partial<Record<AuthField, string>> = {};

if (!email) {
  fieldErrors.email = "يرجى إدخال البريد الإلكتروني.";
}

return errorState("تحقق من البيانات...", fieldErrors);
```

**Database Errors:**

```typescript
const { error } = await supabase.from('resources').insert(...);

if (error) {
  let message = "تعذر إرسال الملف...";
  
  if (error.code === "23505") {
    message = "هذا الملف موجود مسبقا...";  // Duplicate key
  }
  
  return { status: "error", message };
}
```

### Error Components

**Error Boundary:**
```tsx
// app/error.tsx
"use client";

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>حدث خطأ غير متوقع</h1>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  );
}
```

**404 Page:**
```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>الصفحة غير موجودة</h1>
      <Link href="/">العودة للرئيسية</Link>
    </div>
  );
}
```

### Error Display Patterns

**Form Errors:**
```tsx
{state.fieldErrors?.email && (
  <p className="text-destructive text-sm font-semibold">
    {state.fieldErrors.email}
  </p>
)}
```

**Toast Notifications (Future):**
```typescript
// Not implemented yet, but recommended
import { toast } from "@/components/ui/toast";

toast.error("File upload failed");
toast.success("Resource saved successfully");
```

### Logging Strategy

**Current:** Only `console.error()` in error boundaries

**Recommended Improvements:**

```typescript
// lib/logger.ts
export const logger = {
  error: (msg: string, context?: Record<string, unknown>) => {
    console.error(msg, context);
    // Send to external service (Sentry, LogRocket, etc.)
    // captureException(error, { extra: context });
  },
  
  warn: (msg: string) => console.warn(msg),
  info: (msg: string) => console.info(msg),
};

// Usage in server actions
try {
  // ... code ...
} catch (error) {
  logger.error("Resource upload failed", {
    userId: user.id,
    moduleId,
    error: error instanceof Error ? error.message : 'Unknown',
  });
}
```

### Error Recovery

**Optimistic UI (Not yet implemented):**

```typescript
// Recommended pattern
const [resources, setResources] = useState([]);

async function deleteResource(id: string) {
  // Optimistic: Remove immediately
  setResources(prev => prev.filter(r => r.id !== id));
  
  try {
    await serverAction(id);
  } catch (error) {
    // Revert on error
    setResources(prev => [...prev, resource]);
    toast.error("Failed to delete");
  }
}
```

### Suggested Error Handling Improvements

1. **Add Sentry for error tracking:**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Implement user-friendly error pages:**
   - Network error
   - Server error (500)
   - Not found (404)
   - Unauthorized (401)

3. **Add error recovery UX:**
   - Retry buttons
   - Clear error messages
   - Suggested actions

4. **Structured logging:**
   ```typescript
   logger.error('Database query failed', {
     operation: 'getResources',
     moduleId: '123',
     status: 500,
   });
   ```

---

## Current Project Status

### ✅ Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | ✅ Complete | Hero, features, FAQ, CTA |
| User Registration | ✅ Complete | Email OTP verification |
| User Login | ✅ Complete | Email/password auth |
| Profile Completion | ✅ Complete | University, academic level |
| Dashboard Home | ✅ Complete | Stats, recent resources |
| Resource Upload | ✅ Complete | Google Drive link submission |
| Resource Browsing | ✅ Complete | Filter by module, type, level |
| My Uploads | ✅ Complete | Track uploaded resources |
| User Profile | ✅ Complete | Edit preferences |
| Curriculum | ✅ Complete | View all modules |
| Database Schema | ✅ Complete | Users, modules, resources |
| Authentication | ✅ Complete | Supabase auth integration |
| Responsive Design | ✅ Complete | Mobile + desktop |
| RTL Support | ✅ Complete | Arabic language |
| Design System | ✅ Complete | Colors, typography, spacing |

### 🚧 In Progress

| Feature | Status | Progress | Notes |
|---------|--------|----------|-------|
| Resource Details Page | 🚧 Partial | ~50% | Need to add full implementation |
| Admin Dashboard | 🚧 Planned | 0% | Not started |
| Email Notifications | 🚧 Planned | 0% | Basic setup done, needs triggers |
| Search/Global Search | 🚧 Planned | 0% | Not started |
| Favorites/Bookmarks | 🚧 Planned | 0% | Not started |
| Comments on Resources | 🚧 Planned | 0% | Not started |

### ❌ Planned Features

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Admin Moderation | ❌ Planned | High | Review pending resources |
| User Preferences | ❌ Planned | High | Save user settings |
| Resource Statistics | ❌ Planned | Medium | Views, downloads, ratings |
| Resource Ratings | ❌ Planned | Medium | Star ratings, reviews |
| Notifications | ❌ Planned | Medium | Email alerts on uploads |
| Advanced Search | ❌ Planned | Medium | Full-text search, filters |
| User Profiles | ❌ Planned | Low | Public profiles, user bio |
| Community Features | ❌ Planned | Low | Forums, discussions |
| Mobile App | ❌ Planned | Low | React Native version |
| Dark Mode | ❌ Planned | Low | Theme toggle |

---

## TODO Analysis

### Code TODOs

**Scan Result:** No TODO/FIXME/HACK comments found in source code

### Implementation Gaps

**Missing Implementations:**

1. **user_preferences table**
   - Location: Referenced in code but missing from `db.sql`
   - Impact: Profile completion will fail without migration
   - Fix: Add migration to create table

2. **Resource Details Page**
   - Location: `app/home/resources/[id]/page.tsx`
   - Status: Basic file created, needs full implementation
   - Needed: Fetch resource, related resources, external link

3. **Resource Statistics**
   - Views/downloads counters exist in DB but not updated
   - Needed: Tracking logic when resources are accessed

4. **Admin Moderation**
   - No admin dashboard
   - No resource approval workflow
   - No admin-only routes

5. **Search Functionality**
   - No global search
   - Browse filter only client-side
   - Need: Full-text search on server

6. **Email Notifications**
   - Basic email route exists but not integrated
   - Needed: Triggers for upload, approval, etc.

### Infrastructure TODOs

1. **Environment Setup**
   - Document required .env variables
   - Create .env.example file

2. **Database**
   - Create `user_preferences` table migration
   - Add RLS policies
   - Add triggers for status changes

3. **Error Handling**
   - Implement Sentry integration
   - Add custom error pages
   - Structured logging

4. **Security**
   - Implement rate limiting
   - Add request validation with Zod
   - Add security headers middleware

---

## Known Issues

### Database Issues

1. **Missing user_preferences table**
   - **Severity:** Critical
   - **Description:** Code expects `user_preferences` table but it's not in `db.sql`
   - **Impact:** Profile completion and filtering won't work
   - **Fix:** Run SQL migration to create table
   - **Affected Queries:** `getDashboardContext()`, `completeProfile()`

### Email Service Issues

1. **Hardcoded email recipient**
   - **Severity:** Medium
   - **File:** `app/api/send-email/route.ts`
   - **Problem:** Email recipient hardcoded to 'studenthub.ghardaia@gmail.com'
   - **Fix:** Use environment variable or request body
   - **Impact:** Cannot send emails to different recipients

2. **No email sender name**
   - **Severity:** Low
   - **Problem:** Emails sent from 'onboarding@resend.dev'
   - **Fix:** Configure custom sender domain in Resend

### Authentication Issues

1. **No rate limiting on auth endpoints**
   - **Severity:** Medium
   - **Impact:** Brute force attacks possible
   - **Fix:** Add rate limiting middleware

2. **No account lockout**
   - **Severity:** Medium
   - **Impact:** Unlimited login attempts
   - **Fix:** Track failed attempts, lock after 5 tries

### Security Issues

1. **API routes not authenticated**
   - **Severity:** High
   - **File:** `app/api/send-email/route.ts`
   - **Fix:** Add auth check before processing

2. **No RLS policies**
   - **Severity:** High
   - **Impact:** Database-level security missing
   - **Fix:** Implement Row-Level Security in Supabase

3. **No input validation library**
   - **Severity:** Medium
   - **Impact:** Validation scattered, inconsistent
   - **Fix:** Use Zod or similar schema validation library

### UI/UX Issues

1. **Resource details page incomplete**
   - **Severity:** Low
   - **Impact:** Resource pages don't show full info
   - **Fix:** Implement resource detail component

2. **No loading states**
   - **Severity:** Low
   - **Impact:** Confusing when data is loading
   - **Fix:** Add skeleton loaders, loading spinners

3. **No error recovery UI**
   - **Severity:** Low
   - **Impact:** Users stuck on error pages
   - **Fix:** Add retry buttons, clear error messages

### Performance Issues

1. **No image optimization**
   - **Severity:** Low
   - **Impact:** Larger bundle size
   - **Fix:** Use `next/image` for all images

2. **No code splitting**
   - **Severity:** Low
   - **Impact:** Large JS bundle for single page
   - **Fix:** Use dynamic imports for heavy components

### Documentation Issues

1. **No API documentation**
   - **Severity:** Low
   - **Impact:** Unclear for API consumers
   - **Fix:** Add Swagger/OpenAPI docs (if APIs added)

2. **No contribution guide**
   - **Severity:** Low
   - **Impact:** New developers unclear on process
   - **Fix:** Create CONTRIBUTING.md

---

## File Responsibilities

### Root Configuration Files

| File | Responsibility |
|------|-----------------|
| `package.json` | Project metadata, dependencies, scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `next.config.ts` | Next.js build configuration |
| `eslint.config.mjs` | Linting rules and configuration |
| `postcss.config.mjs` | PostCSS plugins (Tailwind) |
| `components.json` | shadcn/ui configuration |
| `.gitignore` | Files to exclude from git |
| `.env.local` | Local environment variables (not committed) |
| `.env.example` | Template for environment variables |

### Core Application Files

| File Path | Responsibility | Dependencies |
|-----------|-----------------|--------------|
| `app/page.tsx` | Landing page | `components/landing/landing-page.tsx` |
| `app/layout.tsx` | Root layout, global styles | `globals.css`, fonts |
| `app/error.tsx` | Global error boundary | - |
| `app/not-found.tsx` | 404 page | - |
| `globals.css` | Global CSS, Tailwind directives | TailwindCSS |

### Authentication

| File | Responsibility |
|------|-----------------|
| `app/auth/page.tsx` | Auth index (redirects to login) |
| `app/auth/login/page.tsx` | Login page |
| `app/auth/register/page.tsx` | Registration page |
| `app/auth/complete/page.tsx` | Profile completion page |
| `app/auth/callback/route.ts` | OAuth callback handler |
| `app/auth/actions.ts` | Server actions (login, register, etc.) - **CORE** |
| `app/auth/AuthForm.tsx` | Reusable auth form component |
| `app/auth/CompleteProfileForm.tsx` | Profile completion form |
| `app/auth/types.ts` | Auth type definitions |
| `app/auth/error-handling.ts` | Auth error utilities |

### Dashboard

| File | Responsibility |
|------|-----------------|
| `app/home/layout.tsx` | Dashboard shell wrapper |
| `app/home/page.tsx` | Dashboard home page |
| `app/home/actions.ts` | Server actions (upload, etc.) |
| `app/home/browse/page.tsx` | Resource browse page |
| `app/home/upload/page.tsx` | Resource upload page |
| `app/home/my-uploads/page.tsx` | User uploads page |
| `app/home/profile/page.tsx` | User profile page |
| `app/home/curriculum/page.tsx` | Course catalog page |
| `app/home/resources/[id]/page.tsx` | Resource detail page |

### Components

| File | Responsibility |
|------|-----------------|
| `components/home/home-shell.tsx` | Main dashboard layout |
| `components/home/home-navigation.tsx` | Sidebar/mobile nav |
| `components/home/home-cards.tsx` | Stats and resource cards |
| `components/home/browse-explorer.tsx` | Resource browsing UI |
| `components/home/upload-form.tsx` | Resource upload form |
| `components/home/upload-resource-dialog.tsx` | Upload modal dialog |
| `components/home/profile-form.tsx` | Profile editing form |
| `components/home/onboarding-gate.tsx` | Profile completion gate |
| `components/landing/landing-page.tsx` | Landing page sections |
| `components/ui/button.tsx` | Button component (shadcn) |
| `components/ui/badge.tsx` | Badge component (shadcn) |

### Libraries & Utilities

| File | Responsibility | Exports |
|------|-----------------|---------|
| `lib/home-data.ts` | **CORE** - Data fetching functions | `getDashboardContext()`, `getModules()`, `getApprovedResources()`, `getResourceById()`, `getMyResources()` |
| `lib/home-types.ts` | Type definitions for dashboard | `DashboardUser`, `ResourceSummary`, `ModuleSummary`, etc. |
| `lib/utils.ts` | Utility functions | `cn()` (class merging) |
| `utils/supabase/client.ts` | Browser Supabase client | `createClient()` |
| `utils/supabase/server.ts` | **CORE** - Server Supabase client | `createClient(cookies)` |
| `utils/supabase/proxy.ts` | Proxy utilities (if needed) | - |

### Database & Configuration

| File | Responsibility |
|------|-----------------|
| `db.sql` | **CORE** - Database schema and initial data |
| `components.json` | shadcn/ui configuration |
| `next.config.ts` | Next.js optimization settings |

### Documentation

| File | Responsibility |
|------|-----------------|
| `README.md` | Project overview |
| `DESIGN_pinggly.md` | Design system specification |
| `guide.md` | Usage guide |
| `docs/nextjs-docs.md` | Next.js reference |
| `docs/react-docs.md` | React reference |
| `docs/shadcn-docs.md` | shadcn/ui reference |
| `PROJECT_CONTEXT.md` | **THIS FILE** - Complete project documentation |

### Critical Files (Modify Carefully)

🔴 **Very Critical - Changes affect entire app:**
1. `app/layout.tsx` - Root layout
2. `lib/home-data.ts` - Core data fetching
3. `utils/supabase/server.ts` - Auth & database connection
4. `db.sql` - Database schema

🟡 **Important - Breaking changes possible:**
5. `app/auth/actions.ts` - Auth logic
6. `components/home/home-shell.tsx` - Layout
7. `lib/home-types.ts` - Type definitions

🟢 **Regular - Safe to modify:**
8. Individual pages
9. Individual components
10. Utility functions

---

## Development Guide

### Adding a New Dashboard Page

**Example: Add a Statistics page at `/home/statistics`**

**Step 1: Create page file**
```tsx
// app/home/statistics/page.tsx
import type { Metadata } from "next";
import { getDashboardContext, getApprovedResources } from "@/lib/home-data";

export const metadata: Metadata = {
  title: "Statistics | Pinggly Dashboard",
};

export default async function StatisticsPage() {
  const { user, preferences, complete } = await getDashboardContext();

  if (!complete) {
    return <OnboardingGate />;
  }

  const resources = await getApprovedResources();
  const resourceCount = resources.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Platform Statistics</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Resources" value={resourceCount} />
        {/* More cards */}
      </div>
    </div>
  );
}
```

**Step 2: Add to navigation**
```tsx
// components/home/home-navigation.tsx
const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/home/browse", label: "Browse", icon: Library },
  { href: "/home/statistics", label: "Statistics", icon: BarChart },  // ← Add
  // ...
];
```

**Step 3: Add navigation link in sidebar**
```tsx
// DashboardNavigation component
<nav className="space-y-2">
  {links.map(link => (
    <Link key={link.href} href={link.href}>
      <link.icon className="size-5" />
      {link.label}
    </Link>
  ))}
</nav>
```

### Adding a New Component

**Example: Add a ResourceStats component**

```tsx
// components/home/resource-stats.tsx
import type { ResourceSummary } from "@/lib/home-types";

type ResourceStatsProps = {
  readonly resources: readonly ResourceSummary[];
};

export function ResourceStats({ resources }: ResourceStatsProps) {
  const stats = {
    total: resources.length,
    byType: Object.groupBy(resources, r => r.resourceType),
    recent: resources.slice(0, 5),
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resource Statistics</h2>
      <p>Total: {stats.total} resources</p>
      {/* More rendering */}
    </div>
  );
}
```

**Usage:**
```tsx
import { ResourceStats } from "@/components/home/resource-stats";

<ResourceStats resources={resources} />
```

### Creating a Database Migration

**Example: Add a new `users_activity` table**

**Step 1: Create migration SQL**
```sql
-- migrations/001_add_users_activity_table.sql

CREATE TABLE public.users_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_activity_user_id ON public.users_activity(user_id);
CREATE INDEX idx_users_activity_created_at ON public.users_activity(created_at);
```

**Step 2: Run in Supabase**
- Go to Supabase Dashboard → SQL Editor
- Create new query
- Paste migration SQL
- Execute

**Step 3: Update types**
```typescript
// lib/home-types.ts
export type UserActivity = {
  readonly id: string;
  readonly userId: string;
  readonly action: string;
  readonly resourceId: string | null;
  readonly createdAt: string;
};
```

### Writing a Server Action

**Example: Add action to save user preferences**

```typescript
// app/home/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { AcademicLevel } from "@/lib/home-types";

export type SavePreferencesState = {
  readonly status: "idle" | "success" | "error";
  readonly message: string;
};

export async function savePreferences(
  _previousState: SavePreferencesState,
  formData: FormData,
): Promise<SavePreferencesState> {
  const university = String(formData.get("university") ?? "").trim();
  const academicLevel = String(formData.get("academicLevel") ?? "")as AcademicLevel;

  if (!university || !academicLevel) {
    return {
      status: "error",
      message: "Please fill all fields",
    };
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please login first",
    };
  }

  const { error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: user.id,
      university,
      academic_level: academicLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: "Failed to save preferences",
    };
  }

  return {
    status: "success",
    message: "Preferences saved",
  };
}
```

### Setting Up Local Development

**1. Clone repository**
```bash
git clone <repo-url>
cd pingy
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

**4. Start development server**
```bash
npm run dev
# Open http://localhost:3000
```

**5. Setup Supabase locally (optional)**
```bash
npm install -g supabase
supabase init
supabase start  # Starts local Supabase
```

### Deployment

**Deploy to Vercel:**

```bash
# 1. Push code to GitHub
git push origin main

# 2. Import project in Vercel dashboard
# https://vercel.com/new

# 3. Set environment variables in Vercel settings
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
RESEND_API_KEY=...

# 4. Deploy
# Automatic on push to main
```

### Project Rules

**Must Follow:**

1. ✅ All components must be TypeScript
2. ✅ Use `readonly` for props and data
3. ✅ Server Components by default (add "use client" only when needed)
4. ✅ Use named exports, not default exports
5. ✅ Keep components pure and side-effect free
6. ✅ Validate all user input on server
7. ✅ Never commit secrets or API keys
8. ✅ Always use `@/` absolute imports
9. ✅ Follow existing naming conventions
10. ✅ Add types for all function parameters

**Must NOT Do:**

1. ❌ Use inline styling (use Tailwind classes)
2. ❌ Use `any` type
3. ❌ Create global variables
4. ❌ Fetch data in Client Components
5. ❌ Commit .env files
6. ❌ Hardcode secret values
7. ❌ Use default exports
8. ❌ Skip TypeScript types
9. ❌ Make breaking database changes without migration
10. ❌ Deploy without testing locally first

---

## AI Context

### Project Overview

**Pinggly** is a Next.js 16 + Supabase application for Computer Science students to discover and share academic resources in an organized, moderated environment.

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Supabase PostgreSQL + TailwindCSS + shadcn/ui + Motion animations

**Language:** Arabic-first, RTL-enabled

### Quick Start for AI

**To understand this project quickly:**

1. Read `Database Documentation` (Section 6) - Understand the data model
2. Read `System Architecture` (Section 5) - Understand the layer communication
3. Read `Authentication & Authorization` (Section 7) - Understand user flows
4. Read `File Responsibilities` (Section 23) - Understand file organization

### Key Architectural Patterns

1. **Server-First:** Most data from Server Components, minimal client JS
2. **Type-Safe:** Full TypeScript, readonly props, discriminated unions
3. **Action-Based:** Forms use Server Actions, not fetch()
4. **Component Structure:** Composed small components, single responsibility
5. **Error Handling:** Form state pattern for errors, not exceptions

### Database Schema Quick Reference

```
Users (auth.users managed by Supabase) ↔ users (profile table)
  ↓
user_preferences (university, academic_level)

Modules (course catalog)
  ↓
Resources (uploaded materials)
  ↓
users (author info)
```

### Common Operations

**Fetch user data:**
```typescript
const supabase = createClient(await cookies());
const { data: { user } } = await supabase.auth.getUser();
```

**Fetch resources:**
```typescript
const { data } = await supabase
  .from('resources')
  .select(`
    id, title, ...,
    modules(name, level),
    users(full_name)
  `)
  .eq('status', 'approved');
```

**Save form data (Server Action):**
```typescript
export async function submitForm(
  _prevState,
  formData,
): Promise<FormState> {
  // Validate → Query DB → Return state
  return { status: 'success', message: 'Done' };
}
```

### Development Workflow

1. **Create feature branch:** `git checkout -b feat/feature-name`
2. **Implement locally:** `npm run dev` on http://localhost:3000
3. **Follow conventions:** TypeScript, Server Components, named exports
4. **Test changes:** Navigate app, fill forms, check console
5. **Commit:** `git add . && git commit -m "feat: description"`
6. **Push & PR:** Push branch, create PR, wait for review
7. **Deploy:** Merge to main → Automatic Vercel deployment

### Current Limitations & Fixes

| Issue | Workaround |
|-------|-----------|
| No user_preferences table | Add migration SQL to Supabase |
| Email not integrated | Email route exists but not called anywhere |
| No RLS policies | Add SQL policies to Supabase |
| No rate limiting | Would need middleware implementation |
| Resource details incomplete | Implement resource detail component |

### Future Enhancements

1. Admin moderation dashboard (review pending resources)
2. Full-text search (Supabase full-text search)
3. User ratings/reviews (new table + components)
4. Notifications (email + in-app)
5. Resource statistics (track views, downloads)
6. Advanced user profiles (public profiles, follow users)
7. Community features (forums, discussions)

### How to Extend

**Adding a new feature typically requires:**
1. Database schema (add table/column in db.sql)
2. Types (add to lib/home-types.ts)
3. Data fetching (add function to lib/home-data.ts)
4. Components (add UI in components/)
5. Pages (add route in app/)
6. Actions (if form submission, add to app/*/actions.ts)

### For New Developers

- Start with landing page to understand component structure
- Then explore auth flow (login/register/complete profile)
- Then dashboard pages (simple data fetch + display)
- Then complex pages (forms with validation)
- Finally, database operations and migrations

### Git Workflow

```bash
# Start work
git checkout -b feat/new-feature

# Make commits
git add .
git commit -m "feat: add new feature"

# Push
git push origin feat/new-feature

# Create PR on GitHub
# Get review, merge to main

# Deploy happens automatically via Vercel
```

### Testing Checklist

Before submitting code:
- ✅ No TypeScript errors: `npm run lint`
- ✅ Can navigate app without errors
- ✅ Forms submit and return correct state
- ✅ Authentication flow works (register → login → dashboard)
- ✅ No console errors or warnings
- ✅ Responsive on mobile (shrink browser window)
- ✅ RTL layout looks correct

---

## Conclusion

**Pinggly** is a well-structured, modern Next.js application focused on providing Arabic-speaking Computer Science students with a reliable platform for resource sharing. The codebase follows current best practices with full TypeScript support, Server Components, and a clean architecture.

**Key Strengths:**
- Modern tech stack (Next.js 16, React 19)
- Type-safe throughout
- Clean component organization
- Database-first architecture
- Responsive and accessible UI

**Areas for Improvement:**
- Add missing database tables (user_preferences)
- Implement RLS policies
- Add rate limiting and security headers
- Complete resource details page
- Add admin moderation feature

**For Continuation:**
Use this document as a reference for all future development. Refer to specific sections when:
- Adding new features (see Development Guide)
- Understanding code architecture (see System Architecture)
- Implementing security (see Security Review)
- Working with database (see Database Documentation)
- Writing code (see Coding Conventions)

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-18  
**Project Status:** Active Development (v0.1.0)
