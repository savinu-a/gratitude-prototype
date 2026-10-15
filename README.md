# Gratitude: concept prototype

A clickable prototype of **Gratitude**, a giving platform proposed as part of the EXMO 2027 "Transform the Campus" pillar for the University of Moratuwa.

> Concept only. Not an official University of Moratuwa website. All projects, figures and names are hypothetical. Department photos are from EXMO 2023.

## What's inside

- Campaign home with total cost, pledges and the Board of Trustees
- 10 Faculty of Engineering department pages
- 35 project pages, each with an itemised bill of quantities (BOQ)
- Legacy: completed facilities with final cost, impact and a digital plaque
- Wall of Gratitude: every gift by name and amount, with filters and leaderboards
- BOQ index, leadership, governance and FAQ
- A demo pledge flow with a certificate (no payment is taken)

## Run locally

Built with Next.js (App Router) and TypeScript. Every page is statically generated.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

| Path | Purpose |
|---|---|
| `app/` | Routes: `/`, `/departments/[id]`, `/projects/[id]`, `/legacy`, `/wall`, `/boq`, `/leadership`, `/governance`, `/pledge/[id]` |
| `components/views/` | One component per page |
| `components/ui.tsx` | Shared pieces: cards, ledger rows, plaque, board, tiers |
| `components/store.tsx` | In-memory demo state: pledges made this visit, wall filters, pledge form |
| `lib/data.ts` | Types, lookups and formatting helpers |
| `lib/gratitude.json` | Generated demo data (departments, projects, BOQs, givers) |
| `gen_data.py` | Regenerates the data: `npm run data` |
| `public/img/` | Department photos |

## Deploy

Import this repository into Vercel. It is detected as a Next.js project, with no extra settings needed.
