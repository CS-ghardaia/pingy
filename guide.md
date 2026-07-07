# AGENTS.md

# AI Development Guide

> This project follows a strict engineering workflow.
> Always prioritize correctness, maintainability, type safety, and official documentation over speed.

---

# Primary Rule

Never guess.

If an API, library, hook, configuration, or syntax is uncertain:

1. Use the latest official documentation.
2. Prefer the newest stable API.
3. Never invent functions or props.
4. Never use deprecated APIs.

Always assume the project uses the latest stable versions unless package.json specifies otherwise.

---

# Official Documentation Priority

Always prioritize documentation in this order:

1. Next.js
2. React
3. TypeScript
4. Tailwind CSS
5. Supabase
6. shadcn/ui
7. Radix UI
8. Vercel
9. MDN Web Docs

Never use blog posts when official documentation exists.

---

# Next.js Rules

Always use:

- App Router
- Server Components by default
- Client Components only when required
- Route Handlers
- Server Actions when appropriate
- Metadata API
- next/navigation
- next/image
- next/font

Avoid:

- Pages Router unless already used
- Legacy APIs
- Deprecated configuration
- Deprecated routing methods

---

# TypeScript Rules

TypeScript correctness is mandatory.

Never:

- use any
- use @ts-ignore
- disable strict mode
- cast blindly using "as"
- ignore compiler errors

Always:

- infer types when possible
- create explicit interfaces
- create reusable types
- use readonly when appropriate
- use discriminated unions
- use generics correctly
- handle undefined
- handle null
- narrow unknown types safely

Every file must compile without TypeScript errors.

---

# React Rules

Always:

- Functional Components
- Hooks
- Composition
- Small reusable components

Avoid:

- Class Components
- Large monolithic files
- Duplicate logic

---

# State Management

Prefer:

1. Server Components
2. URL State
3. React State
4. Context

Do not introduce global state libraries unless necessary.

---

# Component Rules

Each component should have:

Single responsibility.

Reusable.

Typed props.

Meaningful names.

Minimal logic inside JSX.

Avoid components larger than ~250 lines.

---

# Folder Structure

Follow existing project architecture.

Never create duplicate folders.

Prefer:

app/
components/
lib/
hooks/
services/
types/
utils/

---

# Imports

Always use absolute imports.

Example:

import Button from "@/components/ui/button"

Avoid deep relative imports.

---

# Styling

Use:

Tailwind CSS

Prefer utility classes.

Extract reusable UI.

Avoid inline styles unless necessary.

---

# Accessibility

Always include:

ARIA labels

Keyboard support

Semantic HTML

Accessible forms

Proper button usage

---

# Performance

Always optimize:

Images

Fonts

Server rendering

Streaming

Suspense

Code splitting

Lazy loading when appropriate

Avoid unnecessary Client Components.

---

# Error Handling

Never swallow errors.

Always:

return useful messages

log meaningful information

handle async failures

handle loading states

handle empty states

---

# API Rules

Validate inputs.

Validate outputs.

Never trust external data.

Always define request and response types.

---

# Code Style

Write:

Clean

Simple

Predictable

Readable

Self-documenting

Prefer early returns.

Avoid nested conditionals.

Avoid duplicated code.

---

# Naming

Use descriptive names.

Good:

UserProfile

DashboardHeader

fetchUser

createProject

Bad:

Data

Thing

handleStuff

temp

---

# Comments

Write comments only when necessary.

Code should explain itself.

Never comment obvious code.

---

# Refactoring

Whenever editing code:

Improve readability.

Reduce duplication.

Keep behavior identical.

Do not introduce regressions.

---

# Before Finishing

Always verify:

✓ TypeScript compiles

✓ No ESLint errors

✓ Imports are correct

✓ No unused variables

✓ No dead code

✓ No console.log left

✓ Correct async handling

✓ Correct error handling

✓ Responsive UI

✓ Accessible UI

---

# If Documentation Conflicts

Official documentation always wins.

Never prioritize memory over documentation.

---

# Output Quality

Generated code must be:

Production-ready

Strictly typed

Readable

Maintainable

Minimal

Consistent

Modern

No placeholders.

No pseudo code.

No incomplete implementations.

Always deliver finished code.