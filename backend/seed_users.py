from sqlalchemy.orm import Session
from backend.models import User, UserRole, pwd_context
from backend.init_db import SessionLocal, engine
from backend.models import Base

def seed_users():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    users = [
        {"name": "Admin User", "email": "admin@icarlton.com", "password": "Admin@123", "role": UserRole.admin},
        {"name": "Support User", "email": "support@icarlton.com", "password": "Support@123", "role": UserRole.support},
        {"name": "Info User", "email": "info@icarlton.com", "password": "Info@123", "role": UserRole.info},
    ]

    for user_data in users:
        user = db.query(User).filter(User.email == user_data["email"]).first()
        if not user:
            user = User(
                name=user_data["name"],
                email=user_data["email"],
                role=user_data["role"]
            )
            user.set_password(user_data["password"])
            db.add(user)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()
    print("Users seeded.")
