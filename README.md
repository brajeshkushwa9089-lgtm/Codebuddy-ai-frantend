# CodeBuddy AI — Educational Programming Companion

> **Tagline:** *Learn to Code. Understand the Logic. Build Confidence.*  
> **Target Audience:** First-year B.Tech CSE (AI/ML) students, educators, and software engineers.

---

## 🌟 Overview

**CodeBuddy AI** is a production-grade, educational programming tutor that teaches students how to solve problems and understand logic rather than blindly copy answers. It supports **Python**, **C**, **C++**, and **JavaScript** through:

1. **AI Code Explainer:** Line-by-line pedagogical breakdown, memory explanation, core concept tags, and intuitive analogies.
2. **AI Debugging Assistant:** Root-cause analysis, line identification, minimal fixes, one-click apply to editor, and prevention tips.
3. **AI Practice Problem Generator:** Tailored coding challenges by language, difficulty (Beginner, Intermediate, Advanced), and core CS topic.
4. **5-Level Progressive Hint System:** Conceptual Hint $\rightarrow$ Approach Hint $\rightarrow$ Pseudocode $\rightarrow$ Partial Code $\rightarrow$ Full Solution with explicit confirmation modal.
5. **Interactive Coding Workspace:** Monaco Editor with syntax highlighting, language templates, and hint tracking.
6. **AI Tutor Chat:** Conversational mentor with persistent conversation history, renaming, and deletion.
7. **Authentic Student Dashboard:** Real learning analytics, streak counter, language distribution charts, and topic suggestions calculated from database records.
8. **Interchangeable Dual AI Providers:** Local **Ollama** (`gemma3:1b`) or cloud **Google Gemini** (`gemini-1.5-flash`), configured seamlessly on the backend.

---

## 🏗️ System Architecture

```
CodeBuddy-AI/
├── frontend/             # React 18 + Vite + Tailwind CSS + Monaco + Recharts
│   ├── src/
│   │   ├── components/   # CodeEditor, Navbar, ProviderBadge, ProtectedRoute
│   │   ├── contexts/     # AuthContext (Supabase / Demo), AIProviderContext
│   │   ├── layouts/      # AppLayout
│   │   ├── pages/        # Dashboard, Explainer, Debugger, Practice, Chat, History, Profile
│   │   ├── services/     # Axios API layer, Supabase Client
│   │   └── App.jsx
├── backend/              # Node.js + Express (ESM) + Supabase + Ollama/Gemini SDK
│   ├── src/
│   │   ├── config/       # Environment & configuration diagnostics
│   │   ├── controllers/  # MVC controllers (Auth, AI, Practice, Chat, Dashboard)
│   │   ├── middleware/   # Supabase JWT Auth, Zod Validation, Rate Limiters, Errors
│   │   ├── routes/       # REST API Endpoints (/api/...)
│   │   ├── services/     # Unified AI Provider Abstraction (Ollama & Gemini)
│   │   ├── validators/   # Zod Schemas
│   │   └── server.js
│   ├── supabase/
│   │   └── migrations/   # PostgreSQL RLS Schema (20261028_init.sql)
│   └── tests/            # Automated Vitest test suite (Auth, AI, Validation, REST)
├── docs/                 # Architecture, API, Database, and Troubleshooting Guides
└── README.md
```

---

## 🚀 Quick Start Guide (Windows & PowerShell)

