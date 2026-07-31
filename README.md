# Citizen Pulse

**Citizen Pulse** is a civic engagement platform that lets constituents submit development requests and grievances to their Member of Parliament — by web or by USSD on any phone. Submissions are structured with AI, screened for abuse, surfaced in a public feed for community voting, and aggregated into an MP dashboard with charts and ranked project recommendations.

Tagline: *Your development voice, heard by your MP.*

**Live demo:** [citizen-pulse.onrender.com](https://citizen-pulse.onrender.com) — no login required. Citizen views under `/`, `/feed`, and `/submit/:topic`; MP view under `/dashboard`.

> Hosted on Render's free tier: the first request after a period of inactivity can take 30-60s to wake up, and the SQLite data resets on redeploy (no persistent disk on the free plan).

## Features

### For citizens
- Choose a topic (Governance, Education, Health, Water & Infrastructure, Security, Agriculture, Environment)
- Submit text in any language, with an optional photo and ward — via the web app **or by dialing a USSD code** (Africa's Talking), for citizens without smartphones
- Bilingual UI — English and Kiswahili, including AI-generated summaries and tags in both languages
- Public grievances feed with upvote/downvote, topic filter, and sort by newest/most-voted

### For MPs and staff
- Dashboard with charts by urgency (pie), topic (bar), and ward hotspots (bar)
- AI-ranked project recommendations that combine citizen submissions with ward statistics and the local development plan, using Gemma's native function calling to pull real numbers instead of inventing them
- The same grievances feed embedded read-only, so the MP never has to leave the dashboard to see raw submissions

### AI processing (Gemma, via Ollama Cloud)
- Language detection and translation
- Summaries and subtopics generated in both English and Swahili
- Urgency scoring (low / medium / high)
- Photo captioning
- Content moderation — rejects hate speech, harassment, threats, spam, and AI-generated/synthetic photos, while explicitly allowing strong civic criticism of government or officials
- All of the above run synchronously for web submissions; for USSD, the raw submission is saved and the citizen gets an immediate confirmation, with AI analysis completing in the background afterward (Africa's Talking times out callbacks in ~10-15s, too short to wait on an LLM call)

## Tech stack

| Layer    | Technology                                              |
| -------- | --------------------------------------------------------|
| Frontend | React 19, Vite, React Router                             |
| Backend  | Express, Multer, SQLite (Node's built-in `node:sqlite`)  |
| AI       | Gemma 4, via the Ollama Cloud HTTPS API (`gemma4`)       |
| USSD     | Africa's Talking                                         |

## Prerequisites

- [Node.js](https://nodejs.org/) 22.5+ (required for `node:sqlite`; the repo pins `24.16.0` in `.node-version`)
- An [Ollama](https://ollama.com/) account and an API key from [ollama.com/settings/keys](https://ollama.com/settings/keys) — the backend calls Gemma directly over HTTPS, so **no local Ollama install is required**

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Eve-maina/Citizen-Pulse.git
cd Citizen-Pulse
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure the backend

Create `backend/.env` (gitignored, never commit this):

```env
OLLAMA_API_KEY=your_api_key_here
```

### 4. Start the backend

From the `backend` directory:

```bash
npm run dev
```

The API listens on **http://localhost:4000**. On first run, SQLite creates `backend/data/app.db` automatically. Ward data and planned projects ship in `backend/data/`.

### 5. Start the frontend

From the `frontend` directory (in a second terminal):

```bash
npm run dev
```

Open the URL Vite prints (typically **http://localhost:5173**).

## Environment variables

| Variable         | Default   | Description                                                              |
| ----------------- | --------- | -------------------------------------------------------------------------|
| `OLLAMA_API_KEY`  | *(none)*  | **Required.** API key from ollama.com — the backend refuses to start without it |
| `PORT`            | `4000`    | Backend server port                                                      |
| `GEMMA_MODEL`     | `gemma4`  | Ollama Cloud model for analysis & ranking                                |
| `VITE_API_URL`    | *(same-origin in production, `http://localhost:4000` in dev)* | Override the frontend's API base URL |

## Project structure

```
Citizen-Pulse/
├── .node-version                   # Pinned Node version for deployment
├── backend/
│   ├── data/
│   │   ├── planned-projects.json   # Local development plan candidates
│   │   └── wards.json              # Ward demographics & infrastructure stats
│   └── src/
│       ├── lib/
│       │   ├── ollama.js           # Gemma client, AI analysis & recommendation ranking
│       │   ├── tools.js            # Function-calling tools for the ranking step
│       │   └── wards.js            # Ward lookup helpers (shared with USSD)
│       ├── services/
│       │   └── submissions.js      # Insert/update helpers used by the USSD flow
│       ├── routes/                 # API endpoints, including ussd.js
│       ├── db.js                   # SQLite schema
│       └── server.js               # Also serves the built frontend in production
└── frontend/
    └── src/
        ├── pages/                  # Home, Submit, Feed, Dashboard, Confirmation
        ├── components/             # GrievanceCard, charts (Pie/Bar/VerticalBar), TopicCard, …
        ├── i18n/translations.js    # English / Kiswahili strings
        └── api.js
```

## API overview

| Method | Endpoint                    | Description                                          |
| ------ | ---------------------------- | ----------------------------------------------------|
| GET    | `/health`                    | Health check                                         |
| GET    | `/topics`                    | List submission topics                               |
| GET    | `/wards`                     | List wards                                            |
| POST   | `/submissions`                | Submit grievance (multipart; web channel)            |
| GET    | `/submissions`                | List all submissions                                  |
| POST   | `/submissions/:id/vote`       | Upvote or downvote                                    |
| GET    | `/hotspots`                   | Submissions grouped by ward                           |
| GET    | `/stats/topics`               | Counts by topic                                       |
| GET    | `/stats/urgency`              | Counts by urgency                                      |
| GET    | `/recommendations`            | AI-ranked project priorities (function-calling)       |
| POST   | `/ussd`                       | Africa's Talking USSD callback (form-urlencoded)      |

## App routes

| Path               | Page                                      |
| ------------------- | ------------------------------------------|
| `/`                | Home — choose a topic                     |
| `/submit/:topic`   | Submit a grievance                        |
| `/confirmation`    | AI summary of what was understood         |
| `/feed`            | Public grievances feed (with voting)      |
| `/dashboard`       | MP analytics, recommendations, and a read-only view of the feed |

## Deployment

The backend serves the built frontend from the same Express process, so the whole app deploys as **one Node service behind one URL** — no separate static host, no CORS setup.

```bash
# Build the frontend
cd frontend && npm run build

# Start the combined service (serves frontend/dist + the API)
cd ../backend && npm start
```

Deployed here on [Render](https://render.com)'s free tier:
- **Build command**: `npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend`
- **Start command**: `npm start --prefix backend`
- **Environment variable**: `OLLAMA_API_KEY` set in the Render dashboard

Free-tier caveats: the service sleeps after 15 minutes idle (cold start on the next request), and there's no persistent disk, so `backend/data/app.db` and uploaded photos reset on redeploy or instance recycling. For real persistence, swap `node:sqlite` for a hosted database (e.g. Turso or Supabase, both have free tiers) — the `db.js`/`services/submissions.js` layer is the only place that would need to change.

## License

Hackathon project — see repository owner for usage terms.
