# ShikshaSetu AI - Deployment Guide

> **Current Live Website**: [https://shikshasetu-ai-iota.vercel.app](https://shikshasetu-ai-iota.vercel.app)

---

## 1. Vercel Deployment (Unified Fullstack - Default & Recommended)

ShikshaSetu AI is designed to deploy to **Vercel** out-of-the-box with **zero architectural modifications**.

### How it Works:
- The Next.js 16 App Router hosts both the React UI and all `/api/v1` serverless route handlers.
- Vercel automatically deploys each `/api/v1/...` route as an optimized serverless function.
- The centralized API client (`src/services/apiClient.ts`) uses relative paths (`/api/v1`) by default, meaning:
  - Zero CORS configuration is required.
  - No secondary server or domain hosting is needed.
  - Zero cold starts between frontend and backend.

### To Deploy on Vercel:
1. Push your changes to your Git repository connected to Vercel:
   ```bash
   git add .
   git commit -m "Organize into frontend, backend, api, database, shared packages"
   git push origin main
   ```
2. In the Vercel Project Dashboard:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (Default)
   - **Build Command**: `next build` (Default)
   - **Output Directory**: `.next` (Default)
3. Set the Environment Variables in Vercel (**Settings** -> **Environment Variables**):
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
4. Click **Redeploy**. Your live site at `https://shikshasetu-ai-iota.vercel.app` is preserved and updated with full `/api/v1` support!

---

## 2. Standalone Backend Deployment (Decoupled Mode)

If you prefer to host the Node.js Express backend independently on **Render**, **Railway**, or **Docker**:

### Deploying `apps/backend` on Render or Railway:
1. Set the **Root Directory** to `apps/backend` (or run from root with command `npm run dev:backend`).
2. Build Command: `npm install`
3. Start Command: `npx tsx src/server.ts`
4. Set Environment Variables:
   ```env
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://shikshasetu-ai-iota.vercel.app
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. In your Vercel Frontend environment variables, configure:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
   ```

---

## 3. Database Persistence in Production

The local demo store uses `data/shikshasetu_store.json`. Because serverless lambdas recycle disk writes, for multi-school production:
1. Provision a PostgreSQL database on **Neon** or **Supabase**.
2. Run the migration scripts:
   ```bash
   psql $DATABASE_URL -f database/migrations/001_initial_schema.sql
   psql $DATABASE_URL -f database/migrations/002_add_indexes.sql
   psql $DATABASE_URL -f database/seeds/001_seed_data.sql
   ```
3. Add `DATABASE_URL` to Vercel environment variables:
   ```env
   DATABASE_URL=postgres://user:password@hostname:5432/shikshasetu_db?sslmode=require
   ```
