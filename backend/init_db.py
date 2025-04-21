from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base

DATABASE_URL = "mysql+pymysql://user:password@localhost/gearupdb"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database initialized.")
