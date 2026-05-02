# IDGate (Identification Gate)

An identity-verified communication platform where people communicate through their official positions and credentials in a verified, secure way.

## Core Concept

IDGate introduces a three-entity identity model:

1. **Natural Character (الشخصية الطبيعية)** - The real person with a permanent account
2. **Virtual Character / Position (الشخصية الافتراضية)** - Role-based identity granted by organizations, only active when linked to a natural person
3. **Legal Entity (الشخصية الاعتبارية)** - Organizations that create positions and link them to people

## Key Differentiators

- **Official communication** - Unlike WhatsApp/Facebook, communication carries verified identity weight
- **Position-based identity** - People communicate through their verified organizational roles
- **Organization structure** - Full org hierarchy support (departments, positions, levels)
- **Integrated business services** - Meetings, tasks, calendar, projects in one platform
- **Security through verification** - Positions only activate when linked to verified natural persons

## Architecture

```
id-gate/
├── mobile/          # React Native mobile app (iOS & Android)
├── backend/         # NestJS backend API
├── shared/          # Shared TypeScript types & schemas
└── docs/            # Documentation
```

## Tech Stack

- **Mobile**: React Native + TypeScript + Expo
- **Backend**: NestJS + TypeScript + PostgreSQL + Redis
- **Real-time**: Socket.IO for messaging
- **Auth**: JWT + OTP verification
- **Storage**: AWS S3 / MinIO for media

## Modules

### MVP Phase 1: Identity & Communication
- User registration & identity verification
- Natural character profiles
- Legal entity (organization) creation
- Position creation & linking
- Direct messaging (person-to-person, position-to-position)
- Teams, Groups, Broadcast lists
- Address book with approval-based contacts

### Phase 2: Business Tools
- Text meetings
- Conferences
- Calendar & scheduling
- Task management
- Project management
- Reminders & notes

### Phase 3: Information & Services
- Financial/economic news feeds
- ERP data integration
- Vacancy/recruitment
- Publishing & advertising
- Reports & analytics

## Getting Started

```bash
# Install dependencies
npm install

# Start backend
cd backend && npm run start:dev

# Start mobile app
cd mobile && npx expo start
```

## License

Proprietary - All rights reserved.
