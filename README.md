# MedTrax – Centralized Hospital Management System

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://medtrax.vercel.app)
[![Backend API](https://img.shields.io/badge/API-active-blue)](https://medtrax-backend.onrender.com)

MedTrax is a comprehensive healthcare management platform that bridges the gap between patients, hospitals, and medical shops. Built with modern web technologies, it offers appointment scheduling, health tracking, AI-powered prescription predictions, and intelligent medication reminders.

**🔗 Live Demo:** [https://medtrax.vercel.app](https://medtrax.vercel.app)

---

## ✨ Key Features

### 👤 For Patients
- **Hospital Discovery** - Search and filter hospitals by location, specialization, and ratings
- **Appointment Booking** - Schedule appointments with doctors across multiple departments
- **Pharmacy Discovery** - Find nearby pharmacies with real-time availability
- **AI Prescription Predictions** - Get medication suggestions based on symptoms (ML-powered)
- **Health Tracker** - Monitor Health metrics such as headache, hormones, sleep etc.
- **Smart Medication Reminders** - Receive push notifications for medicine schedules

### 🏥 For Hospitals
- **Comprehensive Dashboard** - Manage appointments, doctors, and patient records
- **Doctor Management** - Add/update doctor profiles with specializations and schedules
- **Appointment System** - Real-time appointment tracking with status updates
- **Patient Records** - Secure storage and retrieval of medical histories

### 💊 For Medical Shops
- **Inventory Management** - Track medicine stock levels and expiry dates
- **Order Processing** - Handle customer orders with status tracking
- **Analytics Dashboard** - View sales trends and popular products

### 🔐 Admin Portal
- **User Management** - Approve/reject hospital and shop registrations
- **System Monitoring** - Track platform usage and performance metrics
- **Content Moderation** - Manage reviews and ensure quality

---

## 🛠️ Technology Stack

### Frontend
- **React.js** - Component-based UI framework
- **Redux** - State management
- **Material-UI & Ant Design** - Modern component libraries
- **Tailwind CSS** - Utility-first styling
- **Service Workers** - Push notification support

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Node-cron** - Scheduled background jobs for reminders
- **Web-Push** - VAPID-based push notifications
- **Cloudinary** - Image storage and optimization

### Machine Learning
- **Python 3.11** - ML model runtime
- **Flask** - Lightweight API framework
- **scikit-learn 1.6.1** - ML algorithms
- **Joblib** - Model serialization
- **Gunicorn** - WSGI HTTP server
---

## 🏗️ System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ───────▶│   Backend    │◀────────│   MongoDB   │
│  (Vercel)   │ HTTPS   │   (Render)   │         │   Atlas     │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              │ REST API
                              ▼
                        ┌──────────────┐
                        │  ML Model    │
                        │  (Render)    │
                        └──────────────┘
```

## 📋 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/siddardha003/medtrax.git
cd medtrax
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend/medtrax

# Install dependencies
npm install

# Start development server
npm start
```

### 4. ML Model Setup (Optional)
```bash
cd backend/src/ml_model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python api.py
```

---

## 🚀 Deployment

The application is deployed across multiple platforms for optimal performance:

### Production URLs
- **Frontend:** https://medtrax.vercel.app
- **Backend API:** https://medtrax-backend.onrender.com
- **ML Model:** https://medtrax-ml-model.onrender.com


## 📊 API Documentation

**Authentication**
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET  /api/auth/profile - Get user profile
```

**Hospitals**
```
GET  /api/public/hospitals - List all hospitals
GET  /api/hospital/:id - Get hospital details
POST /api/hospital/appointment - Book appointment
```

**Medical Shops**
```
GET  /api/public/shops - List all shops
GET  /api/shop/:id - Get shop details
POST /api/shop/order - Place order
```

**Health Tracking**
```
POST /api/health/tracker - Log health data
GET  /api/health/tracker - Get health history
POST /api/health/reminder - Set medication reminder
```

**ML Predictions**
```
GET  /api/prescription/symptoms - Get available symptoms
POST /api/prescription/predict - Get prescription prediction
```

**Made with ❤️ for improving healthcare accessibility**

