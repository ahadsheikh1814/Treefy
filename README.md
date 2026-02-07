# Treefy

![Treefy Logo](https://treefy-three.vercel.app/tfy.ico)

**All your links. One smart tree.** — Share everything you create with one simple [Treefy](https://treefy-three.vercel.app) link.

A [Linktree](https://linktr.ee)-style app: sign in, claim a username, add links, and get a public profile at `yoursite.com/your_username`.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Clerk** — authentication
- **Prisma** + **PostgreSQL** — users and links
- **Tailwind CSS 4** — styling

## Prerequisites

- Node.js 18+
- PostgreSQL database
- [Clerk](https://clerk.com) account (for auth)

## Getting started

1. **Clone and install**

   ```bash
   git clone https://github.com/ahadsheikh1814/Treefy.git
   cd Treefy
   npm install
   ```

2. **Environment variables**

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   Use your Clerk dashboard and database URL. For production, set `NEXT_PUBLIC_APP_URL` to your deployed URL.

3. **Database**

   ```bash
   npx prisma db push
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server           |
| `npm run build`| Production build           |
| `npm run start`| Start production server    |
| `npm run lint` | Run ESLint                 |
| `npm run db:studio` | Open Prisma Studio   |

## Project structure

- `app/` — App Router pages and layout
  - `page.tsx` — Landing (logged out), claim-username form, or dashboard (logged in)
  - `[username]/page.tsx` — Public profile page
  - `actions.ts` — Server actions (claim username, add/delete links)
  - `api/users/` — Clerk webhook for user sync
- `app/components/` — Navbar, footer, copy button
- `lib/prisma.ts` — Prisma client
- `prisma/schema.prisma` — User and Link models

## Deploy

The app is set up for [Vercel](https://vercel.com). Add the same env vars in the project settings, connect your repo, and deploy.

---

Built with ❤️ by [Ahad Sheikh](https://ahadsheikh.vercel.app).
