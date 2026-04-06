# ◈ IdeaForge — AI Startup Idea Validator

> **Schmooze Media — Technical Screening Assignment**

A full-stack MVP that lets users submit startup ideas and receive instant AI-generated validation reports powered by OpenAI GPT-3.5-turbo.

---

## 🚀 Live Demo

- **Frontend:** `https://ideaforge.vercel.app` *(replace with your Vercel URL)*
- **Backend API:** `https://ideaforge-api.onrender.com` *(replace with your Render URL)*

---

## 🧱 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite, React Router v6, CSS Modules |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose (Atlas)          |
| AI        | OpenAI GPT-3.5-turbo                |
| Deployment| Vercel (frontend) · Render (backend)|

---

## 📁 Project Structure

```
startup-validator/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Idea submission form
│   │   │   ├── DashboardPage.jsx    # All ideas grid view
│   │   │   └── IdeaDetailPage.jsx   # Full AI report view
│   │   ├── components/
│   │   │   └── Layout.jsx           # Navbar + layout wrapper
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
│
├── server/                  # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── models/
│   │   │   └── Idea.js              # Mongoose schema
│   │   ├── controllers/
│   │   │   └── ideaController.js    # Route handlers
│   │   ├── routes/
│   │   │   └── ideas.js             # Express router
│   │   ├── services/
│   │   │   └── openaiService.js     # GPT-3.5 integration
│   │   └── index.js                 # Express app entry
│   └── package.json
│
├── render.yaml              # Render deployment config
├── package.json             # Root scripts
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/your-username/startup-validator.git
cd startup-validator
npm run install:all
```

### 2. Configure Environment Variables

**Backend** — create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/startup-validator
OPENAI_API_KEY=sk-your-openai-api-key
```

**Frontend** — create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Servers

Open two terminal windows:

```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🌐 API Reference

### `POST /api/ideas`
Submit a new startup idea and trigger AI analysis.

**Request body:**
```json
{
  "title": "AI-powered legal doc reviewer for SMBs",
  "description": "Small businesses struggle with expensive legal reviews..."
}
```

**Response:** Full idea object with AI report.

---

### `GET /api/ideas`
Returns all saved ideas (summary view).

---

### `GET /api/ideas/:id`
Returns a single idea with its full AI report.

---

### `DELETE /api/ideas/:id`
Permanently deletes an idea.

---

## 🤖 AI Prompt

The system prompt used for analysis:

```
You are an expert startup consultant with 20+ years of experience advising early-stage companies.
Analyze the given startup idea and return a structured JSON object with EXACTLY these fields:
- problem: core problem summary (2-3 sentences)
- customer: ideal customer persona (2-3 sentences)
- market: market size and growth overview (2-3 sentences)
- competitors: array of exactly 3 objects {name, differentiation}
- tech_stack: array of 4-6 MVP technologies
- risk_level: "Low" | "Medium" | "High"
- profitability_score: integer 0–100
- justification: reasoning for score and risk (3-4 sentences)

Rules: Be concise, realistic, and data-driven. Return ONLY valid JSON.
```

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd client
npx vercel --prod
# Set VITE_API_BASE_URL to your Render backend URL
```

### Backend → Render
1. Push to GitHub
2. New Web Service on Render → connect repo
3. Root directory: `server`
4. Build: `npm install` · Start: `npm start`
5. Add env vars: `MONGODB_URI`, `OPENAI_API_KEY`, `PORT=5000`

---

## 📊 Scoring Notes

| Category | Implementation |
|---|---|
| AI Report Quality | Structured 8-field JSON via GPT-3.5-turbo with validation + fallbacks |
| API Functionality | All 4 endpoints (POST, GET list, GET by ID, DELETE) |
| Frontend UI/UX | Dark editorial design, animated, responsive, CSS Modules |
| Database | MongoDB Atlas + Mongoose with full schema validation |
| Deployment | Vercel (frontend) + Render (backend) configs included |
| Code Quality | MVC architecture, error handling, service layer separation |
| Documentation | This README + inline comments throughout |

---

## 🏛️ Architecture Decisions

- **MVC Pattern** — Clean separation: routes → controllers → services → models. Keeps each layer testable and replaceable.
- **Optimistic UI** — Idea is saved with `analyzing` status immediately so users see feedback instantly while AI runs.
- **JSON Validation** — AI response is parsed and validated field-by-field before saving; malformed responses are caught and reported cleanly.
- **CSS Modules** — Scoped styles per component, no class conflicts, zero runtime overhead.
- **Vite Proxy** — In dev, `/api` is proxied to Express; in production, `VITE_API_BASE_URL` points to Render.

---

*Built for Schmooze Media Technical Screening · Vishal · 2026*