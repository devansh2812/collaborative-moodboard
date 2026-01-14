# Collaborative Moodboard (PostgreSQL + React)

A polished end-to-end demo: draggable moodboard with live search, Postgres full-text + vector similarity (pgvector), and a motion-first UI.

## Stack
- Backend: Fastify (TypeScript), `pg`, `zod`, `pgvector` (via Postgres extension)
- Frontend: React + Vite + TypeScript, TailwindCSS, Framer Motion, React Query
- Database: PostgreSQL 15+ with `pgvector`, `pg_trgm`

## Quick start

### 1) Database
1. Create a database and enable extensions:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   ```
2. Apply schema and seed:
   ```bash
   psql "$DATABASE_URL" -f schema.sql
   ```

### 2) Backend
```bash
cd server
npm install
cp .env.example .env   # set DATABASE_URL
npm run dev             # starts on http://localhost:4000
```

### 3) Frontend
```bash
cd web
npm install
npm run dev             # starts on http://localhost:5173
```

## API (summary)
- `GET /boards` – list boards
- `POST /boards` – create board
- `GET /boards/:id` – board detail + items
- `POST /boards/:id/items` – add item (image/link/color/note)
- `PATCH /boards/:id/items/:itemId` – update position/attributes
- `GET /search?q=...&boardId=...` – mixed full-text + vector similarity

## Notes on vector search
- Embeddings are stored in `vector(64)`. The sample backend uses a deterministic hash-based embedding for offline demos; swap in your preferred model (OpenAI, Jina, etc.) and keep the same column shape.

## UI highlights
- Drag-and-drop board items with springy motion
- Gradient “vibe” header with live search suggestions
- Contextual action bar per item (pin/duplicate/delete hooks)
- Responsive layout and dark-ready palette (Tailwind configurable)

## Scripts
- Backend: `npm run dev`, `npm run build`, `npm run start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Testing
- Backend: `npm run lint` (tsc) and lightweight route contracts via `zod`
- Frontend: `npm run lint` (tsc) and manual flows (drag, search, create)

Enjoy building and tweaking the vibes. If you swap in a real embedding service, keep vector length 64 or adjust the schema and similarity queries accordingly.

