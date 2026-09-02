import os
import sys
import json
import pytest
import jwt
from fastapi.testclient import TestClient

# Set sqlite DB for test run before importing app
os.environ["DATABASE_URL"] = "sqlite:///./test_abhaya_pytest.db"
os.environ["SUPABASE_JWT_SECRET"] = "supersecretjwtkey12345_supabase_secret_key_32bytes"

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import UserProfile
from app.models.case import Case
from app.models.distress import DistressRecord
from app.models.ai_explanation import AIExplanation

# Helper to create signed Supabase test JWT token
JWT_SECRET = "supersecretjwtkey12345_supabase_secret_key_32bytes"


def create_mock_supabase_token(user_id: str, role: str, phone: str = "+919876543210") -> str:
    payload = {
        "sub": user_id,
        "phone": phone,
        "aud": "authenticated",
        "app_metadata": {"role": role},
        "user_metadata": {"role": role, "full_name": f"Test {role.title()}"}
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed test users
    police = UserProfile(id="p_usr_1", phone="+919999900001", full_name="Officer Bob", role="police")
    sw = UserProfile(id="sw_usr_1", phone="+919999900002", full_name="Worker Alice", role="social_worker")
    victim = UserProfile(id="v_usr_1", phone="+919999900003", full_name="Victim Carol", role="victim")

    db.add_all([police, sw, victim])
    db.commit()

    # Seed test cases
    c1 = Case(
        id="c1",
        case_id="ABH-2026-001",
        fir_no="FIR-100",
        case_type="Domestic Harassment",
        status="Active",
        registered_on="Aug 14, 2026",
        incident_date="Aug 12, 2026",
        incident_location="Test City",
        police_station="Main PS",
        assigned_officer="Officer Bob",
        well_being_score=80,
        well_being_category="Urgent Support Needed",
        trend="Deteriorating",
        victim_initials="V. C.",
        victim_text="Private victim transcript data.",
        assigned_victim_id="v_usr_1",
        assigned_police_id="p_usr_1",
        assigned_social_worker_id="sw_usr_1"
    )
    c2 = Case(
        id="c2",
        case_id="ABH-2026-002",
        fir_no="FIR-101",
        case_type="Stalking",
        status="Active",
        registered_on="Aug 20, 2026",
        incident_date="Aug 19, 2026",
        incident_location="North City",
        police_station="North PS",
        assigned_officer="Officer Bob",
        well_being_score=50,
        well_being_category="Attention Required",
        victim_initials="X. Y.",
        victim_text="Other victim private text.",
        assigned_victim_id="v_usr_other",
        assigned_police_id="p_usr_1",
        assigned_social_worker_id="sw_usr_1"
    )
    db.add_all([c1, c2])
    db.commit()

    # Seed AI explanation
    ai_exp = AIExplanation(
        case_id="c1",
        signals_json=json.dumps([{"id": "s1", "label": "Acoustic Tremor", "riskLevel": "High", "weight": 40, "description": "High vocal distress"}]),
        disclaimer="AI assessment is decision support."
    )
    db.add(ai_exp)
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_abhaya_pytest.db"):
        try:
            os.remove("./test_abhaya_pytest.db")
        except PermissionError:
            pass


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_unauthorized_access(client):
    # Request without Authorization header
    response = client.get("/api/v1/cases")
    assert response.status_code == 403 or response.status_code == 401


def test_police_role_permissions(client, setup_database):
    token = create_mock_supabase_token("p_usr_1", "police")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Police can fetch cases
    res = client.get("/api/v1/cases", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 2
    # Verify police redaction: victimText and aiSignals MUST NOT be present
    for item in data:
        assert "victimText" not in item
        assert "aiSignals" not in item

    # 2. Police can fetch case detail (redacted)
    res_detail = client.get("/api/v1/cases/c1", headers=headers)
    assert res_detail.status_code == 200
    detail_data = res_detail.json()
    assert "victimText" not in detail_data
    assert detail_data["wellBeingScore"] == 80

    # 3. Police MUST NOT see detailed AI distress explanation
    res_exp = client.get("/api/v1/distress/c1/explanation", headers=headers)
    assert res_exp.status_code == 403
    assert "restricted" in res_exp.json()["detail"].lower()

    # 4. Police MUST NOT be able to submit human review
    res_rev = client.post("/api/v1/cases/c1/review", json={"action": "confirmed", "notes": "Test"}, headers=headers)
    assert res_rev.status_code == 403


def test_social_worker_role_permissions(client, setup_database):
    token = create_mock_supabase_token("sw_usr_1", "social_worker")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Social Worker can view cases with full details (victim text, initials, etc.)
    res = client.get("/api/v1/cases", headers=headers)
    assert res.status_code == 200
    data = res.json()
    c1_data = next(c for c in data if c["id"] == "c1")
    assert c1_data["victimInitials"] == "V. C."
    assert c1_data["victimText"] == "Private victim transcript data."

    # 2. Social Worker can view detailed AI distress explanation
    res_exp = client.get("/api/v1/distress/c1/explanation", headers=headers)
    assert res_exp.status_code == 200
    exp_data = res_exp.json()
    assert len(exp_data["signals"]) == 1
    assert exp_data["signals"][0]["label"] == "Acoustic Tremor"

    # 3. Social Worker CAN submit human review action
    res_rev = client.post(
        "/api/v1/cases/c1/review",
        json={"action": "confirmed", "notes": "Verified high acoustic tremor.", "reviewedBy": "Worker Alice"},
        headers=headers
    )
    assert res_rev.status_code == 200
    rev_data = res_rev.json()
    assert rev_data["action"] == "confirmed"
    assert rev_data["reviewedBy"] == "Worker Alice"


def test_victim_role_permissions(client, setup_database):
    token = create_mock_supabase_token("v_usr_1", "victim")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Victim can view ONLY their assigned case (c1)
    res = client.get("/api/v1/cases", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["id"] == "c1"

    # 2. Victim accessing another victim's case returns HTTP 403
    res_other = client.get("/api/v1/cases/c2", headers=headers)
    assert res_other.status_code == 403
