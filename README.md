# Mabrur.ai

Pendamping Digital Haji & Umrah - PWA untuk manajemen perjalanan ibadah.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Prisma + MySQL
- JWT Authentication

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MySQL connection

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed

# Run development server
npm run dev
```

## Default Credentials

**Admin:**
- Email: admin@mabrur.ai
- Password: admin123

**Sample Jamaah:**
- Token: DEMO1234

## Project Structure

```
app/
├── (jamaah)/jamaah/     # Jamaah pages
│   ├── page.tsx         # Token entry
│   ├── dashboard/       # Status dashboard
│   └── chat/            # AI chatbot
├── (admin)/admin/       # Admin pages
│   ├── login/           # Admin login
│   ├── dashboard/       # Overview stats
│   ├── jamaah/          # Jamaah management
│   └── content/         # Chatbot content CRUD
├── api/                 # API routes
│   ├── jamaah/          # Jamaah APIs
│   ├── admin/           # Admin APIs
│   └── chatbot/         # Chatbot API
└── page.tsx             # Landing page

lib/
├── db.ts                # Prisma client
└── auth.ts              # JWT auth helpers

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Sample data
```

## Features

### Jamaah
- Token-based access (no complex login)
- Status dashboard with color indicators
- AI chatbot for FAQ & ibadah info

### Admin
- Secure login
- Dashboard with stats overview
- Jamaah CRUD & status management
- Chatbot content management

## Status Colors

- 🟢 Green = Completed
- 🟡 Yellow = In Progress
- 🔴 Red = Not Started
