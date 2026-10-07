# EchoMail

**AI-powered email response tracking and follow-up agent built on top of Gmail.**

EchoMail helps users track important sent emails, monitor recipient responses, understand what still needs attention, and follow up without manually checking Gmail.

### AI Agent

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
**Other:** OAuth 2.0, WebSockets, APScheduler


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

🎥 **[Watch the EchoMail Demo](https://www.loom.com/share/49d228be155c43f38f6f34a8d6c71c34)**

Built by **Fuad Hassen**.
