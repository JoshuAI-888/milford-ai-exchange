# Milford AI Exchange MVP

A demo-ready internal prompt library, team workspace and prompt collection product for Milford Asset Management.

## What this repo includes

- Next.js App Router web app
- Milford-inspired charcoal/orange/cream theme
- Prompt library pages
- Prompt detail pages with discussion mockup
- Team workspaces
- Prompt collections
- Submit prompt form
- Admin review queue
- Supabase schema and seed scripts
- Vercel deployment instructions

## What is intentionally not included in V1

- Enterprise SSO
- Claude/OpenAI execution inside the app
- RAG/document ingestion
- Bloomberg, Databricks or SharePoint integration
- Complex approval workflow engine
- Production-grade audit dashboard

Those are V2/V3. The MVP proves behaviour: discovery, reuse, ownership, comments and collections.

## Local setup

### 1. Install Node.js

Install the latest LTS version from nodejs.org.

### 2. Clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/milford-ai-exchange.git
cd milford-ai-exchange
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create Supabase project

1. Go to Supabase.
2. Create a new project called `milford-ai-exchange`.
3. Open SQL Editor.
4. Paste and run `supabase/schema.sql`.
5. Paste and run `supabase/seed.sql`.

### 5. Add environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update values from Supabase Project Settings > API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## GitHub setup

```bash
git init
git add .
git commit -m "Initial Milford AI Exchange MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/milford-ai-exchange.git
git push -u origin main
```

## Vercel deployment

1. Go to Vercel.
2. Click Add New Project.
3. Import the GitHub repo.
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy.
6. After deployment, open the Vercel URL.

## Recommended demo story

Do not demo this as a website. Demo it as a behaviour change.

1. Open dashboard.
2. Search for an earnings prompt.
3. Open the prompt detail page.
4. Show governance metadata: owner, risk, model, version.
5. Show comments and improvement discussion.
6. Open the Investment Committee Pack collection.
7. Explain how individual prompt use becomes reusable Milford IP.
8. Open Team Workspace to show ownership.
9. Open Admin Queue to show controlled publishing.

## Production hardening backlog

- Entra ID SSO
- Proper role-based access checks in middleware
- Admin-only mutations
- Immutable audit log
- Full Supabase CRUD wiring for all pages
- Search using Supabase/Postgres full-text search
- Prompt diff/version compare
- Email notification for review queue
- Model execution through controlled backend
- Microsoft Purview labels / DLP
