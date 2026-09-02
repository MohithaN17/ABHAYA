# ABHAYA SIH26094 Backend Service

ABHAYA is a women safety distress assessment, AI signal explanation, and human-in-the-loop intervention platform.

This backend service is built using **FastAPI** and migrated to **Supabase PostgreSQL** and **Supabase Auth**.

---

## 1. Architecture Overview

```
React / Flutter Frontend
           ↓
   Supabase Auth (OTP / JWT / Session Management)
           ↓
   FastAPI Backend (Business Logic & Role-Based Authorization)
           ↓
Supabase PostgreSQL (Application Database via SQLAlchemy)
```

### Responsibility Matrix
- **Supabase Auth**: Manages user authentication, phone/email OTP generation & verification, JWT access token generation, and user credentials.
- **Supabase PostgreSQL**: Hosts the relational application database (`profiles`, `cases`, `distress_records`, `ai_explanations`, `notifications`, `human_reviews`).
- **FastAPI**:
  - Validates Supabase JWT access tokens (`Authorization: Bearer <token>`).
  - Enforces role-based security policies (`police`, `social_worker`, `victim`).
  - Provides case management, distress time-series, AI explanation, notification, and human-in-the-loop review APIs.

---

## 2. Role Security Matrix

| Feature / Data Field | Police (`police`) | Social Worker (`social_worker`) | Victim (`victim`) |
| :--- | :--- | :--- | :--- |
| **Case Access Scope** | Assigned / Station cases | Authorized cases | Own registered cases only |
| **Aggregate Well-being Score** | ✅ Visible | ✅ Visible | ✅ Visible |
| **FIR & Location Info** | ✅ Visible | ✅ Visible | ✅ Visible |
| **Victim Text / Chat Transcripts** | ❌ **Redacted** | ✅ Visible | ❌ Hidden |
| **Detailed AI Distress Explanation** | ❌ **Forbidden (403)** | ✅ Visible | ✅ Visible (Own case) |
| **Human Review / Interventions** | ❌ Read Only | ✅ Submit Review (`POST /review`) | ❌ Read Only |

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Configured variables:

```ini
# Supabase Project Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Supabase PostgreSQL Database Connection String
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Application Settings
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3005,http://localhost:5173
```

> [!WARNING]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL` credentials to frontend code.

---

## 4. How FastAPI Validates Supabase JWTs

1. When a request arrives at FastAPI with `Authorization: Bearer <token>`, FastAPI's security dependency `verify_supabase_jwt(token)` decodes the JWT using the configured `SUPABASE_JWT_SECRET`.
2. It extracts the Supabase user UUID from claim `sub`.
3. The dependency `get_current_user` queries the `profiles` table in Supabase PostgreSQL for matching `id`.
4. Role authorization dependencies (`require_police`, `require_social_worker`, `require_victim`) check `user.role` against endpoint security rules before executing handler logic.

---

## 5. Local Development & Testing Instructions

### Prerequisites
- Python 3.10+
- Virtual environment (`venv`)

### Setup & Installation
```powershell
# Activate Virtual Environment
.\venv\Scripts\Activate.ps1

# Install Dependencies
pip install -r requirements.txt

# Initialize Schema & Seed Mock Data
python scripts/seed_db.py
```

### Running the API Server
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive API documentation will be available at `http://localhost:8000/api/v1/docs`.

### Running Verification Tests & Compile Check
```powershell
# Compile all application modules
python -m compileall app

# Run Pytest suite
pytest tests/
```

---

## 6. Frontend Authentication Integration Contract

See [docs/FRONTEND_AUTH_CONTRACT.md](file:///c:/Users/P%20Manvith/ABHAYA/docs/FRONTEND_AUTH_CONTRACT.md) for full step-by-step frontend code examples.
