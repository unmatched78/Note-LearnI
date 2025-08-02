$\color{Red}\Huge{\textsf{We welcome scholarly contributions. To contribute: The better is to start from }}$ [Todos](https://github.com/unmatched78/Note-LearnI/blob/main/Docs/TODOs.md)
<br></br>

# AI Learning Platform

> Empowering learners to realize their academic aspirations through intelligent, data-driven pathways.

![Dashboard Screenshot](https://github.com/unmatched78/Note-LearnI/blob/main/Docs/Screenshot%202025-08-02%20215131.png)
![Modules Screenshot](https://github.com/unmatched78/Note-LearnI/blob/main/Docs/Screenshot%202025-08-02%20215004.png)
![AI Tools Screenshot](https://github.com/unmatched78/Note-LearnI/blob/main/Docs/Screenshot%202025-08-02%20214903.png)

We welcome scholarly contributions! request a feature and contribute, The better is to start from our [Todos](https://github.com/unmatched78/Note-LearnI/blob/main/Docs/TODOs.md).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Features](#core-features)
3. [Tech Stack & Architecture](#tech-stack--architecture)
4. [UI & Theming](#ui--theming)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [API Reference](#api-reference)
8. [Roadmap & Contributing](#roadmap--contributing)
9. [License](#license)

---

## Project Overview

The **AI Learning Platform** is a full-stack educational ecosystem that:

* Organizes and curates study materials (documents, videos, quizzes).
* Uses AI to generate summaries, quizzes, flashcards, and transcripts.
* Offers a dynamic study dashboard with progress analytics and calendar scheduling.
* Provides social features: peer sharing, notifications, and role-based collaboration.

---

## Core Features

* **Modular Content Library**: Create, tag, and search “Modules” of learning resources.
* **AI Tools Panel**: On-demand summarization, quiz generation, flashcards, and transcription.
* **Study Dashboard**:

  * **Progress Analytics**: Top modules by score, resource counts.
  * **Upcoming Events & Schedule**: Add/view study sessions on a calendar.
  * **Recently Accessed**: Quick links to latest materials.
* **Responsive & Accessible UI**: Built with Tailwind CSS and shadcn/ui components.
* **Secure Authentication**: Clerk for user management, JWT for API access.

---

## Tech Stack & Architecture

```mermaid
flowchart LR
  A[React + Vite] --> B[Clerk Auth & JWT]
  A --> C[shadcn/ui + TailwindCSS]
  A -- API calls --> D[Django REST Framework]
  D --> E[Neon PostgreSQL]
  D --> F[MCP Tool ➔ AI/ML Services]
```

* **Frontend**

  * React + Vite
  * Tailwind CSS, shadcn/ui
  * Clerk for auth, lucide-react icons
* **Backend**

  * Django + DRF
  * Clerk SDK for JWT auth
  * Neon PostgreSQL
  * Custom “MCP Tool” pipeline utility for AI tasks

---

## UI & Theming

We’ve standardized on a **high-contrast, colored-border** design:

* **Card Borders**: Indigo for modules, yellow for events, green for schedule, blue for materials, purple for AI tools.
* **Hover Glow**: `hover:shadow-lg transition` on interactive cards.
* **Buttons**: Solid brand colors matching section accents.
* **Tabs & Controls**: Increased spacing (`gap-4`, `px-4`) for clarity.
* **Responsive Layouts**: Grid → single column on small screens.

All major components—**Dashboard**, **ModuleGrid**, **HomePage**, and **AIToolsPage**—now share this cohesive style.

---

## Getting Started

### Prerequisites

* Node.js v16+ & npm/yarn
* Python 3.9+ & pip/Poetry
* Neon PostgreSQL credentials

### Installation

```bash
# Clone
git clone https://github.com/unmatched78/Note-LearnI.git
cd Note-LearnI

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate

# Frontend
cd ../frontend
npm install
```

### Running Locally

```bash
# Backend (port 8000)
cd backend
source venv/bin/activate
python manage.py runserver

# Frontend (port 3000)
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## Configuration

Create `.env` in each folder:

**backend/.env**

```
DEBUG=True
SECRET_KEY=your_secret
DATABASE_URL=postgres://user:pass@host:port/db
OPENAI_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
```

**frontend/.env**

```
VITE_API_URL=http://localhost:8000/api
VITE_JWT_KEY=authToken
```

---

## API Reference

| Endpoint             | Method   | Description                       |
| -------------------- | -------- | --------------------------------- |
| `/modules/`          | GET/POST | List or create study modules      |
| `/documents/`        | GET/POST | List or upload learning materials |
| `/events/`           | GET/POST | Manage study scheduler events     |
| `/summaries/`        | POST     | Generate AI summaries             |
| `/quizzes/generate/` | POST     | Generate AI-driven quizzes        |
| `/flashcards/`       | POST     | Generate AI flashcards            |
| `/transcripts/`      | POST     | Generate transcripts from media   |

---

## Roadmap & Contributing

* **In Progress**:

  * CI/CD with GitHub Actions
  * PWA support
  * Real-time chat for peer discussion

* **How to Contribute**

  1. Fork & clone
  2. `git checkout -b feature/your-feature`
  3. Commit, push, and open a PR
  4. Reference [Todos](Docs/TODOs.md) for guidance

---

## License

This project is licensed under the **GNU GPL v3.0**. See [LICENSE](LICENSE) for details.
