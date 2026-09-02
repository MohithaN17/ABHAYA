import os
import sys
import json
from sqlalchemy import text

# Add project root directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import UserProfile
from app.models.case import Case
from app.models.distress import DistressRecord
from app.models.ai_explanation import AIExplanation
from app.models.notification import Notification
from app.models.human_review import HumanReview


def seed_database():
    print("Initializing Supabase PostgreSQL database tables...")
    Base.metadata.create_all(bind=engine)

    # Ensure is_active column exists on profiles table
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE NOT NULL;"))
        conn.commit()

    db = SessionLocal()

    try:
        print("Seeding initial ABHAYA test profiles, cases, distress history, and notifications...")

        # Update or create Admin User
        admin_user = db.query(UserProfile).filter(UserProfile.id == "usr_admin_001").first()
        if not admin_user:
            admin_user = UserProfile(
                id="usr_admin_001",
                phone="+919876543200",
                email="admin@abhaya.gov.in",
                full_name="System Administrator",
                role="admin",
                police_station="ABHAYA Central Command",
                badge_id="ADM001",
                is_active=True
            )
            db.add(admin_user)

        # Update or create Police User
        police_user = db.query(UserProfile).filter(UserProfile.id == "usr_police_001").first()
        if not police_user:
            police_user = UserProfile(
                id="usr_police_001",
                phone="+919876543210",
                email="officer.sharma@police.gov.in",
                full_name="Inspector Rajesh Sharma",
                role="police",
                police_station="Central Station, Sector 4",
                badge_id="POL001",
                is_active=True
            )
            db.add(police_user)
        else:
            police_user.badge_id = "POL001"
            police_user.is_active = True

        # Update or create Social Worker User
        sw_user = db.query(UserProfile).filter(UserProfile.id == "usr_sw_001").first()
        if not sw_user:
            sw_user = UserProfile(
                id="usr_sw_001",
                phone="+919876543211",
                email="ananya.roy@welfare.org",
                full_name="Dr. Ananya Roy",
                role="social_worker",
                police_station="State Welfare Bureau",
                badge_id="SW001",
                is_active=True
            )
            db.add(sw_user)
        else:
            sw_user.badge_id = "SW001"
            sw_user.is_active = True

        db.commit()

        # Check if cases already exist
        if not db.query(Case).first():
            # Seed Cases
            c1 = Case(
                id="c1",
                case_id="ABH-2026-0891",
                fir_no="FIR-4029/2026",
                case_type="Domestic Harassment",
                status="Active",
                registered_on="Aug 14, 2026",
                incident_date="Aug 12, 2026",
                incident_location="Indiranagar, Bengaluru",
                police_station="Indiranagar PS",
                assigned_officer="Ins. Rajesh Sharma",
                well_being_score=82,
                well_being_category="Urgent Support Needed",
                trend="Deteriorating",
                last_check_in="12 mins ago",
                activity="SOS Trigger Activated (Voice Pattern Analysis)",
                victim_initials="S. K.",
                victim_text="Subject reported repeated physical threats and boundary violations near dwelling.",
                assigned_victim_id="usr_victim_001",
                assigned_police_id="usr_police_001",
                assigned_social_worker_id="usr_sw_001"
            )
            c2 = Case(
                id="c2",
                case_id="ABH-2026-0914",
                fir_no="FIR-4102/2026",
                case_type="Stalking & Cyber Safety",
                status="Under Review",
                registered_on="Aug 20, 2026",
                incident_date="Aug 19, 2026",
                incident_location="Koramangala, Bengaluru",
                police_station="Koramangala PS",
                assigned_officer="Sub-Ins. Priya Nair",
                well_being_score=64,
                well_being_category="Attention Required",
                trend="Deteriorating",
                last_check_in="2 hours ago",
                activity="Missed scheduled safety check-in",
                victim_initials="M. R.",
                victim_text="Caller mentioned receiving persistent anonymous communications.",
                assigned_police_id="usr_police_001",
                assigned_social_worker_id="usr_sw_001"
            )
            c3 = Case(
                id="c3",
                case_id="ABH-2026-0742",
                fir_no="FIR-3810/2026",
                case_type="Workplace Harassment",
                status="Stable",
                registered_on="Jul 28, 2026",
                incident_date="Jul 25, 2026",
                incident_location="MG Road, Bengaluru",
                police_station="Cubbon Park PS",
                assigned_officer="Ins. Rajesh Sharma",
                well_being_score=35,
                well_being_category="Stable",
                trend="Improving",
                last_check_in="Yesterday, 8:30 PM",
                activity="Routine positive check-in submitted",
                victim_initials="A. D.",
                victim_text="Routine follow-up counseling session completed with positive emotional state.",
                assigned_police_id="usr_police_001",
                assigned_social_worker_id="usr_sw_001"
            )
            db.add_all([c1, c2, c3])
            db.commit()

            # Seed Distress Records
            distress_data = [
                DistressRecord(case_id="c1", date="Aug 14", score=55, category="Attention"),
                DistressRecord(case_id="c1", date="Aug 18", score=68, category="Attention"),
                DistressRecord(case_id="c1", date="Aug 22", score=74, category="Urgent"),
                DistressRecord(case_id="c1", date="Aug 28", score=82, category="Urgent"),
                DistressRecord(case_id="c2", date="Aug 20", score=42, category="Stable"),
                DistressRecord(case_id="c2", date="Aug 24", score=58, category="Attention"),
                DistressRecord(case_id="c2", date="Aug 30", score=64, category="Attention"),
            ]
            db.add_all(distress_data)

            # Seed AI Explanations
            c1_signals = [
                {
                    "id": "s1",
                    "label": "High Acoustic Stress / Tremor",
                    "riskLevel": "High",
                    "weight": 35,
                    "description": "Vocal pitch variance & spectral tremor detected above 84% distress baseline during IVRS check-in call."
                },
                {
                    "id": "s2",
                    "label": "Threat Keyword Density",
                    "riskLevel": "High",
                    "weight": 25,
                    "description": "Text analysis flagged repeated presence of high-risk threat indicators ('followed', 'door', 'scared')."
                },
                {
                    "id": "s3",
                    "label": "Missed Verification Check-in",
                    "riskLevel": "Medium",
                    "weight": 20,
                    "description": "User missed 2 consecutive scheduled automated check-ins within 24 hours."
                }
            ]
            ai_c1 = AIExplanation(
                case_id="c1",
                signals_json=json.dumps(c1_signals),
                disclaimer="AI assessment is decision support for social worker review, not a final medical diagnosis."
            )
            db.add(ai_c1)

            # Seed Human Reviews
            rev1 = HumanReview(
                case_id="c1",
                action="confirmed",
                notes="Reviewed audio log and verified urgent distress flag. Escalated to station officer.",
                reviewed_by="Dr. Ananya Roy (ID: SW001)",
                timestamp="Sep 01, 2026, 10:15 AM"
            )
            db.add(rev1)

            # Seed Notifications
            n1 = Notification(
                target_role="police",
                title="SOS Alert: Case ABH-2026-0891",
                message="Urgent well-being spike (Score: 82). Location: Indiranagar, Sector 4.",
                timestamp="12 mins ago",
                read_status="false"
            )
            n2 = Notification(
                target_role="social_worker",
                title="Human Review Required: Case ABH-2026-0891",
                message="AI distress score rose to 82. Please review acoustic signals & threat density.",
                timestamp="15 mins ago",
                read_status="false"
            )
            db.add_all([n1, n2])
            db.commit()

        print("Database seed completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
