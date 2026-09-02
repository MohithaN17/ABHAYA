from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Abhaya Backend is running successfully!"}

def test_analyze_distress_urgent():
    response = client.post("/analyze-distress/", json={"text": "I am in extreme danger"})
    assert response.status_code == 200
    data = response.json()
    assert data["distress_status"] == "Urgent Support"

def test_register_case():
    payload = {
        "case_id": "CRIM-2026-001",
        "victim_name": "Ananya",
        "phone_number": "9876543210",
        "case_type": "Harassment"
    }
    response = client.post("/cases/register", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "Success"