# Aurelia Retreat

A full-stack retreat booking and inquiry platform built with Next.js, featuring an AI-powered chat assistant and a lead management system.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Groq](https://img.shields.io/badge/AI-Groq-F55036?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Overview

Aurelia Retreat is a modern web application for a wellness/retreat business. It combines a marketing site with an AI concierge chat assistant powered by Groq, and a backend system for capturing and managing booking leads.

## Features

- 🤖 **AI Chat Assistant** — Groq-powered conversational assistant that answers visitor questions using a curated knowledge base
- 📋 **Lead Management** — Capture and store booking inquiries via a dedicated API and database
- 🎨 **Modern UI** — Built with Tailwind CSS and shadcn/ui components
- 🗄️ **Type-safe Database Access** — Prisma ORM with PostgreSQL
- ⚡ **Fast & Scalable** — Built on Next.js App Router with serverless API routes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Database | PostgreSQL |
| ORM | [Prisma](https://www.prisma.io/) |
| AI | [Groq](https://groq.com/) |
| Validation | Zod |

## Project Structure

```
aurelia-retreat/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chat assistant endpoint
│   │   └── leads/         # Lead capture endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── aurelia/           # Custom app components
│   │   ├── booking-form.tsx
│   │   ├── cursor.tsx
│   │   └── retreat-site.tsx
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── aurelia-knowledge.ts  # Knowledge base for the chat assistant
│   ├── db.ts                 # Prisma client instance
│   ├── retrieval.ts          # Retrieval logic for chat context
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── public/
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))
- A [Groq API key](https://console.groq.com/)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SufyTech/aurelia-retreat-app.git
   cd aurelia-retreat-app
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables

   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   pnpm dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GROQ_API_KEY` | API key for Groq's chat completion service |

See `.env.example` for the full list.

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/chat` | `POST` | Sends a message to the AI assistant and returns a response |
| `/api/leads` | `POST` | Submits a new booking/inquiry lead |

## Database

This project uses Prisma to manage the PostgreSQL schema and migrations.

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

## Deployment

This project is designed to deploy easily on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository into Vercel
3. Add your environment variables in the Vercel project settings
4. Run `npx prisma migrate deploy` against your production database
5. Deploy 🚀

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or issue.

## License

This project is licensed under the MIT License.
