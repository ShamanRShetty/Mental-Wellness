# MindMirror -- Youth Wellness Platform

An AI-powered mental wellness platform for youth, offering an empathetic chat companion, mood tracking, private journaling, curated support resources, and crisis detection with multilingual support (English/Hindi).

**⚠️ Not a replacement for professional care.** This app is a self-help and early-support tool. If you or someone you know is in crisis, please contact a licensed mental health professional or a local emergency helpline immediately.

## Features

- **AI Chat Companion** — Conversational support powered by Google Gemini, with session-based history.
- **Crisis Detection** — Real-time keyword-based severity scoring (critical/high/medium) across English and Hindi, triggering appropriate safety responses.
- **Mood Tracker** — Log moods over time and view trend insights.
- **Private Journal** — Create, edit, and revisit journal entries with guided prompts.
- **Resource Library** — Curated wellness resources and emergency helpline directory.
- **Multilingual Support** — Text translation and language detection via Google Cloud Translation.
- **Sentiment Analysis** — Google Cloud Natural Language integration for message sentiment scoring.

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- React Router
- Recharts (mood insights visualization)
- i18next (internationalization)
- react-speech-recognition (voice input)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Google Gemini API (`@google/generative-ai`)
- Google Cloud Natural Language & Translation APIs
- OpenAI SDK (optional/alternate model support)

## Project Structure

```
youth-wellness-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/    # chat, mood, journal, resource logic
│   │   ├── models/         # Mongoose schemas (Journal, Resource, Session)
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Gemini, sentiment, translation, crisis detection
│   │   └── server.js       # Express app entry point
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── components/     # Chat, Mood, Home, Resources, Wellness, Layout, UI
    │   ├── pages/           # Chat, Dashboard, Journal, MoodTracker, Resources, etc.
    │   ├── context/         # App-wide state
    │   └── services/        # API client
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- A Google Gemini API key
- (Optional) Google Cloud service account credentials for Translation/NLP features

### Backend Setup

```bash
cd youth-wellness-platform/backend
npm install
```

Create a `.env` file in `backend/` with:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_APPLICATION_CREDENTIALS=./your-service-account.json
MAX_REQUESTS_PER_DAY=1500
MAX_REQUESTS_PER_MINUTE=60
USE_TRANSLATION=true
USE_NLP_SENTIMENT=true
ENABLE_CACHING=true
```

Run the backend:

```bash
npm run dev      # development, with nodemon
npm start        # production
```

The API will be available at `http://localhost:8080`.

### Frontend Setup

```bash
cd youth-wellness-platform/frontend
npm install
npm run dev
```

The app will be available at the local Vite dev URL (default `http://localhost:5173`).

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat/init` | POST | Start a new chat session |
| `/api/chat/message` | POST | Send a message to the AI companion |
| `/api/chat/history/:sessionId` | GET | Retrieve conversation history |
| `/api/mood/log` | POST | Log a mood entry |
| `/api/mood/history/:sessionId` | GET | Retrieve mood history |
| `/api/mood/insights/:sessionId` | GET | Get mood trend insights |
| `/api/journal` | POST | Create a journal entry |
| `/api/journal/:sessionId` | GET | Get all journal entries for a session |
| `/api/journal/prompts/random` | GET | Get a random journal prompt |
| `/api/resources` | GET | List wellness resources |
| `/api/resources/emergency/helplines` | GET | Get emergency helpline directory |
| `/api/translate/translate` | POST | Translate text |
| `/api/translate/detect` | POST | Detect message language |

## Deployment

- **Backend**: Dockerfile included; configured to run on port 8080 with a health check endpoint at `/`.
- **Frontend**: Static build via `npm run build`, deployable to Firebase Hosting, Vercel, Netlify, etc.

## License

Specify a license (e.g., MIT) if you intend this project to be open source.
