<div align="center">

# 🌍 GlobeTrotter

### Your Intelligent, End-to-End Travel Companion

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=14B8A6&center=true&vCenter=true&width=600&lines=AI-Powered+Itineraries...;Real-Time+Expense+Variance...;Intelligent+Travel+Health+Advisories...;Dual-Theme+Journal+%26+Glass+UI..." alt="Typing SVG" />

<p>
An intelligent, offline-first travel planning platform that transcends static itinerary builders —
generating multi-city trips with AI, tracking live budget variance, grading trip readiness,
and predicting health &amp; packing needs based on destination climate and medical risk.
</p>

<br/>

[![React](https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![SQLite](https://img.shields.io/badge/SQLite-Database-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini API](https://img.shields.io/badge/Gemini_1.5_Flash-AI_Engine-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#license)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](#)

<br/>

<img src="https://img.shields.io/badge/Theme-Terracotta%20%26%20Cream-D97B4F?style=flat-square" />
<img src="https://img.shields.io/badge/Theme-Obsidian%20Glass-0B0F19?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml" />
<img src="https://img.shields.io/badge/Offline--First-localStorage%20%2B%20SQLite-14B8A6?style=flat-square" />

</div>

---

## ✨ Overview

GlobeTrotter isn't a form that saves rows to a database — it's a **proactive AI travel assistant**. Tell it where, when, and how much, and it builds a day-by-day itinerary, tracks every rupee/dollar/euro against your plan in real time, scores how "ready" your trip actually is, and tells you what to pack and what to worry about medically before you land.

Built for speed, resilience, and delight: **optimistic offline-first state**, a **theming engine that flips instantly** between a warm terracotta travel-journal look and a deep glassmorphic obsidian mode, and an **AI pipeline with a bulletproof mock fallback** so the app never breaks a demo.

<br/>

## 🧭 Table of Contents

- [Feature Showcase](#-feature-showcase)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture--project-structure)
- [Quickstart](#-quickstart--local-development)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Theming Engine](#-theming-engine)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Feature Showcase

### 🎨 Dual-Theme Aesthetic Engine

| Mode | Canvas | Surface | Character |
|---|---|---|---|
| ☀️ **Light — Travel Journal** | `#FAF7F5` warm cream | Solid cards, soft shadows | High-contrast terracotta & teal accents, editorial feel |
| 🌑 **Dark — Obsidian Glass** | `#0B0F19` deep obsidian | Frosted glassmorphism, `backdrop-blur` | Cyan/indigo ambient neon glow, translucent slate cards |

A single root-level class toggle (`dark-theme` / `light-theme` on `<html>`) flips an entire CSS-variable design-token system (`--surface`, `--text-primary`, `--glass-border`, …) — **zero flash, zero class conflicts, mathematically instant.**

<br/>

### 🏠 Interactive Dashboard

- 👋 Dynamic greeting — *"Wanderlust calls..."*
- 🎯 Editable **Annual Budget gauge** — target goal, live spend %, color-coded thresholds (green → amber → red)
- 🎠 Recent trips carousel with live status badges — `Upcoming` · `Completed` · `Past`
- 🗑️ Safety-confirmed trip deletion with instant global state sync

<br/>

### 🗺️ Smart Itinerary & Trip Editor

- **Multi-stop timeline** — connected day nodes, grouped into Morning / Afternoon / Evening
- **Booking lifecycle tracker** on every activity:

  `Idea` 🟡 → `Planned` 🔵 → `Booked` 🟣 → `Confirmed` 🟢

- **Composite Trip Health Score** (0–100 circular gauge):

  | Weight | Factor |
  |---|---|
  | 40% | Booking Rate |
  | 40% | Budget Adherence |
  | 20% | Pace Safety |

  `> 90` → 🟢 *Ready for Takeoff* · `< 70` → 🔴 *Needs Attention*

<br/>

### 💳 Planned vs. Actual Budget Engine

- Itemized expense manager, multi-currency (`₹ $ € £`)
- **Live variance engine** — `Planned − Actual` per item, with over-budget day alerts
- Color-shifting progress bars (green → amber → red) as spend approaches the cap
- Inline expense editor + manual "add new expense" on the fly

<br/>

### ✨ AI-Powered Trip Planner (AI Mode)

1. **Input Studio** — Destination, dates, total budget, group type, pace (`Relaxed` / `Balanced` / `Action-Packed`), vibes (`Culture` `Food` `Nature` `Nightlife`)
2. **Structured Prompt Engineering** — backend forces Gemini 1.5 Flash to return a schema-perfect JSON object matching the DB shape
3. **Smart Math** — activity count auto-scales with pace; budget is organically distributed across items
4. **Live animated preview** before saving
5. **Bulletproof Mock Generator** — if the API fails or you're offline, fallback data renders seamlessly. **The app never crashes.**

<br/>

### 📋 Health Advisory & Smart Packing (Prep & Health Tab)

- 🌦️ **Weather & Fabric Intelligence** — climate prediction + fabric recommendations (*"Gore-Tex"* ✅) and warnings (*"avoid heavy denim"* ❌)
- 🎒 **Interactive Smart Packing** — AI checklist + custom item injection, persisted to `localStorage`
- ⚠️ **Medical Alerts** — high-risk contraindications (altitude for cardiac patients, air quality for asthma), endemic risk advisories, vaccine checklist
- 🔄 **On-demand generation** — older trips get an empty state with a **"✨ Generate AI Health Advisory"** button

<br/>

### 🌍 Explore & Estimate

- 25+ curated global cities with high-res photography, cost estimates, rating badges
- Filters: `Trending` · `Budget Friendly` · `Adventure` · `Couples`
- Live-filtering search bar
- **Map Modal Estimator** — pick dates, group size, transport → instant budget estimate
- **"Save & Plan"** — pipes the estimate directly into a formal Dashboard trip

---

## 📸 Screenshots

<div align="center">

| Dashboard | AI Trip Planner |
|:---:|:---:|
| _`docs/screenshots/dashboard-dark.png`_ | _`docs/screenshots/ai-mode.png`_ |
| **Trip Editor — Itinerary** | **Live Budget Tracker** |
| _`docs/screenshots/itinerary-timeline.png`_ | _`docs/screenshots/budget-variance.png`_ |
| **Health & Packing Tab** | **Light Mode — Journal Aesthetic** |
| _`docs/screenshots/prep-health.png`_ | _`docs/screenshots/light-mode.png`_ |

> 📌 *Replace the paths above with real captures/GIFs before publishing. Recommended: 16:9, WebP or GIF ≤ 5MB.*

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (Create React App) |
| **Routing** | `react-router-dom` (SPA navigation) |
| **State Management** | React Context API (`TripsContext.js`) + `localStorage` persistence |
| **Styling** | Vanilla CSS — global design-token system (`variables.css`), no Tailwind |
| **Icons** | `lucide-react` |
| **Server Runtime** | Node.js + Express.js |
| **Database** | SQLite (`database.sqlite`) |
| **AI Engine** | Google Gemini 1.5 Flash API |

</div>

> **Why no Tailwind?** We deliberately stripped it in favor of a raw CSS-variable architecture — it gives us mathematically perfect, instantaneous Light/Dark toggling with zero class-name collisions and full control over the glassmorphism effects.

---

## 🏗️ Architecture & Project Structure

```
globetrotter/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── BudgetGauge.jsx
│   │   │   ├── TripCard.jsx
│   │   │   └── TripsCarousel.jsx
│   │   ├── itinerary/
│   │   │   ├── TimelineView.jsx
│   │   │   ├── DayNode.jsx
│   │   │   ├── ActivityCard.jsx
│   │   │   └── BookingStatusPill.jsx
│   │   ├── budget/
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── VarianceBadge.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── health/
│   │   │   ├── PackingChecklist.jsx
│   │   │   ├── WeatherAdvisory.jsx
│   │   │   └── MedicalAlerts.jsx
│   │   ├── explore/
│   │   │   ├── CityCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── EstimatorModal.jsx
│   │   ├── ai/
│   │   │   ├── InputStudio.jsx
│   │   │   ├── LivePreview.jsx
│   │   │   └── MockGenerator.js
│   │   └── common/
│   │       ├── ThemeToggle.jsx
│   │       ├── HealthScoreGauge.jsx
│   │       └── Navbar.jsx
│   ├── context/
│   │   ├── TripsContext.js
│   │   └── ThemeContext.js
│   ├── services/
│   │   ├── api.js              # Express API client
│   │   ├── geminiService.js    # AI prompt orchestration
│   │   ├── budgetEngine.js     # Variance + forecast math
│   │   └── healthEngine.js     # Climate/medical rule mapping
│   ├── data/
│   │   ├── cities.seed.json
│   │   ├── routes.seed.json
│   │   └── activities.seed.json
│   ├── i18n/
│   │   ├── en.json
│   │   └── index.js
│   ├── styles/
│   │   ├── variables.css       # design tokens (light + dark)
│   │   ├── glassmorphism.css
│   │   └── global.css
│   ├── App.jsx
│   └── index.js
│
├── server/
│   ├── server.js
│   ├── database.js             # SQLite connection + migrations
│   ├── routes/
│   │   ├── trips.routes.js
│   │   ├── budget.routes.js
│   │   ├── travel.routes.js
│   │   └── ai.routes.js
│   └── seed/
│       └── seed.js
│
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quickstart & Local Development

### Prerequisites

- Node.js `>= 18.x`
- npm `>= 9.x`

### 1. Clone the repository

```bash
git clone https://github.com/your-org/globetrotter.git
cd globetrotter
```

### 2. Install dependencies

```bash
# install frontend deps
npm install

# install backend deps
cd server && npm install && cd ..
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then fill in your `.env` — see [Environment Variables](#-environment-variables) below.

### 4. Seed the database

```bash
node server/seed/seed.js
```

### 5. Run the app

```bash
# Terminal 1 — backend (Express + SQLite) on :5000
cd server && npm run dev

# Terminal 2 — frontend (React) on :3000
npm start
```

Visit **`http://localhost:3000`** 🎉

<br/>

<details>
<summary><strong>🧪 Running in fully offline / no-API-key mode</strong></summary>

<br/>

GlobeTrotter is designed to degrade gracefully. If `GEMINI_API_KEY` is missing or the request fails:

- AI Mode automatically routes through `MockGenerator.js`
- A deterministic, schema-valid mock itinerary is generated locally
- The UI shows a subtle "Offline Mode" indicator but **never throws**

This means you can demo the entire app — including "AI" generation — with **zero external API keys**.

</details>

---

## 🔐 Environment Variables

<details>
<summary><strong>Click to expand full <code>.env</code> reference</strong></summary>

<br/>

| Variable | Required | Description | Example |
|---|:---:|---|---|
| `PORT` | ✅ | Express server port | `5000` |
| `DATABASE_PATH` | ✅ | Path to SQLite file | `./database.sqlite` |
| `GEMINI_API_KEY` | ⛔ Optional | Google Gemini 1.5 Flash key — omit to force offline mock mode | `AIza...` |
| `JWT_SECRET` | ✅ | Secret for signing auth tokens | `super-secret-string` |
| `CLIENT_URL` | ✅ | Frontend origin for CORS | `http://localhost:3000` |
| `DEFAULT_CURRENCY` | ⛔ Optional | Default currency symbol | `INR` |

```env
# .env.example
PORT=5000
DATABASE_PATH=./database.sqlite
GEMINI_API_KEY=
JWT_SECRET=change_me_in_production
CLIENT_URL=http://localhost:3000
DEFAULT_CURRENCY=INR
```

</details>

---

## 📡 API Reference

<details>
<summary><strong>🔑 Auth</strong></summary>

<br/>

**`POST /api/auth/signup`**
```json
{ "name": "Aria Kapoor", "email": "aria@example.com", "password": "••••••••" }
```

**`POST /api/auth/login`**
```json
{ "email": "aria@example.com", "password": "••••••••" }
```
**Response**
```json
{ "token": "eyJhbGciOi...", "user": { "id": 12, "name": "Aria Kapoor" } }
```

</details>

<details>
<summary><strong>🧳 Trips</strong></summary>

<br/>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips` | List all trips for authenticated user |
| `POST` | `/api/trips` | Create a new trip |
| `GET` | `/api/trips/:id` | Fetch single trip with stops + activities |
| `PUT` | `/api/trips/:id` | Update trip metadata |
| `DELETE` | `/api/trips/:id` | Delete a trip |

</details>

<details>
<summary><strong>💰 Budget Engine</strong></summary>

<br/>

**`POST /api/trips/:tripId/budget-analysis`**

Request:
```json
{ "totalBudget": 150000, "currency": "INR" }
```

Response:
```json
{
  "estimatedTotal": 138500,
  "remaining": 11500,
  "status": "under_budget",
  "categoryBreakdown": [
    { "category": "stay", "amount": 52000, "percent": 37.5 }
  ]
}
```

</details>

<details>
<summary><strong>✨ AI Itinerary Generation</strong></summary>

<br/>

**`POST /api/ai/generate-itinerary`**

Request:
```json
{
  "destination": "Kyoto, Japan",
  "startDate": "2026-10-01",
  "endDate": "2026-10-05",
  "totalBudget": 90000,
  "groupType": "couple",
  "pace": "balanced",
  "vibes": ["culture", "food"]
}
```

Response (truncated):
```json
{
  "tripName": "Kyoto Autumn Escape",
  "days": [
    {
      "day": 1,
      "date": "2026-10-01",
      "morning": [{ "name": "Fushimi Inari Shrine", "estimatedCost": 0, "category": "sightseeing" }],
      "afternoon": [{ "name": "Arashiyama Bamboo Grove", "estimatedCost": 500, "category": "sightseeing" }],
      "evening": [{ "name": "Kaiseki Dinner", "estimatedCost": 6000, "category": "food" }]
    }
  ],
  "source": "gemini-1.5-flash"
}
```

> If `GEMINI_API_KEY` is unset, `"source"` returns `"mock-generator"` and the same schema is populated deterministically offline.

</details>

<details>
<summary><strong>📋 Health & Packing</strong></summary>

<br/>

**`POST /api/ai/health-advisory`**

Request:
```json
{ "destination": "Manali, India", "travelMonth": "December" }
```

Response:
```json
{
  "climate": "Sub-zero nights, occasional snowfall",
  "fabricsRecommended": ["Thermal base layers", "Gore-Tex shell"],
  "fabricsToAvoid": ["Heavy cotton denim"],
  "medicalAlerts": [
    { "risk": "High Altitude Sickness", "affectedGroups": ["cardiac", "respiratory"], "severity": "high" }
  ],
  "vaccines": { "mandatory": [], "recommended": ["Influenza"] },
  "packingChecklist": ["Thermal jacket", "Passport", "Travel insurance"]
}
```

</details>

---

## 🎨 Theming Engine

```css
/* variables.css — excerpt */
:root.light-theme {
  --canvas: #FAF7F5;
  --surface: #FFFFFF;
  --text-primary: #2B2320;
  --accent-primary: #D97B4F;   /* terracotta */
  --accent-secondary: #2E8B87; /* teal */
}

:root.dark-theme {
  --canvas: #0B0F19;
  --surface: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --text-primary: #E8ECF1;
  --accent-primary: #22D3EE;   /* cyan glow */
  --accent-secondary: #6366F1; /* indigo glow */
  backdrop-filter: blur(18px);
}
```

One class swap on `<html>` → the entire design system re-renders instantly. No re-mount, no flash, no Tailwind purge headaches.

---

## 🗺️ Roadmap

- [ ] Multi-user collaborative trip editing
- [ ] Public shareable itinerary links
- [ ] Flight/hotel price ingestion via optional third-party APIs
- [ ] PWA offline installability
- [ ] i18n expansion beyond `en`

---

## 🤝 Contributing

<details>
<summary><strong>Contributor guidelines</strong></summary>

<br/>

1. Fork the repo & create a feature branch: `git checkout -b feature/amazing-thing`
2. Follow existing component/service structure — colocate styles, keep services pure
3. Run lint before committing: `npm run lint`
4. Write a clear PR description — screenshots for UI changes are appreciated
5. Open a PR against `main`

</details>

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

<br/>

<div align="center">

**Built with ✈️ wanderlust and too much coffee.**

</div>
