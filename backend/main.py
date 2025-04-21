from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.init_db import SessionLocal, engine
from backend.models import Base, User, UserRole
from pydantic import BaseModel
from typing import List, Optional

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# To run on assigned IP, use host parameter in uvicorn command

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole

    class Config:
        orm_mode = True

class UserUpdatePassword(BaseModel):
    old_password: str
    new_password: str

# API endpoints

@app.get("/users/", response_model=List[UserOut])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=user.name,
        email=user.email,
        role=user.role
    )
    new_user.set_password(user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.put("/users/{user_id}/password")
def update_password(user_id: int, passwords: UserUpdatePassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.verify_password(passwords.old_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    user.set_password(passwords.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

# Additional endpoints for profile and notifications can be added here
