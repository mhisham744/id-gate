<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/Backend-NestJS%2010-red" alt="Backend" />
  <img src="https://img.shields.io/badge/Mobile-Expo%20SDK%2054-purple" alt="Mobile" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL%2016-blue" alt="Database" />
  <img src="https://img.shields.io/badge/License-Private-gray" alt="License" />
</p>

# 🚪 IDGate — Identification Gate

> **A unified digital identity platform** that connects Natural Persons, Legal Entities, and Virtual Characters (Positions) through a secure, privacy-first identification system.

---

## 📋 Table of Contents

- [The Idea](#-the-idea)
- [Core Concepts](#-core-concepts)
- [System Architecture](#-system-architecture)
- [Three Character Types](#-three-character-types)
- [Organization Structure System](#-organization-structure-system)
- [Position Lifecycle](#-position-lifecycle)
- [Communication Model](#-communication-model)
- [Privacy & Authorization](#-privacy--authorization)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)

---

## 💡 The Idea

IDGate (Identification Gate) revolutionizes how individuals and organizations establish, verify, and manage their digital identities. Unlike traditional systems where a person has one account, IDGate recognizes that people operate in **multiple capacities**:

- As **themselves** (Natural Character) — personal identity
- As an **employee/officer** (Virtual Character) — position-bound identity
- As an **organization admin** (Legal Entity) — corporate identity management

```
┌─────────────────────────────────────────────────────────────┐
│                    THE IDGATE VISION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🧑 Ahmed (Natural Character)                              │
│   ├── IDG-NAT-00000001                                      │
│   ├── Personal identity, CV, contacts                       │
│   │                                                         │
│   ├── 👔 CEO @ TechCorp (Virtual Character)                 │
│   │   ├── IDG-POS-00000001                                  │
│   │   ├── Corporate communication                           │
│   │   ├── Delegation authority                              │
│   │   └── Authorization profile                             │
│   │                                                         │
│   └── 👔 Board Member @ HoldingCo (Virtual Character)       │
│       ├── IDG-POS-00000002                                  │
│       ├── Board-level communication                         │
│       └── Limited delegation                                │
│                                                             │
│   🏢 TechCorp (Legal Entity)                                │
│   ├── IDG-ORG-00000001                                      │
│   ├── Org Structure (4 types)                               │
│   ├── Positions → linked to natural persons                 │
│   └── Admin: manages master data only                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Separation of Identities** — Personal communication is separate from professional
2. **Position-Based Access** — Corporate rights attach to positions, not people
3. **Privacy by Design** — Granular privacy controls per data category
4. **Delegation Chain** — Authority flows from CEO through positions
5. **Universal IDCode** — Every entity gets a unique IDG-XXX-XXXXXXXX code

---

## 🔑 Core Concepts

### IDCode System

Every entity in the system receives a universally unique identification code:

| Entity Type | Format | Example |
|-------------|--------|---------|
| Natural Character (Person) | `IDG-NAT-XXXXXXXX` | `IDG-NAT-00000001` |
| Legal Entity (Organization) | `IDG-ORG-XXXXXXXX` | `IDG-ORG-00000001` |
| Virtual Character (Position) | `IDG-POS-XXXXXXXX` | `IDG-POS-00000001` |

### Account Types

```mermaid
graph LR
    A[Registration] --> B{Account Type?}
    B -->|Personal| C[Natural Character Only]
    B -->|Organization| D[Natural + Legal Entity]
    C --> E[Can be linked to positions later]
    D --> F[Admin creates positions & structure]
```

---

## 🏗 System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph Client["📱 Mobile App (Expo SDK 54)"]
        RN[React Native]
        ER[Expo Router]
        ZS[Zustand Stores]
        AX[Axios HTTP Client]
        SIO_C[Socket.IO Client]
    end

    subgraph API["🖥 Backend (NestJS 10)"]
        GW[API Gateway]
        AUTH[Auth Module]
        ENT[Entities Module]
        COM[Communication Module]
        CON[Contacts Module]
        NOT[Notifications Module]
        FEED[Feed Module]
        SEED[Seed Module]
        WSG[WebSocket Gateway]
    end

    subgraph Data["💾 Data Layer"]
        PG[(PostgreSQL 16)]
        RD[(Redis 7)]
        S3[(MinIO / S3)]
    end

    RN --> ER
    ER --> ZS
    ZS --> AX
    AX -->|HTTPS REST| GW
    SIO_C -->|WebSocket| WSG

    GW --> AUTH
    GW --> ENT
    GW --> COM
    GW --> CON
    GW --> NOT
    GW --> FEED
    GW --> SEED

    AUTH --> PG
    ENT --> PG
    COM --> PG
    COM --> RD
    CON --> PG
    NOT --> PG
    FEED --> PG
    WSG --> RD

    style Client fill:#e8f5e9
    style API fill:#e3f2fd
    style Data fill:#fff3e0
```

### Monorepo Structure

```mermaid
graph TB
    subgraph Monorepo["id-gate/"]
        SHARED["shared/<br/>TypeScript types & interfaces"]
        BACKEND["backend/<br/>NestJS REST + WebSocket API"]
        MOBILE["mobile/<br/>Expo React Native App"]
    end

    SHARED -->|"@idgate/shared"| BACKEND
    SHARED -->|"@idgate/shared"| MOBILE
    BACKEND -->|"REST API"| MOBILE

    style Monorepo fill:#f5f5f5
```

---

## 👥 Three Character Types

### 1. Natural Character (الشخصية الطبيعية)

The **real person** — their true identity with personal data.

```mermaid
graph TB
    subgraph NC["🧑 Natural Character"]
        PI[Personal Info<br/>Name, Gender, DOB, Nationality 1-4]
        DOC[Documents<br/>National ID, Passports 1-4, Driving License]
        LANG[Languages<br/>Mother Tongue + 4 Languages w/ Proficiency]
        CONT[Contacts<br/>Phone, Email, LinkedIn, WhatsApp]
        EDU[Education<br/>School → University → Postgraduate → PhD<br/>Training & Courses, Specialties]
        CAR[Career<br/>History, Profession, Title, Field, Industry]
        VAC[Vacancy Settings<br/>Notifications, Criteria]
        PRIV[Privacy<br/>Personal, Contact, Education, Career]
        ATTR[Attributes 1-5<br/>Custom fields]
    end

    style NC fill:#e8f5e9
```

**Master Data Fields:**

| Category | Fields |
|----------|--------|
| Personal | firstName, lastName, fullName, gender, dateOfBirth, nationality1-4, residenceCountry, city, address1-3 |
| Documents | nationalId, passport1-4, drivingLicense |
| Languages | motherTongue, language1-4 (with proficiency) |
| Contacts | phoneNumber, email, landlineNumber, linkedIn, facebook, whatsApp |
| Education | school, university, postgraduate, phd, trainingAndCourses[], specialtiesAndSkills[] |
| Career | careerHistory[], profession, title, field, industry, careerCountry |
| Vacancy | vacancyNotificationEnabled, vacancyCriteria{} |
| Privacy | privacyPersonalInfo, privacyContactInfo, privacyEducation, privacyCareer |

---

### 2. Legal Entity (الشخصية الاعتبارية)

The **organization** — a corporate identity managed by admins.

```mermaid
graph TB
    subgraph LE["🏢 Legal Entity"]
        CORP[Corporate Info<br/>Formal Name, Commercial Name, Search Name<br/>Domain Name, Names 1-5]
        LEGAL[Legal Structure<br/>Org Level: Holding/Individual/Branch<br/>Org Type, Legal Entity Type, Date of Operation]
        REG[Registration<br/>Country, City, Registration Address<br/>Headquarter Address]
        OPS[Operations<br/>Address, District, Country, Region<br/>Language, Second Language, Timezone]
        DOCS[Registration Docs<br/>Commercial Reg., Tax Card<br/>Manufacturing Reg., VAT Number]
        CONTS[Contacts<br/>Email, Website, Phone, Mobile, Fax]
        FIELD[Field of Operation<br/>Main Industry, Subsidiaries<br/>Brands[], Products[]]
        STRUCT[Structure Relations<br/>Holding Company, Parent Branch<br/>Sister Companies, Affiliates, Branches]
        FORMAL[Formal<br/>CEO User, Delegation Subjects]
    end

    style LE fill:#e3f2fd
```

**Organization Levels:**

```mermaid
graph TD
    H[🏛 Holding Company] --> I1[🏢 Individual Company A]
    H --> I2[🏢 Individual Company B]
    I1 --> B1[🏬 Branch Cairo]
    I1 --> B2[🏬 Branch Alexandria]
    I2 --> B3[🏬 Branch Riyadh]
```

---

### 3. Virtual Character (الشخصية الافتراضية)

The **position** — a role within an organization that can be linked to a natural person.

```mermaid
graph TB
    subgraph VC["👔 Virtual Character (Position)"]
        POS[Position Info<br/>Name, Names 1-3, Description, Code]
        LANG2[Languages 1-4]
        CONT2[Contact<br/>Mobile, Telephone, Email]
        STRUCT2[Structure Assignment<br/>Org Node, Management Node<br/>Function Node, Geographical Node]
        AUTH2[Authorization<br/>Position Profile, Delegation Subjects<br/>Delegation Limits, Can Delegate Others<br/>Duration, Start/End Dates]
        LINK[Linking<br/>Linked Natural ID, Link Status<br/>Display History, Location Privacy]
    end

    style VC fill:#fff3e0
```

**Position Linking Flow:**

```mermaid
sequenceDiagram
    participant Admin as 🏢 Org Admin
    participant System as ⚙️ IDGate
    participant Person as 🧑 Natural Person

    Admin->>System: Create Position (vacant)
    Note over System: Status: VACANT
    Admin->>System: Link Position to Person
    System->>Person: Send Link Request Notification
    Note over System: Status: PENDING
    
    alt Person Accepts
        Person->>System: Accept Link
        Note over System: Status: ACTIVE
        System->>Admin: Notify: Link Accepted
    else Person Declines
        Person->>System: Decline Link
        Note over System: Status: VACANT
        System->>Admin: Notify: Link Declined
    end
```

---

## 🌳 Organization Structure System

Each organization can define **4 independent structure hierarchies**, each with up to **3 levels**:

```mermaid
graph TB
    subgraph ORG["🏢 Organization"]
        subgraph OS["1️⃣ Organizational Structure<br/>(Shareholders / Board)"]
            OS1[Level 1: Board of Directors]
            OS2[Level 2: Executive Committee]
            OS3[Level 3: Sub-Committees]
            OS1 --> OS2 --> OS3
        end

        subgraph MS["2️⃣ Management Structure<br/>(HQ / Regions)"]
            MS1[Level 1: Headquarters]
            MS2[Level 2: Regional Offices]
            MS3[Level 3: Local Offices]
            MS1 --> MS2 --> MS3
        end

        subgraph FS["3️⃣ Function Structure<br/>(Departments)"]
            FS1[Level 1: Division]
            FS2[Level 2: Department]
            FS3[Level 3: Section]
            FS1 --> FS2 --> FS3
        end

        subgraph GS["4️⃣ Geographical Structure<br/>(Locations)"]
            GS1[Level 1: Country]
            GS2[Level 2: Governorate/State]
            GS3[Level 3: District/City]
            GS1 --> GS2 --> GS3
        end
    end

    style OS fill:#ffebee
    style MS fill:#e8f5e9
    style FS fill:#e3f2fd
    style GS fill:#fff8e1
```

### Position Assignment

A position can be assigned to **one node in each structure type**:

```mermaid
graph LR
    POS[👔 Position: CFO] --> |Org Structure| OS[Board → Finance Committee]
    POS --> |Management| MS[HQ → Cairo Office]
    POS --> |Function| FS[Finance → Accounting → General Ledger]
    POS --> |Geographical| GS[Egypt → Cairo → Downtown]
```

---

## 🔄 Position Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Vacant: Position Created
    Vacant --> Pending: Link Request Sent
    Pending --> Active: Person Accepts
    Pending --> Vacant: Person Declines
    Active --> Unlinked: Admin/Person Unlinks
    Unlinked --> Pending: Re-link to new person
    Unlinked --> Vacant: Reset
    Active --> Blocked: Admin blocks
    Blocked --> Vacant: Admin unblocks
```

### Authorization Model

```mermaid
graph TB
    CEO[CEO Position<br/>Full Delegation Authority]
    CEO -->|delegates| VP[VP Operations<br/>Limited Subjects]
    CEO -->|delegates| CFO[CFO<br/>Financial Authority]
    VP -->|delegates| MGR[Regional Manager<br/>Operational Only]
    CFO -->|delegates| ACC[Head of Accounting<br/>Payment Processing]

    style CEO fill:#ffcdd2
    style VP fill:#c8e6c9
    style CFO fill:#bbdefb
    style MGR fill:#c8e6c9
    style ACC fill:#bbdefb
```

Each position defines:
- **positionProfile** — what system features it can access
- **delegationSubjects** — what business authorities it holds
- **delegationLimits** — monetary/quantity limits per subject
- **canDelegateOthers** — whether it can pass authority downstream
- **delegationDuration** — open-ended or time-limited

---

## 💬 Communication Model

IDGate separates communication by identity type:

```mermaid
graph TB
    subgraph Personal["🧑 Personal Communication"]
        P2P[Person ↔ Person<br/>Direct Messages]
        PGP[Person Groups<br/>Friends, Family]
    end

    subgraph Professional["👔 Position Communication"]
        V2V[Position ↔ Position<br/>Official Messages]
        TEAM[Teams<br/>Project Teams, Departments]
        MEET[Meetings<br/>Scheduled Conferences]
        TASK[Tasks<br/>Assigned Work Items]
    end

    subgraph Rules["📋 Rules"]
        R1[Admin CANNOT communicate<br/>through the org account directly]
        R2[Must use a Position<br/>for all corporate comms]
        R3[Personal messages stay<br/>separate from position messages]
    end

    style Personal fill:#e8f5e9
    style Professional fill:#e3f2fd
    style Rules fill:#fff8e1
```

### Real-Time Communication

```mermaid
sequenceDiagram
    participant A as 👔 Position A
    participant WS as WebSocket Gateway
    participant B as 👔 Position B

    A->>WS: Connect (JWT + Position ID)
    B->>WS: Connect (JWT + Position ID)
    A->>WS: sendMessage(conversationId, content)
    WS->>B: newMessage event
    WS->>A: messageSent confirmation
```

---

## 🔒 Privacy & Authorization

### Privacy Levels

Each data category can be set to one of three privacy levels:

```mermaid
graph LR
    subgraph Levels["Privacy Levels"]
        PUB[🌍 Public<br/>Visible to everyone]
        CON[👥 Contacts<br/>Visible to contacts only]
        CLS[🔒 Closed<br/>Visible to owner only]
    end
```

### Natural Character Privacy Controls

| Category | Controls | Default |
|----------|----------|---------|
| Personal Info | Name, gender, DOB, nationality, address | Public |
| Contact Info | Phone, email, social media | Public |
| Education | Degrees, courses, skills | Public |
| Career | History, profession, industry | Public |

### Legal Entity Privacy Controls

| Category | Controls | Default |
|----------|----------|---------|
| Corporate Info | Names, legal type, registration | Public |
| Contact Info | Phone, email, website | Public |
| Field of Operation | Industry, brands, products | Public |
| Structure Info | Org structure, positions | Contacts |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new account |
| POST | `/auth/login` | Login with phone + password |
| POST | `/auth/verify-otp` | Verify OTP code |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout (invalidate tokens) |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entities/profile/me` | Get my full profile |
| PUT | `/entities/profile/me` | Update my profile |
| GET | `/entities/profile/:id` | Get user public profile |
| GET | `/entities/search/users?q=` | Search users |

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entities/organizations/me` | My organizations |
| POST | `/entities/organizations` | Create organization |
| GET | `/entities/organizations/search?q=` | Search organizations |
| GET | `/entities/organizations/:id` | Get organization details |
| PUT | `/entities/organizations/:id` | Update organization |

### Positions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entities/positions/me` | My active positions |
| GET | `/entities/positions/pending` | Pending link requests |
| POST | `/entities/organizations/:orgId/positions` | Create position |
| GET | `/entities/organizations/:orgId/positions` | List org positions |
| GET | `/entities/positions/:id` | Get position details |
| PUT | `/entities/positions/:id` | Update position |
| POST | `/entities/positions/:id/link` | Link to person |
| POST | `/entities/positions/:id/accept-link` | Accept link request |
| POST | `/entities/positions/:id/decline-link` | Decline link request |
| POST | `/entities/positions/:id/unlink` | Unlink from person |

### Organization Structure

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entities/organizations/:orgId/structure?type=` | Get structure tree |
| POST | `/entities/organizations/:orgId/structure` | Create node |
| PUT | `/entities/structure/:nodeId` | Update node |
| DELETE | `/entities/structure/:nodeId` | Delete node |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications?page=&limit=` | Get notifications |
| GET | `/notifications/unread-count` | Unread count |
| POST | `/notifications/:id/read` | Mark as read |
| POST | `/notifications/read-all` | Mark all as read |
| POST | `/notifications/:id/action?result=` | Action a notification |

### Communication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/communication/conversations` | List conversations |
| POST | `/communication/conversations` | Create conversation |
| GET | `/communication/conversations/:id` | Get conversation |
| GET | `/communication/conversations/:id/messages` | Get messages |
| POST | `/communication/conversations/:id/messages` | Send message |

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get my contacts |
| POST | `/contacts/request` | Send contact request |
| POST | `/contacts/:id/accept` | Accept request |
| POST | `/contacts/:id/reject` | Reject request |
| DELETE | `/contacts/:id` | Remove contact |

---

## 🗃 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ POSITION : "links to (as person)"
    ORGANIZATION ||--o{ POSITION : "contains"
    ORGANIZATION ||--o{ ORG_STRUCTURE_NODE : "has"
    ORG_STRUCTURE_NODE ||--o{ ORG_STRUCTURE_NODE : "parent-child"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ CONVERSATION : "participates"
    CONVERSATION ||--o{ MESSAGE : "contains"
    USER ||--o{ CONTACT : "has"

    USER {
        uuid id PK
        string idCode UK "IDG-NAT-XXXXXXXX"
        string phoneNumber UK
        string email UK
        string passwordHash
        string accountType "personal|organization"
        string firstName
        string lastName
        string fullName
        string gender
        string dateOfBirth
        string nationality1
        string nationality2
        string nationality3
        string nationality4
        string residenceCountry
        string city
        jsonb careerHistory
        jsonb trainingAndCourses
        jsonb specialtiesAndSkills
        jsonb vacancyCriteria
        string privacyPersonalInfo
        string privacyContactInfo
        string privacyEducation
        string privacyCareer
        string status
        boolean isPhoneVerified
        boolean isEmailVerified
    }

    ORGANIZATION {
        uuid id PK
        string idCode UK "IDG-ORG-XXXXXXXX"
        string formalName
        string commercialName
        string orgLevel "holding|individual|branch"
        string orgType
        string legalEntityType
        string countryOfRegistration
        string mainIndustry
        jsonb subsidiaryIndustries
        jsonb brands
        jsonb products
        jsonb adminIds
        string ceoUserId FK
        jsonb delegationSubjects
        jsonb sisterCompanyIds
        jsonb affiliatedCompanyIds
        jsonb branchIds
        string status
    }

    POSITION {
        uuid id PK
        string idCode UK "IDG-POS-XXXXXXXX"
        string positionName
        string positionDescription
        string positionCode
        uuid organizationId FK
        string orgStructureNodeId FK
        string managementStructureNodeId FK
        string functionStructureNodeId FK
        string geographicalStructureNodeId FK
        jsonb positionProfile
        jsonb delegationSubjects
        jsonb delegationLimits
        boolean canDelegateOthers
        string linkedNaturalId FK
        string linkStatus "vacant|pending|active|unlinked|blocked"
        datetime linkedAt
        datetime unlinkedAt
    }

    ORG_STRUCTURE_NODE {
        uuid id PK
        uuid organizationId FK
        string structureType "organizational|management|function|geographical"
        string name
        string description
        int level "1-3"
        string code
        int sortOrder
        jsonb positionIds
        string mpath "materialized path"
    }

    NOTIFICATION {
        uuid id PK
        string recipientId FK
        string recipientType "natural|virtual"
        string type
        string title
        string body
        jsonb data
        string senderId
        string senderName
        boolean isRead
        boolean isActioned
        string actionResult
    }

    CONVERSATION {
        uuid id PK
        string type "direct|group|team"
        string name
        text participantIds
        datetime lastMessageAt
    }

    MESSAGE {
        uuid id PK
        uuid conversationId FK
        string senderId
        string senderType
        string content
        string messageType
    }

    CONTACT {
        uuid id PK
        string userId FK
        string contactId FK
        string status "pending|accepted|blocked"
    }
```

---

## 📁 Project Structure

```
id-gate/
├── backend/                          # NestJS REST + WebSocket API
│   ├── src/
│   │   ├── main.ts                   # App bootstrap
│   │   ├── app.module.ts             # Root module
│   │   ├── auth/                     # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts       # Login, Register, JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts    # Natural Character entity
│   │   ├── entities/                 # Core business entities
│   │   │   ├── entities.module.ts
│   │   │   ├── entities.service.ts   # CRUD for all entity types
│   │   │   ├── entities.controller.ts
│   │   │   └── entities/
│   │   │       ├── organization.entity.ts    # Legal Entity
│   │   │       ├── position.entity.ts        # Virtual Character
│   │   │       └── org-structure-node.entity.ts  # Structure tree
│   │   ├── communication/           # Messaging system
│   │   │   ├── communication.module.ts
│   │   │   ├── communication.service.ts
│   │   │   ├── communication.controller.ts
│   │   │   ├── communication.gateway.ts  # Socket.IO WebSocket
│   │   │   └── entities/
│   │   │       ├── conversation.entity.ts
│   │   │       └── message.entity.ts
│   │   ├── contacts/                # Contact management
│   │   │   ├── contacts.module.ts
│   │   │   ├── contacts.service.ts
│   │   │   ├── contacts.controller.ts
│   │   │   └── entities/
│   │   │       └── contact.entity.ts
│   │   ├── notifications/           # Push & in-app notifications
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.controller.ts
│   │   │   └── entities/
│   │   │       └── notification.entity.ts
│   │   ├── feed/                    # Activity feed
│   │   │   ├── feed.module.ts
│   │   │   ├── feed.service.ts
│   │   │   └── feed.controller.ts
│   │   ├── teams/                   # Teams & groups
│   │   │   └── teams.module.ts
│   │   └── seed/                    # Demo data seeder
│   │       ├── seed.module.ts
│   │       ├── seed.service.ts
│   │       └── seed.controller.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── mobile/                          # Expo React Native App
│   ├── app/                         # Expo Router (file-based routing)
│   │   ├── _layout.tsx              # Root layout
│   │   ├── index.tsx                # Entry redirect
│   │   ├── (auth)/                  # Auth screens (unauthenticated)
│   │   │   ├── register.tsx
│   │   │   ├── login.tsx
│   │   │   └── verify-otp.tsx
│   │   ├── (tabs)/                  # Main tab navigation
│   │   │   ├── home.tsx             # Dashboard
│   │   │   ├── messages.tsx         # Conversations
│   │   │   ├── notifications.tsx    # Notification center
│   │   │   ├── tools.tsx            # Business tools
│   │   │   └── settings.tsx         # Profile & settings
│   │   ├── chat/                    # Chat screens
│   │   └── organizations/           # Organization management
│   │       ├── index.tsx            # List organizations
│   │       ├── [id].tsx             # Organization details
│   │       └── add.tsx              # Join/create organization
│   ├── src/
│   │   ├── services/                # API client layer
│   │   │   ├── api.ts              # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── entity.service.ts
│   │   │   ├── communication.service.ts
│   │   │   └── feed.service.ts
│   │   ├── stores/                  # Zustand state management
│   │   │   └── auth.store.ts
│   │   ├── config/                  # App configuration
│   │   └── utils/                   # Utilities
│   ├── package.json
│   └── app.json
│
├── shared/                          # Shared TypeScript types
│   ├── src/
│   │   ├── index.ts
│   │   └── types/
│   │       ├── entities.ts          # Entity interfaces
│   │       ├── api.ts              # API request/response types
│   │       ├── communication.ts    # Chat types
│   │       └── business-tools.ts   # Tool types
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml               # Local dev infrastructure
├── package.json                     # Workspace root
└── README.md
```

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| NestJS | Application framework | ~10.4 |
| TypeORM | ORM / Database access | ~0.3.20 |
| PostgreSQL | Primary database | 16 |
| Redis | Caching & pub/sub | 7 |
| Socket.IO | Real-time WebSocket | via @nestjs/platform-socket.io |
| Passport + JWT | Authentication | passport-jwt 4 |
| Swagger | API documentation | @nestjs/swagger 8 |
| class-validator | DTO validation | ~0.14 |
| bcrypt | Password hashing | ~5.1 |
| Helmet | Security headers | ~8.0 |

### Mobile

| Technology | Purpose | Version |
|-----------|---------|---------|
| Expo | React Native framework | SDK 54 |
| Expo Router | File-based navigation | ~6 |
| React Native | UI framework | 0.76+ |
| Zustand | State management | ~5 |
| Axios | HTTP client | ~1.7 |
| React Query | Server state | @tanstack/react-query 5 |
| Socket.IO Client | Real-time messaging | — |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| Docker Compose | Local development |
| Railway | Backend hosting (production) |
| Vercel | Mobile web hosting (production) |
| MinIO | Local S3-compatible file storage |
| GitHub | Source control |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **Docker** & Docker Compose
- **Expo CLI** (`npx expo`)

### 1. Clone & Install

```bash
git clone https://github.com/mhisham744/id-gate.git
cd id-gate
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432`
- Redis on port `6379`
- MinIO on ports `9000` (API) and `9001` (console)

### 3. Start Backend

```bash
cd backend
cp .env.example .env  # Configure your environment
npm run start:dev
```

Backend starts on `http://localhost:3000`
Swagger docs at `http://localhost:3000/api`

### 4. Seed Demo Data

```bash
curl -X POST http://localhost:3000/seed
```

Creates:
- Demo user: `+201001234567` / `Password123!`
- Demo organization: IDGate Demo Corp
- Demo position: CEO (linked to demo user)
- Sample org structure

### 5. Start Mobile

```bash
cd mobile
npx expo start
```

Options:
- Press `w` for web browser
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR with Expo Go app

---

## ☁️ Deployment

### Production URLs

| Service | URL |
|---------|-----|
| Backend API | https://backend-production-2b386.up.railway.app |
| Mobile Web | https://dist-tau-one-28.vercel.app |
| API Docs | https://backend-production-2b386.up.railway.app/api |

### Deploy Backend (Railway)

```bash
cd backend
# Railway auto-deploys from GitHub main branch
git push origin main
```

### Deploy Mobile (Vercel)

```bash
cd mobile
npx expo export --platform web
# Deploy dist/ to Vercel
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/idgate
# OR individual settings:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=idgate
DB_PASSWORD=idgate_dev_password
DB_DATABASE=idgate

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=3000

# Redis (optional)
REDIS_URL=redis://localhost:6379

# File Storage (optional)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=idgate
```

### Mobile (src/config)

The mobile app reads the backend URL from its config:

```typescript
export const config = {
  api: {
    baseUrl: 'https://backend-production-2b386.up.railway.app',
  },
};
```

---

## 📊 System Flow Diagrams

### Complete Registration Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant M as 📱 Mobile App
    participant B as 🖥 Backend
    participant DB as 💾 Database

    U->>M: Enter name, nationality, phone
    M->>M: Validate form (Step 1)
    U->>M: Enter phone, email
    M->>M: Validate form (Step 2)
    U->>M: Enter password
    M->>M: Validate form (Step 3)
    M->>B: POST /auth/verify-otp (phone)
    B->>U: Send SMS OTP
    U->>M: Enter OTP
    M->>B: POST /auth/register
    B->>B: Hash password (bcrypt 12 rounds)
    B->>B: Generate IDG-NAT-XXXXXXXX
    B->>DB: INSERT user
    B->>B: Sign JWT
    B-->>M: { accessToken, refreshToken, user }
    M->>M: Store tokens securely
    M->>M: Navigate to Home
```

### Organization Creation & Position Linking

```mermaid
sequenceDiagram
    participant A as 🧑 Admin
    participant B as 🖥 Backend
    participant P as 🧑 Person

    Note over A: Has "organization" account type
    A->>B: POST /entities/organizations
    B->>B: Generate IDG-ORG-XXXXXXXX
    B-->>A: Organization created

    A->>B: POST /entities/organizations/:id/structure
    B-->>A: Structure node created

    A->>B: POST /entities/organizations/:id/positions
    B->>B: Generate IDG-POS-XXXXXXXX
    B-->>A: Position created (status: vacant)

    A->>B: POST /entities/positions/:id/link {personId}
    B->>B: Set status: pending
    B->>P: 🔔 Notification: Position Link Request
    
    P->>B: POST /entities/positions/:id/accept-link
    B->>B: Set status: active, linkedAt: now
    B->>A: 🔔 Notification: Link Accepted
    
    Note over P: Can now communicate as this position
```

### Identity Switching During Communication

```mermaid
graph TB
    subgraph User["🧑 Ahmed's App"]
        SW[Identity Switcher]
        SW --> |"As Myself"| NAT[Natural: Ahmed<br/>IDG-NAT-00000001]
        SW --> |"As CEO"| POS1[Position: CEO @ TechCorp<br/>IDG-POS-00000001]
        SW --> |"As Board Member"| POS2[Position: Board @ HoldingCo<br/>IDG-POS-00000002]
    end

    NAT --> |"sees"| PC[Personal Contacts<br/>Personal Groups<br/>Personal Messages]
    POS1 --> |"sees"| WC1[TechCorp Teams<br/>TechCorp Tasks<br/>TechCorp Meetings]
    POS2 --> |"sees"| WC2[HoldingCo Board Channel<br/>Board Meetings<br/>Board Documents]

    style User fill:#f5f5f5
    style PC fill:#e8f5e9
    style WC1 fill:#e3f2fd
    style WC2 fill:#fff3e0
```

---

## 🔐 Security Architecture

```mermaid
graph TB
    subgraph Security["Security Layers"]
        H[Helmet<br/>Security Headers]
        JWT[JWT Authentication<br/>Access + Refresh Tokens]
        GUARD[Route Guards<br/>@UseGuards JwtAuthGuard]
        VAL[DTO Validation<br/>class-validator]
        BCRYPT[Password Hashing<br/>bcrypt 12 rounds]
        PRIV[Privacy Filters<br/>Per-category controls]
        OWN[Ownership Checks<br/>Admin verification]
    end

    REQ[Incoming Request] --> H --> JWT --> GUARD --> VAL --> OWN --> PRIV --> RES[Response]

    style Security fill:#ffebee
```

**Key Security Features:**
- JWT tokens with short expiry + refresh token rotation
- bcrypt password hashing (12 salt rounds)
- Helmet security headers
- Input validation on all endpoints
- Ownership verification (only admins can modify their orgs)
- Privacy-filtered public profiles
- SQL injection prevention via TypeORM parameterized queries

---

## 🌐 Notification Types

| Type | Trigger | Action Required |
|------|---------|----------------|
| `contact_request` | Someone wants to add you | Accept / Decline |
| `position_link_request` | Organization wants to link you | Accept / Decline |
| `meeting_request` | Meeting invitation | Accept / Decline |
| `task_assignment` | Task assigned to your position | Acknowledge |
| `delegation_request` | Authority delegation offered | Accept / Decline |
| `message` | New message in conversation | Read |
| `system` | System announcement | Read |

---

## 📱 Mobile App Screens

```mermaid
graph TB
    subgraph Auth["🔐 Auth Flow"]
        REG[Register<br/>3-step form]
        OTP[Verify OTP]
        LOG[Login]
    end

    subgraph Main["📱 Main Tabs"]
        HOME[🏠 Home<br/>Dashboard & Quick Actions]
        MSG[💬 Messages<br/>Conversations List]
        NOTIF[🔔 Notifications<br/>All notifications]
        TOOLS[🛠 Tools<br/>Business Tools]
        SET[⚙️ Settings<br/>Profile & Preferences]
    end

    subgraph Screens["📄 Detail Screens"]
        CHAT[Chat View<br/>Real-time messaging]
        ORG_LIST[Organizations<br/>My organizations list]
        ORG_DET[Org Details<br/>Info & structure]
        ORG_ADD[Join Org<br/>Search & link]
        PROFILE[Profile Edit<br/>Full master data]
    end

    REG --> OTP --> Main
    LOG --> Main
    HOME --> ORG_LIST
    MSG --> CHAT
    SET --> PROFILE
    ORG_LIST --> ORG_DET
    ORG_LIST --> ORG_ADD

    style Auth fill:#ffebee
    style Main fill:#e8f5e9
    style Screens fill:#e3f2fd
```

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm test

# Backend e2e tests
cd backend && npm run test:e2e

# Mobile lint
cd mobile && npm run lint

# Type checking (both)
cd backend && npx tsc --noEmit
cd mobile && npx tsc --noEmit
```

---

## 📄 License

Private — All rights reserved.

---

<p align="center">
  <strong>IDGate</strong> — Your Identity, Your Control 🔐
</p> (Identification Gate)

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
