# Beginner deployment guide

## Part A — Accounts you need

Create accounts for:

1. GitHub
2. Supabase
3. Vercel

Use your work email only if Milford approves. For a private concept demo, use a private GitHub repo.

## Part B — Supabase

1. Open Supabase.
2. Create a new project.
3. Name it `milford-ai-exchange`.
4. Choose a secure password and save it.
5. Wait until the project is ready.
6. Go to SQL Editor.
7. Open this repo file: `supabase/schema.sql`.
8. Copy all text.
9. Paste into Supabase SQL Editor.
10. Click Run.
11. Open this repo file: `supabase/seed.sql`.
12. Copy all text.
13. Paste into Supabase SQL Editor.
14. Click Run.

## Part C — Get Supabase keys

1. In Supabase, go to Project Settings.
2. Click API.
3. Copy Project URL.
4. Copy anon public key.

## Part D — Local run

1. Open Terminal.
2. Go into the repo folder.
3. Run:

```bash
npm install
```

4. Create `.env.local` from `.env.local.example`.
5. Paste your Supabase URL and anon key.
6. Run:

```bash
npm run dev
```

7. Open browser at:

```text
http://localhost:3000
```

## Part E — Push to GitHub

```bash
git init
git add .
git commit -m "Initial Milford AI Exchange MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/milford-ai-exchange.git
git push -u origin main
```

If you get `remote origin already exists`, run:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/milford-ai-exchange.git
git push -u origin main
```

## Part F — Vercel

1. Open Vercel.
2. Click Add New Project.
3. Import your GitHub repo.
4. In Environment Variables, add:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

5. Click Deploy.
6. Open the generated Vercel link.

## Part G — Common errors

### Error: Missing Supabase environment variables

You forgot to add environment variables in `.env.local` or Vercel.

### Error: module not found

Run:

```bash
npm install
```

### Error: Vercel still fails after adding env vars

Redeploy. Vercel needs a fresh deployment after environment variables change.

### App loads but no real database data appears

The current MVP uses local demo data for most pages. The Supabase schema is ready for the next step: wiring CRUD pages to live tables.
