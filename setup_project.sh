#!/bin/bash

# Install backend dependencies
pip install fastapi uvicorn sqlalchemy pymysql passlib[bcrypt]

# Install frontend dependencies
npm install react react-dom @types/react @types/react-dom lucide-react

# Start backend server
uvicorn backend.main:app --reload

# Start frontend server (run this in a separate terminal)
# npm run dev
