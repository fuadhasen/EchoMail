# EchoMail

**EchoMail is an intelligent email response-tracking and follow-up platform built around Gmail.**

It helps users keep track of important sent emails, monitor who has responded, identify pending responses, and take follow-up actions without manually checking their inbox.

The project also includes an **AI agent** that can understand email-related requests, find relevant emails, analyze their current tracking and response status, create follow-up drafts, and send them only when explicitly requested.

---

## Why EchoMail?

Sending an important email is easy.

Knowing **who actually responded, who still needs to respond, whether their response answered the original request, and when to follow up** is much harder.

EchoMail turns that process into a trackable workflow.

Instead of:

> Send email → Remember to check later → Search through Gmail → Figure out who responded → Follow up manually

EchoMail provides:

> **Track → Monitor → Analyze → Follow up**

---

## Key Features

### 📧 Gmail Integration

- Connects securely with Gmail using OAuth 2.0.
- Retrieves sent emails and their conversations.
- Monitors replies to tracked emails.
- Keeps email-related data synchronized with the application.

### 🎯 Email Tracking

Users can select important sent emails and define:

- Which recipients require a response
- Response deadlines
- Tracking status
- Follow-up requirements

EchoMail focuses on the **responses that actually matter**, rather than treating every email equally.

### 🔄 Automatic Response Monitoring

A scheduled background job periodically checks Gmail for new replies.

When a response is detected, EchoMail:

1. Identifies the tracked email.
2. Determines which recipient responded.
3. Updates the recipient's response status.
4. Updates the tracking state.
5. Notifies the frontend through WebSockets.

This allows the dashboard to reflect new responses without requiring a manual refresh.

### 🔔 Real-Time Notifications

EchoMail uses WebSockets to notify the frontend when a tracked response is detected.

Users can see changes to their tracked emails without repeatedly checking or refreshing the page.

---

# 🤖 AI Agent

The AI agent is the main intelligent layer of EchoMail.

It is designed around a simple workflow:

**UNDERSTAND → FIND → ANALYZE → ASSIST → ACT**

### Understand

The agent understands what the user is asking and determines what email or tracking information is relevant.

For example:

> "Did anyone respond to the AI Engineering email?"

### Find

The agent can search the user's sent emails and retrieve tracked emails.

It can identify the exact email the user is referring to instead of relying on hardcoded examples.

### Analyze

Once the relevant email is identified, the agent can retrieve fresh tracking and reply information and reason about:

- Recipients
- Pending recipients
- Responses
- Deadlines
- Overdue responses
- Whether the expected response was received
- Whether further action is required

### Assist

The agent can create a follow-up draft based on the **actual email and tracking context**.

It uses real information from the user's email rather than generating generic follow-up messages.

### Act

The agent can send a prepared follow-up **only when the user explicitly asks it to do so**.

The agent does not automatically send emails simply because it created a draft.

---

## Example Agent Workflow

Imagine a user is waiting for confirmation from three recipients.

```text
Original email
      │
      ▼
Track important recipients
      │
      ▼
Monitor Gmail for replies
      │
      ├── Recipient A → Confirmed ✅
      │
      ├── Recipient B → No response ⏳
      │
      └── Recipient C → Partial response ⚠️
      │
      ▼
AI analyzes the current state
      │
      ▼
Creates a follow-up draft
      │
      ▼
User reviews it
      │
      ▼
User explicitly approves sending
      │
      ▼
Follow-up sent
```

This allows EchoMail to move beyond simply **reading emails** and toward managing the entire response workflow.

---

## Agent Context & Fresh Data

EchoMail uses session state to maintain conversational context.

The agent can maintain lightweight context such as:

- Current sent-email context
- Current tracked-email context
- Selected tracked email
- Pending follow-up context

However, session state is **not treated as the source of truth**.

When the agent needs current information such as replies, deadlines, or recipient status, it retrieves fresh data from EchoMail's backend and Gmail.

This helps prevent the agent from making decisions based on stale conversation context.

---

## Safety

Email actions are intentionally controlled.

The AI can:

- Find emails
- Analyze tracking information
- Analyze replies
- Create follow-up drafts

But **sending an email requires explicit user intent**.

This separation between **drafting** and **sending** prevents the agent from unexpectedly sending messages on the user's behalf.

---

# Architecture

```text
                         ┌──────────────────┐
                         │      Gmail       │
                         │   Gmail API      │
                         └────────┬─────────┘
                                  │
                            OAuth 2.0
                                  │
                                  ▼
┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │
│   React Frontend │◄────►│  FastAPI Backend │
│                  │ REST │                  │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         │ WebSocket               │
         │                         ▼
         │                  ┌───────────────┐
         │                  │     MySQL     │
         │                  │   Database    │
         │                  └───────────────┘
         │
         ▼
┌──────────────────┐
│    AI Agent      │
│                  │
│ Understand       │
│ Find             │
│ Analyze          │
│ Assist           │
│ Act              │
└──────────────────┘
```

---

# Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Axios
- WebSockets

### Backend

- Python
- FastAPI
- SQLAlchemy
- MySQL
- Pydantic
- Alembic
- Gmail API
- OAuth 2.0
- APScheduler

### AI

- Google ADK
- Gemini
- LiteLLM
- Tool calling
- Agent session state
- Context-aware workflows

### Infrastructure

- Docker
- Git
- Linux
- AWS-ready architecture

---

# Project Structure

```text
EchoMail/
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── agents/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
└── README.md
```

---

# Core Workflow

### 1. Connect Gmail

The user authenticates with Google OAuth.

### 2. Find an important email

The user selects a sent email that requires a response.

### 3. Define what matters

The user selects the recipients whose responses are important and sets a deadline.

### 4. Monitor responses

EchoMail periodically checks Gmail for replies.

### 5. Update tracking

Recipient statuses are updated automatically when responses are detected.

### 6. Notify the user

The frontend receives real-time updates through WebSockets.

### 7. Use the AI agent

The user can ask questions such as:

```text
Did anyone reply to the AI Engineering email?

Which tracked emails are still waiting for responses?

Draft a follow-up for the AI Engineering email.
```

### 8. Follow up

The agent analyzes the current state, creates a relevant follow-up draft, and waits for explicit approval before sending.

---

# Getting Started

## Prerequisites

- Python 3.12+
- Node.js
- MySQL
- Google Cloud project
- Gmail API enabled
- Google OAuth credentials
- Gemini API key

## Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file with the required configuration:

```env
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the backend:

```bash
uvicorn main:app --reload
```

## Frontend

```bash
cd frontend

npm install
npm run dev
```

Configure the frontend API URL:

```env
VITE_API_URL=http://localhost:8000
```

---

# What Makes EchoMail Different?

EchoMail is not designed to replace Gmail.

It adds a **response-management layer** on top of Gmail.

The focus is not simply:

> "What emails do I have?"

The focus is:

> **"What responses am I waiting for, what has happened so far, and what should I do next?"**

The AI agent extends this further by allowing users to interact with that workflow using natural language.

---

# Future Improvements

- More advanced response classification
- Smarter deadline recommendations
- Automatic priority detection
- Improved follow-up recommendations
- Multi-step agent workflows
- Additional email providers
- Production deployment and monitoring
- More advanced analytics around response times

---

## Author

**Fuad Hassen**

Full-Stack Software Engineer focused on building practical backend systems, AI-powered applications, and agentic workflows.

[GitHub](https://github.com/fuadhasen)
