# MedTrax Deployment Guide

## Architecture Overview

Your MedTrax application consists of 3 components that need to be deployed:

1. **Backend API** (Node.js/Express) - Main application server
2. **ML Model API** (Python/Flask) - Prescription prediction service
3. **Medical Reminder Worker** (Node.js) - Background job for push notifications

All three are required for full functionality.

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### **STEP 1: Deploy ML Model API on Render**

#### 1.1 Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `medtrax-ml-model`
   - **Region**: Choose closest to your backend
   - **Root Directory**: `backend/src/ml_model`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api:app`
   - **Instance Type**: Free (or Starter for better performance)

#### 1.2 Add Environment Variables (if needed)

Click **"Environment"** tab and add:
- `PYTHON_VERSION`: `3.11.0`

#### 1.3 Deploy

- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- **Copy the ML Model URL** (e.g., `https://medtrax-ml-model.onrender.com`)

**Important**: Make sure all model files (`prescription_model.pkl`, `symptom_encoder.pkl`, etc.) are in the `backend/src/ml_model` directory!

---

### **STEP 2: Deploy Main Backend API on Render**

#### 2.1 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `medtrax-backend`
   - **Region**: Same as ML model
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter)

#### 2.2 Add Environment Variables

Click **"Environment"** tab and add ALL of these:

```
NODE_ENV=production
PORT=5003
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key_here_at_least_32_chars
JWT_EXPIRE=7d

# ML Model URL (from Step 1.3)
ML_MODEL_URL=https://medtrax-ml-model.onrender.com

# Frontend URL
FRONTEND_URL=https://medtrax.vercel.app

# Cloudinary (if using image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (if using email notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@medtrax.com

# VAPID Keys (for push notifications - see below)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your_email@example.com

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2.3 Deploy

- Click **"Create Web Service"**
- Wait for deployment
- **Copy the Backend URL** (e.g., `https://medtrax-backend.onrender.com`)

---

### **STEP 3: Deploy Medical Reminder Worker on Render**

#### 3.1 Create Background Worker Service

1. Click **"New +"** → **"Background Worker"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `medtrax-reminder-worker`
   - **Region**: Same region as backend
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run worker`
   - **Instance Type**: Free

#### 3.2 Add Environment Variables

Add the SAME environment variables as the backend (especially `MONGODB_URI` and VAPID keys).

#### 3.3 Deploy

- Click **"Create Background Worker"**
- It will run continuously and process reminders every minute

---

### **STEP 4: Update Frontend Environment Variables on Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `medtrax` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:

```
REACT_APP_BACKEND_URL=https://medtrax-backend.onrender.com
REACT_APP_ML_MODEL_URL=https://medtrax-ml-model.onrender.com
```

5. **Redeploy** your frontend to apply changes

---

## 🔑 IMPORTANT NOTES

### **MongoDB Atlas Setup**

Make sure you have a MongoDB Atlas cluster:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add IP `0.0.0.0/0` to whitelist (for Render access)
4. Get connection string and use it in `MONGODB_URI`

### **VAPID Keys for Push Notifications**

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Copy the output and add to environment variables.

### **Free Tier Limitations (Render)**

- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- **Solution**: Use a service like [Uptime Robot](https://uptimerobot.com/) to ping your services every 10 minutes

### **Why Separate Deployments?**

- **ML Model**: Python environment, separate from Node.js
- **Backend API**: Main application logic
- **Reminder Worker**: Needs to run continuously in background

---

## ✅ VERIFICATION CHECKLIST

After deployment, test:

- [ ] Backend health check: `https://medtrax-backend.onrender.com/health`
- [ ] ML Model health check: `https://medtrax-ml-model.onrender.com/symptoms`
- [ ] Frontend loads: `https://medtrax.vercel.app`
- [ ] User login works
- [ ] Prescription prediction works
- [ ] Medical reminders are sent (check after 1-2 minutes)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "ML Model not found" error

**Fix**: Ensure all `.pkl` files are committed to Git in `backend/src/ml_model/`

### Issue: CORS errors

**Fix**: Add your frontend URL to `FRONTEND_URL` environment variable in backend

### Issue: Database connection failed

**Fix**: 
- Check MongoDB Atlas IP whitelist (use `0.0.0.0/0`)
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas cluster is running

### Issue: Reminders not sending

**Fix**: 
- Verify reminder worker is running on Render
- Check VAPID keys are set correctly
- Ensure users have subscribed to push notifications

---

## 📊 Monitoring

Monitor your services:
- **Render Dashboard**: Check logs for each service
- **MongoDB Atlas**: Monitor database connections
- **Vercel**: Check frontend analytics

---

## 💰 Cost Estimate (Free Tier)

- **Render**: 3 free services (ML Model + Backend + Worker)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Vercel**: Free tier (100GB bandwidth)
- **Cloudinary**: Free tier (25GB storage)

**Total**: $0/month (with limitations)

For production, consider upgrading to paid tiers for better performance and no cold starts.

---

## 📞 Need Help?

If deployment fails, check:
1. Render deployment logs
2. Backend `/health` endpoint
3. Environment variables are set correctly
4. All dependencies in `package.json`/`requirements.txt`
