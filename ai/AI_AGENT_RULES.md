# AEGIS StadiumOS
# AI Agent Implementation Rules

Version: 1.0.0

---

# Objective

Generate a production-grade, enterprise-quality FIFA World Cup Stadium Operations Platform.

The generated code should resemble software developed by senior engineers working at Microsoft, Google, Linear, Stripe, Vercel, or Figma.

The implementation should prioritize:

- Maintainability
- Scalability
- Accessibility
- Performance
- Security
- Clean Architecture
- Beautiful User Experience

---

# Technology Stack

Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript (Strict)
- Tailwind CSS 4
- Framer Motion
- React Three Fiber
- Drei
- Zustand
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Lucide Icons

Backend

- Supabase
- PostgreSQL
- Edge Functions
- Realtime
- Storage
- Row Level Security

AI

- OpenAI GPT-5
- LangChain
- AI SDK
- Streaming Responses

Deployment

- Vercel
- Docker
- GitHub Actions

---

# Code Standards

Always:

- Strict TypeScript
- No any types
- Functional Components
- Server Components where possible
- Client Components only when required
- SOLID Principles
- DRY
- KISS
- Clean Code
- Modular Architecture

Never:

- Duplicate code
- Inline styles
- Magic numbers
- Unused variables
- Console logs in production

---

# Folder Structure

Follow the documented architecture exactly.

Do not invent additional folders unless necessary.

Every feature must remain isolated.

---

# UI Standards

The interface should feel premium.

Inspired by:

- Apple
- Linear
- Arc Browser
- Stripe
- Vercel Dashboard

Avoid generic admin dashboard appearance.

---

# Theme

Support:

- Light
- Dark

Animated switching.

Persist preference.

---

# Visual Design

Use:

Glassmorphism

Layered depth

Soft shadows

3D cards

Animated gradients

Smooth transitions

Micro interactions

Large spacing

Rounded corners

Premium typography

---

# Motion

Animations should use Framer Motion.

Every interaction should feel alive.

Support reduced motion.

Maintain 60 FPS.

---

# Cursor

Implement a magnetic cursor.

Features:

- Magnetic attraction
- Hover scaling
- Particle trail
- Ripple effect
- Context-aware behavior

---

# Accessibility

Must comply with WCAG 2.2 AA.

Support:

Keyboard navigation

Screen readers

High contrast

Reduced motion

Focus management

Large text

Color-safe charts

---

# Performance

Target Lighthouse:

Performance 100

Accessibility 100

SEO 100

Best Practices 100

---

# Security

Follow OWASP ASVS.

Implement:

RBAC

Rate limiting

CSP

Secure headers

Sanitized inputs

Parameterized queries

Secure authentication

---

# Testing

Generate:

Unit Tests

Integration Tests

Playwright E2E

Accessibility Tests

API Tests

---

# AI

Every AI feature must:

Explain reasoning.

Handle failures gracefully.

Display confidence.

Support streaming.

Never fabricate operational data.

---

# Components

Generate reusable components.

No duplicated UI.

Every component documented.

---

# Error Handling

Every API call must include:

Loading

Retry

Timeout

Fallback

Error UI

---

# Logging

Use structured logging.

No console.log in production.

---

# Documentation

Every exported function must include JSDoc.

---

# Git

Generate meaningful commits.

Use semantic commit messages.

---

# Final Requirement

Produce code suitable for enterprise production deployment.

The implementation must match every specification inside the /docs folder.

Never ignore any documented requirement.