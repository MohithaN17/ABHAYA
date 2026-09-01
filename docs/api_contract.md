# Abhaya API & Integration Contract

## 1. Register a Case (Police Dashboard -> Backend)
* **Endpoint:** `/cases/register`
* **Method:** `POST`
* **Payload (JSON):**
  ```json
  {
    "case_id": "CRIM-2026-001",
    "victim_name": "Ananya",
    "phone_number": "9876543210",
    "case_type": "Harassment"
  }