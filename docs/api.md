# CodeBuddy AI — REST API Documentation

Base URL: `/api`  
Authentication: `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` (required on all routes except public health checks)

---

## 1. System Health & Diagnostics

### `GET /api/health`
Checks backend uptime and runtime environment.
- **Auth:** None (Public)
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-28T06:15:00.000Z",
    "version": "1.0.0",
    "environment": "development"
  }
  ```

### `GET /api/health/ai`
Performs a live connectivity probe to the active AI provider (Ollama or Gemini).
- **Auth:** None (Public)
- **Response `200 OK`:**
  ```json
  {
    "status": "connected",
    "provider": "ollama",
    "model": "gemma3:1b",
    "responseTimeMs": 142
  }
  ```
- **Response `503 Service Unavailable`:**
  ```json
  {
    "status": "error",
    "provider": "ollama",
    "model": "gemma3:1b",
    "error": "Cannot connect to Ollama daemon at http://127.0.0.1:11434. Please verify 'ollama serve' is running."
  }
  ```

---

## 2. Authentication & Profile

### `GET /api/auth/me`
Returns authenticated user claims extracted from the verified Supabase JWT.
- **Auth:** Bearer Token
- **Response `200 OK`:**
  ```json
  {
    "user": {
      "id": "e6741b6c-cbe4-4363-8a07-8e68cfb99db1",
      "email": "student@college.edu",
      "role": "authenticated"
    }
  }
  ```

### `GET /api/profile`
Retrieves student profile from the `profiles` table.
- **Auth:** Bearer Token
- **Response `200 OK`:**
  ```json
  {
    "profile": {
      "id": "e6741b6c-cbe4-4363-8a07-8e68cfb99db1",
      "displayName": "Aarav Sharma",
      "createdAt": "2026-10-20T10:00:00.000Z",
      "updatedAt": "2026-10-25T14:30:00.000Z"
    }
  }
  ```

### `PATCH /api/profile`
Updates student display name.
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "displayName": "Aarav S."
  }
  ```
- **Response `200 OK`:** Updated profile object.

---

## 3. AI Capabilities

### `POST /api/ai/explain`
Analyzes code line-by-line, breaks down concepts, and provides a clear program summary.
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "code": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
    "language": "python"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "summary": "Calculates the mathematical factorial of an integer using recursion.",
    "concepts": ["Recursion", "Base Case", "Call Stack"],
    "lineByLine": [
      {
        "lines": "1",
        "code": "def factorial(n):",
        "explanation": "Defines a function named 'factorial' that accepts an integer parameter 'n'."
      },
      {
        "lines": "2-3",
        "code": "if n <= 1:\n    return 1",
        "explanation": "Base case: stops the recursion when n reaches 0 or 1, returning 1 to prevent infinite loops."
      },
      {
        "lines": "4",
        "code": "return n * factorial(n - 1)",
        "explanation": "Recursive step: multiplies n by the result of factorial with n - 1."
      }
    ],
    "exampleConcept": "Similar to how factorial(3) = 3 * 2 * 1, countdown functions also use base cases.",
    "executionNotice": "AI-assisted pedagogical analysis. Code has not been executed."
  }
  ```

### `POST /api/ai/debug`
Identifies probable causes of bugs, flags the code section, provides minimal fixes and prevention tips.
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "code": "int arr[5] = {1, 2, 3, 4, 5};\nfor(int i = 0; i <= 5; i++) {\n    printf(\"%d \", arr[i]);\n}",
    "language": "c",
    "errorMessage": "Segmentation fault or garbage value printed at end",
    "expectedBehavior": "Print all 5 elements from 1 to 5"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "problemDescription": "Off-by-one array boundary overflow.",
    "probableCause": "The loop condition 'i <= 5' causes index 5 to be accessed, which is out of bounds for an array of size 5 (valid indices are 0 to 4).",
    "targetSection": "for(int i = 0; i <= 5; i++)",
    "suggestedFix": "for(int i = 0; i < 5; i++)",
    "whyFixHelps": "C uses 0-based indexing. Changing '<=' to '<' guarantees that 'i' stops at index 4.",
    "preventionTip": "Always remember: in an array of size N, the last valid element is at index N - 1.",
    "isDefiniteSyntaxError": false,
    "isLogicalError": true
  }
  ```

### `POST /api/ai/practice/generate`
Generates a structured, pedagogical programming challenge.
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "language": "cpp",
    "difficulty": "Beginner",
    "topic": "Loops"
  }
  ```
- **Response `200 OK`:** Returns structured challenge fields (`title`, `description`, `constraints`, `sample_input`, `sample_output`, `conceptPracticed`).

### `POST /api/ai/hints`
Retrieves a single requested hint level (Levels 1 to 4) for a practice problem.
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "problemId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "level": 2,
    "currentCode": "# student working code"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "level": 2,
    "levelName": "Approach Hint",
    "hint": "Set up a running accumulator variable initialized to 0. Loop through every element and add it to your accumulator."
  }
  ```

### `POST /api/ai/solution`
Returns the Level 5 full solution and walkthrough. Requires explicit parameter `confirmRequest: true`.
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "problemId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "confirmRequest": true
  }
  ```
- **Response `200 OK`:** Complete pedagogical solution with code, complexity, and step-by-step reasoning.

---

## 4. Conversations & Tutor Chat

- `GET /api/conversations`: List student's conversations ordered by `updated_at DESC`.
- `POST /api/conversations`: Create a new conversation thread.
- `GET /api/conversations/:id`: Retrieve conversation details and full message history.
- `PATCH /api/conversations/:id`: Update title or target language.
- `DELETE /api/conversations/:id`: Delete conversation and associated messages.
- `POST /api/ai/chat`: Send a student query with conversation context and receive the AI tutor's response.

---

## 5. Dashboard & Analytics

### `GET /api/dashboard/stats`
Aggregates authentic counts from Supabase tables:
- `totalAttempts`: Total rows in `practice_attempts`
- `problemsCompleted`: Count of attempts with `completed = true`
- `questionsAsked`: Total user messages in `conversation_messages`
- `languageStats`: Array of `{ language: 'python', count: 12 }`
- `recentTopics`: Array of unique topics studied in the last 14 days
- `learningStreak`: Consecutive days with recorded activity in `learning_activity`

### `GET /api/dashboard/activity`
Returns the latest 20 events from `learning_activity` for student timeline display.

