# Pre-Deployment Checklist

## Files to Check Before Deploying

### ✅ ML Model Files (CRITICAL!)
Ensure these files exist in `backend/src/ml_model/`:
- [ ] `prescription_model.pkl`
- [ ] `symptom_encoder.pkl`
- [ ] `prescription_encoder.pkl`
- [ ] `precaution_encoder.pkl`
- [ ] `severity_encoder.pkl`
- [ ] `scaler.pkl`
- [ ] `requirements.txt` (created)
- [ ] `Procfile` (created)
- [ ] `api.py` (updated)

### ✅ Environment Variables Needed

#### For ML Model (Render):
- [ ] `PYTHON_VERSION`: 3.11.0

#### For Backend (Render):
- [ ] `NODE_ENV`: production
- [ ] `PORT`: 5003
- [ ] `MONGODB_URI`: (from MongoDB Atlas)
- [ ] `JWT_SECRET`: (strong random string)
- [ ] `JWT_EXPIRE`: 7d
- [ ] `ML_MODEL_URL`: (from ML Model deployment)
- [ ] `FRONTEND_URL`: https://medtrax.vercel.app
- [ ] `CLOUDINARY_CLOUD_NAME`: (if using Cloudinary)
- [ ] `CLOUDINARY_API_KEY`: (if using Cloudinary)
- [ ] `CLOUDINARY_API_SECRET`: (if using Cloudinary)
- [ ] `EMAIL_USER`: (for notifications)
- [ ] `EMAIL_PASS`: (Gmail app password)
- [ ] `EMAIL_FROM`: noreply@medtrax.com
- [ ] `VAPID_PUBLIC_KEY`: (generate with web-push)
- [ ] `VAPID_PRIVATE_KEY`: (generate with web-push)
- [ ] `VAPID_SUBJECT`: mailto:your@email.com

#### For Reminder Worker (Render):
- [ ] Same as Backend environment variables

#### For Frontend (Vercel):
- [ ] `REACT_APP_BACKEND_URL`: (from Backend deployment)
- [ ] `REACT_APP_ML_MODEL_URL`: (from ML Model deployment)

### ✅ External Services Setup

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB IP whitelist includes `0.0.0.0/0`
- [ ] MongoDB connection string obtained
- [ ] Cloudinary account setup (if using)
- [ ] Gmail app password generated (if using email)
- [ ] VAPID keys generated (`npx web-push generate-vapid-keys`)

### ✅ Git Repository

- [ ] All code committed to Git
- [ ] `.pkl` files are NOT in `.gitignore` (they need to be deployed!)
- [ ] `.env` files ARE in `.gitignore`
- [ ] Repository pushed to GitHub

### ✅ Deployment Order

1. [ ] Deploy ML Model first
2. [ ] Get ML Model URL
3. [ ] Deploy Backend (with ML_MODEL_URL)
4. [ ] Get Backend URL
5. [ ] Deploy Reminder Worker (same env as Backend)
6. [ ] Update Frontend env vars on Vercel
7. [ ] Redeploy Frontend

### ✅ Post-Deployment Testing

- [ ] Backend health: `{backend_url}/health`
- [ ] ML Model: `{ml_model_url}/symptoms`
- [ ] Frontend loads
- [ ] User registration works
- [ ] User login works
- [ ] Prescription prediction works
- [ ] Medical reminders work (test after setup)

---

## Quick Commands

### Generate VAPID Keys
```bash
npx web-push generate-vapid-keys
```

### Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Test Backend Locally
```bash
cd backend
npm install
npm start
```

### Test ML Model Locally
```bash
cd backend/src/ml_model
pip install -r requirements.txt
python api.py
```

### Test Reminder Worker Locally
```bash
cd backend
npm run worker
```

---

## Common Render Deployment Settings

### ML Model Service
- **Name**: medtrax-ml-model
- **Type**: Web Service
- **Environment**: Python 3
- **Root Directory**: backend/src/ml_model
- **Build**: `pip install -r requirements.txt`
- **Start**: `gunicorn api:app`

### Backend Service
- **Name**: medtrax-backend
- **Type**: Web Service
- **Environment**: Node
- **Root Directory**: backend
- **Build**: `npm install`
- **Start**: `npm start`

### Reminder Worker
- **Name**: medtrax-reminder-worker
- **Type**: Background Worker
- **Environment**: Node
- **Root Directory**: backend
- **Build**: `npm install`
- **Start**: `npm run worker`

---

## Troubleshooting

### ML Model fails to deploy
- Check all `.pkl` files are in the repository
- Verify `requirements.txt` has correct versions
- Check Render logs for Python errors

### Backend fails to connect to ML Model
- Verify `ML_MODEL_URL` is set correctly (no trailing slash)
- Check ML Model service is running on Render
- Test ML Model URL in browser: `{url}/symptoms`

### Database connection fails
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure cluster is running

### Reminders not sending
- Check worker service is running
- Verify VAPID keys are correct
- Test push notification subscription in frontend
