# Puzzler

Alphabet crossword puzzle game built with Next.js 16, Prisma v7 (SQLite via better-sqlite3 adapter), and Tailwind CSS.

## Dev commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run seed` — seed puzzle data into SQLite
- `npx prisma migrate dev` — run migrations
- `npx prisma generate` — regenerate Prisma client

## Deployment

Deployed via Docker on Coolify. The Dockerfile uses Next.js standalone output mode.
Set `AUTH_SECRET` and `DATABASE_URL` env vars in Coolify.
