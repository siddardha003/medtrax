# Super Admin Dashboard Testing Guide

## 🔐 **Super Admin Credentials**
- **Email**: `admin@medtrax.com`
- **Password**: `Admin@123`

## 🧭 **Testing Flow**

### **Step 1: Login as Super Admin**
1. Navigate to: `http://localhost:3000/signin`
2. Enter the credentials above
3. Click "Sign In"
4. You should be redirected to dashboard

### **Step 2: Access Admin Panel**
1. Navigate to: `http://localhost:3000/admin-panel`
2. You should see the Super Admin Dashboard

## 📊 **Dashboard Features**

### **🏠 Dashboard Tab**
- View system statistics:
  - Total Users
  - Total Hospitals  
  - Total Medical Shops
  - Recent Activity

### **👥 Admin Accounts Management Tab**
- View all hospital and shop admin accounts
- **Create New Admin Account**:
  - Hospital Admin credentials
  - Shop Admin credentials
- View user details, roles, status

### **🏥 Hospitals Management Tab** 
- View all hospitals in the system
- Create new hospital entries
- View hospital details

### **🏪 Shops Management Tab**
- View all medical shops
- Create new shop entries  
- View shop details

## ⚡ **Key Functionalities**

### **Creating Hospital Admin Account**
1. Go to "Admin Accounts Management" tab
2. Click "Create Admin Account"
3. Fill form:
   - First Name, Last Name
   - Email (will be their login)
   - Password (they'll use this to login)
   - Role: Select "Hospital Admin"
4. Click "Create"

### **Creating Shop Admin Account**
1. Go to "Admin Accounts Management" tab  
2. Click "Create Admin Account"
3. Fill form:
   - First Name, Last Name
   - Email (will be their login)
   - Password (they'll use this to login)
   - Role: Select "Shop Admin" 
4. Click "Create"

## 🔍 **What to Test**

### ✅ **Authentication**
- [ ] Login with super admin credentials
- [ ] Access protected admin routes
- [ ] Logout functionality

### ✅ **Dashboard Statistics**
- [ ] View total users count
- [ ] View total hospitals count
- [ ] View total shops count

### ✅ **User Management**
- [ ] View existing admin accounts
- [ ] Create new hospital admin account
- [ ] Create new shop admin account
- [ ] View user details in table

### ✅ **Data Management**
- [ ] View hospitals list
- [ ] View shops list
- [ ] Create new hospital entry
- [ ] Create new shop entry

## 🚀 **Expected Backend API Calls**

When using the admin panel, you should see these API calls in the backend terminal:

```
GET /api/admin/stats - Dashboard statistics
GET /api/admin/users - Admin accounts list
GET /api/admin/hospitals - Hospitals list
GET /api/admin/shops - Shops list
POST /api/admin/users - Create new admin account
POST /api/admin/hospitals - Create new hospital
POST /api/admin/shops - Create new shop
```

## 🎯 **Success Criteria**

1. **Authentication**: Super admin can login and access admin panel
2. **Dashboard**: Statistics display correctly from backend
3. **User Creation**: Can create hospital and shop admin accounts
4. **Data Display**: Can view hospitals and shops from backend
5. **Real-time Updates**: New data appears immediately after creation

## 🔧 **Troubleshooting**

### **Can't Login**
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify credentials are correct

### **Admin Panel Not Loading**
- Check if user has `super_admin` role
- Verify authentication token in browser dev tools
- Ensure all API endpoints are accessible

### **Data Not Showing**
- Check backend terminal for API call logs
- Verify database connection
- Check browser network tab for failed requests
