# Import all the models so that Base has them registered before creating tables
from app.db.session import Base
from app.models.user import UserProfile
from app.models.case import Case
from app.models.distress import DistressRecord
from app.models.ai_explanation import AIExplanation
from app.models.notification import Notification
from app.models.human_review import HumanReview
