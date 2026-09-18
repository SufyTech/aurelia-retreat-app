# Aurelia Retreat — Backend Setup

This project now has a real backend: an AI concierge grounded in an actual knowledge base (not canned replies), and a real Postgres database that stores booking inquiries. Here's how to get both running.

## What you're setting up

1. **Groq API key** — powers the "Ask Aurelia" concierge's actual answers (free tier, no credit card needed)
2. **A free Postgres database** (via Supabase) — stores booking form submissions and concierge conversation logs

Both are required for the site to work correctly. Without them, the concierge falls back to a polite "please try again" message instead of crashing, but you won't see the real AI or the real database in action.

## Step 1 — Get a Groq API key

1. Go to https://console.groq.com and sign up / log in (no credit card required)
2. Go to **API Keys** and create a new key
3. Copy it immediately — you won't be able to see it again after leaving the page — and paste it into `.env` in Step 3

Groq's free tier covers this demo comfortably. The concierge uses `llama-3.3-70b-versatile`, a strong general-purpose model that runs on Groq's fast inference hardware.

## Step 2 — Create a free Postgres database (Supabase)

1. Go to https://supabase.com and sign up / log in (free tier is enough)
2. Click **New Project**, give it any name, choose a region close to you, and set a database password (save this password somewhere)
3. Once the project finishes provisioning, go to **Project Settings → Database**
4. Under **Connection string**, copy the **URI** format connection string (it looks like `postgresql://postgres:[YOUR-PASSWORD]@...supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` in that string with the database password you set in step 2

## Step 3 — Set up your environment file

In the project root:

```
cp .env.example .env
```

Open `.env` and fill in:

```
GROQ_API_KEY=gsk_...                (from Step 1)
DATABASE_URL=postgresql://...       (from Step 2)
ADMIN_KEY=choose-any-random-string  (you make this up yourself)
```

## Step 4 — Create the database tables

```
npx prisma migrate dev --name init
```

This reads `prisma/schema.prisma` and creates the actual tables (`BookingLead`, `ConciergeMessage`) in your Supabase database. You should see confirmation output and no errors.

If you want a visual browser for your database at any point, run `npx prisma studio` — it opens a local web UI where you can see every row in your tables.

## Step 5 — Run it

```
npm install
npm run dev
```

Open http://localhost:3000, then test both systems:

- **Concierge:** open "Ask Aurelia" and ask something like "What's included in the Wellness Pavilion?" — you should get a real, generated answer grounded in the knowledge base, not the old canned response.
- **Booking form:** scroll to the "Begin here" section at the bottom, fill in the form, and submit. Then visit `http://localhost:3000/api/leads?key=YOUR_ADMIN_KEY` in your browser (using the ADMIN_KEY you set) — you should see your submission as JSON.

## Extending the knowledge base

To teach the concierge new facts, open `lib/aurelia-knowledge.ts` and add a new entry to the array — one topic per entry, kept focused. No code changes needed elsewhere; retrieval automatically picks up new entries.

## Deploying to Vercel

When you deploy, add the same three environment variables (`GROQ_API_KEY`, `DATABASE_URL`, `ADMIN_KEY`) in your Vercel project's **Settings → Environment Variables** — `.env` files are never uploaded/read in production, Vercel needs them set there directly.

## A known limitation, stated honestly

The concierge's retrieval (matching a guest's question to the right knowledge base entry) uses TF-IDF keyword-overlap search rather than true semantic embeddings. This is a deliberate, defensible tradeoff for a knowledge base this small — it needs no extra API calls or cost, and testing confirms it correctly retrieves the right topic for realistic guest questions and correctly returns "no match" for off-topic questions (try asking it something unrelated to the hotel — it should decline rather than make something up). If the knowledge base grows much larger (50+ topics), swapping in real vector embeddings would be the next upgrade — `lib/retrieval.ts` is written so that swap wouldn't require changing any other file.

There's currently no wifi/internet entry in `lib/aurelia-knowledge.ts`, so a guest asking about wifi will get the honest "I don't have that on hand, please contact the team" fallback rather than a made-up answer. Add a real entry for it (with your actual wifi details) in the knowledge base file whenever you have that info.
