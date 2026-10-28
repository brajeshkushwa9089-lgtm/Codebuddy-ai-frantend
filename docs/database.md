# CodeBuddy AI — Database Schema & Security Architecture

> **Database Engine:** PostgreSQL 15+ (Hosted via Supabase)  
> **Security Model:** Strict Row Level Security (RLS) with JWT user claims.

---

## 1. Schema Overview & Entity Relationship

CodeBuddy AI stores authenticated student data with strict relational isolation. Every user record references `auth.users(id)` managed natively by Supabase Authentication.

```mermaid
erDiagram
    auth_users ||--|| profiles : "has profile (1:1)"
    auth_users ||--o{ conversations : "owns"
    conversations ||--o{ conversation_messages : "contains"
    auth_users ||--o{ practice_problems : "generates"
    auth_users ||--o{ practice_attempts : "submits"
    practice_problems ||--o{ practice_attempts : "tested against"
    auth_users ||--o{ learning_activity : "logs activity"

    profiles {
        uuid id PK "references auth.users(id)"
        text display_name
        timestamp with_time_zone created_at
        timestamp with_time_zone updated_at
    }

    conversations {
        uuid id PK
        uuid user_id FK "references auth.users(id)"
        text title
        varchar language "nullable"
        timestamp with_time_zone created_at
        timestamp with_time_zone updated_at
    }

    conversation_messages {
        uuid id PK
        uuid conversation_id FK "references conversations(id)"
        varchar role "user or assistant"
        text content
        timestamp with_time_zone created_at
    }

    practice_problems {
        uuid id PK
        uuid user_id FK "references auth.users(id)"
        varchar language
        varchar topic
        varchar difficulty
        text title
        text description
        text input_description
        text output_description
        text constraints
        text sample_input
        text sample_output
        timestamp with_time_zone created_at
    }

    practice_attempts {
        uuid id PK
        uuid user_id FK "references auth.users(id)"
        uuid problem_id FK "references practice_problems(id)"
        text submitted_code
        integer hints_used "0 to 5"
        boolean completed
        timestamp with_time_zone created_at
        timestamp with_time_zone updated_at
    }

    learning_activity {
        uuid id PK
        uuid user_id FK "references auth.users(id)"
        varchar activity_type "explain, debug, practice, hint, chat"
        varchar language
        varchar topic "nullable"
        jsonb metadata
        timestamp with_time_zone created_at
    }
```

---

## 2. Table Specifications

### 2.1 `profiles`
Stores student profile metadata linked to Supabase Auth credentials.
- `id` (UUID, PK): References `auth.users(id)` ON DELETE CASCADE.
- `display_name` (TEXT): Display name or username.
- `created_at` (TIMESTAMPTZ, DEFAULT `now()`).
- `updated_at` (TIMESTAMPTZ, DEFAULT `now()`).

### 2.2 `conversations`
Tracks chat threads with the AI Tutor.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`).
- `user_id` (UUID, FK): References `auth.users(id)` ON DELETE CASCADE.
- `title` (TEXT, NOT NULL, DEFAULT `'New Conversation'`).
- `language` (VARCHAR(30)): Target programming language (e.g., 'python', 'c', 'cpp', 'javascript').
- `created_at` (TIMESTAMPTZ, DEFAULT `now()`).
- `updated_at` (TIMESTAMPTZ, DEFAULT `now()`).

### 2.3 `conversation_messages`
Stores individual turn-by-turn messages in a chat thread.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`).
- `conversation_id` (UUID, FK): References `conversations(id)` ON DELETE CASCADE.
- `role` (VARCHAR(20), CHECK `role IN ('user', 'assistant')`).
- `content` (TEXT, NOT NULL).
- `created_at` (TIMESTAMPTZ, DEFAULT `now()`).

### 2.4 `practice_problems`
Stores AI-generated coding problems tailored for the student.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`).
- `user_id` (UUID, FK): References `auth.users(id)` ON DELETE CASCADE.
- `language` (VARCHAR(30), NOT NULL).
- `topic` (VARCHAR(80), NOT NULL).
- `difficulty` (VARCHAR(20), CHECK `difficulty IN ('Beginner', 'Intermediate', 'Advanced')`).
- `title` (TEXT, NOT NULL).
- `description` (TEXT, NOT NULL).
- `input_description` (TEXT, NOT NULL).
- `output_description` (TEXT, NOT NULL).
- `constraints` (TEXT, NOT NULL).
- `sample_input` (TEXT, NOT NULL).
- `sample_output` (TEXT, NOT NULL).
- `created_at` (TIMESTAMPTZ, DEFAULT `now()`).

### 2.5 `practice_attempts`
Records student solution attempts, progressive hint consumption, and completion status.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`).
- `user_id` (UUID, FK): References `auth.users(id)` ON DELETE CASCADE.
- `problem_id` (UUID, FK): References `practice_problems(id)` ON DELETE CASCADE.
- `submitted_code` (TEXT, NOT NULL).
- `hints_used` (INTEGER, DEFAULT 0, CHECK `hints_used >= 0 AND hints_used <= 5`).
- `completed` (BOOLEAN, DEFAULT FALSE).
- `created_at` (TIMESTAMPTZ, DEFAULT `now()`).
- `updated_at` (TIMESTAMPTZ, DEFAULT `now()`).

### 2.6 `learning_activity`
Audit trail and event stream for generating authentic student learning analytics.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`).
- `user_id` (UUID, FK): References `auth.users(id)` ON DELETE CASCADE.
- `activity_type` (VARCHAR(50), NOT NULL) — e.g. `'code_explanation'`, `'error_debug'`, `'problem_generated'`, `'hint_requested'`, `'attempt_submitted'`, `'chat_message'`.
- `language` (VARCHAR(30), NOT NULL).
- `topic` (VARCHAR(80)).
- `metadata` (JSONB, DEFAULT `'{}'::jsonb`).
- `created_at` (TIMESTAMPTZ, DEFAULT `now()`).

---

## 3. Row Level Security (RLS) Policies

Row Level Security is enabled on **all tables**. Every query automatically restricts rows to the currently authenticated user (`auth.uid()`).

```sql
-- Example policy applied to conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" 
  ON conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
  ON conversations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
  ON conversations FOR DELETE 
  USING (auth.uid() = user_id);
```

For child tables like `conversation_messages`, parent ownership is validated:
```sql
CREATE POLICY "Users can manage messages in their conversations"
  ON conversation_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_messages.conversation_id 
        AND conversations.user_id = auth.uid()
    )
  );
```

---

## 4. Performance Indexes

To ensure snappy queries on student dashboards and chat threads:
- `CREATE INDEX idx_conversations_user ON conversations(user_id, updated_at DESC);`
- `CREATE INDEX idx_conversation_messages_convo ON conversation_messages(conversation_id, created_at ASC);`
- `CREATE INDEX idx_practice_problems_user ON practice_problems(user_id, created_at DESC);`
- `CREATE INDEX idx_practice_attempts_user_problem ON practice_attempts(user_id, problem_id);`
- `CREATE INDEX idx_learning_activity_user ON learning_activity(user_id, created_at DESC);`

