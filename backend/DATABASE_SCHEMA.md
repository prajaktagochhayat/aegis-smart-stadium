# AEGIS StadiumOS
# Database Architecture & Schema Specification

Version: 1.0.0
Status: Production Ready

---

# Database Philosophy

AEGIS StadiumOS uses PostgreSQL (Supabase) as its primary relational database.

The database is designed for:

- Scalability
- Security
- High availability
- Real-time synchronization
- AI-powered analytics
- Multi-tenant support
- Auditability

The schema follows Third Normal Form (3NF) while allowing selective denormalization for analytics.

---

# Database Technology

Primary Database

- PostgreSQL 16

Platform

- Supabase

Extensions

- pgvector
- pgcrypto
- uuid-ossp
- pg_trgm
- postgis (future)
- pgjwt

Realtime

- Enabled where appropriate

---

# Naming Convention

Tables

snake_case

Columns

snake_case

Primary Keys

id UUID

Foreign Keys

<entity>_id

Created Timestamp

created_at

Updated Timestamp

updated_at

Deleted Timestamp

deleted_at

---

# Core Tables

## Identity

users

roles

permissions

role_permissions

user_roles

sessions

devices

audit_logs

oauth_accounts

api_keys

---

## Stadium

stadiums

stadium_zones

gates

parking_areas

seats

amenities

maps

---

## Match

matches

teams

tournaments

tickets

ticket_scans

match_events

---

## Crowd Intelligence

crowd_snapshots

crowd_predictions

crowd_alerts

heatmaps

queue_metrics

sensor_data

crowd_incidents

---

## Emergency

emergency_incidents

emergency_alerts

responders

response_teams

evacuation_plans

emergency_logs

---

## Volunteers

volunteers

volunteer_shifts

volunteer_tasks

volunteer_messages

volunteer_locations

volunteer_performance

---

## Accessibility

accessibility_profiles

accessible_routes

accessible_facilities

accessibility_requests

language_preferences

assistance_tickets

---

## Transportation

transport_routes

traffic_events

parking_status

metro_stations

bus_stops

ride_share_zones

transport_predictions

---

## Sustainability

energy_usage

water_usage

waste_collection

recycling_metrics

carbon_metrics

esg_reports

---

## Fan Experience

fan_profiles

recommendations

favorite_locations

notifications

digital_passports

digital_souvenirs

---

## AI

ai_conversations

ai_messages

ai_recommendations

ai_feedback

ai_context

ai_usage_logs

---

## Analytics

page_views

user_events

performance_metrics

system_metrics

error_logs

---

# Shared Columns

Every table includes:

id UUID PRIMARY KEY

created_at TIMESTAMP WITH TIME ZONE

updated_at TIMESTAMP WITH TIME ZONE

deleted_at TIMESTAMP NULL

created_by UUID

updated_by UUID

---

# Relationships

Users

↓

Roles

↓

Permissions

Users

↓

Sessions

Users

↓

Devices

Matches

↓

Tickets

Tickets

↓

Ticket Scans

Stadium

↓

Zones

Zones

↓

Crowd Snapshots

Crowd

↓

Alerts

Crowd

↓

Predictions

Volunteers

↓

Tasks

Tasks

↓

Incidents

Incidents

↓

Emergency Response

AI

↓

Recommendations

Recommendations

↓

Notifications

---

# UUID Strategy

Every entity uses UUID v4.

Never use sequential integer IDs.

---

# Soft Delete

Most operational tables implement:

deleted_at

Instead of permanent deletion.

---

# Index Strategy

Indexes required for:

Primary Keys

Foreign Keys

created_at

updated_at

status

user_id

match_id

stadium_id

zone_id

location

GIN indexes for JSON

GIN indexes for Full Text Search

Vector indexes for AI embeddings

---

# JSON Columns

Allowed only where flexibility is required.

Examples:

metadata

settings

preferences

configuration

ai_response

sensor_payload

---

# Enum Types

UserRole

IncidentStatus

IncidentSeverity

VolunteerStatus

TaskPriority

QueueLevel

AlertType

NotificationType

TransportMode

Theme

Language

AccessibilityType

---

# Row Level Security

Enable RLS for every user-facing table.

Policies include:

Users can access only their own profile.

Volunteers access assigned tasks.

Organizers access stadium data.

Administrators access all data.

Public access prohibited unless explicitly allowed.

---

# Audit Logging

Every INSERT

UPDATE

DELETE

Permission Change

Authentication Event

AI Administrative Action

Must generate an immutable audit log.

---

# Triggers

Automatically update:

updated_at

Generate audit logs.

Create notifications.

Maintain analytics.

Refresh materialized views.

---

# Materialized Views

Create optimized reporting views.

Examples:

Daily Crowd Summary

Volunteer Performance

Transport Analytics

Carbon Dashboard

Incident Statistics

---

# AI Embeddings

Store embeddings using pgvector.

Tables

ai_messages

knowledge_base

documentation

semantic_search

---

# Realtime

Realtime enabled for:

Crowd Updates

Emergency Alerts

Volunteer Tasks

Transportation

Notifications

Match Events

AI Responses

---

# Backup Strategy

Daily Full Backup

Hourly Incremental Backup

Point-in-Time Recovery

30-Day Retention

---

# Performance Targets

Simple Query

<50ms

Complex Query

<250ms

Dashboard

<500ms

Realtime Event

<100ms

---

# Constraints

NOT NULL

CHECK

UNIQUE

FOREIGN KEY

CASCADE only where appropriate.

Avoid cascading deletes for historical records.

---

# Security

Encrypt sensitive data.

Use Row Level Security.

Parameterized queries only.

Never expose internal IDs unnecessarily.

Store passwords only through Supabase Auth.

---

# Data Retention

Audit Logs

7 years

Operational Metrics

2 years

Notifications

90 days

AI Conversations

Configurable

Sessions

30 days

---

# Migration Strategy

Every schema change must use versioned migrations.

No manual production schema modifications.

---

# Future Expansion

Multi-Stadium Support

Multi-Tournament Support

Digital Twin Storage

IoT Device Registry

Drone Telemetry

Computer Vision Metadata

Predictive AI Models

---

# Source of Truth

This document defines the canonical database architecture for AEGIS StadiumOS.

Every backend implementation must follow this specification.