# MedTrax Testing Guide 🏥💊

## Overview
Your MedTrax application is now fully integrated! The backend and frontend are connected, and sample data has been seeded into the database.

## Test Accounts

### 🔐 Super Admin
- **Email:** admin@medtrax.com
- **Password:** Admin@123
- **Access:** Full system administration

### 🏥 Hospital Admins
- **Hospital 1:** hospital1@medtrax.com / Hospital@123
- **Hospital 2:** hospital2@medtrax.com / Hospital@123  
- **Hospital 3:** hospital3@medtrax.com / Hospital@123

### 🏪 Shop Admins
- **Shop 1:** shop1@medtrax.com / Shop@123
- **Shop 2:** shop2@medtrax.com / Shop@123
- **Shop 3:** shop3@medtrax.com / Shop@123

## Sample Data Created

### 🏥 Hospitals
1. **City General Hospital** (Mumbai) - Multispecialty
2. **Apollo Health Center** (Delhi) - General
3. **Sunshine Medical Center** (Bangalore) - Specialty

### 🏪 Medical Shops
1. **HealthPlus Pharmacy** (Mumbai)
2. **MediCare Pharmacy** (Delhi)
3. **QuickMeds Pharmacy** (Bangalore)

## How to Test

### 1. Start the Application
Make sure both servers are running:
```bash
# Backend (should already be running)
cd backend
npm start
# Backend runs on: http://localhost:5000

# Frontend
cd frontend/medtrax
npm start
# Frontend runs on: http://localhost:3000
```

### 2. Test Frontend Features

#### 🏠 Homepage
- Visit: http://localhost:3000
- Check if the homepage loads correctly

#### 🏥 Hospital Listings
- Visit: http://localhost:3000/Hospital
- Should display 3 hospitals from the database
- Try searching for "Apollo" or "Mumbai"
- Click on any hospital card to view details

#### 💊 Medical Shop Listings  
- Visit: http://localhost:3000/Medicines
- Should display 3 medical shops from the database
- Try searching for "HealthPlus" or "Delhi"
- Click on any shop card to view details

#### 📅 Appointment Booking
- Visit: http://localhost:3000/Appointments
- Should display hospitals for appointment booking
- Click "Book Appointment" on any hospital
- Fill out the appointment form
- **Note:** You need to be logged in to complete booking

#### 🔐 Authentication
- Visit: http://localhost:3000/login
- Use any of the test accounts above
- After login, you'll be redirected to the appropriate dashboard

### 3. Test Backend APIs

#### 🔍 Health Check
```bash
curl http://localhost:5000/health
```

#### 🏥 Get Hospitals
```bash
curl http://localhost:5000/api/public/hospitals
```

#### 🏪 Get Shops
```bash
curl http://localhost:5000/api/public/shops
```

#### 🔐 Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medtrax.com","password":"Admin@123"}'
```

### 4. Test Role-Based Access

#### Super Admin Access
1. Login with: admin@medtrax.com / Admin@123
2. Should redirect to admin panel
3. Can manage all hospitals and shops

#### Hospital Admin Access
1. Login with any hospital admin account
2. Should redirect to hospital dashboard
3. Can manage that specific hospital's data

#### Shop Admin Access
1. Login with any shop admin account
2. Should redirect to shop dashboard
3. Can manage that specific shop's inventory

## Features Working

✅ **Frontend-Backend Integration**
- All pages now fetch real data from APIs
- Fallback to static data if APIs fail

✅ **Authentication System**
- JWT-based authentication
- Role-based access control
- Protected routes

✅ **Hospital Management**
- Public hospital listings
- Hospital details with services
- Appointment booking system

✅ **Medical Shop Management**
- Public shop listings
- Shop details with inventory
- Order management system

✅ **User Interface**
- Existing UI preserved and enhanced
- Responsive design maintained
- Error handling and loading states

## Troubleshooting

### If Frontend Shows No Data:
1. Check if backend is running on port 5000
2. Check browser console for API errors
3. Verify CORS settings in backend

### If Login Doesn't Work:
1. Check if MongoDB is running
2. Verify test accounts in database
3. Check JWT configuration in .env

### If Pages Don't Load:
1. Make sure frontend is running on port 3000
2. Check for React compilation errors
3. Verify all dependencies are installed

## Next Steps

Now you can:
1. **Add more sample data** using the seeder
2. **Customize the UI** to match your brand
3. **Add more features** like online payments
4. **Deploy to production** with proper security
5. **Add real images** instead of placeholder URLs

## File Structure

```
medtrax/
├── backend/
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   └── middleware/  # Auth & validation
│   ├── seeders/         # Sample data
│   └── server.js        # Main server file
└── frontend/medtrax/
    ├── src/
    │   ├── Api/         # API integration
    │   ├── Redux/       # State management
    │   ├── user/        # User-facing pages
    │   └── components/  # Reusable components
    └── public/          # Static assets
```

## Enjoy Testing! 🎉

Your MedTrax application is now fully functional with real backend integration. All your existing UI is preserved and now powered by a robust backend system.
