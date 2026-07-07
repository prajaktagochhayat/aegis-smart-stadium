# AEGIS StadiumOS
# Backend API Specification

Version: 1.0.0
Status: Production Ready

---

# Overview

This document defines the REST API architecture for AEGIS StadiumOS.

The API powers every client application including:

- Organizer Dashboard
- Volunteer Console
- Fan Experience
- AI Copilot
- Operations Center
- Mobile Applications

The API follows REST principles while supporting realtime updates via WebSockets and Supabase Realtime.

---

# API Principles

The API must be:

- Predictable
- Consistent
- Versioned
- Secure
- Idempotent where applicable
- Fully documented
- Backward compatible

---

# Base URL

Production

/api/v1

Development

/api/v1

Future versions

/api/v2

---

# Response Format

Every successful response follows:

{
  "success": true,
  "data": {},
  "meta": {},
  "timestamp": ""
}

Every error response follows:

{
  "success": false,
  "error": {
      "code": "",
      "message": "",
      "details": []
  }
}

---

# Authentication

Every protected endpoint requires:

Authorization

Bearer JWT Token

Support

- OAuth 2.1
- Supabase Auth
- Refresh Tokens
- MFA
- Role-Based Access Control

---

# Roles

Supported Roles

Fan

Volunteer

Organizer

Security

Medical

Accessibility

Sustainability

Administrator

Super Administrator

---

# Common HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

503 Service Unavailable

---

# Pagination

Use Cursor Pagination.

Example

GET /matches?cursor=abc123&limit=25

Response

nextCursor

previousCursor

hasMore

---

# Filtering

Support:

status

stadium

zone

date

priority

severity

role

language

---

# Sorting

sortBy

order

Example

sortBy=created_at

order=desc

---

# Search

Support Full Text Search.

Example

/search?q=medical emergency

---

# Rate Limiting

Anonymous

60 requests/minute

Authenticated

300 requests/minute

Admin

1000 requests/minute

AI Endpoints

30 requests/minute

---

# Idempotency

POST endpoints supporting retries must accept:

Idempotency-Key

---

# WebSocket Channels

Realtime Events

crowd.updated

transport.updated

match.updated

notification.created

incident.created

ai.streaming

volunteer.updated

---

# Core API Modules

Authentication

/api/v1/auth/*

Users

/api/v1/users/*

Matches

/api/v1/matches/*

Crowd Intelligence

/api/v1/crowd/*

Navigation

/api/v1/navigation/*

Transportation

/api/v1/transport/*

Emergency

/api/v1/emergency/*

Volunteers

/api/v1/volunteers/*

Accessibility

/api/v1/accessibility/*

AI

/api/v1/ai/*

Analytics

/api/v1/analytics/*

Notifications

/api/v1/notifications/*

Sustainability

/api/v1/sustainability/*

---

# Authentication Endpoints

POST /auth/login

POST /auth/logout

POST /auth/register

POST /auth/refresh

POST /auth/mfa

GET /auth/profile

PATCH /auth/profile

DELETE /auth/session

---

# Crowd Endpoints

GET /crowd/live

GET /crowd/zones

GET /crowd/predictions

GET /crowd/heatmap

POST /crowd/report

PATCH /crowd/incident

---

# Navigation Endpoints

GET /navigation/routes

POST /navigation/optimize

GET /navigation/gates

GET /navigation/map

---

# AI Endpoints

POST /ai/chat

POST /ai/recommendations

POST /ai/navigation

POST /ai/incident-analysis

GET /ai/history

DELETE /ai/history

---

# Transportation Endpoints

GET /transport/status

GET /transport/routes

GET /transport/parking

GET /transport/public

POST /transport/recommend

---

# Volunteer Endpoints

GET /volunteers

GET /volunteers/tasks

PATCH /volunteers/tasks/{id}

POST /volunteers/check-in

POST /volunteers/report

---

# Emergency Endpoints

GET /emergency/incidents

POST /emergency/incidents

PATCH /emergency/incidents/{id}

POST /emergency/evacuate

---

# Accessibility Endpoints

GET /accessibility/routes

GET /accessibility/services

POST /accessibility/request

PATCH /accessibility/request/{id}

---

# Sustainability Endpoints

GET /sustainability/dashboard

GET /sustainability/carbon

GET /sustainability/waste

GET /sustainability/energy

GET /sustainability/reports

---

# Analytics Endpoints

GET /analytics/dashboard

GET /analytics/crowd

GET /analytics/incidents

GET /analytics/transport

GET /analytics/sustainability

---

# Notification Endpoints

GET /notifications

PATCH /notifications/read

DELETE /notifications/{id}

---

# Validation Rules

Every endpoint must validate:

- Required fields
- Data types
- UUID format
- Enum values
- Payload size
- Authorization

Validation should use Zod.

---

# API Security

Every endpoint must implement:

- JWT Validation
- RBAC
- Input Sanitization
- SQL Injection Protection
- XSS Protection
- CSRF Protection
- Rate Limiting
- Audit Logging

---

# Caching

Use:

Redis

Cache-Control Headers

ETags

Stale-While-Revalidate

---

# Error Codes

AUTH_INVALID_TOKEN

AUTH_SESSION_EXPIRED

VALIDATION_ERROR

RESOURCE_NOT_FOUND

INSUFFICIENT_PERMISSION

RATE_LIMIT_EXCEEDED

AI_SERVICE_UNAVAILABLE

TRANSPORT_DATA_UNAVAILABLE

CROWD_DATA_DELAYED

---

# API Documentation

Generate:

OpenAPI 3.1

Swagger UI

Scalar Documentation

---

# Monitoring

Track:

API Latency

Error Rate

Request Volume

Success Rate

Token Usage

Realtime Connections

---

# Performance Targets

GET Requests

<150ms

POST Requests

<300ms

Realtime Event

<100ms

AI Streaming

<1 second first token

---

# Testing

Every endpoint requires:

- Unit Tests
- Integration Tests
- Contract Tests
- Load Tests
- Security Tests

Minimum API coverage:

95%

---

# Deprecation Policy

Endpoints remain supported for one major version after deprecation.

Clients receive warning headers before removal.

---

# Source of Truth

Every backend implementation must follow this API specification.

Changes require version-controlled documentation updates.