# ABHAYA Frontend Authentication Contract

This document specifies the exact authentication flow and contract between the Frontend (React / Flutter) and the FastAPI Backend using **Supabase Auth** and **Supabase PostgreSQL**.

---

## Target Architecture Overview

```
+-------------------+             +-------------------+             +-------------------+
|  React / Flutter  |  ------->   |   Supabase Auth   |             |    FastAPI        |
|  Frontend Client  |  <-------   |  (OTP & JWT Auth) |             |  Backend Service  |
+-------------------+             +-------------------+             +-------------------+
          |                                                                   |
          |  1. Send Request:                                                 |
          |  Authorization: Bearer <supabase_access_token>                     |
          +------------------------------------------------------------------>|
                                                                              |
                                                                              |  2. Validate JWT & Query DB
                                                                              v
                                                                    +-------------------+
                                                                    |Supabase PostgreSQL|
                                                                    |  Application DB   |
                                                                    +-------------------+
```

---

## Complete Authentication Flow (Step-by-Step)

### Step 1: User Input
The user enters their phone number or email address on the ABHAYA login screen.

### Step 2: Request OTP via Supabase Auth
The frontend invokes Supabase Auth SDK to send an OTP:
```javascript
// Example using Supabase Client SDK
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+919876543210' // or email
});
```

### Step 3: User Verification
The user receives the 6-digit OTP via SMS/Email and enters it into the application.

### Step 4: Session Creation
The frontend verifies the OTP with Supabase Auth:
```javascript
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+919876543210',
  token: '123456',
  type: 'sms'
});

// Returns session with access_token and user object
const session = data.session;
const accessToken = session.access_token;
```

### Step 5: Obtain Access Token
The frontend extracts the `access_token` (Supabase JWT token) from the active Supabase session.

### Step 6: Invoke FastAPI Endpoints
For every subsequent API request to FastAPI, the frontend includes the Supabase `access_token` in the `Authorization` header:
```http
GET /api/v1/cases HTTP/1.1
Host: api.abhaya.org
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

### Step 7: FastAPI Token Validation
FastAPI's security dependency (`get_current_user`) parses and validates the Supabase JWT.

### Step 8: ABHAYA Role Determination
FastAPI queries the `profiles` table in Supabase PostgreSQL using the Supabase `sub` UUID to fetch the user's ABHAYA application role (`victim`, `police`, `social_worker`).

### Step 9: Role Security Enforcement & Data Redaction
FastAPI evaluates role permissions and applies security rules:
- **POLICE**:
  - Access to assigned cases with aggregate metrics.
  - Sensitive victim chat text and detailed AI distress explanations are **REDACTED**.
- **SOCIAL WORKER**:
  - Full access to cases, distress history, detailed AI explanations.
  - Can submit human review/intervention actions (`POST /api/v1/cases/{case_id}/review`).
- **VICTIM**:
  - Access strictly scoped to their own registered profile and case (`assigned_victim_id == user.id`).

---

## FastAPI Backend Auth Endpoints Reference

### Get Current User Profile
`GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <supabase_access_token>`
- **Response**:
```json
{
  "id": "e4b2a19f-...",
  "phone": "+919876543210",
  "email": "officer.sharma@police.gov.in",
  "full_name": "Inspector Rajesh Sharma",
  "role": "police",
  "police_station": "Central Station",
  "badge_id": "POL-8829"
}
```

### Sync Application Role & Profile
`POST /api/v1/auth/sync-profile`
- **Headers**: `Authorization: Bearer <supabase_access_token>`
- **Body**:
```json
{
  "id": "e4b2a19f-...",
  "full_name": "Dr. Ananya Roy",
  "role": "social_worker",
  "badge_id": "SW-402"
}
```