### 1. Prerequisites
- **Node.js**: v20+ or v24+ ([Download Node.js](https://nodejs.org/))
- **Git**: Installed ([Download Git](https://git-scm.com/))
- **Ollama**: (Optional for local offline AI) ([Download Ollama](https://ollama.com/download))
- **Google Gemini API Key**: (Optional for cloud AI) ([Google AI Studio](https://aistudio.google.com/))

---

### 2. Ollama & Gemma 3:1B Setup (Local AI)

If you wish to run CodeBuddy 100% offline with zero cloud API costs:

```powershell
# 1. Start Ollama background daemon
ollama serve

# 2. In a second PowerShell window, pull Google Gemma 3:1B
ollama pull gemma3:1b

# 3. Test Gemma 3 interactively
ollama run gemma3:1b "Explain recursion in one sentence."
# Type /bye to exit
```

---

### 3. Database & Supabase Setup

CodeBuddy AI uses Supabase PostgreSQL with strict Row Level Security (RLS).

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Open `backend/supabase/migrations/20261028_init.sql` from this repository, copy its entire contents, paste into the SQL editor, and click **Run**.
4. Retrieve your credentials from **Project Settings $\rightarrow$ API**:
   - `Project URL`
   - `anon public key`

> **Note:** If you want to test immediately without configuring Supabase first, CodeBuddy includes a built-in Local Demo Mode that automatically activates when placeholder credentials are used.

---

### 4. Configure Environment Files

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Active Provider: 'ollama' or 'gemini'
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma3:1b

# If AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

AI_REQUEST_TIMEOUT_MS=60000
```

#### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

---

### 5. Install Dependencies

Open a PowerShell window in the project root:

```powershell
# Install backend dependencies
cd backend
npm.cmd install

# Install frontend dependencies
cd ../frontend
npm.cmd install
```

---

### 6. Start the Servers

#### Terminal 1: Backend API
```powershell
cd backend
npm.cmd run dev
```
*Expected terminal output:*
```
🚀 CodeBuddy AI Backend listening on port 5000 (development)
🤖 Active AI Provider: OLLAMA (Model: gemma3:1b)
🌐 Allowed Frontend Origin: http://localhost:5173
```

#### Terminal 2: Frontend Client
```powershell
cd frontend
npm.cmd run dev
```
*Expected output:*
```
  VITE v6.x.x  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to: **`http://localhost:5173/`**

---

### 7. Switching AI Providers

To switch between Ollama and Google Gemini:

1. Open `backend/.env`.
2. Change `AI_PROVIDER=gemini` (and ensure `GEMINI_API_KEY` is provided).
3. Restart the backend:
   ```powershell
   npm.cmd run dev
   ```
4. CodeBuddy AI will immediately switch providers. The frontend header status pill will automatically update to `GEMINI (gemini-1.5-flash)`.

---

### 8. Running Automated Tests

CodeBuddy includes a comprehensive automated test suite testing auth, Zod validation, AI provider abstraction, Ollama/Gemini error scenarios, progressive hints, and REST endpoints:

```powershell
cd backend
npm.cmd test
```

*Expected output:*
```
 ✓ tests/aiValidators.test.js (6 tests)
 ✓ tests/authMiddleware.test.js (3 tests)
 ✓ tests/aiProvider.test.js (7 tests)
 ✓ tests/apiEndpoints.test.js (8 tests)

 Test Files  4 passed (4)
      Tests  24 passed (24)
```

---

## 🔒 Security Architecture Highlights

1. **Row Level Security (RLS):** All tables (`conversations`, `practice_problems`, `practice_attempts`, `learning_activity`) enforce PostgreSQL RLS policies where `auth.uid() = user_id`.
2. **Server-Side Token Verification:** The Express backend independently verifies the Bearer JWT on every protected route. Hiding a button on the UI is never treated as security.
3. **No Unsafe Remote Code Execution:** Student code is strictly analyzed via pedagogical static models. The backend server never passes student code to `child_process.exec`, `eval`, or bash shells.
4. **Hint Privacy & Scaffolding Enforcement:** Unrevealed hints and full solutions are never sent to the browser in advance. Level 5 full solutions require explicit user confirmation.
5. **Credentials Sanitization:** The logger automatically redacts API keys, passwords, and authorization headers.

---

## 📚 Detailed Documentation Links
- [System Architecture Specification](docs/architecture.md)
- [Database Schema & RLS Policies](docs/database.md)
- [REST API Reference](docs/api.md)
- [Troubleshooting & Windows Guide](docs/troubleshooting.md)

