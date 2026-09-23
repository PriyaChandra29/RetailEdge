# RetailEdge Operations Dashboard

A privacy-first, edge-AI retail operations dashboard by **1008 A-Rise** — live store overview, customer density, zone occupancy, inventory health, checkout queues, edge devices, and connected CCTV feeds.

## Tech stack

- **Frontend:** React (TanStack Start) + Tailwind CSS
- **Backend (planned):** Django REST API — see integration notes below

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The dashboard runs fully on built-in demo data until a backend is connected.

## Connecting the Django backend

1. Create a `.env` file in the project root (see `.env.example`):
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
2. Implement these endpoints in Django:
   - `GET /api/dashboard/?window=<1h|4h|24h>` — returns metrics, zones, alerts, inventory, queue lanes and edge devices
   - `POST /api/alerts/<id>/acknowledge/` — acknowledges an alert

Until the backend responds, the dashboard automatically falls back to demo data, so the page never breaks.
