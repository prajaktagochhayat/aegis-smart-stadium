# AEGIS StadiumOS
# Design System Specification

Version: 1.0.0
Status: Production Ready

---

# Philosophy

AEGIS StadiumOS is not a traditional admin dashboard.

It should feel like a premium operating system designed for the FIFA World Cup.

The design language combines:

- Apple Human Interface Guidelines
- Linear
- Arc Browser
- Stripe Dashboard
- Vercel Dashboard
- Nothing OS
- VisionOS

The interface must communicate intelligence, trust, speed, and precision.

---

# Design Principles

Every screen should be:

- Minimal
- Elegant
- Spacious
- Responsive
- Predictable
- Accessible
- Interactive
- Beautiful

Never overwhelm the user.

Information density should remain balanced.

---

# Color System

## Primary

Blue

Used for:

- AI
- Navigation
- Primary buttons

---

## Secondary

Purple

Used for:

- Analytics
- Intelligence
- Predictions

---

## Success

Green

---

## Warning

Amber

---

## Danger

Red

---

## Neutral

Slate

---

# Theme Support

Support:

- Light Mode
- Dark Mode

Requirements:

- Instant switching
- Animated transition
- Persist user preference
- Respect system preference

---

# Typography

Primary Font

Inter

Fallback

System UI

Weights

- 400
- 500
- 600
- 700
- 800

Line height should prioritize readability.

Never use more than three font sizes within a card.

---

# Spacing System

Use an 8-point grid.

Spacing Scale:

4

8

12

16

24

32

40

48

64

80

96

Never use arbitrary spacing.

---

# Border Radius

Buttons

Large

Cards

Extra Large

Dialogs

Extra Large

Floating Panels

Maximum

---

# Shadows

Use soft layered shadows.

Avoid harsh shadows.

Large components should use subtle elevation.

---

# Glassmorphism

Most floating panels should use:

- Background blur
- Semi-transparent surfaces
- Soft borders
- Layered lighting

Avoid excessive opacity.

---

# Gradients

Use subtle gradients.

Primary gradient:

Blue → Purple

Secondary gradient:

Purple → Cyan

Danger gradient:

Orange → Red

Never use rainbow gradients.

---

# Icons

Library

Lucide

Rules

- Consistent stroke width
- Minimal style
- 20–24px default
- Never mix icon libraries

---

# Layout

Desktop

Sidebar

Top Navigation

Main Workspace

Context Panel

Tablet

Collapsible Sidebar

Mobile

Bottom Navigation

Floating Action Button

---

# Navigation

Smooth animated transitions.

Current page highlighted.

Breadcrumbs on complex pages.

---

# Sidebar

Glass background.

Animated collapse.

Resizable.

Search at top.

Pinned favorites.

---

# Dashboard Cards

Each card contains:

- Title
- Primary Metric
- Trend
- Status Indicator
- Mini Visualization
- Actions

Cards should animate into view.

---

# Buttons

Variants

Primary

Secondary

Ghost

Danger

Outline

Loading

Disabled

Hover

Magnetic interaction.

Subtle glow.

---

# Inputs

Rounded.

Animated focus.

Clear validation.

Inline errors.

Autocomplete where appropriate.

---

# Tables

Sticky header.

Resizable columns.

Sorting.

Filtering.

Search.

Pagination.

Keyboard navigation.

---

# Charts

Preferred

Area

Line

Bar

Donut

Heatmap

Treemap

Use smooth animations.

Never overload charts.

---

# Maps

Interactive.

3D capable.

Zoom.

Rotate.

Heatmap overlay.

Crowd overlay.

Transportation overlay.

Emergency overlay.

---

# AI Components

AI Chat

Streaming responses

Typing indicator

Confidence score

Suggested prompts

Reasoning summary

Copy response

Regenerate

Feedback buttons

---

# Notifications

Support:

Toast

Banner

Modal

System Alert

Emergency Alert

Emergency alerts override everything.

---

# Motion System

Framework

Framer Motion

Rules

- 150–300ms for UI transitions
- 300–500ms for page transitions
- Spring animations for cards
- Fade + Slide for panels

Avoid excessive motion.

---

# Cursor

Custom magnetic cursor.

Features

- Magnetic attraction
- Hover expansion
- Ripple click effect
- Particle trail
- Interactive highlighting

Cursor disabled automatically on touch devices.

---

# Loading States

Skeleton loaders.

Animated shimmer.

Progress indicators.

Never use blank screens.

---

# Empty States

Illustration

Helpful message

Suggested action

Quick navigation

---

# Error States

Friendly explanation.

Retry button.

Diagnostic code.

Support link.

---

# Accessibility

WCAG 2.2 AA

Support:

Keyboard navigation

Screen readers

Focus rings

Reduced motion

High contrast

Large text

Color-safe charts

---

# Responsive Breakpoints

Mobile

Tablet

Laptop

Desktop

Ultra-wide

Every component must adapt fluidly.

---

# Animation Performance

Maintain:

60 FPS

Avoid layout shifts.

Prefer transform over position animations.

Lazy load heavy animations.

---

# 3D Experience

Use React Three Fiber for:

Landing hero

Interactive stadium

Floating AI orb

Background particles

Interactive globe

Avoid excessive GPU usage.

---

# Sound

Optional.

Muted by default.

Micro interaction sounds only.

Respect user preference.

---

# Design Tokens

All colors, spacing, radius, shadows, and typography must be implemented using reusable design tokens.

Never hardcode values directly inside components.

---

# Internationalization

Support RTL-ready layouts.

Support multilingual text expansion.

Never truncate important information.

---

# Printing

Dashboard reports should generate print-friendly layouts.

---

# Final Design Goal

The interface should resemble enterprise software used during a live FIFA World Cup rather than a hackathon demo.

Every interaction should communicate confidence, intelligence, and precision.