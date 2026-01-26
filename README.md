# 🔐 Universal Auth Backend

<div align="center">

**Production-ready, open-source authentication server for any application**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [API](#-api-endpoints) • [Architecture](#-architecture) • [Security](#-security)

</div>

---

## 🎯 What is This?

**Universal Auth Backend** is a **plug-and-play authentication server** that you can self-host and integrate with any frontend (React, Vue, mobile apps) or backend application. Instead of building auth from scratch every time, deploy this once and connect all your apps to it.

### Use Cases

| Scenario | How This Helps |
|----------|----------------|
| 🏢 **SaaS Product** | Handle user registration, login, and permissions |
| 📱 **Mobile App** | JWT tokens for stateless authentication |
| 🌐 **Microservices** | Central auth service for all your services |
| 🎓 **Learning** | Study production-grade auth implementation |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 **JWT Authentication** | Access + refresh token flow with automatic rotation |
| 🌐 **Social Login** | Google and GitHub OAuth 2.0 integration |
| 👥 **RBAC** | Flexible role-based access control with granular permissions |
| 🛡️ **Security First** | Argon2 hashing, rate limiting, brute force protection |
| 📝 **API Docs** | Interactive Swagger/OpenAPI documentation |
| 🐳 **Docker Ready** | One-command deployment with Docker Compose |
| 🧪 **Type Safe** | Full TypeScript coverage with Zod validation |
| 📦 **Clean Architecture** | Controllers → Services → Repositories pattern |
| 🔌 **Easy Integration** | RESTful API works with any client |

---

## 🏗️ Architecture

### High-Level Overview

```mermaid
graph TB
    subgraph "Client Applications"
        WEB[Web App]
        MOBILE[Mobile App]
        API_CLIENT[API Client]
    end
    
    subgraph "Universal Auth Backend"
        GATEWAY[API Gateway / Rate Limiter]
        
        subgraph "API Layer"
            AUTH_CTRL[Auth Controller]
            OAUTH_CTRL[OAuth Controller]
            USER_CTRL[User Controller]
            ROLE_CTRL[Role Controller]
        end
        
        subgraph "Service Layer"
            AUTH_SVC[Auth Service]
            OAUTH_SVC[OAuth Service]
            TOKEN_SVC[Token Service]
            USER_SVC[User Service]
            RBAC_SVC[RBAC Service]
        end
        
        subgraph "Middleware"
            AUTH_MW[Auth Middleware]
            RBAC_MW[Permission Guard]
            VALIDATE_MW[Validation]
        end
    end
    
    subgraph "Data Stores"
        PG[(PostgreSQL)]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    API_CLIENT --> GATEWAY
    
    GATEWAY --> AUTH_CTRL
    GATEWAY --> USER_CTRL
    GATEWAY --> ROLE_CTRL
    
    AUTH_CTRL --> AUTH_SVC
    AUTH_CTRL --> TOKEN_SVC
    USER_CTRL --> USER_SVC
    ROLE_CTRL --> RBAC_SVC
    
    AUTH_SVC --> PG
    TOKEN_SVC --> PG
    RBAC_SVC --> PG
```

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Clean Architecture** | Controllers → Services → Repositories pattern |
| **Stateless Design** | JWT-based, no server-side sessions |
| **Database Agnostic** | Repository pattern allows swapping databases |
| **Configurable** | All settings via environment variables |

---

## 💾 Database Schema

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        boolean is_active
        boolean is_verified
        timestamp created_at
    }
    
    roles {
        uuid id PK
        varchar name UK
        varchar description
        boolean is_system
    }
    
    permissions {
        uuid id PK
        varchar name UK
        varchar resource
        varchar action
    }
    
    user_roles {
        uuid user_id FK
        uuid role_id FK
    }
    
    role_permissions {
        uuid role_id FK
        uuid permission_id FK
    }
    
    refresh_tokens {
        uuid id PK
        uuid user_id FK
        varchar token_hash UK
        boolean is_revoked
        timestamp expires_at
    }
    
    accounts {
        uuid id PK
        uuid user_id FK
        varchar provider
        varchar provider_account_id
        varchar type
    }
    
    users ||--o{ user_roles : has
    roles ||--o{ user_roles : assigned_to
    roles ||--o{ role_permissions : has
    permissions ||--o{ role_permissions : assigned_to
    users ||--o{ refresh_tokens : has
    users ||--o{ accounts : owns
```

### Default Roles

| Role | Permissions |
|------|-------------|
| `admin` | `*:*` (full access) |
| `moderator` | `user:read`, `user:update`, `role:read` |
| `user` | `profile:read`, `profile:update` |

---

## 🔄 Authentication Flow

### Login Flow
```
┌─────────┐     ┌─────────────────┐     ┌──────────────┐     ┌──────────┐
│ Client  │     │ Auth Controller │     │ Auth Service │     │ Database │
└────┬────┘     └───────┬─────────┘     └──────┬───────┘     └────┬─────┘
     │                  │                      │                  │
     │ POST /login      │                      │                  │
     │ {email,password} │                      │                  │
     │─────────────────>│                      │                  │
     │                  │ validate & login     │                  │
     │                  │─────────────────────>│                  │
     │                  │                      │ findUser         │
     │                  │                      │─────────────────>│
     │                  │                      │<─────────────────│
     │                  │                      │                  │
     │                  │                      │ verifyPassword   │
     │                  │                      │ (Argon2)         │
     │                  │                      │                  │
     │                  │                      │ generateTokens   │
     │                  │                      │─────────────────>│
     │                  │<─────────────────────│<─────────────────│
     │                  │                      │                  │
     │ 200 + tokens     │                      │                  │
     │<─────────────────│                      │                  │
```

### Token Refresh Flow
```
┌─────────┐     ┌─────────────────┐     ┌──────────────┐     ┌──────────┐
│ Client  │     │ Auth Controller │     │Token Service │     │ Database │
└────┬────┘     └───────┬─────────┘     └──────┬───────┘     └────┬─────┘
     │                  │                      │                  │
     │ POST /refresh    │                      │                  │
     │ {refreshToken}   │                      │                  │
     │─────────────────>│                      │                  │
     │                  │ refreshTokens        │                  │
     │                  │─────────────────────>│                  │
     │                  │                      │ validateToken    │
     │                  │                      │─────────────────>│
     │                  │                      │<─────────────────│
     │                  │                      │                  │
     │                  │                      │ revokeOldToken   │
     │                  │                      │ generateNewPair  │
     │                  │                      │─────────────────>│
     │                  │<─────────────────────│<─────────────────│
     │                  │                      │                  │
     │ 200 + newTokens  │                      │                  │
     │<─────────────────│                      │                  │
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+ (or Docker)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/kursat-dev/Universal-Authentication-Backend.git
cd Universal-Authhentication-Backend

# Copy environment file
cp .env.example .env

# Start everything
docker compose up -d

# API: http://localhost:3000
# Docs: http://localhost:3000/api-docs
```

### Option 2: Local Development

```bash
# Clone and install
git clone https://github.com/kursat-dev/Universal-Authentication-Backend.git
cd Universal-authentication-Backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login | ❌ |
| `POST` | `/api/v1/auth/refresh` | Refresh tokens | ❌ |
| `POST` | `/api/v1/auth/logout` | Logout | ❌ |
| `POST` | `/api/v1/auth/logout-all` | Logout all devices | ✅ |
| `POST` | `/api/v1/auth/forgot-password` | Request reset | ❌ |
| `POST` | `/api/v1/auth/reset-password` | Reset password | ❌ |
| `GET` | `/api/v1/auth/:provider` | Redirect to OAuth | ❌ |
| `POST` | `/api/v1/auth/:provider/callback` | OAuth Callback | ❌ |

### Users

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET` | `/api/v1/users/me` | Get current user | Authenticated |
| `PATCH` | `/api/v1/users/me` | Update profile | Authenticated |
| `GET` | `/api/v1/users` | List all users | `user:read` |
| `POST` | `/api/v1/users` | Create user | `user:create` |
| `PATCH` | `/api/v1/users/:id` | Update user | `user:update` |
| `DELETE` | `/api/v1/users/:id` | Delete user | `user:delete` |

### Roles & Permissions

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET` | `/api/v1/roles` | List roles | `role:read` |
| `POST` | `/api/v1/roles` | Create role | `role:create` |
| `GET` | `/api/v1/permissions` | List permissions | `role:read` |

---

## 📋 Request/Response Examples

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecureP@ss123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["user"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
      "expiresIn": 900
    }
  }
}
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecureP@ss123"
  }'
```

### Access Protected Route
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>"
```

---

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | Argon2id (PHC winner) |
| **Access Tokens** | JWT, 15 min lifetime |
| **Refresh Tokens** | Hashed in DB, 7 day lifetime, rotated on use |
| **Rate Limiting** | 5 auth attempts / 15 min |
| **Brute Force** | Account lockout after 10 failed attempts |
| **Input Validation** | Zod schema validation |
| **Security Headers** | Helmet.js with CSP |

---

## ⚙️ Configuration

All settings via `.env`:

```env
# Core
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Rate Limiting
AUTH_RATE_LIMIT_MAX_REQUESTS=5
MAX_LOGIN_ATTEMPTS=10
```

---

## 👤 Default Admin

After seeding:

| Field | Value |
|-------|-------|
| Email | `admin@example.com` |
| Password | `Admin@123456` |

> ⚠️ **Change password in production!**

---

## 📁 Project Structure

```
src/
├── config/          # Environment configuration
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── middleware/      # Auth, validation, rate limiting
├── schemas/         # Zod validation schemas
├── types/           # TypeScript definitions
├── routes/          # API routes
├── utils/           # Helpers (logger, crypto, errors)
└── docs/            # Swagger spec
```

---

## 🔌 Integration Examples

### React/Next.js
```typescript
// Login and store tokens
const login = async (email: string, password: string) => {
  const res = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const { data } = await res.json();
  localStorage.setItem('accessToken', data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.tokens.refreshToken);
};

// Use access token for API calls
const fetchUser = async () => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('http://localhost:3000/api/v1/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
```

### Mobile App (React Native / Flutter)
Same pattern - store tokens securely and send in Authorization header.

---

## 🚀 Deployment

### Vercel/Railway/Render

1. Push to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Add PostgreSQL addon
5. Deploy!

### Self-Hosted (VPS)

```bash
# Build production
npm run build

# Start with PM2
pm2 start dist/server.js --name auth-api
```

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/kursata_destek`)
3. Commit changes (`git commit -m 'Add Kürşat'a Destek ☺️'`)
4. Push to branch (`git push origin feature/kursata_destek`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Built with ❤️ for the open-source community

</div>
