# AXENT Platform - AI-Powered Equipment Rental

## 🚀 Quick Start

```powershell
# Start AI Backend (Terminal 1)
cd backend\ai_service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python start.py

# Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

**Access**: Frontend at http://localhost:5173 | Backend API at http://localhost:8000/docs

---

## ✨ Features

### 🤖 AI-Powered Backend (FastAPI)
- **Price Estimation**: ML-based rental price predictions
- **Smart Recommendations**: Personalized equipment suggestions
- **Demand Forecasting**: Time series predictions for inventory
- **Image Analysis**: Equipment detection & condition assessment
- **NLP Chatbot**: Conversational AI for customer support

### 🎨 Modern Frontend (React + TypeScript)
- **Modular Architecture**: Role-based modules (Customer, Organization, Provider, Admin)
- **macOS Design System**: Professional, clean UI
- **Real-time AI Integration**: Seamless backend communication
- **Responsive Design**: Mobile-first approach

---

## 📁 Project Structure

```
axent/
├── backend/
│   └── ai_service/          # FastAPI AI Backend
│       ├── app/
│       │   ├── api/v1/      # API endpoints
│       │   ├── core/        # AI services (pricing, recommendations, etc.)
│       │   ├── models/      # Pydantic models
│       │   └── main.py      # FastAPI app
│       ├── requirements.txt
│       └── start.py
│
├── frontend/
│   └── src/
│       ├── modules/         # Role-based modules
│       │   ├── customer/    # Agriculture equipment
│       │   ├── provider/    # Listings with AI pricing
│       │   ├── organization/# Fleet management
│       │   └── admin/       # System management
│       ├── shared/
│       │   ├── services/    # AI API client
│       │   └── hooks/       # React hooks (useAI)
│       └── app/             # Core app & routing
│
└── STARTUP_GUIDE.md         # Detailed startup instructions
```

---

## 🤖 AI Services

| Service | Endpoint | Description |
|---------|----------|-------------|
| **Price Estimation** | `/api/v1/estimate/price` | ML-based rental price predictions |
| **Recommendations** | `/api/v1/recommend/equipment` | Personalized equipment suggestions |
| **Forecasting** | `/api/v1/forecast/demand` | Demand forecasting with seasonality |
| **Image Analysis** | `/api/v1/vision/analyze` | Equipment detection from images |
| **Chatbot** | `/api/v1/chat/message` | NLP-powered assistance |

---

## 🎯 Demo Pages

### Customer Module
- **Agriculture Page**: Browse equipment with AI price estimator
- **Smart Recommendations**: Personalized suggestions based on user profile

### Provider Module
- **Listings Management**: AI pricing suggestions for your equipment
- **Revenue Analytics**: Optimize pricing with market insights

### Organization Module
- **Fleet Dashboard**: Manage enterprise equipment
- **Demand Forecasting**: Plan inventory with AI predictions

### Admin Module
- **User Management**: Platform administration
- **AI Monitoring**: Model performance & analytics

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **AI/ML**: XGBoost, Scikit-learn, Prophet (architecture ready)

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **React Router** - Navigation

---

## 📖 Documentation

- **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Complete startup & deployment guide
- **[Backend README](./backend/ai_service/README.md)** - AI service documentation
- **API Docs**: http://localhost:8000/docs (when backend is running)
- **Implementation Plan**: See conversation artifacts

---

## ⚙️ Configuration

### Backend `.env`
```env
API_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend `.env.local`
```env
# Supabase (Optional)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# AI Backend (Required)
VITE_AI_API_URL=http://localhost:8000/api/v1
```

---

## 🚢 Deployment

### Backend(FastAPI)
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend (React)
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, etc.
```

---

## 👥 User Roles

| Role | Features |
|------|----------|
| **Customer** | Browse agriculture equipment, AI price estimates, smart search |
| **Organization** | Heavy equipment catalog, fleet management, analytics |
| **Provider** | Manage listings, AI pricing suggestions, revenue tracking |
| **Admin** | Full platform access, user management, AI model monitoring |

---

## 🔒 Authentication

- **Supabase Auth** integration (optional, not required for AI features)
- **Role-based Access Control** with route guards
- **Protected Routes** for each module

---

## 📊 AI Model Status

Current implementation uses **production-ready architectures** with mock data for development:

- ✅ **Price Estimator**: Rule-based → Ready for XGBoost integration
- ✅ **Recommender**: Hybrid scoring → Ready for collaborative filtering
- ✅ **Forecaster**: Time series simulation → Ready for Prophet/ARIMA
- ✅ **Vision**: Mock detection → Ready for CLIP/ResNet integration
- ✅ **Chatbot**: Intent-based → Ready for GPT-4/LLaMA integration

All services have complete API interfaces and can be upgraded with real ML models without changing the frontend.

---

## 🧪 Testing

```bash
# Backend
cd backend/ai_service
pytest tests/ -v

# Frontend
cd frontend
npm run build  # Verify production build
```

---

## 📝 License

Part of AXENT Platform - Equipment Rental Intelligence

---

**Built with ❤️ using FastAPI, React & AI** 🚀🤖