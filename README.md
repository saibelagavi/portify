# Portify — Portfolio for the Next Generation

A stunning, glassmorphism-dark portfolio builder for Gen Z creators. Build, showcase, and share your skills and projects with a unique public URL.

## Features

- **Landing Page** — Aurora gradient hero, animated roles, feature showcase, marquee gallery
- **Auth** — Sign up / Sign in via Supabase Auth (email + password)
- **Profile Editor** — Avatar upload, bio, social links (GitHub, LinkedIn, Twitter, Instagram, YouTube, Dribbble)
- **Portfolio Builder** — Add/edit/delete:
  - Skills with categories and proficiency levels (1–5)
  - Projects with tech stack tags, GitHub/live URLs, featured flag
  - Work Experience with timeline view
  - Education entries
- **Public Portfolio** — Shareable at `/u/[username]` — beautiful dark glassmorphism layout

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth + DB**: Supabase (Postgres + Storage)
- **Styling**: Tailwind CSS + custom glassmorphism CSS
- **Fonts**: Syne (display) + DM Sans (body)
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo>
cd portify
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **anon public key** from:
   - Settings → API → Project URL
   - Settings → API → Project API keys → `anon public`

### 3. Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor → New query**
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Click **Run**

This creates all tables, RLS policies, triggers, and the storage bucket.

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL, e.g. `https://portify.vercel.app`)
4. Deploy!

### Supabase Auth Redirect URLs

In Supabase → Authentication → URL Configuration, add your Vercel URL to **Redirect URLs**:

```
https://your-app.vercel.app/**
```

---

## Project Structure

```
portify/
├── app/
│   ├── (auth)/           # Sign in / Sign up pages
│   ├── (dashboard)/      # Protected dashboard, profile, builder
│   ├── u/[username]/     # Public portfolio pages
│   ├── actions/          # Server actions (auth + portfolio CRUD)
│   ├── globals.css       # Global styles, CSS variables, glass utilities
│   └── layout.tsx        # Root layout with fonts + Toaster
├── components/
│   ├── landing/          # Hero, Navbar, Features, HowItWorks, etc.
│   ├── dashboard/        # DashboardNav, ProfileForm
│   ├── builder/          # PortfolioBuilder + section editors
│   └── public/           # PublicPortfolio component
├── lib/
│   ├── supabase/         # Client + server Supabase clients
│   └── utils.ts          # Helpers: cn, formatDate, getInitials
├── types/index.ts        # TypeScript types for all entities
├── middleware.ts          # Auth route protection
└── supabase/schema.sql   # Full database schema
```

---

## Customization

- **Colors**: Edit CSS variables in `app/globals.css`
- **Fonts**: Swap fonts in `app/layout.tsx` (currently Syne + DM Sans)
- **Portfolio URL**: Currently `/u/[username]` — change in `app/u/[username]/page.tsx`
- **Skill categories**: Edit `SKILL_CATEGORIES` in `lib/utils.ts`
