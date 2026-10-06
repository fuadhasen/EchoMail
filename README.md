# EchoMail

**AI-powered email response tracking and follow-up agent built on top of Gmail.**

EchoMail helps users track important sent emails, monitor recipient responses, understand what still needs attention, and follow up without manually checking Gmail.

### 🤖 AI Agent

The agent can:

- Find and understand tracked emails
- Analyze replies, recipients, and deadlines
- Identify who has and hasn't responded
- Create context-aware follow-up drafts
- Send follow-ups only with user approval

**UNDERSTAND → FIND → ANALYZE → ASSIST → ACT**

### Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** FastAPI, Python, SQLAlchemy, MySQL, Gmail API  
**AI:** Google ADK, Gemini, LiteLLM, Tool Calling  
**Other:** OAuth 2.0, WebSockets, APScheduler, Docker

## Architecture

```text
             Gmail
               │
          Gmail API / OAuth
               │
               ▼
        ┌───────────────┐
        │    FastAPI    │
        │    Backend    │
        └───────┬───────┘
                │
        ┌───────┴────────┐
        ▼                ▼
      MySQL          AI Agent
                         │
                  ┌──────┴──────┐
                  │    Tools     │
                  ├──────────────┤
                  │ Search Email │
                  │ Track Email  │
                  │ Get Replies  │
                  │ Draft Follow │
                  │ Send Follow  │
                  └──────────────┘
                         │
                         ▼
                  React Frontend
```

## Project Structure

```text
EchoMail/
├── backend/
│   ├── agents/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── ...
│
├── frontend/
│   └── gmail-tracker/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   └── ...
│       └── ...
│
└── README.md
```

## Getting Started

### Backend

```bash
cd backend

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend/gmail-tracker

npm install
npm run dev
```

### Demo

🎥 **[Watch the EchoMail Demo](YOUR_LOOM_LINK)**

Built by **Fuad Hassen**.
