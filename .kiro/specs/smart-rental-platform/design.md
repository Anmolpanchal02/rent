# Design Document: Smart Rental Platform

## Overview

The Smart Rental Platform is a full-stack web application that connects property owners with potential tenants through an intuitive, real-time rental marketplace. The platform supports three distinct user roles (Tenant, Owner, Admin) with role-specific dashboards and features. Built on Next.js 14+ with App Router, the system leverages modern React patterns, TypeScript for type safety, and real-time communication via Socket.IO. The architecture emphasizes responsive design, smooth animations, and production-ready performance with image optimization, lazy loading, and code splitting.

The platform enables tenants to browse, filter, and book properties while communicating directly with owners through real-time chat. Property owners can manage listings, handle booking requests, and track performance metrics. Administrators maintain platform integrity by monitoring users, managing properties, and removing spam content. The system integrates external services including Google Maps for location visualization, Cloudinary for image management, and Razorpay for payment processing.

## Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>App Router]
        B[React Components<br/>shadcn/ui + Framer Motion]
        C[Socket.IO Client]
    end
    
    subgraph "Server Layer"
        D[Next.js API Routes]
        E[Authentication Middleware<br/>JWT + bcrypt]
        F[Socket.IO Server]
    end
    
    subgraph "Data Layer"
        G[(MongoDB/PostgreSQL)]
        H[Mongoose/Prisma ORM]
    end
    
    subgraph "External Services"
        I[Cloudinary<br/>Image Storage]
        J[Google Maps API]
        K[Razorpay<br/>Payments]
        L[Email Service]
    end
    
    A --> D
    B --> A
    C --> F
    D --> E
    D --> H
    F --> H
    H --> G
    D --> I
    D --> J
    D --> K
    D --> L
    
    style A fill:#3b82f6
    style D fill:#8b5cf6
    style G fill:#10b981
```

## Main Algorithm/Workflow

### User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (Next.js)
    participant M as Auth Middleware
    participant A as API Route
    participant DB as Database
    
    U->>C: Access protected route
    C->>M: Check authentication
    M->>M: Verify JWT token
    alt Token valid
        M->>A: Allow request
        A->>DB: Fetch user data
        DB-->>A: Return user
        A-->>C: Render page
        C-->>U: Show content
    else Token invalid/missing
        M-->>C: Redirect to /login
        C-->>U: Show login page
    end
```

### Property Booking Flow

```mermaid
sequenceDiagram
    participant T as Tenant
    participant C as Client
    participant API as API Routes
    participant DB as Database
    participant S as Socket.IO
    participant O as Owner
    
    T->>C: Click "Book Property"
    C->>API: POST /api/bookings
    API->>DB: Create booking request
    DB-->>API: Booking created
    API->>S: Emit booking notification
    S-->>O: Real-time notification
    API-->>C: Booking confirmed
    C-->>T: Show confirmation
    O->>C: View booking request
    O->>API: Accept/Reject booking
    API->>DB: Update booking status
    API->>S: Emit status update
    S-->>T: Real-time status update
```

### Real-Time Chat Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant C1 as Client 1
    participant S as Socket.IO Server
    participant DB as Database
    participant C2 as Client 2
    participant U2 as User 2
    
    U1->>C1: Send message
    C1->>S: socket.emit('message')
    S->>DB: Save message
    DB-->>S: Message saved
    S->>C2: socket.emit('message')
    C2-->>U2: Display message
    S-->>C1: Delivery confirmation
    
    U2->>C2: Start typing
    C2->>S: socket.emit('typing')
    S->>C1: socket.emit('typing')
    C1-->>U1: Show typing indicator
