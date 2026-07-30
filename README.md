# Citizen Pulse

**Citizen Pulse** is a civic engagement platform that lets constituents submit development requests and grievances to their Member of Parliament. Submissions are structured with AI, surfaced in a public feed, and aggregated into an MP dashboard with ranked project recommendations.

Tagline: *Your development voice, heard by your MP.*

## Features

### For citizens
- Choose a topic (Governance, Education, Health, Water & Infrastructure, Security, Agriculture, Environment)
- Submit text in any language, with an optional photo and ward
- Bilingual UI — English and Kiswahili
- Public grievances feed with upvote/downvote

### For MPs and staff
- Dashboard with charts by urgency, topic, and ward hotspots
- AI-ranked project recommendations that combine citizen submissions with the local development plan
- Evidence-backed rationales citing ward statistics and submission counts

### AI processing (Ollama / Gemma)
- Language detection and translation
- Summaries and subtopics in English and Swahili
- Urgency scoring (low / medium / high)
- Photo captioning
- Content moderation (rejects abuse while allowing strong civic criticism)

## Tech stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19, Vite, React Router        |
| Backend  | Express, Multer, SQLite             |
| AI       | Ollama (`gemma4:cloud` by default)  |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Ollama](https://ollama.com/) installed and running
- The Gemma model pulled locally, e.g.:

```bash
ollama pull gemma4:cloud
```

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

### 3. Start the backend

From the `backend` directory:

```bash
npm run dev
```

The API listens on **http://localhost:4000**.

On first run, SQLite creates `backend/data/app.db` automatically. Ward data and planned projects ship in `backend/data/`.

### 4. Start the frontend

From the `frontend` directory (in a second terminal):

```bash
npm run dev
```

Open the URL Vite prints (typically **http://localhost:5173**).

## Environment variables

| Variable       | Default            | Description                          |
| -------------- | ------------------ | ------------------------------------ |
| `PORT`         | `4000`             | Backend server port                  |
| `GEMMA_MODEL`  | `gemma4:cloud`     | Ollama model for analysis & ranking  |
| `VITE_API_URL` | `http://localhost:4000` | Frontend API base URL (optional) |

Example for the frontend (create `frontend/.env` if needed):

```env
VITE_API_URL=http://localhost:4000
```

## Project structure

```
Citizen-Pulse/
├── backend/
│   ├── data/
│   │   ├── planned-projects.json   # Local development plan candidates
│   │   └── wards.json              # Ward demographics & infrastructure stats
│   └── src/
│       ├── lib/ollama.js           # AI analysis & recommendation ranking
│       ├── routes/                 # API endpoints
│       ├── db.js                   # SQLite schema
│       └── server.js
└── frontend/
    └── src/
        ├── pages/                  # Home, Submit, Feed, Dashboard, …
        ├── components/
        ├── i18n/translations.js    # English / Kiswahili strings
        └── api.js
```

## API overview

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/health`                   | Health check                   |
| GET    | `/topics`                   | List submission topics         |
| GET    | `/wards`                    | List wards                     |
| POST   | `/submissions`              | Submit grievance (multipart)   |
| GET    | `/submissions`              | List all submissions           |
| POST   | `/submissions/:id/vote`     | Upvote or downvote             |
| GET    | `/hotspots`                 | Submissions grouped by ward    |
| GET    | `/stats/topics`             | Counts by topic                |
| GET    | `/stats/urgency`            | Counts by urgency              |
| GET    | `/recommendations`          | AI-ranked project priorities   |

## App routes

| Path               | Page                                      |
| ------------------ | ----------------------------------------- |
| `/`                | Home — choose a topic                     |
| `/submit/:topic`   | Submit a grievance                        |
| `/confirmation`    | AI summary of what was understood         |
| `/feed`            | Public grievances feed                    |
| `/dashboard`       | MP analytics & recommendations            |

## Production build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

Serve the frontend `dist/` folder with any static host and point `VITE_API_URL` at your deployed API.

## License

Hackathon project — see repository owner for usage terms.
