# Omnichannel Finance Dashboard

A single-page dashboard for finance/admin teams to monitor business performance across Shopee, TikTok Shop, and Tokopedia.

**Live URL:** _[add after deploy]_

---

## What I Built

One dashboard page that processes the provided CSV on the client side — no backend, no database.

**Metrics shown:**
- **Net Revenue** — total from completed orders only (not gross)
- **Order Volume** — total transactions across all channels
- **AOV** — average order value from completed orders
- **Success Rate** — % of orders that completed successfully

**Insights:**
- Daily revenue trend chart with date labels
- Market share breakdown per channel (Shopee, TikTok, Tokopedia)
- Automatic anomaly alerts if cancellation rate is high (≥15% warning, ≥25% critical)
- Per-channel health indicator showing success rate and cancellations

**Interactions:**
- Search by order ID
- Filter by sales channel
- Pagination (20 rows per page)

---

## What I Prioritized

Net revenue over gross — cancelled orders don't count as income. Success Rate matters more than just volume. The anomaly section exists because "detect issues early" was explicitly in the requirements.

## What I Intentionally Left Out

- Date range picker — the dataset covers a fixed period, so filtering by date adds complexity without much value here
- Export to CSV/Excel — not relevant for a monitoring dashboard
- User authentication — not part of the task scope
- Backend/API — the task explicitly said no backend needed

## How a User Would Use This Daily

Open the dashboard → check the 4 KPI cards for a quick overview → look at the anomaly section to see if anything needs attention → scroll to the trend chart to spot revenue dips → use the table to investigate specific orders if needed.

---

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charts)
- CSV parsed client-side with native JS

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
