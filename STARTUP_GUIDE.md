# AXENT Platform - Complete Startup Guide

## 🚀 Quick Start (All Services)

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+  
- **Git**

---

## Option 1: Start Both Services (Recommended)

### Windows PowerShell
```powershell
# Terminal 1: Start AI Backend
cd backend\ai_service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m app.main

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **AI Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Option 2: Backend Only (AI Service)

```powershell
cd backend\ai_service

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python -m app.main
# OR
uvicorn app.main:app --reload --port 8000
```

**Backend runs on**: http://localhost:8000

### Test the AI APIs
```powershell
# Health check
curl http://localhost:8000/health

# Visit interactive docs
start http://localhost:8000/docs
```

---

## Option 3: Frontend Only

```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

**Frontend runs on**: http://localhost:5173

---

## 📋 Environment Setup

### Backend (.env)
Located in `backend/ai_service/.env`:
```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env.local)
Located in `frontend/.env.local`:
```env
# Supabase (Optional - auth won't work without it)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here

# AI Backend (Required for AI features)
VITE_AI_API_URL=http://localhost:8000/api/v1
VITE_AI_API_TIMEOUT=30000
```

---

## 🤖 AI Features Available

1. **Equipment Price Estimation** - `/api/v1/estimate/price`
2. **Smart Recommendations** - `/api/v1/recommend/equipment`
3. **Demand Forecasting** - `/api/v1/forecast/demand`
4. **Image Analysis** - `/api/v1/vision/analyze`
5. **NLP Chatbot** - `/api/v1/chat/message`

---

## 🧪 Testing

### Test AI Backend
```powershell
cd backend\ai_service
.\venv\Scripts\activate
pytest tests/ -v
```

### Test Frontend
```powershell
cd frontend
npm run build  # Verify build works
```

---

## 🔧 Troubleshooting

### Backend Won't Start
```powershell
# Ensure Python 3.9+ installed
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check port 8000 is not in use
netstat -ano | findstr :8000
```

### Frontend Can't Connect to Backend
1. Verify backend is running: http://localhost:8000/health
2. Check `.env.local` has correct `VITE_AI_API_URL`
3. Restart frontend: `Ctrl+C` then `npm run dev`

### CORS Errors
- Ensure backend `.env` has frontend URL in `ALLOWED_ORIGINS`
- Restart backend after changing `.env`

---

## 📦 Production Deployment

### Backend
```powershell
# Install production server
pip install gunicorn

# Run with multiple workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```powershell
npm run build
# Deploy `dist/` folder to hosting service
```

---

## 🛠️ Development Workflow

1. Start both services (backend & frontend)
2. Frontend auto-reloads on code changes
3. Backend auto-reloads with `--reload` flag
4. Test AI features at http://localhost:5173
5. View API docs at http://localhost:8000/docs

---

## 📚 Documentation

- **Backend API**: http://localhost:8000/docs (when running)
- **Backend README**: `backend/ai_service/README.md`
- **Project README**: `README.md`
- **Supabase Setup**: See conversation artifacts

---

## 🎯 Demo Pages

### Customer Role
- Agriculture Equipment page with AI price estimator
- Smart recommendations based on user profile

### Provider Role
- Listings management with AI pricing suggestions
- Revenue analytics and optimization

### Organization Role
- Fleet management with demand forecasting
- Analytics dashboard (coming soon)

### Admin Role
- User management
- AI model monitoring (coming soon)

---

**Built with ❤️ using FastAPI & React** 🚀🤖
