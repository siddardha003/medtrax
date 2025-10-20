# MedTrax Backend API

A comprehensive backend API for the Centralized Hospital Management System built with Node.js, Express, and MongoDB.

## 🏗️ Architecture

### User Roles
1. **Super Admin**: Full system control, manages hospital and shop admins
2. **Hospital Admin**: Manages appointments and hospital operations
3. **Shop Admin**: Manages inventory and billing

## 🚀 Quick Start

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except `/auth/login`) require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 🔐 Authentication (`/api/auth`)
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - Logout user
- `POST /refresh` - Refresh JWT token
- `GET /validate` - Validate JWT token

#### 👑 Admin Management (`/api/admin`) - Super Admin Only
- `POST /users` - Create new user (Hospital/Shop Admin)
- `GET /users` - Get all users with filtering
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /hospitals` - Register new hospital
- `GET /hospitals` - Get all hospitals
- `GET /hospitals/:id` - Get single hospital
- `PUT /hospitals/:id` - Update hospital
- `DELETE /hospitals/:id` - Delete hospital
- `POST /shops` - Register new medical shop
- `GET /shops` - Get all shops
- `GET /shops/:id` - Get single shop
- `PUT /shops/:id` - Update shop
- `DELETE /shops/:id` - Delete shop
- `GET /stats` - Get system statistics

#### 🏥 Hospital Management (`/api/hospital`) - Hospital Admin Only
- `GET /appointments` - Get all appointments
- `GET /appointments/:id` - Get single appointment
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `GET /appointments/stats` - Get appointment statistics
- `GET /patients/search` - Search patients

#### 🛒 Medical Shop Management (`/api/shop`) - Shop Admin Only
- `GET /inventory` - Get all inventory items
- `GET /inventory/:id` - Get single inventory item
- `POST /inventory` - Add new inventory item
- `PUT /inventory/:id` - Update inventory item
- `DELETE /inventory/:id` - Delete inventory item
- `PUT /inventory/:id/stock` - Update stock quantity
- `GET /inventory/alerts/low-stock` - Get low stock items
- `GET /inventory/alerts/expiring` - Get expiring items
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get single order
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status
- `GET /stats` - Get shop statistics

### 📊 Query Parameters

#### Pagination
```
?page=1&limit=10&sort=createdAt
```

#### Filtering
```
?status=active&category=prescription_drug&search=paracetamol
```

#### Date Range
```
?startDate=2024-01-01&endDate=2024-12-31
```

## 🗄️ Database Models

### User
- Authentication and role management
- Links to Hospital/Shop based on role

### Hospital
- Hospital information and settings
- Address, contact details, departments

### Shop
- Medical shop information and settings
- License details, services offered

### Appointment
- Patient appointment booking and management
- Status tracking, confirmation codes

### Inventory
- Medical products and stock management
- Pricing, expiry tracking, categories

### Order
- Billing and sales order management
- Customer details, payment tracking

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 📧 Email Features

- Welcome emails for new users
- Appointment confirmations
- Order invoices
- Password reset emails

## 🛠️ Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Show seeding help
npm run seed:admin # Create super admin user
npm run seed:sample # Seed sample data
npm run seed:all   # Seed admin and sample data
```

## 🧪 Testing

### Default Super Admin Credentials
```
Email: admin@medtrax.com
Password: Admin@123
```

⚠️ **Change these credentials after first login!**

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medtrax.com","password":"Admin@123"}'
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── adminController.js   # Admin management
│   │   ├── hospitalController.js # Hospital operations
│   │   └── shopController.js    # Shop operations
│   ├── middleware/
│   │   ├── auth.js             # JWT & role-based auth
│   │   ├── errorHandler.js     # Global error handling
│   │   └── validation.js       # Input validation
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Hospital.js         # Hospital schema
│   │   ├── Shop.js             # Shop schema
│   │   ├── Appointment.js      # Appointment schema
│   │   ├── Inventory.js        # Inventory schema
│   │   └── Order.js            # Order schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── admin.js            # Admin routes
│   │   ├── hospital.js         # Hospital routes
│   │   └── shop.js             # Shop routes
│   └── utils/
│       ├── helpers.js          # Utility functions
│       └── email.js            # Email functions
├── seeders/
│   └── seed.js                 # Database seeding
├── uploads/                    # File uploads
├── .env                        # Environment variables
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies & scripts
├── server.js                  # Main server file
└── README.md                  # This file
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medtrax
JWT_SECRET=very_secure_random_string_for_production
EMAIL_USER=production_email@domain.com
EMAIL_PASS=secure_app_password
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start server.js --name "medtrax-backend"
pm2 startup
pm2 save
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- 📧 Email: support@medtrax.com
- 📞 Phone: +91-XXXX-XXXXXX
- 🌐 Website: www.medtrax.com

---

**Built with ❤️ for the MedTrax Team**
