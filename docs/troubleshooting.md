# CodeBuddy AI — Troubleshooting & Operations Guide

> **Authoritative guide for local setup, AI debugging, database connection, and Windows issues.**

---

## 1. Ollama & Gemma 3:1B Setup

### Problem: `ECONNREFUSED 127.0.0.1:11434` or "Cannot connect to Ollama daemon"
**Cause:** The Ollama background process is not active.  
**Resolution:**
1. Open a new terminal or PowerShell window.
2. Run:
   ```powershell
   ollama serve
   ```
3. Keep this window running in the background.
4. Verify in browser or terminal:
   ```powershell
   curl http://127.0.0.1:11434/
   ```
   *Expected output:* `Ollama is running`

---

### Problem: `model 'gemma3:1b' not found`
**Cause:** The Gemma 3:1B model has not been pulled locally yet.  
**Resolution:**
1. In PowerShell, execute:
   ```powershell
   ollama pull gemma3:1b
   ```
2. Once the download completes, test interactively:
   ```powershell
   ollama run gemma3:1b "Hello! Explain what a loop is in one sentence."
   ```
3. Type `/bye` to exit the interactive prompt.

---

## 2. Google Gemini Setup

### Problem: `GEMINI_API_KEY is not configured` or `API_KEY_INVALID`
**Cause:** Missing or invalid API key in `backend/.env`.  
**Resolution:**
1. Visit [Google AI Studio](https://aistudio.google.com/) and create a free API key.
2. In `backend/.env`, set:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
3. Restart the backend server.
4. Test using the health check:
   ```powershell
   curl http://localhost:5000/api/health/ai
   ```

---

## 3. Supabase & Database Issues

### Problem: `Invalid API key` or `Failed to fetch profile`
**Cause:** Incorrect Supabase URL or Publishable/Anon key.  
**Resolution:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> Select Project -> **Project Settings** -> **API**.
2. Copy:
   - **Project URL** -> `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - **Project API Keys -> `anon` / `public`** -> `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Paste them into both `backend/.env` and `frontend/.env`.
4. Apply the SQL migration in Supabase SQL Editor:
   - Copy contents of `backend/supabase/migrations/20261028_init.sql`.
   - Paste into Supabase **SQL Editor** and click **Run**.

---

## 4. Windows PowerShell Script Execution Policy

### Problem: `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled`
**Cause:** Windows PowerShell ExecutionPolicy is set to `Restricted` by default.  
**Resolution:**
- Use `npm.cmd` and `npx.cmd` in PowerShell:
  ```powershell
  npm.cmd run dev
  ```
- Or set ExecutionPolicy for the current user process:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

## 5. Port Conflicts

### Problem: `EADDRINUSE: address already in use :::5000` or `:::5173`
**Cause:** A lingering Node.js process is occupying the port.  
**Resolution (PowerShell):**
```powershell
# Identify process on port 5000
netstat -ano | findstr :5000
# Kill process by PID (e.g. 14320)
taskkill /F /PID 14320
```
Or simply change `PORT=5001` in `backend/.env` and `VITE_API_BASE_URL=http://localhost:5001/api` in `frontend/.env`.

