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

It's a static site. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell and styles |
| `app.js` | Routing, views and the pledge flow |
| `data.js` | Generated demo data (departments, projects, BOQs, givers) |
| `gen_data.py` | Regenerates `data.js`: `python gen_data.py` |
| `img/` | Department photos |
| `vercel.json` | Hosting settings for Vercel |

## Deploy

Import this repository into Vercel with the framework preset set to **Other** and no build command.
