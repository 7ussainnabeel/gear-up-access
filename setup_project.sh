#!/bin/bash

# Install backend dependencies
pip install fastapi uvicorn sqlalchemy pymysql passlib[bcrypt]

# Install frontend dependencies
npm install react react-dom @types/react @types/react-dom lucide-react

# Start backend server in background
nohup uvicorn backend.main:app --reload > backend.log 2>&1 &

# Start frontend server
npm run dev
