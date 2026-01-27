# 🚀 MedTrax Quick Deployment Reference

## Answer: YES, deploy all 3 components

Your MedTrax app has 3 parts that work together:

```
┌─────────────────┐
│    Frontend     │ ← Already deployed on Vercel ✅
│    (React)      │   https://medtrax.vercel.app
└────────┬────────┘
         │
         ↓ API calls
┌─────────────────┐
│   Backend API   │ ← DEPLOY on Render (Step 2)
│  (Node/Express) │
└────┬───────┬────┘
     │       │
     │       └──────→ ┌─────────────────┐
     │                │   ML Model API  │ ← DEPLOY on Render (Step 1)
     │                │  (Python/Flask) │
     │                └─────────────────┘
     │
     ↓
┌─────────────────┐
│ Reminder Worker │ ← DEPLOY on Render (Step 3)
│ (Background Job)│
└─────────────────┘
```

---

## 📝 Deployment Steps (in order)

### **STEP 1: ML Model → Render Web Service**
- Root Dir: `backend/src/ml_model`
- Start: `gunicorn api:app`
- 📋 Get URL → save for Step 2

### **STEP 2: Backend → Render Web Service**
- Root Dir: `backend`
- Start: `npm start`
- ⚙️ Add env var `ML_MODEL_URL` from Step 1
- 📋 Get URL → save for Step 4

### **STEP 3: Worker → Render Background Worker**
- Root Dir: `backend`
- Start: `npm run worker`
- ⚙️ Same env vars as Step 2

### **STEP 4: Update Frontend → Vercel**
- Add env: `REACT_APP_BACKEND_URL` from Step 2
- Redeploy ♻️

---

## 🔑 Essential Environment Variables

### Backend & Worker (Render)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long_random_string
ML_MODEL_URL=https://medtrax-ml-model.onrender.com
FRONTEND_URL=https://medtrax.vercel.app
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:you@email.com
```

### Frontend (Vercel)
```
REACT_APP_BACKEND_URL=https://medtrax-backend.onrender.com
```

---

## ✅ Pre-Flight Check

Before deploying:
- [ ] All `.pkl` model files in `backend/src/ml_model/` 
- [ ] MongoDB Atlas cluster ready
- [ ] VAPID keys generated: `npx web-push generate-vapid-keys`
- [ ] Code pushed to GitHub

---

## 🐛 Quick Fixes

**Backend deploy fails?**
- Check MongoDB connection string
- Verify Node version in `package.json` engines

**ML Model 500 error?**
- Ensure all 6 `.pkl` files are committed to Git
- Check Python version = 3.11

**Reminders not working?**
- Verify worker service is running on Render
- Check VAPID keys match in backend and frontend

**CORS errors?**
- Add frontend URL to `FRONTEND_URL` in backend env

---

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed instructions
See `DEPLOYMENT_CHECKLIST.md` for complete checklist

---

## 🆘 Need Help?

1. Check Render logs for each service
2. Test endpoints:
   - Backend: `{url}/health`
   - ML Model: `{url}/symptoms`
3. Review environment variables

---

**Cost**: Free tier on all platforms (with cold starts)
**Time**: ~30-45 minutes total deployment
